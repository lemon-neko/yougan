export function spherePoints(count){
  const golden=Math.PI*(3-Math.sqrt(5));
  return Array.from({length:count},(_,i)=>{
    const y=1-2*(i+.5)/count,r=Math.sqrt(1-y*y),a=i*golden;
    return {x:Math.cos(a)*r,y,z:Math.sin(a)*r,seed:i*.61803398875%1};
  });
}
export function project(point,yaw,pitch,width,height,zoom=1){
  const x=point.x*Math.cos(yaw)+point.z*Math.sin(yaw);
  const z=-point.x*Math.sin(yaw)+point.z*Math.cos(yaw);
  const y=point.y*Math.cos(pitch)-z*Math.sin(pitch);
  const depth=point.y*Math.sin(pitch)+z*Math.cos(pitch);
  const scale=Math.min(width,height)*.34*zoom/(1-depth*.22);
  return {x:width/2+x*scale,y:height/2+y*scale,z:depth,scale};
}
export function createProjector(yaw,pitch,width,height,zoom=1){
 const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch),base=Math.min(width,height)*.34*zoom;
 return (px,py,pz,out)=>{const x=px*cy+pz*sy,z=-px*sy+pz*cy,y=py*cp-z*sp,depth=py*sp+z*cp,scale=base/(1-depth*.22);out.x=width/2+x*scale;out.y=height/2+y*scale;out.z=depth;out.scale=scale;return out;};
}
