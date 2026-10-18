import {createRenderer,staticMotion} from './motion-renderer.js';
import {createQualityController} from './experience-state.js';
import {labPaused,pauseLab,motionBlocked} from './motion-state.js';
export {labPaused,pauseLab};
let dispose=()=>{},intensity=1;
export function stopLab(){dispose();dispose=()=>{};}
export function setLabIntensity(value){intensity=Math.max(.3,Math.min(1.8,Number(value)||1));}
export function mountLab(root,catalog){
 stopLab();intensity=1;let frame=0,last=0,dead=false;
 const states=[...root.querySelectorAll('[data-motion-canvas]')].map(canvas=>({canvas,parent:canvas.closest('[data-motion-interval],[data-motion-detail]'),renderer:null,quality:createQualityController(),time:0,drawnAt:0,pointer:{x:0,y:0},target:{x:0,y:0},cleanup:()=>{},failed:false}));
 if(!states.length)return;
 const prepared=s=>!s.parent||s.parent.dataset.prepared==='true';
 const playing=s=>prepared(s)&&(!s.parent||s.parent.dataset.active==='true')&&s.renderer&&!motionBlocked();
 function draw(s){if(!s.renderer)return;const ms=s.renderer.draw(s.time,s.pointer);if(s.quality.record(ms))s.renderer.setQuality(s.quality.level);s.canvas.dataset.quality=String(s.quality.level);
  if(document.documentElement.hasAttribute('data-performance-probe')){s.canvas.dataset.drawSamples=JSON.stringify([...(JSON.parse(s.canvas.dataset.drawSamples||'[]')),ms].slice(-120));s.canvas.dataset.drawMs=ms.toFixed(3);}
 }
 function status(s,text){let message=s.canvas.parentElement.querySelector('.motion-recovery');if(!message){message=document.createElement('div');message.className='motion-recovery';message.setAttribute('role','status');s.canvas.parentElement.append(message);}message.replaceChildren();const p=document.createElement('p');p.textContent=text;message.append(p);const b=document.createElement('button');b.textContent='重新打开画面';b.type='button';b.addEventListener('click',()=>{s.failed=false;if(s.renderer)s.renderer.retry();else allocate(s);if(s.renderer)message.remove();reconcile();});message.append(b);}
 function allocate(s){
  if(s.renderer||s.failed||dead)return;
  const config=catalog.experiments.find(e=>e.effect===s.canvas.dataset.motionCanvas);
  try{s.renderer=createRenderer(s.canvas,config,{level:s.quality.level,invalidate:()=>{if(!dead)draw(s);},onError:()=>status(s,'部分配图没有打开，仍可继续观看。')});s.canvas.hidden=false;s.canvas.parentElement.querySelector('.motion-static')?.remove();
   const move=event=>{const r=s.canvas.getBoundingClientRect();s.target={x:(event.clientX-r.left)/r.width*2-1,y:(event.clientY-r.top)/r.height*2-1};if(motionBlocked()){s.pointer={...s.target};draw(s);}};const leave=()=>{s.target={x:0,y:0};};s.canvas.addEventListener('pointermove',move);s.canvas.addEventListener('pointerleave',leave);s.cleanup=()=>{s.canvas.removeEventListener('pointermove',move);s.canvas.removeEventListener('pointerleave',leave);};draw(s);
  }catch{s.failed=true;s.canvas.hidden=true;let fallback=s.canvas.parentElement.querySelector('.motion-static');if(!fallback){fallback=document.createElement('div');fallback.className='motion-static';fallback.innerHTML=staticMotion(s.canvas.dataset.motionCanvas,config);s.canvas.parentElement.prepend(fallback);}status(s,'当前浏览器暂不能播放动态画面，先看静态作品。');}
 }
 function release(s){if(!s.renderer)return;s.cleanup();s.renderer.dispose();s.renderer=null;s.canvas.dataset.animationState='released';s.canvas.parentElement.querySelector('.motion-recovery')?.remove();}
 function tick(now){frame=0;if(dead||motionBlocked())return;const dt=last?Math.min((now-last)/1000,.06):0;last=now;
  for(const s of states)if(playing(s)){s.time+=dt*intensity;const interval=[1000/60,1000/45,1000/30][s.quality.level];if(now-s.drawnAt<interval-1)continue;s.drawnAt=now;s.pointer.x+=(s.target.x-s.pointer.x)*.07;s.pointer.y+=(s.target.y-s.pointer.y)*.07;draw(s);}
  if(states.some(playing))frame=requestAnimationFrame(tick);
 }
 function reconcile(){if(dead)return;for(const s of states){if(prepared(s))allocate(s);else release(s);s.canvas.dataset.animationState=s.failed?'static':!prepared(s)?'released':motionBlocked()?'paused':playing(s)?'playing':'prepared';}
  if(states.some(playing)){if(!frame){last=0;frame=requestAnimationFrame(tick);}}else{cancelAnimationFrame(frame);frame=0;last=0;}
 }
 document.addEventListener('stage-change',reconcile);reconcile();
 dispose=()=>{dead=true;cancelAnimationFrame(frame);document.removeEventListener('stage-change',reconcile);states.forEach(release);};
}
