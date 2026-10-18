export const CATEGORY = {creative: '有趣创意', aesthetic: '审美发现', empathy: '共情时刻'};
export const FORMAT = {poem:'诗',letter:'短笺',poster:'海报',photo:'视觉作品',comic:'插画故事',exhibition:'小展览',interactive:'互动',motion:'动态作品',website:'网站'};
export const FEELINGS = {
  '轻快': ['#f56950','#ffcc45','#4164d9','#f4efe3'],
  '安静': ['#67877d','#c1ccc3','#ece7da','#374b55'],
  '好奇': ['#4869dd','#d5d4f0','#f5a45d','#f4f0e9'],
  '想念': ['#b37874','#e4c9b9','#718fa3','#f1e7d8'],
  '有点乱': ['#a4ba65','#ee825a','#5364a5','#f3d8b8']
};
export function filterItems(items, {q='',category='',kind='',format=''}={}) {
  const words=q.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return items.filter(i=>(!category||i.category===category)&&(!kind||i.kind===kind)&&(!format||i.format===format)&&words.every(w=>[i.title,i.subtitle,i.author,...i.tags,...i.body].join(' ').toLocaleLowerCase().includes(w)));
}
export function randomOther(items, current='',random=Math.random) {
  const candidates=items.filter(i=>i.id!==current);
  return candidates.length ? candidates[Math.min(candidates.length-1,Math.floor(random()*candidates.length))] : null;
}
export function createSavedStore(storage, knownIds) {
  let ids=new Set(), available=true;
  try {
    const raw=storage.getItem('yougan.saved.v1');
    const parsed=raw?JSON.parse(raw):[];
    if(!Array.isArray(parsed))throw new Error('Invalid saved list');
    ids=new Set(parsed.filter(id=>typeof id==='string'&&knownIds.includes(id)));
  } catch {available=false;}
  return {
    get available(){return available;},
    all:()=>[...ids], has:id=>ids.has(id),
    toggle(id){if(!knownIds.includes(id))return false;ids.has(id)?ids.delete(id):ids.add(id);this.persist();return ids.has(id);},
    clear(){ids.clear();this.persist();},
    persist(){try{storage.setItem('yougan.saved.v1',JSON.stringify([...ids]));}catch{available=false;}}
  };
}
export const MIXER = {
  object:['雨伞','纸箱','旧车票','一片树叶','杯子','回形针','窗帘','一把椅子'],
  action:['替人保存声音','给影子放一天假','收集今天的风','把距离折起来','给路过的人写信','交换一种颜色','为沉默留一个位置','把普通的一天放大'],
  limit:['只能用两种颜色','不出现一个字','只用窗边的光','让它小到能放进口袋','用一张纸完成','把最重要的部分留白','从物件的视角开始','只给十秒钟']
};
export function remix(previous={},locks={},random=Math.random) {
  return Object.fromEntries(Object.entries(MIXER).map(([key,values])=>{
    if(locks[key]&&values.includes(previous[key]))return [key,previous[key]];
    const candidates=values.filter(v=>v!==previous[key]);
    return [key,candidates[Math.min(candidates.length-1,Math.floor(random()*candidates.length))]];
  }));
}
export function rotatePalette(colors) {return [...colors.slice(1),colors[0]];}
export function parseRoute(hash) {
  const [path,search='']=hash.replace(/^#\/?/,'').split('?');
  const parts=path.split('/').filter(Boolean);
  return {page:parts[0]||'home',id:parts[1]||'',params:new URLSearchParams(search)};
}

export function getEntries(catalog){return [...catalog.items,...(catalog.experiments||[])];}
export function entryHref(item){return `#/${item.effect?'motion':'item'}/${item.id}`;}

// Discovery keeps its public query parameters while exposing removable conditions.
export function activeFilters(filters={}) {
 const labels={q:value=>`关键词：${value}`,category:value=>CATEGORY[value],kind:value=>({original:'有感原创',curated:'外部精选'}[value]),format:value=>FORMAT[value]};
 return Object.entries(labels).flatMap(([key,label])=>{const value=String(filters[key]||'').trim();const text=value&&label(value);return text?[{key,value,label:text}]:[];});
}
export function removeFilter(filters,key){return {...filters,...(['q','category','kind','format'].includes(key)?{[key]:''}:{})};}
