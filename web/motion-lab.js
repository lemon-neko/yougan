import {spherePoints,project} from './motion-geometry.js';
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let dispose=()=>{},paused=false,intensity=1;
export function stopLab(){dispose();dispose=()=>{};}
export function labPaused(){return paused;}
export function pauseLab(value){paused=value;document.dispatchEvent(new Event('lab-state'));}
export function setLabIntensity(value){intensity=Number(value)||1;}
function triangle(ctx,img,s,d){
  const [s0,s1,s2]=s,[d0,d1,d2]=d;
  const a=s1.x-s0.x,b=s1.y-s0.y,c=s2.x-s0.x,dv=s2.y-s0.y,det=a*dv-b*c;
  if(Math.abs(det)<.001)return;
  const ux=d1.x-d0.x,uy=d1.y-d0.y,vx=d2.x-d0.x,vy=d2.y-d0.y;
  const A=(ux*dv-vx*b)/det,B=(uy*dv-vy*b)/det,C=(vx*a-ux*c)/det,D=(vy*a-uy*c)/det;
  ctx.save();ctx.beginPath();ctx.moveTo(d0.x,d0.y);ctx.lineTo(d1.x,d1.y);ctx.lineTo(d2.x,d2.y);ctx.closePath();ctx.clip();
  ctx.transform(A,B,C,D,d0.x-A*s0.x-C*s0.y,d0.y-B*s0.x-D*s0.y);ctx.drawImage(img,0,0);ctx.restore();
}
function drawGallery(s,time){
  const {ctx,w,h,images,pointer}=s,angle=time*.14+pointer.x*.4;
  const panels=Array.from({length:10},(_,i)=>{
    const a=i*Math.PI*2/10+angle;
    const center={x:Math.sin(a)*1.28,y:Math.sin(a*2)*.27,z:Math.cos(a)*1.1};
    const corners=[[-.48,-.34],[.48,-.34],[.48,.34],[-.48,.34]].map(([x,y])=>project({x:center.x+x*Math.cos(a),y:center.y+y,z:center.z-x*Math.sin(a)},pointer.x*.12,pointer.y*.12,w,h,1.2));
    return {corners,z:center.z,img:images[i%images.length]};
  }).sort((a,b)=>a.z-b.z);
  for(const {corners:q,z,img} of panels){
    ctx.globalAlpha=.35+(z+1.1)/2.2*.65;
    if(img?.complete&&img.naturalWidth){
      const iw=img.naturalWidth,ih=img.naturalHeight;
      triangle(ctx,img,[{x:0,y:0},{x:iw,y:0},{x:iw,y:ih}],[q[0],q[1],q[2]]);
      triangle(ctx,img,[{x:0,y:0},{x:iw,y:ih},{x:0,y:ih}],[q[0],q[2],q[3]]);
    }else{
      ctx.fillStyle='#51465f';ctx.beginPath();q.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fill();
    }
    ctx.strokeStyle='#ffffff30';ctx.beginPath();q.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.stroke();
  }
  ctx.globalAlpha=1;
}
function drawParticles(s,time){
  const {ctx,w,h,points,pointer,type}=s;
  const sphere=type==='sphere',yaw=time*(sphere?.15:.08)+pointer.x*.45,pitch=pointer.y*.25;
  if(!sphere){
    ctx.save();ctx.translate(w/2,h*.81);ctx.scale(1,.2);
    for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(0,0,Math.min(w,h)*(.19+i*.09)+Math.sin(time+i)*3,0,Math.PI*2);ctx.strokeStyle=`rgba(68,98,255,${.22-i*.025})`;ctx.lineWidth=1;ctx.stroke();}ctx.restore();
    const glow=ctx.createRadialGradient(w/2,h*.4,0,w/2,h*.4,Math.min(w,h)*.44);glow.addColorStop(0,'#1233b32b');glow.addColorStop(1,'#09090c00');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    ctx.globalCompositeOperation='lighter';
  }
  for(const p of points){
    let x=p.x,y=p.y,z=p.z;
    if(!sphere){
      const wave=1+Math.sin(p.y*5+time*.65)*.09;
      x*=wave;z*=wave;
      y+=Math.sin(p.x*6+time*.5)*.045;
    }
    const q=project({x,y,z},yaw,pitch,w,h,sphere?1:1.12);
    const pulse=.7+Math.sin(time*1.4+p.seed*30)*.3;
    const alpha=(sphere?.25:.4)+(q.z+1)*.3;
    ctx.fillStyle=sphere?`rgba(220,231,241,${alpha*pulse})`:`hsla(${205+p.seed*65},96%,${58+p.seed*23}%,${alpha*pulse})`;
    const radius=(sphere?.65:.85)+Math.max(0,q.z)*.4;
    ctx.beginPath();ctx.arc(q.x,q.y,radius,0,Math.PI*2);ctx.fill();
  }
  ctx.globalCompositeOperation='source-over';
}
export function mountLab(root,catalog){
  stopLab();intensity=1;const canvases=[...root.querySelectorAll('[data-motion-canvas]')];if(!canvases.length)return;
  let frame=0,last=0,time=0,dead=false;const cleanups=[];
  const states=canvases.map(canvas=>{
    const ctx=canvas.getContext('2d');if(!ctx){canvas.replaceWith(Object.assign(document.createElement('p'),{textContent:'当前浏览器暂不支持动态画布。'}));return null;}
    const type=canvas.dataset.motionCanvas;
    const mobile=window.innerWidth<768;
    const base=spherePoints(type==='sphere'?(mobile?1600:3200):(mobile?2300:4800));
    const points=type==='cloud'?base.map((p,i)=>{
      if(i%5===0){const t=p.seed;return {...p,x:p.x*(.05+t*.11),y:.1+t*.92,z:p.z*(.05+t*.11)};}
      const r=.88+.12*Math.sin(p.y*8+p.x*5);return {...p,x:p.x*r*(.62+p.seed*.38),y:p.y*.43-.3,z:p.z*r*.66*(.62+p.seed*.38)};
    }):base;
    const s={canvas,ctx,type,points,w:1,h:1,visible:false,pointer:{x:0,y:0},target:{x:0,y:0},images:[]};
    if(type==='gallery')s.images=catalog.experiments.find(e=>e.id==='orbit-gallery').images.map(src=>{const img=new Image();img.onload=()=>{draw(s);};img.src=src;return img;});
    const size=()=>{const r=canvas.getBoundingClientRect();s.w=r.width;s.h=r.height;const dpr=Math.min(window.devicePixelRatio||1,1.75);canvas.width=Math.round(s.w*dpr);canvas.height=Math.round(s.h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw(s);};
    const move=event=>{const r=canvas.getBoundingClientRect();s.target={x:(event.clientX-r.left)/r.width*2-1,y:(event.clientY-r.top)/r.height*2-1};if(blocked()){s.pointer={...s.target};draw(s);}};
    const leave=()=>{s.target={x:0,y:0};};
    canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerleave',leave);
    const resize=new ResizeObserver(size);resize.observe(canvas);size();
    cleanups.push(()=>{resize.disconnect();canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',leave);s.images.forEach(img=>img.onload=null);});return s;
  }).filter(Boolean);
  function draw(s){if(dead)return;s.ctx.clearRect(0,0,s.w,s.h);s.ctx.fillStyle='#08080b';s.ctx.fillRect(0,0,s.w,s.h);if(s.type==='gallery')drawGallery(s,time);else drawParticles(s,time);}
  function blocked(){return paused||reduced.matches||document.hidden;}
  function tick(now){frame=0;if(dead||blocked())return;const dt=last?Math.min((now-last)/1000,.04):0;last=now;time+=dt*intensity;
    for(const s of states)if(s.visible){s.pointer.x+=(s.target.x-s.pointer.x)*.055;s.pointer.y+=(s.target.y-s.pointer.y)*.055;draw(s);}
    if(states.some(s=>s.visible))frame=requestAnimationFrame(tick);
  }
  function update(){cancelAnimationFrame(frame);frame=0;last=0;root.querySelectorAll('[data-lab-pause]').forEach(b=>{b.setAttribute('aria-pressed',String(paused));b.textContent=paused?'继续播放':'暂停动态';});if(!blocked()&&states.some(s=>s.visible))frame=requestAnimationFrame(tick);}
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){const s=states.find(s=>s.canvas===entry.target);if(s)s.visible=entry.isIntersecting;}update();},{threshold:.01});
  states.forEach(s=>observer.observe(s.canvas));
  document.addEventListener('visibilitychange',update);document.addEventListener('lab-state',update);reduced.addEventListener('change',update);
  dispose=()=>{dead=true;cancelAnimationFrame(frame);observer.disconnect();cleanups.forEach(fn=>fn());document.removeEventListener('visibilitychange',update);document.removeEventListener('lab-state',update);reduced.removeEventListener('change',update);};
  update();
}
