import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {CATEGORY,filterItems,randomOther,createSavedStore,MIXER,remix,rotatePalette,parseRoute} from '../web/core.js';
const catalog=JSON.parse(await readFile(new URL('../web/content/catalog.json',import.meta.url),'utf8'));
test('19 complete entries, ten originals and nine sourced selections',()=>{
 assert.equal(catalog.items.length,19);
 assert.equal(new Set(catalog.items.map(i=>i.id)).size,19);
 assert.equal(catalog.items.filter(i=>i.kind==='original').length,10);assert.equal(catalog.items.filter(i=>i.kind==='curated').length,9);
 assert.equal(catalog.items.filter(i=>i.interaction).length,3);
 for(const i of catalog.items){assert.ok(CATEGORY[i.category]);assert.ok(i.body.length&&i.body.every(p=>typeof p==='string'&&p.length));assert.ok(i.coverAlt&&i.coverCredit&&i.author);if(i.kind==='curated'){assert.equal(new URL(i.source.url).protocol,'https:');assert.ok(i.source.author&&i.source.checkedAt&&i.source.accessNote);}else assert.equal(i.source,null);}
});
test('every artwork exists, collections have valid bidirectional references',async()=>{
 for(const i of catalog.items){const resource=new URL('../web/'+i.cover,import.meta.url);assert.ok((await stat(resource)).size>0);if(i.cover.endsWith('.svg'))assert.match(await readFile(resource,'utf8'),/<svg[\s>]/);else assert.ok((await stat(resource)).size>10000);}
 assert.equal(catalog.collections.length,3);
 for(const c of catalog.collections){assert.ok(c.itemIds.length>=4);for(const id of c.itemIds){const item=catalog.items.find(i=>i.id===id);assert.ok(item,`Missing ${id}`);assert.ok(item.collections.includes(c.id));}}
 for(const i of catalog.items)for(const id of i.collections)assert.ok(catalog.collections.find(c=>c.id===id)?.itemIds.includes(i.id));
});
test('search combines text, category, origin and format; impossible query is empty',()=>{
 const base=catalog.items.find(i=>i.id==='shadow-ad');
 assert.equal(filterItems(catalog.items,{q:'影子',category:base.category,kind:'original',format:base.format}).some(i=>i.id===base.id),true);
 assert.equal(filterItems(catalog.items,{q:'no-such-work-7328'}).length,0);
 assert.equal(filterItems(catalog.items,{q:'PATATAP'}).length,1);
 assert.equal(filterItems(catalog.items,{kind:'curated'}).length,9);
 assert.equal(filterItems(catalog.items,{kind:'curated',format:'poem'}).length,0);
});
test('random discovery excludes current item and handles an empty candidate list',()=>{
 for(const fraction of [0,.2,.99])assert.notEqual(randomOther(catalog.items,'patatap',()=>fraction).id,'patatap');
 assert.equal(randomOther([{id:'one'}],'one'),null);
});
test('favorites persist across new stores and remove stale IDs',()=>{
 const db=new Map();const storage={getItem:key=>db.get(key)||null,setItem:(key,value)=>db.set(key,value)};
 const first=createSavedStore(storage,['a','b']);first.toggle('a');assert.ok(first.has('a'));
 const second=createSavedStore(storage,['a','b']);assert.deepEqual(second.all(),['a']);second.toggle('a');assert.deepEqual(second.all(),[]);
 first.toggle('b');const third=createSavedStore(storage,['a']);assert.deepEqual(third.all(),['a']);third.clear();assert.deepEqual(third.all(),[]);
 assert.equal(third.toggle('unknown'),false);
});
test('blocked and corrupted storage preserve usable in-memory favorites',()=>{
 const blocked={getItem(){throw new Error('blocked');},setItem(){throw new Error('blocked');}};
 const store=createSavedStore(blocked,['a']);assert.equal(store.available,false);store.toggle('a');assert.ok(store.has('a'));
 const malformed=createSavedStore({getItem:()=>'{',setItem(){}},['a']);assert.equal(malformed.available,false);malformed.toggle('a');assert.ok(malformed.has('a'));
});
test('creative mixer respects locks and varies unlocked elements',()=>{
 const first=remix({}, {},()=>0);const second=remix(first,{object:true},()=>0);
 assert.equal(first.object,second.object);assert.notEqual(first.action,second.action);assert.notEqual(first.limit,second.limit);
 assert.deepEqual(remix(first,{object:true,action:true,limit:true}),first);
 for(const key of Object.keys(MIXER))assert.ok(MIXER[key].includes(second[key]));
});
test('palette rotation preserves colors without mutating the source',()=>{
 const colors=['a','b','c','d'];assert.deepEqual(rotatePalette(colors),['b','c','d','a']);assert.deepEqual(colors,['a','b','c','d']);
});
test('shared routes retain IDs and combined query filters',()=>{
 assert.deepEqual(parseRoute('#/item/moon-library').id,'moon-library');
 const r=parseRoute('#/discover?category=empathy&q=%E5%8F%8B');assert.equal(r.page,'discover');assert.equal(r.params.get('q'),'友');
 assert.equal(parseRoute('').page,'home');
});
test('site entry resources and reader-facing editorial articles are complete',async()=>{
 const html=await readFile(new URL('../web/index.html',import.meta.url),'utf8');
 for(const name of ['app.js','styles.css','assets/favicon.svg'])assert.ok(html.includes(name));
 assert.equal(catalog.articles.length,3);for(const a of catalog.articles)assert.ok(a.id&&a.title&&a.body.length>=3);
 await assert.rejects(stat(new URL('../SKILL.md',import.meta.url)),{code:'ENOENT'});
 await assert.rejects(stat(new URL('../agents/openai.yaml',import.meta.url)),{code:'ENOENT'});
});
