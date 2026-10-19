import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {microwaveArt} from '../web/microwave-art.js';
import {normalizeSceneState,changeSceneState,createStore} from '../web/experience-state.js';
import {getEntries,filterItems,createSavedStore,entryHref} from '../web/core.js';
const c=JSON.parse(await readFile(new URL('../web/content/catalog.json',import.meta.url),'utf8'));
const work=c.items.find(i=>i.id==='microwave-slacking');

test('microwave story remains searchable, collectible and part of the daily editorial route',()=>{
 assert.ok(work.experience);assert.equal(work.experience.type,'microwave');assert.equal(entryHref(work),'#/item/microwave-slacking');
 for(const q of ['微波炉','冰箱','摸鱼'])assert.ok(filterItems(getEntries(c),{q}).some(i=>i.id===work.id));
 const collection=c.collections.find(i=>i.id==='daily');assert.ok(collection.itemIds.includes(work.id));assert.ok(collection.viewingNotes[work.id]);
 const memory=new Map([['yougan.saved.v1',JSON.stringify(['last-box','quiet-sphere'])]]);const storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};
 const saved=createSavedStore(storage,getEntries(c).map(i=>i.id));saved.toggle(work.id);assert.deepEqual(createSavedStore(storage,getEntries(c).map(i=>i.id)).all(),['last-box','quiet-sphere',work.id]);
});
test('turning for three rounds never changes the ice or skips the reveal',()=>{
 let s=normalizeSceneState({rice:true,view:'staying'});assert.equal(s.microwave,'frozen');
 s=changeSceneState(s,'microwave-check');assert.equal(s.microwave,'frozen');
 s=changeSceneState(s,'microwave-start');assert.equal(s.microwave,'spinning');assert.equal(s.microwaveRounds,1);
 for(let n=0;n<10;n++)s=changeSceneState(s,'microwave-wait');assert.equal(s.microwaveRounds,3);assert.equal(s.microwave,'spinning');
 s=changeSceneState(s,'microwave-check');assert.equal(s.microwave,'caught');assert.equal(s.rice,true);assert.equal(s.view,'staying');
 s=changeSceneState(s,'microwave-wait');assert.equal(s.microwave,'caught');
 s=changeSceneState(s,'microwave-reset');assert.equal(s.microwave,'frozen');assert.equal(s.microwaveRounds,0);assert.equal(s.rice,true);
});
test('new session choices survive reload and blocked storage; legacy scenes retain defaults',()=>{
 const memory=new Map();const storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};
 const normalize=raw=>Object.fromEntries(Object.entries(raw).map(([id,state])=>[id,normalizeSceneState(state)]));
 const initial={'last-box':{opened:true,view:'staying'}};
 const store=createStore(storage,'yougan.scenes.v1',normalize,initial);store.set({...initial,[work.id]:changeSceneState(changeSceneState({},'microwave-start'),'microwave-check')});
 const reloaded=createStore(storage,'yougan.scenes.v1',normalize,{});assert.equal(reloaded.get()[work.id].microwave,'caught');assert.equal(reloaded.get()['last-box'].view,'staying');assert.equal(reloaded.get()['last-box'].microwave,'frozen');
 const blocked=createStore({getItem(){throw Error()},setItem(){throw Error()}},'micro',normalizeSceneState,normalizeSceneState());blocked.set(changeSceneState(blocked.get(),'microwave-start'));assert.equal(blocked.get().microwave,'spinning');assert.equal(blocked.available,false);
 assert.equal(normalizeSceneState({microwave:'hot',microwaveRounds:99}).microwave,'frozen');assert.equal(normalizeSceneState({microwave:'spinning',microwaveRounds:-4}).microwaveRounds,1);
});
test('one authored ice shape is shared by static and animated scenes; every stage has readable text',async()=>{
 const svg=microwaveArt(),x=work.experience;assert.equal((svg.match(/class="microwave-meal"/g)||[]).length,1);assert.match(svg,/microwave-fish/);assert.doesNotMatch(svg,/<script|<image|https?:\/\/[^w]/);
 const cover=await readFile(new URL('../web/'+work.cover,import.meta.url),'utf8');assert.match(cover,/microwave-meal/);assert.match(cover,/microwave-fish" opacity="1"/);
 assert.equal(x.busy.length,3);assert.equal(x.screenBusy.length,3);for(const key of ['intro','revealed','artFrozen','artSpinning','artCaught','note'])assert.ok(x[key]);
 assert.ok(work.body.some(p=>p.includes('冰连一个角都没少')));assert.ok(work.body.some(p=>p.includes('光做的小鱼')));
});
