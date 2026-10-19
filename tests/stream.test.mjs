import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {getEntries,entryHref,filterItems,createSavedStore,parseRoute} from '../web/core.js';
const catalog=JSON.parse(await readFile(new URL('../web/content/catalog.json',import.meta.url),'utf8'));
const entries=getEntries(catalog);

test('the authored stream has nine valid unique scenes and the selected external ending',()=>{
 assert.deepEqual(catalog.stream.map(x=>x.id),['shadow-ad','salty-dinner','thought-cloud','moon-library','wrong-use-museum','quiet-sphere','last-box','wide-table','orbit-gallery']);
 for(const ref of catalog.stream){const item=(ref.type==='item'?catalog.items:catalog.experiments).find(i=>i.id===ref.id);assert.ok(item);if(ref.type==='item')assert.ok(item.experience);else assert.ok(item.interlude);}
 for(const id of catalog.streamRecommendations)assert.ok(catalog.items.find(i=>i.id===id&&i.kind==='curated')?.source.url);
});
test('every original scene has full text, its own controls and a disclosure of fictional or AI content',()=>{
 const scenes=catalog.items.filter(i=>i.experience);assert.equal(scenes.length,7);
 assert.equal(new Set(scenes.map(i=>i.experience.type)).size,7);
 for(const item of scenes){const x=item.experience;for(const key of ['headline','eyebrow','instruction','note'])assert.ok(x[key]);assert.ok(item.body.length>=2);assert.match(x.note,/AI/);}
 assert.equal(scenes.find(i=>i.id==='moon-library').experience.frames.length,3);
 assert.equal(scenes.find(i=>i.id==='last-box').experience.perspectives.length,2);
 assert.equal(scenes.find(i=>i.id==='wrong-use-museum').experience.objects.length,3);
});
test('22 works share complete discovery data and preserve both item and motion routes',()=>{
 assert.equal(entries.length,22);assert.equal(new Set(entries.map(i=>i.id)).size,22);
 for(const item of entries){assert.ok(item.tags.length);assert.ok(item.body.length);const route=parseRoute(entryHref(item));assert.equal(route.id,item.id);assert.equal(route.page,item.effect?'motion':'item');}
 assert.equal(filterItems(entries,{format:'motion'}).length,3);
 assert.equal(filterItems(entries,{kind:'original'}).length,13);
 assert.equal(filterItems(entries,{q:'星球',kind:'original',format:'motion'}).length,1);
});
test('existing browser favorites survive catalog expansion and new experiments persist alongside them',()=>{
 const data=new Map([['yougan.saved.v1',JSON.stringify(['shadow-ad','last-box'])]]);
 const storage={getItem:key=>data.get(key),setItem:(key,value)=>data.set(key,value)};
 const saved=createSavedStore(storage,entries.map(i=>i.id));assert.deepEqual(saved.all(),['shadow-ad','last-box']);saved.toggle('quiet-sphere');
 const restored=createSavedStore(storage,entries.map(i=>i.id));assert.deepEqual(restored.all(),['shadow-ad','last-box','quiet-sphere']);
});
test('local module imports and stylesheet references resolve to built-source resources',async()=>{
 const base=new URL('../web/',import.meta.url);
 for(const file of await readdir(base))if(file.endsWith('.js')){
  const body=await readFile(new URL(file,base),'utf8');
  for(const match of body.matchAll(/from\s+['"](\.\/[^'"]+)['"]/g))assert.ok((await stat(new URL(match[1],base))).size>0);
 }
 const html=await readFile(new URL('index.html',base),'utf8');assert.ok(html.includes('scenes.css'));for(const match of html.matchAll(/rel="stylesheet" href="([^"]+)"/g))assert.ok((await stat(new URL(match[1],base))).size>0);
});
