import {createStore,getStorage,selectStages} from './experience-state.js';
const preference=createStore(getStorage('localStorage'),'yougan.motion.v1',value=>value===true,false);
export const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
export const labPaused=()=>preference.get();
export const motionBlocked=()=>labPaused()||reducedMotion.matches||document.hidden;
export function pauseLab(value){preference.set(value===true);document.dispatchEvent(new Event('lab-state'));return preference.available;}
export function mountStageRuntime(root){
 const stages=[...root.querySelectorAll('[data-stream-id]')];let frame=0,dead=false,previous=[];
 const update=()=>{
  frame=0;if(dead)return;
  const mode=selectStages(stages.map(el=>{const r=el.getBoundingClientRect();return {id:el.dataset.streamId,top:r.top,bottom:r.bottom,motion:el.hasAttribute('data-motion-interval')||el.hasAttribute('data-motion-detail')};}),window.innerHeight/2,previous);previous=mode.prepared;
  const blocked=motionBlocked();document.body.dataset.motionPaused=String(blocked);
  for(const el of stages){el.dataset.active=String(el.dataset.streamId===mode.active);el.dataset.prepared=String(mode.prepared.includes(el.dataset.streamId));}
  document.querySelectorAll('[data-global-pause],[data-lab-pause]').forEach(b=>{b.textContent=reducedMotion.matches?'静态观看':labPaused()?'继续播放':'暂停动态';b.disabled=reducedMotion.matches;b.setAttribute('aria-pressed',String(labPaused()||reducedMotion.matches));});
  document.dispatchEvent(new CustomEvent('stage-change',{detail:mode}));
 };
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
 document.addEventListener('visibilitychange',update);document.addEventListener('lab-state',update);reducedMotion.addEventListener('change',update);update();
 return ()=>{dead=true;cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);document.removeEventListener('visibilitychange',update);document.removeEventListener('lab-state',update);reducedMotion.removeEventListener('change',update);};
}
