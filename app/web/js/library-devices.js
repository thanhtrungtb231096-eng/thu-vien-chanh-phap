(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  function init(){
    const box=$('sync-disconnect').closest('.upgrade-card');box.insertAdjacentHTML('beforeend','<label>Tên thiết bị này<input id="sync-device-name" maxlength="100" placeholder="Ví dụ: Điện thoại của tôi"></label><div class="upgrade-actions"><button id="sync-name-save" class="r-button">Lưu tên</button><button id="sync-devices-refresh" class="r-button">Xem thiết bị đã ghép</button><button id="sync-conflicts-export" class="r-button">Tải các bản ghi chú khác</button></div><p id="sync-last-success" class="upgrade-help"></p><div id="sync-devices"></div><button id="sync-delete-profile" class="r-button">Xóa dữ liệu đồng bộ trên máy chủ</button><p class="upgrade-help">Bản sao lưu JSON gồm ghi chú, vị trí và cài đặt; không gồm âm thanh, PDF/Word ngoại tuyến hoặc khóa ghép nối. Nếu mất hết thiết bị, tạo hồ sơ mới và nhập bản sao lưu cá nhân. Không thể khôi phục bằng tên thiết bị.</p>');
    $('sync-device-name').value=LibraryStore.read('device-name','Thiết bị của tôi');
    $('sync-name-save').onclick=async()=>{const name=$('sync-device-name').value.trim();if(!name)return;LibraryStore.write('device-name',name);try{if(LibrarySync.auth())await LibrarySync.rename(name);await refresh();}catch(e){status(e.message);}};
    $('sync-devices-refresh').onclick=refresh;
    $('sync-conflicts-export').onclick=async()=>{try{LibraryStore.download('ghi-chu-can-doi-chieu.json',await LibrarySync.conflicts());status('Đã xuất các phiên bản ghi chú khác. Đối chiếu rồi lưu bản bạn chọn trong sổ tay.');}catch(e){status(e.message);}};
    const view=document.createElement('button');view.id='sync-conflicts-view';view.className='r-button';view.textContent='Xem ghi chú cần đối chiếu';view.onclick=conflicts;$('sync-conflicts-export').before(view);
    const versions=document.createElement('div');versions.id='sync-conflict-list';$('sync-devices').before(versions);
    $('sync-delete-profile').onclick=async()=>{if(!confirm('Xóa toàn bộ dữ liệu và thiết bị trong hồ sơ trên máy chủ? Dữ liệu trên trình duyệt này được giữ. Các thiết bị khác sẽ cần ghép lại.'))return;try{await LibrarySync.deleteProfile();await refresh();status('Đã xóa hồ sơ máy chủ. Dữ liệu cá nhân trên thiết bị được giữ.');}catch(e){status(e.message);}};
    $('sync-disconnect').onclick=async()=>{try{const list=await LibrarySync.devices(),current=list.devices.find(x=>x.current);if(current)await LibrarySync.revoke(current.id);else LibrarySync.disconnect();await refresh();status('Đã thu hồi phiên trên máy chủ và ngắt thiết bị này.');}catch(e){status(e.message+' · Phiên chưa được thu hồi. Thử lại khi có mạng.');}};
    $('tab-settings').addEventListener('library-tab-open',refresh);window.addEventListener('library-synced',refresh);window.addEventListener('library-sync-status',last);
    last();
  }
  function status(text){$('sync-status').textContent=text;}
  async function conflicts(){
    const box=$('sync-conflict-list');box.replaceChildren();
    try{const result=await LibrarySync.conflicts();
      for(const record of result.conflicts){
        const detail=document.createElement('details'),summary=document.createElement('summary'),text=document.createElement('pre'),save=document.createElement('button');
        const item=LibraryCatalog.get(record.key.replace(/^cp3:marks:/,''));
        summary.textContent=(item?.title||record.key)+' · '+new Date(record.stamp).toLocaleString('vi-VN');text.textContent=JSON.stringify(record.value,null,2);
        save.className='r-button';save.textContent='Xuất phiên bản này';save.onclick=()=>LibraryStore.download('ghi-chu-doi-chieu-'+record.id+'.json',record);
        detail.append(summary,text,save);box.append(detail);
      }
      status(result.conflicts.length?'Các phiên bản khác được giữ ở dưới. Đối chiếu rồi sửa ghi chú đang dùng; xuất bản cần giữ lâu dài.':'Không có ghi chú khác cần đối chiếu.');
    }catch(e){status(e.message);}
  }
  function last(){const time=LibraryStore.read('sync-last',0);$('sync-last-success').textContent=(time?'Lần thành công cuối: '+new Date(time).toLocaleString('vi-VN'):'Chưa đồng bộ thành công')+(LibrarySync.dirty?' · Có thay đổi chưa gửi':'');}
  async function refresh(){last();const connected=!!LibrarySync.auth();$('sync-create').disabled=connected;['sync-now','sync-code','sync-disconnect','sync-devices-refresh','sync-delete-profile','sync-conflicts-export','sync-conflicts-view'].forEach(id=>$(id).disabled=!connected);$('sync-pair-form').hidden=connected;$('sync-devices').replaceChildren();if(!connected){$('sync-conflict-list').replaceChildren();return;}try{const result=await LibrarySync.devices();for(const info of result.devices){const row=document.createElement('p'),name=document.createElement('span');name.textContent=info.name+(info.current?' · Thiết bị này':'')+' · Hoạt động cuối: '+(info.lastSeenAt?new Date(info.lastSeenAt).toLocaleString('vi-VN'):'Chưa rõ');const remove=document.createElement('button');remove.className='r-button';remove.textContent='Thu hồi';remove.setAttribute('aria-label','Thu hồi '+info.name);remove.onclick=async()=>{if(!confirm('Thu hồi quyền đồng bộ của '+info.name+'?'))return;try{await LibrarySync.revoke(info.id);await refresh();}catch(e){status(e.message);}};row.append(name,remove);$('sync-devices').append(row);}}catch(e){status(e.message);}}
  window.LibraryDevices={init,refresh};
})();
