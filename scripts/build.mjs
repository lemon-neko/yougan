import {cp,mkdir,rm,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
await rm(path.join(root,'dist'),{recursive:true,force:true});
await mkdir(path.join(root,'dist'),{recursive:true});
await cp(path.join(root,'web'),path.join(root,'dist'),{recursive:true,filter:source=>!source.endsWith('.md')});
let html=await readFile(path.join(root,'dist/index.html'),'utf8');
try {
 const manifest=JSON.parse(await readFile(path.join(root,'web/content/site.json'),'utf8'));
 if(manifest.url){
  const base=new URL(manifest.url).origin;
  html=html.replace('</head>',`  <meta property="og:url" content="${base}/">\n  <meta property="og:image" content="${base}/assets/wrong-use-museum.jpg">\n</head>`);
 }
} catch(error){if(error.code!=='ENOENT')throw error;}
await writeFile(path.join(root,'dist/index.html'),html);
console.log('Built static site in dist/');
