(() => {
  'use strict';
  const S=LibraryStore;
  const date=(value=new Date())=>{const d=new Date(value);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  function days(plan){return Array.from({length:plan.days},(_,i)=>{const d=new Date(plan.start+'T12:00:00');d.setDate(d.getDate()+i);return date(d);});}
  function add(value,id=null){
    if(!value.books.length||!value.name.trim()||!/\d{4}-\d{2}-\d{2}/.test(value.start))throw new Error('Hãy đặt tên, chọn sách và ngày bắt đầu.');
    const prior=S.read('study-plans',[]).find(p=>p.id===id);
    const plan={...value,id:prior?.id||crypto.randomUUID(),days:Math.max(1,Math.min(90,value.days)),minutes:Math.max(1,Math.min(180,value.minutes)),createdAt:prior?.createdAt||Date.now(),updatedAt:Date.now()};
    S.write('study-plans',[...S.read('study-plans',[]).filter(p=>p.id!==plan.id),plan]);return plan;
  }
  function mark(plan,day,done){const key='study-completions';let list=S.read(key,[]).filter(x=>x.id!==plan.id+':'+day);if(done)list.push({id:plan.id+':'+day,plan:plan.id,date:day,updatedAt:Date.now()});S.write(key,list);}
  let removed;
  function remove(id){removed={plan:S.read('study-plans',[]).find(p=>p.id===id),completions:S.read('study-completions',[]).filter(x=>x.plan===id)};S.write('study-plans',S.read('study-plans',[]).filter(p=>p.id!==id));S.write('study-completions',S.read('study-completions',[]).filter(x=>x.plan!==id));}
  function undo(){if(!removed?.plan)return;S.write('study-plans',[...S.read('study-plans',[]).filter(p=>p.id!==removed.plan.id),removed.plan]);S.write('study-completions',[...S.read('study-completions',[]).filter(x=>x.plan!==removed.plan.id),...removed.completions]);removed=null;}
  let previous=performance.now(),readKey='',audioState={};
  function tick(){
    const now=performance.now(),seconds=Math.min(8,(now-previous)/1000);previous=now;
    const reading=Reader.state.ready&&document.getElementById('reader-view-container')?.classList.contains('active')&&document.visibilityState==='visible'&&document.hasFocus();
    const active=audioState.status==='playing';const entries=[];
    if(reading)entries.push([Reader.state.key,'read']);
    if(active)entries.push([audioState.key,'listen']);
    for(const [key,mode]of entries){if(!key)continue;const storeKey='study-time:'+date()+':'+key+':'+mode;S.write(storeKey,Math.round((S.read(storeKey,0)+seconds)*10)/10);}
    if(entries.length)window.dispatchEvent(new Event('library-study-progress'));
  }
  function init(){window.addEventListener('dharma-audio',e=>audioState=e.detail);setInterval(tick,5000);}
  function completeSection(state){if(!state.ready)return;const section=state.sections[state.section];if(!section)return;const id=date()+':'+state.key+':'+state.doc.version+':'+section.id;S.write('study-sections',[...S.read('study-sections',[]).filter(x=>x.id!==id),{id,key:state.key,section:section.id,title:section.title,date:date(),mode:'read',updatedAt:Date.now()}]);}
  function minutes(plan,day){return plan.books.reduce((sum,b)=>sum+S.read('study-time:'+day+':'+b+':'+plan.mode,0),0)/60;}
  window.LibraryStudy={date,days,add,mark,remove,undo,minutes,completeSection,init};
})();
