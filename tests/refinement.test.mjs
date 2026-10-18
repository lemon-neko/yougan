import test from 'node:test';
import assert from 'node:assert/strict';
import {createStore,changeSceneState,normalizeSceneState,normalizeVisit,restoredY,normalizeJourney,selectStages,createQualityController} from '../web/experience-state.js';
import {project,createProjector} from '../web/motion-geometry.js';
import {createRenderer,staticMotion} from '../web/motion-renderer.js';

test('pause preference survives new store instances and blocked storage stays usable',()=>{
 const memory=new Map(),storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};
 const first=createStore(storage,'pause',v=>v===true,false);first.set(true);assert.equal(createStore(storage,'pause',v=>v===true,false).get(),true);
 const blocked=createStore({getItem(){throw Error();},setItem(){throw Error();}},'pause',v=>v===true,false);blocked.set(true);assert.equal(blocked.get(),true);assert.equal(blocked.available,false);
 const corrupt=createStore({getItem:()=>'{',setItem(){}},'pause',v=>v===true,false);assert.equal(corrupt.get(),false);
});
test('each museum object remembers its own transformation without changing its neighbors',()=>{
 let s=changeSceneState({},'imagine');s=changeSceneState(s,'object',1);assert.equal(s.imagined.umbrella,false);s=changeSceneState(s,'imagine');s=changeSceneState(s,'object',0);assert.equal(s.imagined.cup,true);assert.equal(s.imagined.clip,false);
 const roundTrip=normalizeSceneState(JSON.parse(JSON.stringify(s)));assert.deepEqual(roundTrip,s);
});
test('bookmark changes preserve the returned book; rereading explicitly resets it',()=>{
 let s=changeSceneState({},'stamp');s=changeSceneState(s,'bookmark');assert.equal(s.stamped,true);assert.equal(s.bookmark,1);s=changeSceneState(s,'bookmark');s=changeSceneState(s,'bookmark');assert.equal(s.bookmark,0);assert.equal(s.stamped,true);s=changeSceneState(s,'reread');assert.equal(s.stamped,false);assert.equal(s.bookmark,0);
 assert.deepEqual(normalizeSceneState({object:999,wind:-1,bookmark:99,imagined:true}),normalizeSceneState());
});
test('resume locations validate IDs and restore offsets relative to scene geometry',()=>{
 assert.equal(normalizeVisit({scene:'unknown',offset:10},['moon-library']),null);assert.equal(normalizeVisit({scene:'moon-library',offset:NaN},['moon-library']),null);
 const visit=normalizeVisit({scene:'moon-library',offset:215},['moon-library']);assert.equal(restoredY(visit,3200),3415);assert.equal(restoredY({y:480}),480);assert.equal(restoredY({scene:'moon-library',offset:-150},100),0);
});
test('stage selection keeps one active work and no more than two nearby motion resources',()=>{
 const stages=[{id:'shadow',top:0,bottom:900,motion:false},{id:'cloud',top:2100,bottom:2900,motion:true},{id:'sphere',top:4200,bottom:5000,motion:true},{id:'gallery',top:6200,bottom:7000,motion:true}];
 assert.deepEqual(selectStages(stages,450),{active:'shadow',prepared:[]});
 const near=selectStages(stages.map(s=>({...s,top:s.top-2000,bottom:s.bottom-2000})),450);assert.equal(near.active,'cloud');assert.deepEqual(near.prepared,['cloud']);
 const crowded=selectStages([{id:'a',top:0,bottom:500,motion:true},{id:'b',top:500,bottom:1000,motion:true},{id:'c',top:1000,bottom:1500,motion:true}],450);assert.equal(crowded.prepared.length,2);assert.ok(crowded.prepared.includes(crowded.active));
 assert.deepEqual(selectStages([{id:'a',top:1550,bottom:1900,motion:true}],450,['a']).prepared,['a']);
 assert.deepEqual(selectStages([{id:'a',top:2200,bottom:2600,motion:true}],450,['a']).prepared,[]);
});
test('damaged journey records cannot inject invalid focus or iterable snapshots into restoration',()=>{
 const result=normalizeJourney({records:{good:{key:'good',index:2,hash:'#/discover?q=moon',snapshot:{y:400,focus:{href:'#/item/moon-library',index:0},readings:['moon-library','unknown']}},bad:{key:'bad',index:-1,hash:'https://example.com'},odd:{key:'odd',index:3,hash:'#/',snapshot:{y:'bad',readings:{},focus:{href:'https://example.com',index:0}}}},resume:{scene:'unknown',offset:12}},['moon-library']);
 assert.equal(result.records.bad,undefined);assert.equal(result.records.good.snapshot.focus.href,'#/item/moon-library');assert.deepEqual(result.records.good.snapshot.readings,['moon-library']);assert.equal(result.records.odd.snapshot.y,0);assert.deepEqual(result.records.odd.snapshot.readings,[]);assert.equal(result.records.odd.snapshot.focus,null);assert.equal(result.resume,null);
});
test('sustained expensive frames reduce quality, fast frames never bounce it back up',()=>{
 const q=createQualityController();for(let n=0;n<100;n++)q.record(20);assert.equal(q.level,2);for(let n=0;n<150;n++)q.record(1);assert.equal(q.level,2);
 const fast=createQualityController();for(let n=0;n<150;n++)fast.record(3);assert.equal(fast.level,0);
});
test('precomputed projection preserves the original geometry and reuses output objects',()=>{
 for(const yaw of [0,.8,2])for(const pitch of [-.2,0,.3]){const reusable={},p={x:.4,y:.7,z:-.2};const actual=createProjector(yaw,pitch,1366,480)(p.x,p.y,p.z,reusable),expected=project(p,yaw,pitch,1366,480);assert.equal(actual,reusable);for(const key of Object.keys(expected))assert.ok(Math.abs(expected[key]-actual[key])<1e-9);}
});
test('renderer release prevents queued resize callbacks from reallocating the canvas',()=>{
 const priorWindow=globalThis.window,priorObserver=globalThis.ResizeObserver;let callback,clears=0,disconnected=false;
 globalThis.window={innerWidth:1366,devicePixelRatio:1};globalThis.ResizeObserver=class{constructor(cb){callback=cb;}observe(){}disconnect(){disconnected=true;}};
 const noop=()=>{},ctx=new Proxy({clearRect(){clears++;},createRadialGradient:()=>({addColorStop:noop})},{get:(o,key)=>key in o?o[key]:noop});
 const canvas={dataset:{motionCanvas:'cloud'},width:1,height:1,getContext:()=>ctx,getBoundingClientRect:()=>({width:980,height:480})};
 try{const renderer=createRenderer(canvas,{});assert.equal(canvas.dataset.allocated,'true');renderer.draw(1,{x:0,y:0});const before=clears;renderer.dispose();callback();assert.equal(canvas.width,1);assert.equal(canvas.height,1);assert.equal(clears,before);assert.ok(disconnected);assert.equal(canvas.dataset.allocated,undefined);}finally{globalThis.window=priorWindow;globalThis.ResizeObserver=priorObserver;}
});
test('unsupported Canvas has meaningful static fallbacks for all three experiments',()=>{
 assert.match(staticMotion('cloud'),/<circle/);assert.match(staticMotion('sphere'),/静态图形/);assert.match(staticMotion('gallery',{images:['assets/moon-library.jpg']}),/<image href="assets\/moon-library.jpg"/);
});
test('already cached gallery images wait for their geometry before the first draw',()=>{
 const old={window:globalThis.window,ResizeObserver:globalThis.ResizeObserver,Image:globalThis.Image};let draws=0;const images=[];const noop=()=>{};
 globalThis.window={innerWidth:1366,devicePixelRatio:1};globalThis.ResizeObserver=class{observe(){}disconnect(){}};
 globalThis.Image=class{constructor(){this.complete=true;this.naturalWidth=100;this.naturalHeight=80;images.push(this);}};
 const ctx=new Proxy({drawImage(){draws++;}},{get:(o,key)=>key in o?o[key]:noop});const canvas={dataset:{motionCanvas:'gallery'},width:1,height:1,getContext:()=>ctx,getBoundingClientRect:()=>({width:980,height:480})};
 try{const renderer=createRenderer(canvas,{images:['first.jpg','second.jpg']});assert.equal(draws,0);images.forEach(img=>img.onload());renderer.draw(1,{x:0,y:0});assert.ok(draws>0);renderer.dispose();assert.ok(images.every(img=>img.onload===null));}finally{Object.assign(globalThis,old);}
});
