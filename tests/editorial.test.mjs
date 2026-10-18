import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {activeFilters,removeFilter,filterItems,getEntries,parseRoute} from '../web/core.js';
import {changeSceneState,normalizeSceneState,createStore} from '../web/experience-state.js';
import {dinnerArt,boxObjects} from '../web/domestic-art.js';
const catalog=JSON.parse(await readFile(new URL('../web/content/catalog.json',import.meta.url),'utf8'));

test('each existing collection retains an ordered, complete set of specific viewing notes',()=>{
 assert.deepEqual(catalog.collections.map(c=>c.id),['daily','wordless','perspective']);
 const ids=getEntries(catalog).map(i=>i.id);const notes=[];
 for(const c of catalog.collections){assert.deepEqual(Object.keys(c.viewingNotes),c.itemIds);assert.equal(new Set(c.itemIds).size,c.itemIds.length);for(const id of c.itemIds){assert.ok(ids.includes(id));assert.ok(c.viewingNotes[id].length>12);notes.push(c.viewingNotes[id]);}}
 assert.equal(new Set(notes).size,notes.length);
});
test('discovery conditions can be removed one by one without dropping other URL filters',()=>{
 const route=parseRoute('#/discover?q=月亮&category=creative&kind=original&format=comic');
 let filters=Object.fromEntries(route.params);assert.equal(activeFilters(filters).length,4);
 assert.equal(filterItems(getEntries(catalog),filters)[0].id,'moon-library');
 filters=removeFilter(filters,'q');assert.equal(filters.q,'');assert.equal(filters.category,'creative');assert.equal(filters.format,'comic');
 assert.deepEqual(activeFilters(filters).map(f=>f.key),['category','kind','format']);
 for(const key of ['category','kind','format'])filters=removeFilter(filters,key);
 assert.equal(activeFilters(filters).length,0);assert.equal(filterItems(getEntries(catalog),filters).length,21);
 assert.equal(filterItems(getEntries(catalog),{format:'website'}).length,9);
 assert.deepEqual(removeFilter({q:'声音'},'bogus'),{q:'声音'});
});
test('rice replay, tape folds and both table controls preserve unrelated scene choices',()=>{
 let s=normalizeSceneState({rice:true,opened:true,view:'staying',choice:'missing',wind:2,bookmark:1});
 s=changeSceneState(s,'rice');assert.equal(s.rice,false);s=changeSceneState(s,'rice');assert.equal(s.rice,true);
 s=changeSceneState(s,'open');assert.equal(s.opened,false);assert.equal(s.view,'staying');s=changeSceneState(s,'open');assert.equal(s.opened,true);assert.equal(s.view,'staying');
 s=changeSceneState(s,'table-toggle');assert.equal(s.choice,'empty');s=changeSceneState(s,'table','missing');assert.equal(s.choice,'missing');s=changeSceneState(s,'table-toggle');assert.equal(s.choice,'empty');assert.equal(s.wind,2);assert.equal(s.bookmark,1);
});
test('existing session states survive new artwork details and blocked storage',()=>{
 const old={rice:true,opened:false,view:'staying',choice:'missing'};
 const map=new Map([['yougan.scenes.v1',JSON.stringify(old)]]),storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};
 const store=createStore(storage,'yougan.scenes.v1',normalizeSceneState,normalizeSceneState());assert.equal(store.get().view,'staying');assert.equal(store.get().rice,true);
 store.set(changeSceneState(store.get(),'open'));assert.equal(JSON.parse(map.get('yougan.scenes.v1')).view,'staying');
 const blocked=createStore({getItem(){throw Error()},setItem(){throw Error()}},'yougan.scenes.v1',normalizeSceneState,normalizeSceneState());blocked.set(changeSceneState(blocked.get(),'table-toggle'));assert.equal(blocked.get().choice,'missing');assert.equal(blocked.available,false);
});
test('new visual descriptions, objects and original prose remain complete without animation',()=>{
 const find=id=>catalog.items.find(i=>i.id===id);
 for(const key of ['artBefore','artAfter','memoryCaption','riceLabel'])assert.ok(find('salty-dinner').experience[key]);
 for(const p of find('last-box').experience.perspectives){assert.ok(['bowl','slippers'].includes(p.object));assert.ok(p.objectLabel);assert.ok(p.objectNote);assert.equal(p.paragraphs.length,3);}
 for(const key of ['artEmpty','artMissing','noteText','placeAction'])assert.ok(find('wide-table').experience[key]);
 assert.ok(find('salty-dinner').body[0].includes('把这次旅行吃完'));assert.ok(find('last-box').body.some(p=>p.includes('带一双你穿惯的拖鞋')));
 assert.match(dinnerArt(),/data-last-grain/);assert.match(boxObjects(),/box-object-slippers/);assert.doesNotMatch(dinnerArt()+boxObjects(),/<image|https?:/);
});

test('a guided collection returns to discovery while a standalone artwork uses its declared fallback',async()=>{
 const {createJourney}=await import('../web/journey.js');
 const names=['window','document','location','history','requestAnimationFrame'];const original=Object.fromEntries(names.map(n=>[n,globalThis[n]]));
 const listeners={},stack=[];let at=-1;const location={hash:'#/discover',pathname:'/',search:'',href:'http://local/#/discover'};
 const update=hash=>{location.hash=hash;location.href='http://local/'+hash;};
 const history={state:null,replaceState(s,_,hash){this.state=s;if(hash.startsWith('#'))update(hash);if(at<0){at=0;stack.push({s,hash:location.hash});}else stack[at]={s,hash:location.hash};},pushState(s,_,hash){this.state=s;update(hash);stack.splice(++at);stack.push({s,hash});},go(delta){at+=delta;this.state=stack[at].s;update(stack[at].hash);listeners.popstate();}};
 const main={querySelector:()=>null,querySelectorAll:()=>[],focus(){},contains:()=>true};
 const chapter={hidden:true,open:false,contains:()=>false};const resume={addEventListener(){}};
 const document={activeElement:main,querySelector:selector=>selector==='#chapter-nav'?chapter:resume,addEventListener(name,fn){listeners[name]=fn;},getElementById:()=>null};
 const memory=new Map();const window={scrollY:0,sessionStorage:{getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)},addEventListener(name,fn){listeners[name]=fn;},scrollTo(){}};
 Object.assign(globalThis,{window,document,location,history,requestAnimationFrame:fn=>{fn();return 1;}});
 const clickReturn=href=>listeners.click({button:0,preventDefault(){},target:{closest:selector=>selector==='a[href]'?{target:'',hasAttribute:key=>key==='data-return',getAttribute:()=>href}:null}});
 try{
  const journey=createJourney({main,catalog,render(){}});journey.start();journey.go('#/collection/daily');assert.equal(journey.backInfo('#/collections','全部专题').href,'#/discover');
  journey.go('#/item/salty-dinner');assert.equal(journey.backInfo('#/','回到作品流').href,'#/collection/daily');
  clickReturn('#/collection/daily');assert.equal(location.hash,'#/collection/daily');clickReturn('#/discover');assert.equal(location.hash,'#/discover');
  // No saved source for a link opened directly; its rendered href remains authoritative.
  update('#/item/wide-table');history.state=null;const direct=createJourney({main,catalog,render(){}});direct.start();clickReturn('#/');assert.equal(location.hash,'#/');
 }finally{for(const name of names){if(original[name]===undefined)delete globalThis[name];else globalThis[name]=original[name];}}
});
