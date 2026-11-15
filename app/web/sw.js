/* Only public assets and explicitly selected editions are cached. Personal APIs stay private. */
const SHELL = 'cp-shell-ux-20261010-e3f68d51279d', BOOKS = 'cp-offline-books-v1';
self.addEventListener('install', event => event.waitUntil((async () => {
  const staging=SHELL+'-install';
  try {
    const response = await fetch('/web-thuvien/data/offline-assets.json', {cache:'no-store'});
    const assets = await response.json();
    const version = await (await fetch('/web-thuvien/data/library-version.json', {cache:'no-store'})).json();
    if(SHELL!=='cp-shell-'+version.version)throw new Error('Release manifest does not match worker');
    const cache = await caches.open(staging);
    await cache.addAll(assets);
    const cachedVersion=await(await cache.match('/web-thuvien/data/library-version.json')).json();
    if(cachedVersion.version!==version.version)throw new Error('Release changed during installation');
    for(const url of assets){
      const path=new URL(url,self.location.origin).pathname.slice('/web-thuvien/'.length),expected=version.assetHashes[path];
      if(!expected)continue;
      const content=await(await cache.match(url)).arrayBuffer();
      const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',content))].map(x=>x.toString(16).padStart(2,'0')).join('');
      if(digest!==expected)throw new Error('Asset does not match release: '+path);
    }
    const final=await caches.open(SHELL);
    for(const request of await cache.keys())await final.put(request,await cache.match(request));
  } finally {await caches.delete(staging);}
})()));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const key of await caches.keys()) if (key.startsWith('cp-shell-') && key !== SHELL) await caches.delete(key);
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') && url.pathname !== '/api/voices') return;
  const bootstrap=['/web-thuvien/index.html','/web-thuvien/manifest.webmanifest','/web-thuvien/data/library-version.json'].includes(url.pathname);
  const versioned=/^\/web-thuvien\/(js|css)\//.test(url.pathname)&&url.searchParams.has('v');
  const asset = bootstrap || /^\/web-thuvien\/(js|css|fonts|design)\//.test(url.pathname) || /^\/web-thuvien\/data\/(library-audit\.json|edition-migrations\/[^/]+\.json|dai-tang-kinh\/catalog\.json)$/.test(url.pathname) || url.pathname === '/api/voices';
  event.respondWith((async () => {
    const books = await caches.open(BOOKS);
    const saved = await books.match(request, {ignoreSearch:true});
    if (saved && request.cache !== 'no-store') return saved;
    if(url.pathname==='/share'&&request.mode==='navigate'){
      try{return await fetch(request);}catch(error){
        const book=url.searchParams.get('book'),mode=url.searchParams.get('mode')||'viet',block=url.searchParams.get('block')||'';
        if(!book||!['viet','han','note'].includes(mode))throw error;
        return Response.redirect(url.origin+'/web-thuvien/index.html#read/'+encodeURIComponent(book)+'/'+mode+'/'+encodeURIComponent(block));
      }
    }
    if (!asset) return fetch(request);
    const cache = await caches.open(SHELL);
    if(request.mode==='navigate' && url.pathname==='/web-thuvien/index.html') {
      try {
        const response=await fetch('/web-thuvien/data/library-version.json',{cache:'no-store'});
        if(response.ok) {
          const current=await response.json();
          if('cp-shell-'+current.version!==SHELL && url.searchParams.get('release')!==current.version) {
            return Response.redirect(url.origin+'/',302);
          }
        }
      } catch { /* Offline visits retain the last verified shell. */ }
    }
    if(bootstrap||versioned){const pinned=await cache.match(request,{ignoreSearch:bootstrap});if(pinned)return pinned;}
    try {
      const response = await fetch(request);
      if(response.ok&&versioned){
        const manifest=await(await cache.match('/web-thuvien/data/library-version.json')).json();
        const expected=manifest.assetHashes[url.pathname.slice('/web-thuvien/'.length)];
        if(!expected||url.searchParams.get('v')!==expected.slice(0,12))throw new Error('Asset belongs to another release');
        const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',await response.clone().arrayBuffer()))].map(x=>x.toString(16).padStart(2,'0')).join('');
        if(digest!==expected)throw new Error('Asset changed during loading');
      }
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch (error) {
      const fallback = await cache.match(request, {ignoreSearch:!versioned});
      if (fallback) return fallback;
      throw error;
    }
  })());
});
