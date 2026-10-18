import {createStore,getStorage,normalizeVisit,restoredY,normalizeEntry,normalizeJourney} from './experience-state.js';
import {parseRoute} from './core.js';
const id=()=>crypto.randomUUID();
const safeHash=hash=>typeof hash==='string'&&/^#\//.test(hash)?hash:'#/';
export function createJourney({main,catalog,render}){
 const ids=catalog.stream.map(s=>s.id);
 const store=createStore(getStorage('sessionStorage'),'yougan.journey.v1',v=>normalizeJourney(v,ids),{records:{},resume:null});
 let data=store.get(),current=null,hash=location.hash||'#/',restoring=false,scrollTimer=0,restoreTicket=0,offerResume=!!store.get().resume;
 const chapter=document.querySelector('#chapter-nav'),resumeButton=document.querySelector('[data-resume]');
 const findScene=scene=>[...main.querySelectorAll('[data-stream-id]')].find(el=>el.dataset.streamId===scene);
 function token(el){if(!el||el===main)return null;if(el.id)return {id:el.id};const a=el.closest?.('a[href]');if(a&&main.contains(a)){const href=a.getAttribute('href');return {href,index:[...main.querySelectorAll('a[href]')].filter(el=>el.getAttribute('href')===href).indexOf(a)};}return null;}
 function focusToken(t){let el=t?.id?document.getElementById(t.id):t?.href?[...main.querySelectorAll('a[href]')].filter(el=>el.getAttribute('href')===t.href)[t.index||0]:null;if(!el)el=main;el.focus({preventScroll:true});}
 function persist(){const keys=Object.keys(data.records);for(const key of keys.slice(0,Math.max(0,keys.length-50)))delete data.records[key];store.set(data);}
 function capture(trigger){
  if(!current||restoring)return;
  const page=parseRoute(hash).page;const snapshot={y:window.scrollY,focus:token(trigger||document.activeElement),readings:[...main.querySelectorAll('[data-scene] .scene-reading[open]')].map(d=>d.closest('[data-scene]').dataset.scene)};
  if(page==='home'){
   const scene=main.querySelector('[data-stream-id][data-active="true"]')||main.querySelector('[data-stream-id]');
   if(scene){snapshot.scene=scene.dataset.streamId;snapshot.offset=-scene.getBoundingClientRect().top;if(snapshot.scene!==ids[0]||snapshot.offset>150)data.resume=normalizeVisit(snapshot,ids);}
  }
  data.records[current.key]={...current,hash,snapshot};persist();
 }
 function origin(){return current?.origin&&data.records[current.origin]||null;}
 function backInfo(fallback,label){const from=origin();if(!from)return {href:fallback,label};const page=parseRoute(from.hash).page;return {href:from.hash,label:({home:'回到刚才的作品流',discover:'回到刚才的发现',saved:'回到收藏',collection:'回到专题',collections:'回到全部专题',play:'回到玩一下'}[page]||'回到刚才的位置')};}
 function updateResume(){
  const home=parseRoute(hash).page==='home';chapter.hidden=!home;
  const r=data.resume;resumeButton.hidden=!home||!r||!offerResume;resumeButton.textContent=r?'继续刚才的作品 ↗':'';
 }
 function position({snapshot,scene,initial=false}={}){
  const ticket=++restoreTicket;restoring=true;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   if(ticket!==restoreTicket)return;
   for(const id of snapshot?.readings||[])findScene(id)?.querySelector('.scene-reading')?.setAttribute('open','');
   const target=findScene(scene||snapshot?.scene);
   const y=scene?(target?target.getBoundingClientRect().top+window.scrollY-95:0):snapshot?restoredY(snapshot,target?target.getBoundingClientRect().top+window.scrollY:0):0;
   window.scrollTo({top:y,behavior:'instant'});
   if(!initial){if(scene&&target&&!snapshot){const heading=target.querySelector('h1,h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}}else focusToken(snapshot?.focus);}
   restoring=false;
  }));
 }
 function show(options={}){
  render();hash=location.hash||'#/';updateResume();
  const requested=parseRoute(hash).params.get('scene');
  position({...options,scene:options.snapshot?undefined:requested?ids.includes(requested)?requested:'invalid':undefined});
 }
 function go(next,{brand=false,trigger,replace=false,resume=null}={}){
  next=safeHash(next);capture(trigger);offerResume=brand&&!!data.resume;const prior=current,priorPage=parseRoute(hash).page;
  const isDetail=['item','motion','collection'].includes(parseRoute(next).page);
  current={key:id(),index:replace?(prior?.index||0):(prior?.index||0)+1,origin:isDetail?(isDetail&&['item','motion'].includes(priorPage)?prior?.origin:prior?.key):null};
  history[replace?'replaceState':'pushState']({yougan:current},'',next);const wasHome=priorPage==='home';hash=next;
  chapter.open=false;
  const requested=parseRoute(next).params.get('scene');
  if(wasHome&&parseRoute(next).page==='home'&&!brand){updateResume();position({snapshot:resume,scene:resume?undefined:requested?ids.includes(requested)?requested:'invalid':undefined});}
  else show({snapshot:brand?undefined:resume});
 }
 function back(trigger){const from=origin();if(from&&Number.isInteger(from.index)&&from.index<current.index){capture(trigger);history.go(from.index-current.index);}else go(from?.hash||trigger?.getAttribute('href')||'#/',{trigger});}
 function sync(){
  const incoming=normalizeEntry(history.state?.yougan);
  if(incoming?.key===current?.key&&(location.hash||'#/')===hash)return;
  capture();chapter.open=false;offerResume=false;current=incoming||{key:id(),index:(current?.index||0)+1,origin:null};hash=location.hash||'#/';history.replaceState({...history.state,yougan:current},'',location.href);
  const snapshot=data.records[current.key]?.snapshot;show({snapshot});
 }
 function click(event){
  if(event.target.closest('[data-scene-action]'))dismissResume();
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const a=event.target.closest('a[href]');if(!a||a.target||a.hasAttribute('download'))return;
  const href=a.getAttribute('href');if(!href?.startsWith('#/')||!catalog)return;
  event.preventDefault();if(a.hasAttribute('data-return')){back(a);return;}go(href,{brand:a.classList.contains('brand'),trigger:a});
 }
 function stage(event){if(parseRoute(hash).page!=='home')return;const i=ids.indexOf(event.detail.active);if(i<0)return;const summary=chapter.querySelector('summary');summary.textContent=`${String(i+1).padStart(2,'0')} / ${String(ids.length).padStart(2,'0')}`;chapter.querySelectorAll('a').forEach(a=>{if(a.dataset.chapter===ids[i])a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
 const onScroll=()=>{if(restoring)return;clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>capture(),180);};
 function dismissResume(){if(offerResume){offerResume=false;updateResume();}}
 window.addEventListener('wheel',dismissResume,{passive:true});window.addEventListener('touchstart',dismissResume,{passive:true});
 document.addEventListener('click',click);document.addEventListener('stage-change',stage);window.addEventListener('popstate',sync);window.addEventListener('hashchange',sync);window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('pagehide',()=>capture());
 document.addEventListener('keydown',event=>{if(['PageDown','PageUp','ArrowDown','ArrowUp',' '].includes(event.key))dismissResume();if(event.key==='Escape'&&chapter.open){chapter.open=false;chapter.querySelector('summary').focus();}});
 document.addEventListener('pointerdown',event=>{if(chapter.open&&!chapter.contains(event.target))chapter.open=false;});
 resumeButton.addEventListener('click',()=>{if(data.resume){const saved={...data.resume};go(`#/?scene=${saved.scene}`,{resume:saved});resumeButton.hidden=true;}});
 return {start(){history.scrollRestoration='manual';current=normalizeEntry(history.state?.yougan)||{key:id(),index:0,origin:null};history.replaceState({...history.state,yougan:current},'',location.href);show({initial:true});},go,backInfo,noteHash(){hash=location.hash;},capture};
}
