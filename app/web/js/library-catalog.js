/* Shared edition identity and quality labels; human review is never inferred. */
(() => {
  'use strict';
  const names={ebooks:'Đại Tạng Kinh',daithua:'Đại Thừa',daitang:'Hán Tạng',phucminh:'Chùa Phúc Minh'};
  function all(){return [['ebooks',window.DAI_TANG_KINH_DATA||[]],['daithua',window.DAI_THUA_DATA||[]],['daitang',window.DAI_TANG_HAN_DATA?.texts||[]],['phucminh',window.PHUC_MINH_DATA||[]]].flatMap(([type,books])=>books.map(data=>({type,data,id:data.id,key:type+':'+data.id,title:data.vietTitle||data.title})));}
  function get(key){return all().find(x=>x.key===key)||null;}
  function status(item){
    const b=item.data;
    if(b.proofread===true)return 'Đã hiệu đính';
    if(b.reviewStatus==='source-verified')return 'Đã đối chiếu nguồn; chưa hiệu đính';
    if(b.sourceKind==='ocr')return 'OCR tự động; chưa hiệu đính';
    if(item.type==='ebooks')return 'Bản chữ chuyển từ Word; chưa hiệu đính';
    if(item.type==='phucminh')return 'Bản trích PDF; chưa hiệu đính';
    return 'Bản chữ; chưa ghi nhận hiệu đính';
  }
  function description(item){return [window.LibraryDesign?.creditLine(item),status(item),item.data.metadataVerified?'Thông tin đầu sách đã đối chiếu '+item.data.metadataVerified:''].filter(Boolean).join(' · ');}
  let provenance;
  async function hydrate(item){
    if(item.type!=='ebooks'||item.data.sources?.length)return item;
    if(!provenance)provenance=fetch('data/dai-tang-kinh/catalog.json').then(r=>{if(!r.ok)throw new Error('Chưa tải được hồ sơ nguồn. Hãy thử lại.');return r.json();}).catch(e=>{provenance=null;throw e;});
    const full=(await provenance).books.find(b=>b.id===item.id||b.id===item.data.id);
    if(full)Object.assign(item.data,full);
    return item;
  }
  function renderSelect(el,list){
    if(el.multiple)return renderMulti(el,list);
    const selected=[...el.selectedOptions].map(o=>({key:o.value,title:o.textContent}));
    const visible=list.slice(0,40);
    const retained=selected.filter(x=>!visible.some(b=>b.key===x.key));
    el.replaceChildren(...[...retained,...visible].map(x=>{const o=new Option(x.title+(x.type?' · '+names[x.type]:''),x.key);o.selected=selected.some(b=>b.key===x.key);return o;}));
    el.dataset.matches=String(list.length);
    let count=document.getElementById(el.id+'-count');
    if(!count){count=document.createElement('p');count.id=el.id+'-count';count.className='upgrade-help book-picker-count';count.setAttribute('role','status');(el.closest('label')||el).after(count);el.setAttribute('aria-describedby',count.id);}
    count.textContent=list.length>40?'40 / '+list.length.toLocaleString('vi-VN')+' sách · Lọc theo tên/mã.':list.length+' sách phù hợp.';
  }
  const widgets=new Map();
  function setSelection(el,keys){
    el.replaceChildren(...keys.map(key=>{const item=get(key);const o=new Option(item?.title||key,key);o.selected=true;return o;}));
    if(widgets.has(el))renderMulti(el,widgets.get(el).list);
  }
  function renderMulti(el,list){
    let widget=widgets.get(el);
    if(!widget){
      el.hidden=true;el.required=false;
      const box=document.createElement('div');box.className='book-picker';
      const chosen=document.createElement('ol');chosen.className='book-picker-chosen';chosen.setAttribute('aria-label','Sách đã chọn theo thứ tự');
      const results=document.createElement('div');results.className='book-picker-results';
      const status=document.createElement('p');status.className='upgrade-help';status.setAttribute('role','status');
      box.append(chosen,status,results);el.after(box);widget={box,chosen,results,status,list};widgets.set(el,widget);
    }
    widget.list=list;widget.chosen.replaceChildren();widget.results.replaceChildren();
    const keys=[...el.selectedOptions].map(o=>o.value);
    const action=(label,fn)=>{const b=document.createElement('button');b.type='button';b.className='r-button';b.textContent=label;b.onclick=fn;return b;};
    keys.forEach((key,i)=>{
      const item=get(key),row=document.createElement('li'),title=document.createElement('span');title.textContent=item?.title||key;
      const change=(a,b)=>{const copy=[...keys];[copy[a],copy[b]]=[copy[b],copy[a]];setSelection(el,copy);};
      const up=action('↑',()=>change(i,i-1));up.disabled=i===0;up.setAttribute('aria-label','Đưa '+title.textContent+' lên');
      const down=action('↓',()=>change(i,i+1));down.disabled=i===keys.length-1;down.setAttribute('aria-label','Đưa '+title.textContent+' xuống');
      const remove=action('Bỏ',()=>setSelection(el,keys.filter(x=>x!==key)));remove.setAttribute('aria-label','Bỏ '+title.textContent);
      row.append(title,up,down,remove);widget.chosen.append(row);
    });
    const available=list.filter(x=>!keys.includes(x.key));
    widget.status.textContent=keys.length+' sách đã chọn · '+available.length+' sách phù hợp. Hiển thị tối đa 20; gõ tên để tìm thêm.';
    available.slice(0,20).forEach(item=>{const b=action('+ '+item.title+' · '+names[item.type],()=>setSelection(el,[...keys,item.key]));b.dataset.bookKey=item.key;widget.results.append(b);});
  }
  window.LibraryCatalog={all,get,status,description,names,hydrate,renderSelect,setSelection};
})();
