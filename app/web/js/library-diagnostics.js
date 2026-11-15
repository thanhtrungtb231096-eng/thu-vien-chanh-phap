/* Session measurements are local, contain no text/notes and are never uploaded. */
(() => {
  'use strict';
  let version=null,start=null,lcp=0,cls=0,largestInteraction=0,errors=0;const starts=[];
  window.addEventListener('error',()=>errors++);window.addEventListener('unhandledrejection',()=>errors++);
  try{new PerformanceObserver(list=>{for(const e of list.getEntries())lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});}catch{}
  try{let total=0,first=0,last=0;new PerformanceObserver(list=>{for(const e of list.getEntries()){if(e.hadRecentInput)continue;if(e.startTime-last>1000||e.startTime-first>5000){total=0;first=e.startTime;}total+=e.value;last=e.startTime;cls=Math.max(cls,total);}}).observe({type:'layout-shift',buffered:true});}catch{}
  try{new PerformanceObserver(list=>{for(const e of list.getEntries())largestInteraction=Math.max(largestInteraction,e.duration);}).observe({type:'event',durationThreshold:16,buffered:true});}catch{}
  window.addEventListener('dharma-audio',e=>{if(start!==null&&e.detail.status==='playing'){starts.push(Math.round(performance.now()-start));if(starts.length>100)starts.shift();start=null;}});
  function capture(){return {format:'chanh-phap-session-diagnostics',version:version?.version||'unknown',recordedAt:new Date().toISOString(),viewport:{width:innerWidth,height:innerHeight},metrics:{lcpMilliseconds:Math.round(lcp),cls,largestObservedInteractionMilliseconds:largestInteraction,audioStartMilliseconds:[...starts],errors},scope:'One local browser session; interaction duration is not a certified INP measurement; no user text or personal notes.'};}
  async function init(){
    try{version=await(await fetch('data/library-version.json')).json();document.getElementById('help-version').textContent='Phiên bản '+version.version+' · '+version.documents.toLocaleString('vi')+' bản văn · '+version.passages.toLocaleString('vi')+' đoạn.';}catch{}
    const b=document.createElement('button');b.className='r-button';b.textContent='Xuất chẩn đoán phiên sử dụng';b.onclick=()=>LibraryStore.download('chan-doan-thu-vien.json',capture());document.getElementById('help-version').after(b);
  }
  window.LibraryDiagnostics={init,capture,startAudio(){if(start===null)start=performance.now();},requestAudio(){start=performance.now();},cancelAudio(){start=null;}};
})();
