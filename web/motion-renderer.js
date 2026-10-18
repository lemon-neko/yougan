import {spherePoints,createProjector,project} from './motion-geometry.js';
const TAU=Math.PI*2;
export function staticMotion(type,config={}){
 if(type==='gallery')return `<svg viewBox="0 0 600 400" role="img" aria-label="空间画廊的静态图形"><rect width="600" height="400" fill="#08080b"/>${(config.images||[]).slice(0,5).map((src,i)=>`<image href="${String(src).replace(/["<>&]/g,'')}" x="${50+i*83}" y="${85+Math.abs(i-2)*18}" width="160" height="170" preserveAspectRatio="xMidYMid slice" transform="rotate(${(i-2)*8},${130+i*83},190)"/>`).join('')}</svg>`;
 const points=spherePoints(180);const dots=points.map(p=>{const q=project({x:p.x,y:type==='cloud'?p.y*.45:p.y,z:p.z},.4,.12,600,400,1);return `<circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="1.5" opacity="${(.35+(p.z+1)*.2).toFixed(2)}"/>`;}).join('');
 return `<svg viewBox="0 0 600 400" role="img" aria-label="动态作品的静态图形"><rect width="600" height="400" fill="#08080b"/><g fill="${type==='cloud'?'#8da4f1':'#dce7ed'}">${dots}</g></svg>`;
}
function triangle(ctx,img,s,d){
 const s0=s[0],s1=s[1],s2=s[2],d0=d[0],d1=d[1],d2=d[2],a=s1.x-s0.x,b=s1.y-s0.y,c=s2.x-s0.x,dv=s2.y-s0.y,det=a*dv-b*c;
 if(Math.abs(det)<.001)return;
 const ux=d1.x-d0.x,uy=d1.y-d0.y,vx=d2.x-d0.x,vy=d2.y-d0.y,A=(ux*dv-vx*b)/det,B=(uy*dv-vy*b)/det,C=(vx*a-ux*c)/det,D=(vy*a-uy*c)/det;
 ctx.save();ctx.beginPath();ctx.moveTo(d0.x,d0.y);ctx.lineTo(d1.x,d1.y);ctx.lineTo(d2.x,d2.y);ctx.closePath();ctx.clip();ctx.transform(A,B,C,D,d0.x-A*s0.x-C*s0.y,d0.y-B*s0.x-D*s0.y);ctx.drawImage(img,0,0);ctx.restore();
}
export function createRenderer(canvas,config,{level=0,invalidate=()=>{},onError=()=>{}}={}){
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas unavailable');
 const type=canvas.dataset.motionCanvas;let mobile=window.innerWidth<768;
 let dead=false,w=1,h=1,quality=level,lastTime=0,lastPointer={x:0,y:0};
 const images=[];const panels=[];let points=[];
 if(type==='gallery'){
  for(let i=0;i<10;i++){const q=Array.from({length:4},()=>({x:0,y:0,z:0,scale:0}));panels.push({angle:i*TAU/10,z:0,q,triangles:[[q[0],q[1],q[2]],[q[0],q[2],q[3]]]});}
  for(const src of config.images){const img=new Image();const asset={img,failed:false,source:[{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}]};img.onload=()=>{if(dead)return;asset.source=[{x:0,y:0},{x:img.naturalWidth,y:0},{x:img.naturalWidth,y:img.naturalHeight},{x:0,y:img.naturalHeight}];const s=asset.source;asset.triangles=[[s[0],s[1],s[2]],[s[0],s[2],s[3]]];invalidate();};img.onerror=()=>{if(dead)return;asset.failed=true;onError();invalidate();};img.src=src;images.push(asset);}
 }else preparePoints();
 function preparePoints(){
  points=spherePoints(type==='sphere'?(mobile?1600:3200):(mobile?2300:4800));
  points.forEach((p,i)=>{if(type==='cloud'){if(i%5===0){const t=p.seed;p.x*=.05+t*.11;p.y=.1+t*.92;p.z*=.05+t*.11;}else{const r=.88+.12*Math.sin(p.y*8+p.x*5);p.x*=r*(.62+p.seed*.38);p.y=p.y*.43-.3;p.z*=r*.66*(.62+p.seed*.38);}}p.color=type==='sphere'?'#dce7f1':`hsl(${205+p.seed*65},96%,${58+p.seed*23}%)`;p.wave=p.y*5;p.ripple=p.x*6;p.twinkle=p.seed*30;});
 }
 canvas.dataset.allocated='true';
 const resize=()=>{if(dead)return;const r=canvas.getBoundingClientRect();if(r.width<2||r.height<2)return;const nextMobile=window.innerWidth<768;if(nextMobile!==mobile){mobile=nextMobile;if(type!=='gallery')preparePoints();}w=r.width;h=r.height;const dpr=Math.min(window.devicePixelRatio||1,(mobile?[1.5,1.15,1]:[1.75,1.25,1])[quality]);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw(lastTime,lastPointer);};
 const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(canvas);
 const q={x:0,y:0,z:0,scale:0};
 function particles(time,pointer){
  const sphere=type==='sphere',yaw=time*(sphere?.15:.08)+pointer.x*.45,pitch=pointer.y*.25,projectPoint=createProjector(yaw,pitch,w,h,sphere?1:1.12);
  if(!sphere){ctx.save();ctx.translate(w/2,h*.81);ctx.scale(1,.2);for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(0,0,Math.max(1,Math.min(w,h)*(.19+i*.09)+Math.sin(time+i)*3),0,TAU);ctx.strokeStyle=`rgba(68,98,255,${.22-i*.025})`;ctx.stroke();}ctx.restore();const glow=ctx.createRadialGradient(w/2,h*.4,0,w/2,h*.4,Math.min(w,h)*.44);glow.addColorStop(0,'#1233b32b');glow.addColorStop(1,'#09090c00');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation='lighter';}
  const step=[1,2,3][quality];
  for(let i=0;i<points.length;i+=step){const p=points[i];let x=p.x,y=p.y,z=p.z;if(!sphere){const wave=1+Math.sin(p.wave+time*.65)*.09;x*=wave;z*=wave;y+=Math.sin(p.ripple+time*.5)*.045;}projectPoint(x,y,z,q);ctx.globalAlpha=Math.min(1,((sphere?.25:.4)+(q.z+1)*.3)*(.7+Math.sin(time*1.4+p.twinkle)*.3));ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(q.x,q.y,(sphere?.65:.85)+Math.max(0,q.z)*.4,0,TAU);ctx.fill();}
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 }
 const corners=[[-.48,-.34],[.48,-.34],[.48,.34],[-.48,.34]];
 function gallery(time,pointer){
  const angle=time*.14+pointer.x*.4,projectPoint=createProjector(pointer.x*.12,pointer.y*.12,w,h,1.2);
  for(const panel of panels){const a=panel.angle+angle,sa=Math.sin(a),ca=Math.cos(a),x=sa*1.28,y=Math.sin(a*2)*.27,z=ca*1.1;panel.z=z;for(let n=0;n<4;n++){const c=corners[n];projectPoint(x+c[0]*ca,y+c[1],z-c[0]*sa,panel.q[n]);}}
  panels.sort((a,b)=>a.z-b.z);
  for(const panel of panels){const p=panel.q,asset=images[Math.round(panel.angle/TAU*10)%images.length],img=asset?.img;ctx.globalAlpha=.35+(panel.z+1.1)/2.2*.65;
   if(img?.complete&&img.naturalWidth&&asset.triangles&&!asset.failed){triangle(ctx,img,asset.triangles[0],panel.triangles[0]);triangle(ctx,img,asset.triangles[1],panel.triangles[1]);}else{ctx.fillStyle='#51465f';ctx.beginPath();p.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.closePath();ctx.fill();}ctx.strokeStyle='#ffffff30';ctx.beginPath();p.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.closePath();ctx.stroke();}
  ctx.globalAlpha=1;
 }
 function draw(time,pointer){if(dead||w<2||h<2)return 0;const start=performance.now();lastTime=time;lastPointer=pointer;ctx.clearRect(0,0,w,h);ctx.fillStyle='#08080b';ctx.fillRect(0,0,w,h);if(type==='gallery')gallery(time,pointer);else particles(time,pointer);return performance.now()-start;}
 try{resize();}catch(error){dead=true;sizeObserver.disconnect();images.forEach(a=>{a.img.onload=null;a.img.onerror=null;});canvas.width=1;canvas.height=1;delete canvas.dataset.allocated;throw error;}
 return {draw,setQuality(value){quality=Math.max(quality,value);resize();},retry(){for(const a of images)if(a.failed){a.failed=false;a.img.src=a.img.src;}},dispose(){dead=true;sizeObserver.disconnect();images.forEach(a=>{a.img.onload=null;a.img.onerror=null;});points=[];images.length=0;panels.length=0;canvas.width=1;canvas.height=1;delete canvas.dataset.allocated;}};
}
