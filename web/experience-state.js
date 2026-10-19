// Browser persistence is optional. The in-memory value remains usable on failure.
export function createStore(storage,key,normalize,fallback){
 let value=fallback,available=true;
 try{const raw=storage?.getItem(key);if(raw)value=normalize(JSON.parse(raw));}catch{available=false;}
 return {get:()=>value,get available(){return available;},set(next){value=normalize(next);try{storage?.setItem(key,JSON.stringify(value));}catch{available=false;}return value;}};
}
export function getStorage(name){try{return window[name];}catch{return {getItem(){throw new Error('Unavailable');},setItem(){throw new Error('Unavailable');}};}}
export function normalizeSceneState(raw={}){
 const r=raw&&typeof raw==='object'?raw:{};
 const microwave=['spinning','caught'].includes(r.microwave)?r.microwave:'frozen';
 return {microwave,microwaveRounds:microwave==='frozen'?0:Math.max(1,Math.min(3,Math.trunc(Number(r.microwaveRounds)||1))),rice:r.rice===true,stamped:r.stamped===true,bookmark:Number.isInteger(r.bookmark)&&r.bookmark>=0&&r.bookmark<3?r.bookmark:0,object:Number.isInteger(r.object)&&r.object>=0&&r.object<3?r.object:0,
  imagined:{cup:r.imagined?.cup===true,umbrella:r.imagined?.umbrella===true,clip:r.imagined?.clip===true},opened:r.opened===true,view:r.view==='staying'?'staying':'leaving',choice:r.choice==='missing'?'missing':'empty',wind:Number.isInteger(r.wind)&&r.wind>=0&&r.wind<3?r.wind:0};
}
export function changeSceneState(raw,action,value){
 const s=normalizeSceneState(raw);
 switch(action){
 case 'microwave-start':if(s.microwave==='frozen'){s.microwave='spinning';s.microwaveRounds=1;}break;
 case 'microwave-wait':if(s.microwave==='spinning')s.microwaveRounds=Math.min(3,s.microwaveRounds+1);break;
 case 'microwave-check':if(s.microwave==='spinning')s.microwave='caught';break;
 case 'microwave-reset':s.microwave='frozen';s.microwaveRounds=0;break;
 case 'wind':s.wind=value===undefined?(s.wind+1)%3:Math.max(0,Math.min(2,Number(value)||0));break;
 case 'rice':s.rice=!s.rice;break;case 'stamp':s.stamped=true;break;
 case 'bookmark':s.bookmark=(s.bookmark+1)%3;break;case 'reread':s.stamped=false;s.bookmark=0;break;
 case 'object':s.object=Math.max(0,Math.min(2,Number(value)||0));break;
 case 'imagine':{const id=['cup','umbrella','clip'][s.object];s.imagined={...s.imagined,[id]:!s.imagined[id]};break;}
 case 'open':s.opened=!s.opened;break;case 'perspective':s.view=value==='staying'?'staying':'leaving';s.opened=true;break;
 case 'table-toggle':s.choice=s.choice==='missing'?'empty':'missing';break;
 case 'table':s.choice=value==='missing'?'missing':'empty';break;
 }return s;
}
export function normalizeVisit(raw,validIds=[]){
 if(!raw||!validIds.includes(raw.scene)||!Number.isFinite(raw.offset))return null;
 return {scene:raw.scene,offset:Math.max(-200,Math.min(raw.offset,20000))};
}
export function restoredY(snapshot,sceneTop=0){return Math.max(0,snapshot?.scene?sceneTop+snapshot.offset:Number(snapshot?.y)||0);}
export function selectStages(stages,center,previous=[]){
 const visible=stages.filter(s=>s.bottom>0&&s.top<center*2);
 const active=visible.sort((a,b)=>Math.abs((a.top+a.bottom)/2-center)-Math.abs((b.top+b.bottom)/2-center))[0];
 const near=stages.filter(s=>(s.top<center*2+600&&s.bottom>-600)||(previous.includes(s.id)&&s.top<center*2+1200&&s.bottom>-1200));
 const prepared=near.filter(s=>s.motion).sort((a,b)=>Number(b.id===active?.id)-Number(a.id===active?.id)||Math.abs((a.top+a.bottom)/2-center)-Math.abs((b.top+b.bottom)/2-center)).slice(0,2).map(s=>s.id);
 return {active:active?.id||null,prepared};
}
export function normalizeEntry(raw){return raw&&typeof raw.key==='string'&&raw.key.length<100&&Number.isInteger(raw.index)&&raw.index>=0&&raw.index<100000?{key:raw.key,index:raw.index,origin:typeof raw.origin==='string'?raw.origin:null}:null;}
export function normalizeJourney(raw,ids){
 const records={};for(const [key,r] of Object.entries(raw?.records&&typeof raw.records==='object'?raw.records:{}).slice(-50)){
  const entry=normalizeEntry(r);if(!entry||entry.key!==key||typeof r.hash!=='string'||!r.hash.startsWith('#/')||r.hash.length>1500)continue;
  const s=r.snapshot||{},visit=normalizeVisit(s,ids);let focus=null;
  if(typeof s.focus?.id==='string'&&s.focus.id.length<100)focus={id:s.focus.id};else if(typeof s.focus?.href==='string'&&s.focus.href.startsWith('#/')&&Number.isInteger(s.focus.index)&&s.focus.index>=0&&s.focus.index<1000)focus={href:s.focus.href,index:s.focus.index};
  records[key]={...entry,hash:r.hash,snapshot:{y:Number.isFinite(s.y)?Math.max(0,s.y):0,...(visit||{}),focus,readings:Array.isArray(s.readings)?s.readings.filter(id=>ids.includes(id)):[]}};
 }return {records,resume:normalizeVisit(raw?.resume,ids)};
}
export function createQualityController(){
 let level=0,total=0,samples=0;
 return {get level(){return level;},record(ms){if(!Number.isFinite(ms))return false;total+=ms;samples++;if(samples<45)return false;const slow=total/samples>12;total=0;samples=0;if(slow&&level<2){level++;return true;}return false;}};
}
