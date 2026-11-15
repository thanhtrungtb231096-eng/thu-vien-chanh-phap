"""Small exact replacements in legacy one-line templates; fail on ambiguity."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
path=ROOT/'app/web/js/library-upgrades.js'
text=path.read_text(encoding='utf-8')
replacements=[
    ("info.duration=await checkRecording(file,info.chapters);", "info.filename=file.name;info.mime=file.type;info.usage='private-import';info.duration=await checkRecording(file,info.chapters);"),
    ("async()=>{if(Audiobook.state.recorded&&Audiobook.state.key===item.key)", "async()=>{if(!confirm('Gỡ bản thu khỏi thiết bị? Hãy xuất tệp nếu chưa có bản sao.'))return;if(Audiobook.state.recorded&&Audiobook.state.key===item.key)"),
    ("async()=>{await LibraryOffline.removeBook(pack.key);renderOffline();}", "async()=>{if(!confirm('Gỡ bản chữ, nguồn và âm thanh ngoại tuyến của '+pack.title+' khỏi thiết bị?'))return;await LibraryOffline.removeBook(pack.key);note('offline-status','Đã gỡ '+pack.title+' khỏi thiết bị.');renderOffline();}"),
    ("for(const o of $('study-books').options)o.selected=plan.books.includes(o.value);", "LibraryCatalog.setSelection($('study-books'),plan.books);"),
    ("()=>{LibraryStudy.remove(plan.id);renderStudy();}", "()=>{LibraryStudy.remove(plan.id);renderStudy();note('study-status','Đã xóa thời khóa. Có thể hoàn tác lần xóa vừa rồi.');const undo=button('Hoàn tác xóa thời khóa',()=>{LibraryStudy.undo();renderStudy();note('study-status','Đã khôi phục thời khóa.');});$('study-status').append(undo);}"),
    ("Đã thực hành ${Math.floor(LibraryStudy.minutes(plan,today))} phút", "Thời gian hoạt động ước tính ${Math.floor(LibraryStudy.minutes(plan,today))} phút"),
    ("const actions=row.querySelector('.upgrade-actions');actions.append(button(Reader.path(item,'viet')", "const chapterInfo=document.createElement('p');chapterInfo.className='upgrade-help';chapterInfo.textContent=(pack.chapters||[]).map(c=>'Chương nghe: '+c.completed+'/'+c.total+' đoạn · '+c.voice.replace('online:','')+(c.completed<c.total?' · Chưa tải đủ':' · Hoàn tất')).join('; ');row.querySelector('div').append(chapterInfo);const actions=row.querySelector('.upgrade-actions');actions.append(button(Reader.path(item,'viet')")
]
for old,new in replacements:
    if new in text:continue
    assert text.count(old)==1,old
    text=text.replace(old,new)
path.write_text(text,encoding='utf-8')
print('Completed seven exact workflow changes.')
