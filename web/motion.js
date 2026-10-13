// Motion is optional: content and controls remain usable without animation.
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let observer,resizeObserver;
const running=new Set();
function animate(element,frames,options){
  if(reduced.matches||!element.animate)return;
  const animation=element.animate(frames,options);running.add(animation);
  animation.finished.catch(()=>{}).finally(()=>running.delete(animation));
}
export function resetMotion(){
  observer?.disconnect();resizeObserver?.disconnect();
  for(const animation of running)animation.cancel();
  running.clear();
}
export function revealOnScroll(root){
  if(reduced.matches||!('IntersectionObserver' in window))return;
  observer??=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){
      entry.target.classList.add('is-seen');observer.unobserve(entry.target);
    }
  },{threshold:.08});
  root.querySelectorAll('.library-card,.collection-card,.motion-play-banner').forEach(el=>{
    if(el.classList.contains('is-seen'))return;
    el.classList.add('scroll-reveal');observer.observe(el);
  });
}
export function animateGallery(target,previous){
  [...target.children].forEach((el,index)=>{
    el.classList.add('is-seen');
    const from=previous.get(el.dataset.itemId),to=el.getBoundingClientRect();
    const frames=from?[
      {transform:`translate(${from.left-to.left}px,${from.top-to.top}px)`,opacity:.75},
      {transform:'translate(0,0)',opacity:1}
    ]:[{transform:'translateY(18px) scale(.98)',opacity:0},{transform:'translateY(0) scale(1)',opacity:1}];
    animate(el,frames,{duration:420,delay:Math.min(index,5)*25,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
  });
}
export function moveFilterIndicator(tabs){
  if(!tabs)return;
  const indicator=tabs.querySelector('.filter-indicator');
  const update=()=>{
    const active=tabs.querySelector('[aria-pressed="true"]');if(!active)return;
    const left=active.offsetLeft,width=active.offsetWidth;
    const oldLeft=Number(indicator.dataset.left),oldWidth=Number(indicator.dataset.width);
    indicator.style.width=`${width}px`;
    indicator.style.transform=`translateX(${left}px)`;
    if(oldWidth&&(oldWidth!==width||oldLeft!==left))animate(indicator,[
      {transform:`translateX(${oldLeft}px) scaleX(${oldWidth/width})`},
      {transform:`translateX(${left}px) scaleX(1)`}
    ],{duration:420,easing:'cubic-bezier(.16,1,.3,1)'});
    indicator.dataset.left=left;indicator.dataset.width=width;
  };
  update();
  resizeObserver?.disconnect();
  if('ResizeObserver' in window){resizeObserver=new ResizeObserver(update);resizeObserver.observe(tabs);}
}
reduced.addEventListener('change',()=>{
  if(reduced.matches){resetMotion();document.querySelectorAll('.scroll-reveal').forEach(el=>el.classList.add('is-seen'));}
});
