import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {spherePoints,project} from '../web/motion-geometry.js';

test('particle sphere stays on its surface and distributes across every hemisphere',()=>{
  const points=spherePoints(2000);
  for(const p of points){assert.ok(Math.abs(Math.hypot(p.x,p.y,p.z)-1)<1e-10);assert.ok(p.seed>=0&&p.seed<1);}
  for(const axis of ['x','y','z'])assert.ok(Math.abs(points.filter(p=>p[axis]>0).length-1000)<3);
});
test('perspective projection is finite, responds to rotation and gives near objects larger scale',()=>{
  for(const yaw of [0,.5,Math.PI])for(const pitch of [0,.2,-.2]){
    const p=project({x:1,y:0,z:0},yaw,pitch,390,430);
    for(const value of Object.values(p))assert.ok(Number.isFinite(value));
  }
  assert.ok(project({x:0,y:0,z:1},0,0,1000,600).scale>project({x:0,y:0,z:-1},0,0,1000,600).scale);
  assert.notEqual(project({x:1,y:0,z:0},0,0,390,430).x,project({x:1,y:0,z:0},Math.PI,0,390,430).x);
});
test('all live experiments have unique share routes, explanations and available gallery images',async()=>{
  const c=JSON.parse(await readFile(new URL('../web/content/catalog.json',import.meta.url),'utf8'));
  assert.equal(c.experiments.length,3);assert.equal(new Set(c.experiments.map(x=>x.id)).size,3);
  assert.deepEqual(new Set(c.experiments.map(x=>x.effect)),new Set(['cloud','sphere','gallery']));
  for(const x of c.experiments){for(const key of ['title','subtitle','hint','description','credit'])assert.ok(x[key]);
    for(const image of x.images||[])await access(new URL('../web/'+image,import.meta.url));
  }
});
