/* DM.AID TEST 1.18.1; navigation network-first to avoid stale builds. */
const CACHE='dmaid-test-1.18.1';
const ASSETS=['./','./index.html','./character-builder-v2.js','./character-builder-v2.css','./icon-192.png'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const names=await caches.keys();await Promise.all(names.filter(n=>n.startsWith('dmaid-test-')&&n!==CACHE).map(n=>caches.delete(n)));await self.clients.claim();})());});
self.addEventListener('fetch',event=>{const r=event.request;if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return; if(r.mode==='navigate'){event.respondWith(fetch(r).catch(()=>caches.match('./index.html')));return;} const path=new URL(r.url).pathname;if(/(?:character-builder-v2\.(?:js|css)|index\.html)$/.test(path)){event.respondWith(fetch(r).catch(()=>caches.match(r,{ignoreSearch:true})));}});
