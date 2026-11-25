// Lengo offline cache. Bump C when files change so phones pick up the new version.
const C='lengo-v2';
const FILES=['./','./index.html','./desktop.html','./manifest.webmanifest','./desktop.webmanifest','./favicon.png','./apple-touch-icon.png','./icon-192.png','./icon-512.png','./icon-maskable-192.png','./icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return; // GitHub sync calls go straight to the network
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>{
    const net=fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>hit);
    return hit||net;
  }));
});
