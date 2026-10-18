
/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const nf=n=>Number(n).toLocaleString('vi-VN');
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rnd=rng(20260929);
function pad(n){return String(n).padStart(2,'0')}
function nowStr(){const d=new Date();return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`}
function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>t.hidden=true,3200)}
function stripTags(h){const d=document.createElement('div');d.innerHTML=h;return d.textContent||''}
function clean(h){return String(h).replace(/<script[\s\S]*?<\/script>/gi,'').replace(/\son\w+="[^"]*"/gi,'')}

/* ---------- reference data ---------- */
const ROLES={
  public:{label:'Người dân / khách truy cập',short:'Người dân'},
  editor:{label:'Cán bộ biên soạn · Phòng Văn hóa – Xã hội',short:'Cán bộ biên soạn',dept:'vhxh'},
  lead:{label:'Lãnh đạo phụ trách ban',short:'Lãnh đạo ban'},
  office:{label:'Văn phòng Đảng ủy · kiểm tra, công khai',short:'Văn phòng'},
  chief:{label:'Lãnh đạo phường',short:'Lãnh đạo phường'}
};
const NAV=[
  {grp:'Cổng công khai'},
  {id:'home',t:'Trang chủ',roles:'*'},
  {id:'shelves',t:'Tủ sách',roles:'*'},
  {id:'news',t:'Bản tin',roles:'*'},
  {id:'links',t:'Văn bản & liên kết',roles:'*'},
  {sep:1,roles:'editor lead office chief'},
  {grp:'Nghiệp vụ nội bộ',roles:'editor lead office chief'},
  {id:'kho',t:'Kho nghiệp vụ',roles:'editor lead office chief'},
  {id:'compose',t:'Soạn thảo',roles:'editor'},
  {id:'workflow',t:'Phê duyệt',roles:'editor lead office chief',count:1},
  {id:'archive',t:'Kho lưu trữ',roles:'editor lead office chief'},
  {id:'depts',t:'Phòng ban',roles:'editor lead office chief'},
  {id:'dashboard',t:'Điều hành',roles:'lead office chief'},
  {id:'log',t:'Nhật ký hệ thống',roles:'office chief'},
  {sep:1,roles:'editor lead office chief'},
  {id:'admin',t:'Tài khoản & phân quyền',roles:'office chief'},
  {id:'migrate',t:'Số hóa tài liệu',roles:'office chief'},
  {id:'security',t:'An toàn thông tin',roles:'editor lead office chief'}
];
const SHELVES=[
  {id:'dang',name:'Lịch sử Đảng bộ',color:'#8E3B22',img:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNjAgMzcwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjM3MCI+CjxkZWZzPjxjbGlwUGF0aCBpZD0iYyI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIzNzAiIHJ4PSI0Ii8+PC9jbGlwUGF0aD48L2RlZnM+CjxnIGNsaXAtcGF0aD0idXJsKCNjKSI+PHJlY3Qgd2lkdGg9IjI2MCIgaGVpZ2h0PSIzNzAiIGZpbGw9IiM4RTNCMjIiLz4KPGc+PHJlY3Qgd2lkdGg9IjI2MCIgaGVpZ2h0PSIyMzYiIGZpbGw9IiNGM0RDQ0QiLz48cGF0aCBkPSJNMCAxMDYuMiBRNDAgNTkuMCA4MCA5NC40IFQxNzAgNzUuNTIgVDI2MCA5OS4xMTk5OTk5OTk5OTk5OSBWMjM2IEgwWiIgZmlsbD0iI0U5QzlCNiIgb3BhY2l0eT0iLjU1Ii8+PHBhdGggZD0iTTAgMTQ2LjMyIFE2MCAxMTMuMjggMTIwIDE0MS42IFQyNjAgMTI5LjggVjIzNiBIMFoiIGZpbGw9IiNEOUE2OEMiIG9wYWNpdHk9Ii43Ii8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTMwLDE4NC4wOCkiPjxyZWN0IHg9Ii03MCIgeT0iLTYiIHdpZHRoPSIxNDAiIGhlaWdodD0iMTAiIGZpbGw9IiM3QTJGMUIiIG9wYWNpdHk9Ii44Ii8+PHJlY3QgeD0iLTUwIiB5PSItMTYiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAiIGZpbGw9IiM3QTJGMUIiIG9wYWNpdHk9Ii42Ii8+PHJlY3QgeD0iLTM3IiB5PSItNzIiIHdpZHRoPSIxOCIgaGVpZ2h0PSI1NiIgcng9IjYiIGZpbGw9IiM4RTNCMjIiLz48Y2lyY2xlIGN4PSItMjgiIGN5PSItODAiIHI9IjkiIGZpbGw9IiM4RTNCMjIiLz48cmVjdCB4PSItOSIgeT0iLTkwIiB3aWR0aD0iMTgiIGhlaWdodD0iNzQiIHJ4PSI2IiBmaWxsPSIjOEUzQjIyIi8+PGNpcmNsZSBjeD0iMCIgY3k9Ii05OCIgcj0iOSIgZmlsbD0iIzhFM0IyMiIvPjxyZWN0IHg9IjE5IiB5PSItNjgiIHdpZHRoPSIxOCIgaGVpZ2h0PSI1MiIgcng9IjYiIGZpbGw9IiM4RTNCMjIiLz48Y2lyY2xlIGN4PSIyOCIgY3k9Ii03NiIgcj0iOSIgZmlsbD0iIzhFM0IyMiIvPjxwYXRoIGQ9Ik01MiAtMTYgVi0xMTIiIHN0cm9rZT0iIzVBMjQxMiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTUyIC0xMTIgaDMwIGwtNiA4IGw2IDggaC0zMHoiIGZpbGw9IiNDMDM5MkIiLz48cGF0aCBkPSJNNjQgLTEwOCBsMiA0IGg0IGwtMyAzIGwxIDQgbC00IC0yIGwtNCAyIGwxIC00IGwtMyAtMyBoNHoiIGZpbGw9IiNGNEQwM0YiLz48L2c+PC9nPgo8cmVjdCB4PSIwIiB5PSIyMzYiIHdpZHRoPSIyNjAiIGhlaWdodD0iMTM0IiBmaWxsPSIjOEUzQjIyIi8+CjxyZWN0IHg9IjAiIHk9IjIzNiIgd2lkdGg9IjI2MCIgaGVpZ2h0PSI0IiBmaWxsPSIjRTI1NzJCIi8+CjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSI4IiBoZWlnaHQ9IjM3MCIgZmlsbD0iIzAwMCIgb3BhY2l0eT0iLjE2Ii8+Cjx0ZXh0IHg9IjIyIiB5PSIyNzgiIGZvbnQtZmFtaWx5PSJNb250c2VycmF0LCdCZSBWaWV0bmFtIFBybycsJ1NlZ29lIFVJJyxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjI1IiBmb250LXdlaWdodD0iODAwIiBmaWxsPSIjZmZmIj5M4buLY2ggc+G7rTwvdGV4dD48dGV4dCB4PSIyMiIgeT0iMzA4IiBmb250LWZhbWlseT0iTW9udHNlcnJhdCwnQmUgVmlldG5hbSBQcm8nLCdTZWdvZSBVSScsQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNSIgZm9udC13ZWlnaHQ9IjgwMCIgZmlsbD0iI2ZmZiI+xJDhuqNuZyBi4buZPC90ZXh0Pjx0ZXh0IHg9IjIyIiB5PSIzNDAiIGZvbnQtZmFtaWx5PSJNb250c2VycmF0LCdCZSBWaWV0bmFtIFBybycsJ1NlZ29lIFVJJyxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjExLjUiIGZvbnQtd2VpZ2h0PSI2MDAiIGxldHRlci1zcGFjaW5nPSIxLjQiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii43OCI+UEjGr+G7nE5HIEPhuqhNIFBI4bqiPC90ZXh0Pjx0ZXh0IHg9IjI0MCIgeT0iMzU0IiB0ZXh0LWFuY2hvcj0iZW5kIiBmb250LWZhbWlseT0iTW9udHNlcnJhdCwnQmUgVmlldG5hbSBQcm8nLCdTZWdvZSBVSScsQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzNCIgZm9udC13ZWlnaHQ9IjgwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEuMiIgb3BhY2l0eT0iLjU1Ij4wMTwvdGV4dD4KPC9nPgo8L3N2Zz4=',desc:'Truyền thống, mốc son và công tác xây dựng Đảng ở cơ sở'},
  {id:'ditich',name:'Di tích vùng mỏ',color:'#7A4E22',img:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNjAgMzcwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjM3MCI+CjxkZWZzPjxjbGlwUGF0aCBpZD0iYyI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIzNzAiIHJ4PSI0Ii8+PC9jbGlwUGF0aD48L2RlZnM+CjxnIGNsaXAtcGF0aD0idXJsKCNjKSI+PHJlY3Qgd2lkdGg9IjI2MCIgaGVpZ2h0PSIzNzAiIGZpbGw9IiM3QTRFMjIiLz4KPGc+PHJlY3Qgd2lkdGg9IjI2MCIgaGVpZ2h0PSIyMzYiIGZpbGw9IiNFRkUxQzgiLz48cGF0aCBkPSJNLTEwIDEyOS44IEgyNzAiIHN0cm9rZT0iI0IwOEE1QSIgc3Ryb2tlLXdpZHRoPSI3IiBvcGFjaXR5PSIwLjM1Ii8+PHBhdGggZD0iTS00IDE0MS44IEgyNjQiIHN0cm9rZT0iI0IwOEE1QSIgc3Ryb2tlLXdpZHRoPSI3IiBvcGFjaXR5PSIwLjQzIi8+PHBhdGggZD0iTTIgMTUzLjggSDI1OCIgc3Ryb2tlPSIjQjA4QTVBIiBzdHJva2Utd2lkdGg9IjciIG9wYWNpdHk9IjAuNTEiLz48cGF0aCBkPSJNOCAxNjUuOCBIMjUyIiBzdHJva2U9IiNCMDhBNUEiIHN0cm9rZS13aWR0aD0iNyIgb3BhY2l0eT0iMC41OSIvPjxwYXRoIGQ9Ik0xNCAxNzcuOCBIMjQ2IiBzdHJva2U9IiNCMDhBNUEiIHN0cm9rZS13aWR0aD0iNyIgb3BhY2l0eT0iMC42Njk5OTk5OTk5OTk5OTk5Ii8+PHBhdGggZD0iTTIwIDE4OS44IEgyNDAiIHN0cm9rZT0iI0IwOEE1QSIgc3Ryb2tlLXdpZHRoPSI3IiBvcGFjaXR5PSIwLjc1Ii8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwLDEyOS44KSBzY2FsZSguNzIpIiBzdHJva2U9IiM3QTRFMjIiIHN0cm9rZS13aWR0aD0iMy41IiBmaWxsPSJub25lIj48cGF0aCBkPSJNLTMwIDAgTC04IC0xMjAgTDggLTEyMCBMMzAgMCIvPjxwYXRoIGQ9Ik0tMjIgLTQwIEgyMiBNLTE2IC03NSBIMTYgTS0yNiAtMjAgTDIwIC02MCBNMjYgLTIwIEwtMjAgLTYwIE0tMTIgLTk1IEwxMiAtMTEwIE0xMiAtOTUgTC0xMiAtMTEwIi8+PGNpcmNsZSBjeD0iMCIgY3k9Ii0xMjQiIHI9IjEzIi8+PHBhdGggZD0iTS0xMyAtMTI0IEgxMyBNMCAtMTM3IFYtMTExIi8+PHBhdGggZD0iTTggLTEyMCBMNjAgMCIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9nPjxyZWN0IHg9IjMwIiB5PSIxMDMuODAwMDAwMDAwMDAwMDEiIHdpZHRoPSI1NCIgaGVpZ2h0PSIyNiIgZmlsbD0iIzdBNEUyMiIgb3BhY2l0eT0iLjg1Ii8+PHJlY3QgeD0iNDAiIHk9Ijg5LjgwMDAwMDAwMDAwMDAxIiB3aWR0aD0iMTAiIGhlaWdodD0iMTQiIGZpbGw9IiM3QTRFMjIiIG9wYWNpdHk9Ii44NSIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcwLDIxMi40KSI+PHBhdGggZD0iTS0yMiAtMTQgSDIyIEwxNiAwIEgtMTZaIiBmaWxsPSIjM0IyQTFBIi8+PGNpcmNsZSBjeD0iLTEwIiBjeT0iMyIgcj0iNCIgZmlsbD0iIzNCMkExQSIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMyIgcj0iNCIgZmlsbD0iIzNCMkExQSIvPjxwYXRoIGQ9Ik0tNjAgNyBIMjAwIiBzdHJva2U9IiMzQjJBMUEiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L2c+CjxyZWN0IHg9IjAiIHk9IjIzNiIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIxMzQiIGZpbGw9IiM3QTRFMjIiLz4KPHJlY3QgeD0iMCIgeT0iMjM2IiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjQiIGZpbGw9IiNFMjU3MkIiLz4KPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjgiIGhlaWdodD0iMzcwIiBmaWxsPSIjMDAwIiBvcGFjaXR5PSIuMTYiLz4KPHRleHQgeD0iMjIiIHk9IjI3OCIgZm9udC1mYW1pbHk9Ik1vbnRzZXJyYXQsJ0JlIFZpZXRuYW0gUHJvJywnU2Vnb2UgVUknLEFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjUiIGZvbnQtd2VpZ2h0PSI4MDAiIGZpbGw9IiNmZmYiPkRpIHTDrWNoPC90ZXh0Pjx0ZXh0IHg9IjIyIiB5PSIzMDgiIGZvbnQtZmFtaWx5PSJNb250c2VycmF0LCdCZSBWaWV0bmFtIFBybycsJ1NlZ29lIFVJJyxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjI1IiBmb250LXdlaWdodD0iODAwIiBmaWxsPSIjZmZmIj52w7luZyBt4buPPC90ZXh0Pjx0ZXh0IHg9IjIyIiB5PSIzNDAiIGZvbnQtZmFtaWx5PSJNb250c2VycmF0LCdCZSBWaWV0bmFtIFBybycsJ1NlZ29lIFVJJyxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjExLjUiIGZvbnQtd2VpZ2h0PSI2MDAiIGxldHRlci1zcGFjaW5nPSIxLjQiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii43OCI+S+G7tiBMVeG6rFQgVsOAIMSQ4buSTkcgVMOCTTwvdGV4dD48dGV4dCB4PSIyNDAiIHk9IjM1NCIgdGV4dC1hbmNob3I9ImVuZCIgZm9udC1mYW1pbHk9Ik1vbnRzZXJyYXQsJ0JlIFZpZXRuYW0gUHJvJywnU2Vnb2UgVUknLEFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzQiIGZvbnQtd2VpZ2h0PSI4MDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjIiIG9wYWNpdHk9Ii41NSI+MDI8L3RleHQ+CjwvZz4KPC9zdmc+',desc:'Di tích, truyền thống “Kỷ luật và Đồng tâm”, ký ức thợ mỏ'},
  {id:'vanhoa',name:'Văn hóa Cẩm Phả',color:'#2F5A3E',img:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNjAgMzcwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjM3MCI+CjxkZWZzPjxjbGlwUGF0aCBpZD0iYyI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIzNzAiIHJ4PSI0Ii8+PC9jbGlwUGF0aD48L2RlZnM+CjxnIGNsaXAtcGF0aD0idXJsKCNjKSI+PHJlY3Qgd2lkdGg9IjI2MCIgaGVpZ2h0PSIzNzAiIGZpbGw9IiMyRjVBM0UiLz4KPGc+PHJlY3Qgd2lkdGg9IjI2MCIgaGVpZ2h0PSIyMzYiIGZpbGw9IiNEREU4RDgiLz48cGF0aCBkPSJNMCAxMDYuMiBRNDAgNTkuMCA4MCA5NC40IFQxNzAgNzUuNTIgVDI2MCA5OS4xMTk5OTk5OTk5OTk5OSBWMjM2IEgwWiIgZmlsbD0iI0I5Q0ZBRSIgb3BhY2l0eT0iLjU1Ii8+PHBhdGggZD0iTTAgMTQ2LjMyIFE2MCAxMTMuMjggMTIwIDE0MS42IFQyNjAgMTI5LjggVjIzNiBIMFoiIGZpbGw9IiM5REJBOEYiIG9wYWNpdHk9Ii43Ii8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTMwLDE2OS45MikiPjxyZWN0IHg9Ii02MCIgeT0iLTQwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQ0IiBmaWxsPSIjRTlEOEI0Ii8+PHBhdGggZD0iTS04NiAtMzggUTAgLTc4IDg2IC0zOCBMNzQgLTQ4IFEwIC05MCAtNzQgLTQ4WiIgZmlsbD0iIzJGNUEzRSIvPjxwYXRoIGQ9Ik0tNzAgLTY0IFEwIC0xMDQgNzAgLTY0IEw2MCAtNzIgUTAgLTExMCAtNjAgLTcyWiIgZmlsbD0iIzJGNUEzRSIgb3BhY2l0eT0iLjg1Ii8+PHJlY3QgeD0iLTEyIiB5PSItMjgiIHdpZHRoPSIyNCIgaGVpZ2h0PSIzMiIgZmlsbD0iIzVCM0EyMiIvPjxyZWN0IHg9Ii00NiIgeT0iLTI2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiM1QjNBMjIiIG9wYWNpdHk9Ii42Ii8+PHJlY3QgeD0iMzAiIHk9Ii0yNiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjNUIzQTIyIiBvcGFjaXR5PSIuNiIvPjwvZz48cGF0aCBkPSJNNDAgMTg4LjggVjg5LjY4IiBzdHJva2U9IiM1QjNBMjIiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik00MCA4OS42OCBsMjIgOCBsLTIyIDh6IiBmaWxsPSIjQzAzOTJCIi8+PHBhdGggZD0iTTIyMCAxODguOCBWODkuNjgiIHN0cm9rZT0iIzVCM0EyMiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTIyMCA4OS42OCBsMjIgOCBsLTIyIDh6IiBmaWxsPSIjRDRBMDE3Ii8+PC9nPgo8cmVjdCB4PSIwIiB5PSIyMzYiIHdpZHRoPSIyNjAiIGhlaWdodD0iMTM0IiBmaWxsPSIjMkY1QTNFIi8+CjxyZWN0IHg9IjAiIHk9IjIzNiIgd2lkdGg9IjI2MCIgaGVpZ2h0PSI0IiBmaWxsPSIjRTI1NzJCIi8+CjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSI4IiBoZWlnaHQ9IjM3MCIgZmlsbD0iIzAwMCIgb3BhY2l0eT0iLjE2Ii8+Cjx0ZXh0IHg9IjIyIiB5PSIyNzgiIGZvbnQtZmFtaWx5PSJNb250c2VycmF0LCdCZSBWaWV0bmFtIFBybycsJ1NlZ29lIFVJJyxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjI1IiBmb250LXdlaWdodD0iODAwIiBmaWxsPSIjZmZmIj5WxINuIGjDs2E8L3RleHQ+PHRleHQgeD0iMjIiIHk9IjMwOCIgZm9udC1mYW1pbHk9Ik1vbnRzZXJyYXQsJ0JlIFZpZXRuYW0gUHJvJywnU2Vnb2UgVUknLEFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjUiIGZvbnQtd2VpZ2h0PSI4MDAiIGZpbGw9IiNmZmYiPkPhuqltIFBo4bqjPC90ZXh0Pjx0ZXh0IHg9IjIyIiB5PSIzNDAiIGZvbnQtZmFtaWx5PSJNb250c2VycmF0LCdCZSBWaWV0bmFtIFBybycsJ1NlZ29lIFVJJyxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjExLjUiIGZvbnQtd2VpZ2h0PSI2MDAiIGxldHRlci1zcGFjaW5nPSIxLjQiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii43OCI+UEjGr+G7nE5HIEPhuqhNIFBI4bqiPC90ZXh0Pjx0ZXh0IHg9IjI0MCIgeT0iMzU0IiB0ZXh0LWFuY2hvcj0iZW5kIiBmb250LWZhbWlseT0iTW9udHNlcnJhdCwnQmUgVmlldG5hbSBQcm8nLCdTZWdvZSBVSScsQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzNCIgZm9udC13ZWlnaHQ9IjgwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEuMiIgb3BhY2l0eT0iLjU1Ij4wMzwvdGV4dD4KPC9nPgo8L3N2Zz4=',desc:'Đời sống cộng đồng, lễ hội, phong trào văn hóa khu dân cư'},
  {id:'tochuc',name:'Cơ cấu tổ chức',color:'#0B4F57',img:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNjAgMzcwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjM3MCI+CjxkZWZzPjxjbGlwUGF0aCBpZD0iYyI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIzNzAiIHJ4PSI0Ii8+PC9jbGlwUGF0aD48L2RlZnM+CjxnIGNsaXAtcGF0aD0idXJsKCNjKSI+PHJlY3Qgd2lkdGg9IjI2MCIgaGVpZ2h0PSIzNzAiIGZpbGw9IiMwQjRGNTciLz4KPGc+PHJlY3Qgd2lkdGg9IjI2MCIgaGVpZ2h0PSIyMzYiIGZpbGw9IiNFNEVCRjEiLz48cGF0aCBkPSJNMTMwIDUwLjA0MDAwMDAwMDAwMDAwNiBWNzAuOCBNNzAgNzAuOCBIMTkwIE03MCA3MC44IFY4NC45NiBNMTMwIDcwLjggVjg0Ljk2IE0xOTAgNzAuOCBWODQuOTYiIHN0cm9rZT0iIzBCNEY1NyIgc3Ryb2tlLXdpZHRoPSIxLjYiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSIxMzAiIGN5PSIzMy4wNDAwMDAwMDAwMDAwMDYiIHI9IjE3IiBmaWxsPSIjZmZmIiBzdHJva2U9IiMwQjRGNTciIHN0cm9rZS13aWR0aD0iMiIvPjxjaXJjbGUgY3g9IjEzMCIgY3k9IjI5LjA0MDAwMDAwMDAwMDAwNiIgcj0iNS41IiBmaWxsPSIjMEI0RjU3Ii8+PHBhdGggZD0iTTEyMSA0My4wNDAwMDAwMDAwMDAwMDYgcTkgLTEyIDE4IDAiIGZpbGw9IiMwQjRGNTciLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjEwMS45NiIgcj0iMTciIGZpbGw9IiNmZmYiIHN0cm9rZT0iIzBCNEY1NyIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSI5Ny45NiIgcj0iNS41IiBmaWxsPSIjMEI0RjU3Ii8+PHBhdGggZD0iTTYxIDExMS45NiBxOSAtMTIgMTggMCIgZmlsbD0iIzBCNEY1NyIvPjxjaXJjbGUgY3g9IjEzMCIgY3k9IjEwMS45NiIgcj0iMTciIGZpbGw9IiNmZmYiIHN0cm9rZT0iIzBCNEY1NyIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTMwIiBjeT0iOTcuOTYiIHI9IjUuNSIgZmlsbD0iIzBCNEY1NyIvPjxwYXRoIGQ9Ik0xMjEgMTExLjk2IHE5IC0xMiAxOCAwIiBmaWxsPSIjMEI0RjU3Ii8+PGNpcmNsZSBjeD0iMTkwIiBjeT0iMTAxLjk2IiByPSIxNyIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjMEI0RjU3IiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSIxOTAiIGN5PSI5Ny45NiIgcj0iNS41IiBmaWxsPSIjMEI0RjU3Ii8+PHBhdGggZD0iTTE4MSAxMTEuOTYgcTkgLTEyIDE4IDAiIGZpbGw9IiMwQjRGNTciLz48Zz48cmVjdCB4PSI0MCIgeT0iMTU1Ljc2MDAwMDAwMDAwMDAyIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjgwLjIzOTk5OTk5OTk5OTk4IiBmaWxsPSIjRjdGN0YyIi8+PHBhdGggZD0iTTMwIDE1NS43NjAwMDAwMDAwMDAwMiBMMTMwIDEyOS43NjAwMDAwMDAwMDAwMiBMMjMwIDE1NS43NjAwMDAwMDAwMDAwMloiIGZpbGw9IiNDOUQzREMiLz48cmVjdCB4PSI1MiIgeT0iMTY3Ljc2MDAwMDAwMDAwMDAyIiB3aWR0aD0iMTIiIGhlaWdodD0iNjguMjM5OTk5OTk5OTk5OTgiIGZpbGw9IiNCN0MzQ0UiLz48cmVjdCB4PSI3OCIgeT0iMTY3Ljc2MDAwMDAwMDAwMDAyIiB3aWR0aD0iMTIiIGhlaWdodD0iNjguMjM5OTk5OTk5OTk5OTgiIGZpbGw9IiNCN0MzQ0UiLz48cmVjdCB4PSIxMDQiIHk9IjE2Ny43NjAwMDAwMDAwMDAwMiIgd2lkdGg9IjEyIiBoZWlnaHQ9IjY4LjIzOTk5OTk5OTk5OTk4IiBmaWxsPSIjQjdDM0NFIi8+PHJlY3QgeD0iMTMwIiB5PSIxNjcuNzYwMDAwMDAwMDAwMDIiIHdpZHRoPSIxMiIgaGVpZ2h0PSI2OC4yMzk5OTk5OTk5OTk5OCIgZmlsbD0iI0I3QzNDRSIvPjxyZWN0IHg9IjE1NiIgeT0iMTY3Ljc2MDAwMDAwMDAwMDAyIiB3aWR0aD0iMTIiIGhlaWdodD0iNjguMjM5OTk5OTk5OTk5OTgiIGZpbGw9IiNCN0MzQ0UiLz48cmVjdCB4PSIxODIiIHk9IjE2Ny43NjAwMDAwMDAwMDAwMiIgd2lkdGg9IjEyIiBoZWlnaHQ9IjY4LjIzOTk5OTk5OTk5OTk4IiBmaWxsPSIjQjdDM0NFIi8+PHJlY3QgeD0iMjA4IiB5PSIxNjcuNzYwMDAwMDAwMDAwMDIiIHdpZHRoPSIxMiIgaGVpZ2h0PSI2OC4yMzk5OTk5OTk5OTk5OCIgZmlsbD0iI0I3QzNDRSIvPjxwYXRoIGQ9Ik0xMzAgMTI5Ljc2MDAwMDAwMDAwMDAyIFYxMDEuNzYwMDAwMDAwMDAwMDIiIHN0cm9rZT0iIzU1NSIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48cGF0aCBkPSJNMTMwIDEwMS43NjAwMDAwMDAwMDAwMiBoMTggbC00IDUgbDQgNSBoLTE4eiIgZmlsbD0iI0MwMzkyQiIvPjwvZz48L2c+CjxyZWN0IHg9IjAiIHk9IjIzNiIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIxMzQiIGZpbGw9IiMwQjRGNTciLz4KPHJlY3QgeD0iMCIgeT0iMjM2IiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjQiIGZpbGw9IiNFMjU3MkIiLz4KPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjgiIGhlaWdodD0iMzcwIiBmaWxsPSIjMDAwIiBvcGFjaXR5PSIuMTYiLz4KPHRleHQgeD0iMjIiIHk9IjI3OCIgZm9udC1mYW1pbHk9Ik1vbnRzZXJyYXQsJ0JlIFZpZXRuYW0gUHJvJywnU2Vnb2UgVUknLEFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjUiIGZvbnQtd2VpZ2h0PSI4MDAiIGZpbGw9IiNmZmYiPkPGoSBj4bqldTwvdGV4dD48dGV4dCB4PSIyMiIgeT0iMzA4IiBmb250LWZhbWlseT0iTW9udHNlcnJhdCwnQmUgVmlldG5hbSBQcm8nLCdTZWdvZSBVSScsQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNSIgZm9udC13ZWlnaHQ9IjgwMCIgZmlsbD0iI2ZmZiI+dOG7lSBjaOG7qWM8L3RleHQ+PHRleHQgeD0iMjIiIHk9IjM0MCIgZm9udC1mYW1pbHk9Ik1vbnRzZXJyYXQsJ0JlIFZpZXRuYW0gUHJvJywnU2Vnb2UgVUknLEFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTEuNSIgZm9udC13ZWlnaHQ9IjYwMCIgbGV0dGVyLXNwYWNpbmc9IjEuNCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iLjc4Ij5QSMav4bucTkcgQ+G6qE0gUEjhuqI8L3RleHQ+PHRleHQgeD0iMjQwIiB5PSIzNTQiIHRleHQtYW5jaG9yPSJlbmQiIGZvbnQtZmFtaWx5PSJNb250c2VycmF0LCdCZSBWaWV0bmFtIFBybycsJ1NlZ29lIFVJJyxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjM0IiBmb250LXdlaWdodD0iODAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMS4yIiBvcGFjaXR5PSIuNTUiPjA0PC90ZXh0Pgo8L2c+Cjwvc3ZnPg==',desc:'Bộ máy, chức năng nhiệm vụ, thủ tục thường gặp'},
  {id:'diaphuong',name:'Địa phương Cẩm Phả',color:'#2E6B6E',img:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNjAgMzcwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjM3MCI+CjxkZWZzPjxjbGlwUGF0aCBpZD0iYyI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIzNzAiIHJ4PSI0Ii8+PC9jbGlwUGF0aD48L2RlZnM+CjxnIGNsaXAtcGF0aD0idXJsKCNjKSI+PHJlY3Qgd2lkdGg9IjI2MCIgaGVpZ2h0PSIzNzAiIGZpbGw9IiMyRTZCNkUiLz4KPGc+PHJlY3Qgd2lkdGg9IjI2MCIgaGVpZ2h0PSIyMzYiIGZpbGw9IiNEQ0VCRUEiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSI0Ny4yIiByPSIxOCIgZmlsbD0iI0YxQzI3RCIgb3BhY2l0eT0iLjgiLz48cGF0aCBkPSJNMjAgMTQ2LjMyIFEyNS4wIDY2LjMyIDQ1LjAgNjYuMzIgUTY1LjAgNjYuMzIgNzAgMTQ2LjMyWiIgZmlsbD0iIzJFNkI2RSIgb3BhY2l0eT0iMC45Ii8+PHBhdGggZD0iTTgwIDE0Ni4zMiBRODQuMCAzNi4zMTk5OTk5OTk5OTk5OSAxMDAuMCAzNi4zMTk5OTk5OTk5OTk5OSBRMTE2LjAgMzYuMzE5OTk5OTk5OTk5OTkgMTIwIDE0Ni4zMloiIGZpbGw9IiMyRTZCNkUiIG9wYWNpdHk9IjAuOCIvPjxwYXRoIGQ9Ik0xNTAgMTQ2LjMyIFExNTYuMCA1Ni4zMTk5OTk5OTk5OTk5OSAxODAuMCA1Ni4zMTk5OTk5OTk5OTk5OSBRMjA0LjAgNTYuMzE5OTk5OTk5OTk5OTkgMjEwIDE0Ni4zMloiIGZpbGw9IiMyRTZCNkUiIG9wYWNpdHk9IjAuODUiLz48cGF0aCBkPSJNMjEwIDE0Ni4zMiBRMjE0LjAgNzYuMzIgMjMwLjAgNzYuMzIgUTI0Ni4wIDc2LjMyIDI1MCAxNDYuMzJaIiBmaWxsPSIjMkU2QjZFIiBvcGFjaXR5PSIwLjciLz48cmVjdCB4PSIwIiB5PSIxNDYuMzIiIHdpZHRoPSIyNjAiIGhlaWdodD0iODkuNjgiIGZpbGw9IiM3RkIzQjMiIG9wYWNpdHk9Ii43NSIvPjxwYXRoIGQ9Ik0xMCAxNjAuNDgwMDAwMDAwMDAwMDIgcTEwIC01IDIwIDAgdDIwIDAgTTE0MCAxNjQuNDgwMDAwMDAwMDAwMDIgcTEwIC01IDIwIDAgdDIwIDAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjYiIGZpbGw9Im5vbmUiIG9wYWNpdHk9Ii44Ii8+PHBhdGggZD0iTTI4IDE3Mi40ODAwMDAwMDAwMDAwMiBxMTAgLTUgMjAgMCB0MjAgMCBNMTMwIDE3Ni40ODAwMDAwMDAwMDAwMiBxMTAgLTUgMjAgMCB0MjAgMCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEuNiIgZmlsbD0ibm9uZSIgb3BhY2l0eT0iLjgiLz48cGF0aCBkPSJNNDYgMTg0LjQ4MDAwMDAwMDAwMDAyIHExMCAtNSAyMCAwIHQyMCAwIE0xMjAgMTg4LjQ4MDAwMDAwMDAwMDAyIHExMCAtNSAyMCAwIHQyMCAwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMS42IiBmaWxsPSJub25lIiBvcGFjaXR5PSIuOCIvPjxwYXRoIGQ9Ik02NCAxOTYuNDgwMDAwMDAwMDAwMDIgcTEwIC01IDIwIDAgdDIwIDAgTTExMCAyMDAuNDgwMDAwMDAwMDAwMDIgcTEwIC01IDIwIDAgdDIwIDAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjYiIGZpbGw9Im5vbmUiIG9wYWNpdHk9Ii44Ii8+PHBhdGggZD0iTTgyIDIwOC40ODAwMDAwMDAwMDAwMiBxMTAgLTUgMjAgMCB0MjAgMCBNMTAwIDIxMi40ODAwMDAwMDAwMDAwMiBxMTAgLTUgMjAgMCB0MjAgMCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEuNiIgZmlsbD0ibm9uZSIgb3BhY2l0eT0iLjgiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMTAsMTY5LjkyKSI+PHBhdGggZD0iTS0yNiAwIEgyNiBMMTggMTAgSC0xOFoiIGZpbGw9IiM2QjNFMjYiLz48cGF0aCBkPSJNMCAwIFYtMzYiIHN0cm9rZT0iIzZCM0UyNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTIgLTM0IEwyNCAtNiBIMloiIGZpbGw9IiNDMDM5MkIiIG9wYWNpdHk9Ii45Ii8+PC9nPjwvZz4KPHJlY3QgeD0iMCIgeT0iMjM2IiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjEzNCIgZmlsbD0iIzJFNkI2RSIvPgo8cmVjdCB4PSIwIiB5PSIyMzYiIHdpZHRoPSIyNjAiIGhlaWdodD0iNCIgZmlsbD0iI0UyNTcyQiIvPgo8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iOCIgaGVpZ2h0PSIzNzAiIGZpbGw9IiMwMDAiIG9wYWNpdHk9Ii4xNiIvPgo8dGV4dCB4PSIyMiIgeT0iMjc4IiBmb250LWZhbWlseT0iTW9udHNlcnJhdCwnQmUgVmlldG5hbSBQcm8nLCdTZWdvZSBVSScsQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNSIgZm9udC13ZWlnaHQ9IjgwMCIgZmlsbD0iI2ZmZiI+xJDhu4thIHBoxrDGoW5nPC90ZXh0Pjx0ZXh0IHg9IjIyIiB5PSIzMDgiIGZvbnQtZmFtaWx5PSJNb250c2VycmF0LCdCZSBWaWV0bmFtIFBybycsJ1NlZ29lIFVJJyxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjI1IiBmb250LXdlaWdodD0iODAwIiBmaWxsPSIjZmZmIj5D4bqpbSBQaOG6ozwvdGV4dD48dGV4dCB4PSIyMiIgeT0iMzQwIiBmb250LWZhbWlseT0iTW9udHNlcnJhdCwnQmUgVmlldG5hbSBQcm8nLCdTZWdvZSBVSScsQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMS41IiBmb250LXdlaWdodD0iNjAwIiBsZXR0ZXItc3BhY2luZz0iMS40IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIuNzgiPsSQ4bqkVCBN4buOIOKAkyBCSeG7gk4gWEFOSDwvdGV4dD48dGV4dCB4PSIyNDAiIHk9IjM1NCIgdGV4dC1hbmNob3I9ImVuZCIgZm9udC1mYW1pbHk9Ik1vbnRzZXJyYXQsJ0JlIFZpZXRuYW0gUHJvJywnU2Vnb2UgVUknLEFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzQiIGZvbnQtd2VpZ2h0PSI4MDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjIiIG9wYWNpdHk9Ii41NSI+MDU8L3RleHQ+CjwvZz4KPC9zdmc+',desc:'Tự nhiên, dân cư, kinh tế – xã hội, tuyên truyền pháp luật'},
  {id:'amthuc',name:'Ẩm thực vùng biển',color:'#9A3E24',img:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNjAgMzcwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjM3MCI+CjxkZWZzPjxjbGlwUGF0aCBpZD0iYyI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIzNzAiIHJ4PSI0Ii8+PC9jbGlwUGF0aD48L2RlZnM+CjxnIGNsaXAtcGF0aD0idXJsKCNjKSI+PHJlY3Qgd2lkdGg9IjI2MCIgaGVpZ2h0PSIzNzAiIGZpbGw9IiM5QTNFMjQiLz4KPGc+PHJlY3Qgd2lkdGg9IjI2MCIgaGVpZ2h0PSIyMzYiIGZpbGw9IiNGNkUzRDUiLz48cGF0aCBkPSJNMjAgNDIuNDggVjcwLjgiIHN0cm9rZT0iIzVCM0EyMiIgc3Ryb2tlLXdpZHRoPSIxIi8+PGVsbGlwc2UgY3g9IjIwIiBjeT0iNzguOCIgcng9IjkiIHJ5PSIxMSIgZmlsbD0iI0QzNTQwMCIvPjxwYXRoIGQ9Ik03MCA0Mi40OCBWNzAuOCIgc3Ryb2tlPSIjNUIzQTIyIiBzdHJva2Utd2lkdGg9IjEiLz48ZWxsaXBzZSBjeD0iNzAiIGN5PSI3OC44IiByeD0iOSIgcnk9IjExIiBmaWxsPSIjRDM1NDAwIi8+PHBhdGggZD0iTTEyMCA0Mi40OCBWNzAuOCIgc3Ryb2tlPSIjNUIzQTIyIiBzdHJva2Utd2lkdGg9IjEiLz48ZWxsaXBzZSBjeD0iMTIwIiBjeT0iNzguOCIgcng9IjkiIHJ5PSIxMSIgZmlsbD0iI0QzNTQwMCIvPjxwYXRoIGQ9Ik0xNzAgNDIuNDggVjcwLjgiIHN0cm9rZT0iIzVCM0EyMiIgc3Ryb2tlLXdpZHRoPSIxIi8+PGVsbGlwc2UgY3g9IjE3MCIgY3k9Ijc4LjgiIHJ4PSI5IiByeT0iMTEiIGZpbGw9IiNEMzU0MDAiLz48cGF0aCBkPSJNMjIwIDQyLjQ4IFY3MC44IiBzdHJva2U9IiM1QjNBMjIiIHN0cm9rZS13aWR0aD0iMSIvPjxlbGxpcHNlIGN4PSIyMjAiIGN5PSI3OC44IiByeD0iOSIgcnk9IjExIiBmaWxsPSIjRDM1NDAwIi8+PHJlY3QgeD0iMCIgeT0iMTQ2LjMyIiB3aWR0aD0iMjYwIiBoZWlnaHQ9Ijg5LjY4IiBmaWxsPSIjQzhBMjdBIiBvcGFjaXR5PSIuNiIvPjxlbGxpcHNlIGN4PSI4MCIgY3k9IjE2OS45MiIgcng9IjU2IiByeT0iMjEuMjgiIGZpbGw9IiNGREY4RjAiIHN0cm9rZT0iI0UwRDJCQyIvPjxlbGxpcHNlIGN4PSI4MCIgY3k9IjE2NS4yIiByeD0iNDAuMzIiIHJ5PSIxMy40NCIgZmlsbD0iI0U4QTA0QSIvPjxlbGxpcHNlIGN4PSIxODAiIGN5PSIxNjkuOTIiIHJ4PSI1MCIgcnk9IjE5LjAiIGZpbGw9IiNGREY4RjAiIHN0cm9rZT0iI0UwRDJCQyIvPjxlbGxpcHNlIGN4PSIxODAiIGN5PSIxNjUuMiIgcng9IjM2LjAiIHJ5PSIxMi4wIiBmaWxsPSIjRThBMDRBIi8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoODAsMTU1Ljc2MDAwMDAwMDAwMDAyKSI+PHBhdGggZD0iTS0yNiAwIFEwIC0xNCAyMiAwIFEwIDE0IC0yNiAwWiIgZmlsbD0iIzlBM0UyNCIvPjxwYXRoIGQ9Ik0yMiAwIEwzNCAtOSBWOVoiIGZpbGw9IiM5QTNFMjQiLz48Y2lyY2xlIGN4PSItMTQiIGN5PSItMiIgcj0iMiIgZmlsbD0iI2ZmZiIvPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxODAsMTU1Ljc2MDAwMDAwMDAwMDAyKSI+PGNpcmNsZSBjeD0iLTE4IiBjeT0iMCIgcj0iNiIgZmlsbD0iI0MwMzkyQiIvPjxjaXJjbGUgY3g9Ii05IiBjeT0iLTQiIHI9IjYiIGZpbGw9IiNDMDM5MkIiLz48Y2lyY2xlIGN4PSIwIiBjeT0iMCIgcj0iNiIgZmlsbD0iI0MwMzkyQiIvPjxjaXJjbGUgY3g9IjkiIGN5PSItNCIgcj0iNiIgZmlsbD0iI0MwMzkyQiIvPjxjaXJjbGUgY3g9IjE4IiBjeT0iMCIgcj0iNiIgZmlsbD0iI0MwMzkyQiIvPjwvZz48L2c+CjxyZWN0IHg9IjAiIHk9IjIzNiIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIxMzQiIGZpbGw9IiM5QTNFMjQiLz4KPHJlY3QgeD0iMCIgeT0iMjM2IiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjQiIGZpbGw9IiNFMjU3MkIiLz4KPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjgiIGhlaWdodD0iMzcwIiBmaWxsPSIjMDAwIiBvcGFjaXR5PSIuMTYiLz4KPHRleHQgeD0iMjIiIHk9IjI3OCIgZm9udC1mYW1pbHk9Ik1vbnRzZXJyYXQsJ0JlIFZpZXRuYW0gUHJvJywnU2Vnb2UgVUknLEFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjUiIGZvbnQtd2VpZ2h0PSI4MDAiIGZpbGw9IiNmZmYiPuG6qG0gdGjhu7FjPC90ZXh0Pjx0ZXh0IHg9IjIyIiB5PSIzMDgiIGZvbnQtZmFtaWx5PSJNb250c2VycmF0LCdCZSBWaWV0bmFtIFBybycsJ1NlZ29lIFVJJyxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjI1IiBmb250LXdlaWdodD0iODAwIiBmaWxsPSIjZmZmIj52w7luZyBiaeG7g248L3RleHQ+PHRleHQgeD0iMjIiIHk9IjM0MCIgZm9udC1mYW1pbHk9Ik1vbnRzZXJyYXQsJ0JlIFZpZXRuYW0gUHJvJywnU2Vnb2UgVUknLEFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTEuNSIgZm9udC13ZWlnaHQ9IjYwMCIgbGV0dGVyLXNwYWNpbmc9IjEuNCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iLjc4Ij5D4bqoTSBQSOG6ojwvdGV4dD48dGV4dCB4PSIyNDAiIHk9IjM1NCIgdGV4dC1hbmNob3I9ImVuZCIgZm9udC1mYW1pbHk9Ik1vbnRzZXJyYXQsJ0JlIFZpZXRuYW0gUHJvJywnU2Vnb2UgVUknLEFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzQiIGZvbnQtd2VpZ2h0PSI4MDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjIiIG9wYWNpdHk9Ii41NSI+MDY8L3RleHQ+CjwvZz4KPC9zdmc+',desc:'Món ăn, chợ hải sản, câu chuyện người làm nghề'}
];
const SHELF_AUTHOR={dang:'Ban Xây dựng Đảng',ditich:'Phòng Văn hóa – Xã hội',vanhoa:'Phòng Văn hóa – Xã hội',tochuc:'Văn phòng HĐND và UBND',diaphuong:'Phòng Kinh tế, Hạ tầng và Đô thị',amthuc:'Phòng Văn hóa – Xã hội'};
const SHELF_TEXT={
  dang:['Mỗi chương trong kệ Lịch sử Đảng bộ được biên soạn theo mốc thời gian, có ghi nguồn tư liệu và được lãnh đạo phụ trách duyệt trước khi công khai.','Nội dung minh họa gồm các giai đoạn hình thành và phát triển của tổ chức Đảng trên địa bàn, các phong trào thi đua tiêu biểu và kinh nghiệm lãnh đạo ở chi bộ khu dân cư.','Khi triển khai chính thức, phần này được thay bằng bản thảo do Ban Xây dựng Đảng biên soạn, đối chiếu với lịch sử Đảng bộ đã xuất bản.'],
  ditich:['Kệ Di tích vùng mỏ lưu giữ truyền thống của đất mỏ: cuộc tổng bãi công của hơn ba vạn thợ mỏ bắt đầu ngày 12/11/1936, tinh thần “Kỷ luật và Đồng tâm” của công nhân ngành Than.','Hồ sơ di tích gồm vị trí, tư liệu lịch sử, hiện vật, ảnh hiện trạng và lời kể nhân chứng, lưu trong kho dữ liệu dùng chung, gắn mã hồ sơ để tra cứu.','Người đọc có thể nghe thuyết minh bằng giọng đọc AI và xem phim tư liệu ngắn. Nội dung minh họa, được thay bằng hồ sơ do phường cung cấp khi triển khai.'],
  vanhoa:['Kệ Văn hóa Cẩm Phả lưu giữ đời sống cộng đồng: phong trào văn hóa, văn nghệ công nhân mỏ, lễ hội và nếp sống khu dân cư.','Cán bộ văn hóa ghi âm lời kể của các cựu thợ mỏ, số hóa ảnh gia đình và đưa vào sách dưới dạng đa phương tiện.','Mỗi tư liệu ghi rõ người cung cấp và quyền sử dụng, bảo đảm tôn trọng quyền tác giả.'],
  tochuc:['Kệ Cơ cấu tổ chức giới thiệu bộ máy của phường: Đảng ủy, Hội đồng nhân dân, Ủy ban nhân dân, Mặt trận Tổ quốc và các đoàn thể.','Mỗi phòng ban có trang riêng nêu chức năng, nhiệm vụ, đầu mối liên hệ và các thủ tục hành chính thường gặp.','Văn bản liên quan được liên kết về Cơ sở dữ liệu quốc gia về văn bản pháp luật, luôn dẫn tới bản hiện hành.'],
  diaphuong:['Kệ Địa phương tổng hợp đặc điểm tự nhiên, dân cư, kinh tế – xã hội của phường Cẩm Phả, hình thành từ năm phường Cẩm Trung, Cẩm Thành, Cẩm Bình, Cẩm Tây và Cẩm Đông.','Số liệu được cập nhật từ báo cáo định kỳ của các phòng ban, kèm biểu đồ và nguồn trích dẫn.','Các sổ tay tuyên truyền pháp luật trong kệ này có giọng đọc AI để người cao tuổi dễ tiếp cận.'],
  amthuc:['Kệ Ẩm thực giới thiệu món ăn từ biển, chợ hải sản và hàng quán trên địa bàn, gắn với câu chuyện của người làm nghề.','Mỗi món được trình bày với ảnh, video ngắn và bản đồ vị trí, phục vụ quảng bá du lịch địa phương.','Nội dung do Phòng Văn hóa – Xã hội phối hợp các khu phố thu thập, duyệt trước khi công khai.']
};
const BOOK_SEED=[
 ['dang','Lược sử Đảng bộ phường Cẩm Phả','Tóm lược các chặng đường xây dựng và phát triển',['flip','audio']],
 ['dang','Những mốc son trên đất mỏ Cẩm Phả','Dòng thời gian các sự kiện tiêu biểu',['flip','media']],
 ['dang','Chân dung đảng viên tiêu biểu','Gương người tốt, việc tốt ở khu dân cư',['flip','audio']],
 ['dang','Sổ tay công tác chi bộ khu dân cư','Hướng dẫn nghiệp vụ sinh hoạt chi bộ',['flip']],
 ['ditich','Ngọn lửa 12/11/1936','Cuộc tổng bãi công của thợ mỏ vùng Cẩm Phả',['flip','audio','media']],
 ['ditich','Núi Trọc – di tích lịch sử','Tư liệu, hiện vật và lời kể nhân chứng',['flip','media']],
 ['ditich','Quảng trường 12/11 và tượng đài Vinh quang thợ mỏ','Ảnh tư liệu và phim ngắn',['flip','audio','media']],
 ['ditich','Kỷ luật và Đồng tâm','Truyền thống của công nhân ngành Than',['flip','audio']],
 ['ditich','Bản đồ di tích trên địa bàn phường','Vị trí và thông tin tra cứu nhanh',['flip']],
 ['vanhoa','Ký ức thợ mỏ','Lời kể của các cựu công nhân mỏ',['flip','audio','media']],
 ['vanhoa','Văn nghệ công nhân vùng mỏ','Phong trào văn hóa, văn nghệ cơ sở',['flip','media']],
 ['vanhoa','Lễ hội và phong tục khu dân cư','Sưu tầm và giới thiệu',['flip','audio']],
 ['vanhoa','Gia đình văn hóa, khu phố văn hóa','Mô hình tiêu biểu',['flip']],
 ['tochuc','Sơ đồ tổ chức bộ máy phường','Đảng ủy, HĐND, UBND, MTTQ và đoàn thể',['flip']],
 ['tochuc','Chức năng, nhiệm vụ các phòng ban','Đầu mối và phạm vi công việc',['flip']],
 ['tochuc','Thủ tục hành chính thường gặp','Hồ sơ, thời hạn, nơi tiếp nhận',['flip','audio']],
 ['tochuc','Danh bạ đường dây nóng','Liên hệ khi cần hỗ trợ',['flip']],
 ['tochuc','Quy chế làm việc của UBND phường','Nguyên tắc, trách nhiệm, chế độ làm việc',['flip']],
 ['diaphuong','Sổ tay tuyên truyền Luật Đất đai 2024','Những điểm mới người dân cần biết',['flip','audio','media','law']],
 ['diaphuong','Phường Cẩm Phả sau sắp xếp','Hợp nhất 5 phường, tổ chức chính quyền hai cấp',['flip','audio']],
 ['diaphuong','Đất mỏ – biển xanh','Tổng quan tự nhiên, dân cư phường Cẩm Phả',['flip']],
 ['diaphuong','Kinh tế – xã hội 9 tháng năm 2026','Số liệu và biểu đồ',['flip','media']],
 ['diaphuong','Quy hoạch đô thị thương mại, dịch vụ','Định hướng phát triển',['flip']],
 ['amthuc','Hương vị biển Cẩm Phả','Món ăn và người giữ nghề',['flip','media']],
 ['amthuc','Mâm cỗ ngày Tết vùng mỏ','Phong tục và cách làm',['flip','audio']],
 ['amthuc','Bản đồ ẩm thực phường','Hàng quán theo khu phố',['flip']],
 ['amthuc','Chợ hải sản sớm mai','Nhịp sống chợ ven biển',['flip','media']]
];
const LAWS=[
  {name:'Cơ sở dữ liệu quốc gia về văn bản pháp luật',url:'https://vbpl.vn',g:'Văn bản Nhà nước'},
  {name:'Hệ thống văn bản – Cổng TTĐT Chính phủ',url:'https://vanban.chinhphu.vn',g:'Văn bản Nhà nước'},
  {name:'Cổng Thông tin điện tử Chính phủ',url:'https://chinhphu.vn',g:'Văn bản Nhà nước'},
  {name:'Cổng Dịch vụ công quốc gia',url:'https://dichvucong.gov.vn',g:'Văn bản Nhà nước'},
  {name:'Tư liệu – Văn kiện Đảng',url:'https://tulieuvankien.dangcongsan.vn',g:'Văn bản của Đảng'},
  {name:'Báo điện tử Đảng Cộng sản Việt Nam',url:'https://dangcongsan.vn',g:'Văn bản của Đảng'},
  {name:'Cổng Thông tin điện tử tỉnh Quảng Ninh',url:'https://www.quangninh.gov.vn',g:'Tỉnh Quảng Ninh'},
  {name:'Thư viện Quốc gia Việt Nam',url:'https://nlv.gov.vn',g:'Thư viện, tài nguyên văn hóa'}
];
const DEPTS=[
  {id:'vpdu',name:'Văn phòng Đảng ủy',block:'Đảng ủy',code:'VPĐU',acct:'vpdu.campha',members:4},
  {id:'xdd',name:'Ban Xây dựng Đảng',block:'Đảng ủy',code:'BXDĐ',acct:'bxdd.campha',members:5},
  {id:'ubkt',name:'Ủy ban Kiểm tra Đảng ủy',block:'Đảng ủy',code:'UBKT',acct:'ubkt.campha',members:3},
  {id:'mttq',name:'Ủy ban MTTQ Việt Nam phường',block:'Mặt trận, đoàn thể',code:'MTTQ',acct:'mttq.campha',members:6},
  {id:'vpub',name:'Văn phòng HĐND và UBND',block:'Chính quyền',code:'VPUB',acct:'vpub.campha',members:7},
  {id:'kt',name:'Phòng Kinh tế, Hạ tầng và Đô thị',block:'Chính quyền',code:'KTHT',acct:'ktht.campha',members:8},
  {id:'vhxh',name:'Phòng Văn hóa – Xã hội',block:'Chính quyền',code:'VHXH',acct:'vhxh.campha',members:6},
  {id:'hcc',name:'Trung tâm Phục vụ hành chính công',block:'Chính quyền',code:'PVHCC',acct:'pvhcc.campha',members:9}
];
const deptName=id=>(DEPTS.find(d=>d.id===id)||{}).name||id;
const shelfOf=b=>SHELVES.find(s=>s.id===b.shelf);

/* ---------- state ---------- */
const S={
  role:'public',view:'home',shelf:null,shelfFilter:'all',newsCat:'Tất cả',q:'',
  books:BOOK_SEED.map((b,i)=>({id:'b'+i,shelf:b[0],title:b[1],sub:b[2],flags:b[3],views:Math.round(180+rnd()*1400),author:SHELF_AUTHOR[b[0]],date:`${pad(1+Math.floor(rnd()*28))}/0${4+Math.floor(rnd()*5)}/2026`})),
  news:[
    {id:'n1',cat:'Chuyển đổi số',title:'Đề xuất xây dựng Tủ sách điện tử phường Cẩm Phả',date:'30/09/2026',sum:'Hệ thống gồm cổng Tủ sách, kho nghiệp vụ nội bộ, kho dữ liệu dùng chung và không gian riêng cho từng phòng ban.',dept:'vpdu',views:312},
    {id:'n2',cat:'Hoạt động Đảng',title:'Đảng ủy phường sơ kết công tác 9 tháng đầu năm 2026',date:'26/09/2026',sum:'Hội nghị đánh giá kết quả thực hiện nghị quyết và triển khai nhiệm vụ quý IV.',dept:'vpdu',views:540},
    {id:'n3',cat:'Văn hóa – xã hội',title:'Ngày hội đọc sách tại nhà văn hóa khu phố',date:'24/09/2026',sum:'Thiếu nhi và người cao tuổi cùng trải nghiệm sách điện tử và nghe sách nói.',dept:'vhxh',views:421},
    {id:'n4',cat:'Chính quyền',title:'Lịch tiếp công dân định kỳ tháng 10/2026',date:'23/09/2026',sum:'Lãnh đạo UBND phường tiếp công dân vào thứ Năm hằng tuần tại trụ sở.',dept:'vpub',views:388},
    {id:'n5',cat:'Thông báo',title:'Hướng dẫn nộp hồ sơ trực tuyến trên Cổng Dịch vụ công',date:'20/09/2026',sum:'Các bước tạo tài khoản, nộp hồ sơ và tra cứu kết quả trực tuyến.',dept:'hcc',views:602},
    {id:'n6',cat:'Văn hóa – xã hội',title:'Ra quân vệ sinh môi trường, làm sạch bãi biển',date:'18/09/2026',sum:'Đoàn viên, hội viên cùng người dân làm sạch các tuyến phố và khu vực ven biển.',dept:'mttq',views:275},
    {id:'n7',cat:'Chính quyền',title:'Tiến độ chỉnh trang tuyến phố quý III',date:'15/09/2026',sum:'Các hạng mục vỉa hè, chiếu sáng và thoát nước đạt kế hoạch đề ra.',dept:'kt',views:196},
    {id:'n8',cat:'Hoạt động Đảng',title:'Chi bộ khu dân cư sinh hoạt chuyên đề về văn hóa đọc',date:'12/09/2026',sum:'Đảng viên thảo luận giải pháp đưa sách điện tử đến từng gia đình thợ mỏ.',dept:'xdd',views:233}
  ],
  subs:[],files:[],log:[],deptSel:null,deptTab:'projects',
  arch:{folder:'all',q:'',type:'all',page:1,sel:null},
  wfFilter:'all',compose:null,scriptOpen:false,scriptStep:-1,uploadsPending:0
};
const NEWS_BODY={
  n1:['Bản trình diễn kế thừa bố cục do phường xây dựng: sáu kệ sách chính, sách lật trang, người đọc AI và thư viện liên kết.','Điểm mới là quy trình biên soạn – duyệt – công khai cho từng ban, kho dữ liệu dùng chung đặt tại trụ sở có sao lưu lên cloud trong nước, và mục riêng để các phòng ban đăng dự án, kế hoạch.']
};

/* ---------- workflow seed ---------- */
function mkSub(o){return Object.assign({ver:1,versions:[],log:[],check:[false,false,false,false],comment:''},o)}
S.subs=[
 mkSub({id:'HS-2026-0142',orig:{name:'Tin-so-ket-9-thang.docx',size:1153434},title:'Hội nghị sơ kết 9 tháng đầu năm 2026 của Đảng ủy phường',kind:'Bản tin',cat:'Hoạt động Đảng',dept:'vpdu',author:'Cán bộ Văn phòng Đảng ủy',status:'lead',updated:'30/09/2026 08:40',summary:'Kết quả thực hiện nghị quyết và nhiệm vụ trọng tâm quý IV.',content:'<p>Sáng 26/9, Đảng ủy phường tổ chức hội nghị sơ kết công tác 9 tháng đầu năm 2026.</p><p>Hội nghị thống nhất các nhiệm vụ trọng tâm quý IV, trong đó có đưa Tủ sách điện tử vào vận hành.</p>'}),
 mkSub({id:'HS-2026-0139',orig:{name:'Nui-Troc-ban-thao.docx',size:4718592},title:'Núi Trọc – nơi khởi đầu cuộc tổng bãi công 1936',kind:'Sách',shelf:'ditich',dept:'vhxh',author:'Cán bộ biên soạn · Phòng VH–XH',status:'office',updated:'28/09/2026 16:05',summary:'Tư liệu, thuyết minh và phim ngắn về di tích.',content:'<h2>Giới thiệu</h2><p>Tập sách giới thiệu tư liệu, hiện vật và lời kể nhân chứng về cuộc tổng bãi công năm 1936.</p><div class="mchip"><b>[Video]</b> Phim tư liệu Núi Trọc (minh họa).mp4</div><p>Nguồn ảnh: tư liệu Phòng Văn hóa – Xã hội.</p>'}),
 mkSub({id:'HS-2026-0144',title:'Hướng dẫn nộp hồ sơ trực tuyến cho người cao tuổi',kind:'Bản tin',cat:'Thông báo',dept:'vhxh',author:'Cán bộ biên soạn · Phòng VH–XH',status:'draft',updated:'30/09/2026 09:12',summary:'Hướng dẫn từng bước, có giọng đọc AI.',content:'<p>Bước 1: Truy cập Cổng Dịch vụ công quốc gia.</p><p>Bước 2: Đăng nhập bằng tài khoản định danh điện tử.</p>'}),
 mkSub({id:'HS-2026-0131',orig:{name:'Ky-uc-tho-mo-tap-2.docx',size:6291456},title:'Ký ức thợ mỏ – tập 2',kind:'Sách',shelf:'vanhoa',dept:'vhxh',author:'Cán bộ biên soạn · Phòng VH–XH',status:'returned',updated:'27/09/2026 14:30',comment:'Bổ sung nguồn và quyền sử dụng ảnh ở trang 4; rút gọn phần mở đầu.',summary:'Lời kể và ảnh gia đình của các cựu thợ mỏ.',content:'<h2>Lời mở đầu</h2><p>Tập hai tiếp tục ghi lại lời kể của các cựu thợ mỏ về đời sống vùng mỏ.</p><div class="mchip"><b>[Âm thanh]</b> Ghi âm tọa đàm cựu thợ mỏ (minh họa).mp3</div>'}),
 mkSub({id:'HS-2026-0127',title:'Ra quân tổng vệ sinh môi trường khu dân cư',kind:'Bản tin',cat:'Văn hóa – xã hội',dept:'mttq',author:'Cán bộ Ủy ban MTTQ',status:'published',updated:'18/09/2026 10:20',summary:'Đoàn viên, hội viên cùng người dân làm sạch ngõ xóm.',content:'<p>Đông đảo người dân tham gia.</p>'}),
 mkSub({id:'HS-2026-0140',title:'Sổ tay chi bộ khu dân cư năm 2026',kind:'Sách',shelf:'dang',dept:'xdd',author:'Cán bộ Ban Xây dựng Đảng',status:'lead',updated:'28/09/2026 11:00',summary:'Hướng dẫn nghiệp vụ sinh hoạt chi bộ.',content:'<h2>Phần 1. Sinh hoạt chi bộ định kỳ</h2><p>Nội dung, trình tự và hồ sơ cần chuẩn bị.</p>'}),
 mkSub({id:'HS-2026-0143',title:'Lịch tiếp công dân tháng 10/2026',kind:'Bản tin',cat:'Chính quyền',dept:'vpub',author:'Cán bộ Văn phòng HĐND và UBND',status:'office',updated:'30/09/2026 07:55',summary:'Thời gian, địa điểm tiếp công dân.',content:'<p>Lãnh đạo UBND phường tiếp công dân vào thứ Năm hằng tuần.</p>'})
];
S.subs.forEach(s=>{
  const L=[['Cán bộ biên soạn','Tạo bản thảo','']];
  if(s.status!=='draft'){L.push(['Cán bộ biên soạn','Gửi lãnh đạo ban duyệt',''])}
  if(s.status==='returned'){L.push(['Lãnh đạo phụ trách ban','Trả lại chỉnh sửa',s.comment])}
  if(s.status==='office'||s.status==='published'){L.push(['Lãnh đạo phụ trách ban','Duyệt, chuyển Văn phòng','Đồng ý nội dung'])}
  if(s.status==='published'){s.check=[true,true,true,true];L.push(['Văn phòng Đảng ủy','Công khai trên Tủ sách',''])}
  s.log=L.map((l,i)=>({time:i===L.length-1?s.updated:s.updated.replace(/(\d\d):(\d\d)$/,(m,h)=>pad(Math.max(7,h-L.length+i))+':05'),by:l[0],act:l[1],note:l[2]}));
  s.versions=[{v:1,time:s.log[0].time,by:'Cán bộ biên soạn',note:'Bản thảo đầu'}];
  if(s.status==='returned'||s.status==='office'){s.ver=2;s.versions.push({v:2,time:s.updated,by:'Cán bộ biên soạn',note:'Chỉnh sửa theo góp ý'})}
});
let SUBN=145;

/* ---------- archive seed ---------- */
const FTYPES={pdf:{l:'PDF',c:'var(--bad)',bg:'var(--bad-soft)'},docx:{l:'DOCX',c:'var(--info)',bg:'var(--info-soft)'},xlsx:{l:'XLSX',c:'var(--ok)',bg:'var(--ok-soft)'},jpg:{l:'ẢNH',c:'var(--warn)',bg:'var(--warn-soft)'},mp4:{l:'VIDEO',c:'var(--rust)',bg:'var(--rust-soft)'},mp3:{l:'AUDIO',c:'var(--river)',bg:'var(--river-soft)'},scan:{l:'SCAN',c:'var(--muted)',bg:'var(--surface-2)'}};
const GROUPS=[
 {id:'g1',name:'Hướng dẫn nghiệp vụ do phường xây dựng'},
 {id:'g2',name:'Cẩm nang, sổ tay và tài liệu tập huấn'},
 {id:'g3',name:'Quy trình phối hợp'},
 {id:'g4',name:'Kinh nghiệm xử lý công việc đặc thù'},
 {id:'g5',name:'Bộ tiêu chí, danh mục nhiệm vụ và sản phẩm'},
 {id:'g6',name:'Tài liệu quản trị'},
 {id:'g7',name:'Biểu mẫu và hệ thống chuyên ngành cấp trên'}
];
const GDESC={g1:'Hướng dẫn thực hiện từng lĩnh vực công việc do phường ban hành.',g2:'Tài liệu học tập, bồi dưỡng cho cán bộ mới và tập huấn định kỳ.',g3:'Trình tự phối hợp giữa các ban, phòng và khu phố.',g4:'Tình huống đã xử lý, cách làm hay được đúc kết để dùng lại.',g5:'Tiêu chí đánh giá, danh mục nhiệm vụ và sản phẩm đầu ra.',g6:'Kế hoạch, báo cáo, quyết định, biên bản phục vụ điều hành.',g7:'Biểu mẫu dùng chung, hướng dẫn hệ thống chuyên ngành của Thành phố.'};
const MEDIA_GROUPS=[{id:'tl',name:'Tư liệu ảnh, âm thanh, video'},{id:'hs',name:'Hồ sơ số hóa (bản scan)'},{id:'bt',name:'Bản thảo sách'}];
const groupName=id=>([...GROUPS,...MEDIA_GROUPS].find(g=>g.id===id)||{}).name||'';
const FTEMPL=[
 ['Hướng dẫn nghiệp vụ {t}','pdf','g1'],['Hướng dẫn thực hiện {t}','docx','g1'],
 ['Sổ tay {t}','pdf','g2'],['Tài liệu tập huấn {t}','docx','g2'],
 ['Quy trình phối hợp {t}','docx','g3'],['Sơ đồ phối hợp liên ngành {t}','pdf','g3'],
 ['Kinh nghiệm xử lý {t}','docx','g4'],
 ['Bộ tiêu chí {t}','xlsx','g5'],['Danh mục nhiệm vụ {t}','xlsx','g5'],
 ['Kế hoạch {t}','docx','g6'],['Báo cáo sơ kết {t}','docx','g6'],['Quyết định {t}','pdf','g6'],['Biên bản họp {t}','pdf','g6'],
 ['Biểu mẫu {t}','docx','g7'],['Hướng dẫn hệ thống chuyên ngành {t}','pdf','g7'],
 ['Ảnh tư liệu {t}','jpg','tl'],['Phim tư liệu {t}','mp4','tl'],['Ghi âm tọa đàm {t}','mp3','tl'],['Ảnh sự kiện {t}','jpg','tl'],
 ['Hồ sơ lưu trữ {t} (bản scan)','scan','hs'],['Bản thảo sách {t}','docx','bt']
];
const FTOP=['văn hóa đọc','chuyển đổi số','quý III/2026','Luật Đất đai','di tích Núi Trọc','lễ hội mùa xuân','chi bộ khu dân cư','an toàn giao thông','vệ sinh môi trường','cải cách hành chính','khu dân cư văn hóa','công tác dân vận','ẩm thực vùng biển','ngày hội đọc sách','kế hoạch năm 2027'];
const FSIZE={pdf:[0.3,8],docx:[0.05,3],xlsx:[0.05,2],jpg:[2,14],mp4:[80,900],mp3:[5,60],scan:[4,40]};
(function(){
  for(let i=0;i<264;i++){
    const tp=FTEMPL[Math.floor(rnd()*FTEMPL.length)],d=DEPTS[Math.floor(rnd()*DEPTS.length)],top=FTOP[Math.floor(rnd()*FTOP.length)];
    const [a,b]=FSIZE[tp[1]],mb=a+rnd()*(b-a);
    const day=1+Math.floor(rnd()*28),mon=1+Math.floor(rnd()*9);
    S.files.push({id:'f'+i,name:tp[0].replace('{t}',top)+'.'+(tp[1]==='scan'?'pdf':tp[1]),type:tp[1],group:tp[2],dept:d.id,mb,date:`${pad(day)}/${pad(mon)}/2026`,sort:mon*100+day,code:`CP.${d.code}.2026.${String(1000+i).slice(1)}`,ver:1+Math.floor(rnd()*3),status:'backed'});
  }
  S.files.sort((x,y)=>y.sort-x.sort);
})();

/* ---------- dept projects & plans ---------- */
const PROJ={
 vpdu:[{n:'Tủ sách điện tử và kho dữ liệu dùng chung',b:'Thuê dịch vụ',p:15,s:'Đang chuẩn bị',ms:'Khảo sát 10/2026'},{n:'Hợp nhất, số hóa hồ sơ lưu trữ của 5 phường cũ',b:'Chi thường xuyên',p:40,s:'Đang thực hiện',ms:'Hoàn thành 12/2026'}],
 xdd:[{n:'Biên soạn Lược sử Đảng bộ phường',b:'Chi thường xuyên',p:55,s:'Đang thực hiện',ms:'Bản thảo 11/2026'}],
 ubkt:[{n:'Chuẩn hóa hồ sơ kiểm tra, giám sát điện tử',b:'Không phát sinh',p:30,s:'Đang thực hiện',ms:'12/2026'}],
 mttq:[{n:'Cuộc vận động khu dân cư văn hóa, văn minh',b:'Xã hội hóa',p:70,s:'Đang thực hiện',ms:'Tổng kết 12/2026'}],
 vpub:[{n:'Chuyển đổi số quy trình văn bản nội bộ',b:'Chi thường xuyên',p:62,s:'Đang thực hiện',ms:'11/2026'},{n:'Lịch tiếp công dân trực tuyến',b:'Không phát sinh',p:100,s:'Hoàn thành',ms:'09/2026'}],
 kt:[{n:'Cải tạo vỉa hè, chiếu sáng tuyến đường nội phường',b:'Ngân sách phường',p:68,s:'Đang thực hiện',ms:'Nghiệm thu 12/2026'},{n:'Chỉnh trang tuyến phố ven biển',b:'Ngân sách phường',p:20,s:'Đang chuẩn bị',ms:'Khởi công Q1/2027'}],
 vhxh:[{n:'Phát triển văn hóa đọc tại khu phố',b:'Chi thường xuyên',p:48,s:'Đang thực hiện',ms:'10 điểm đọc 12/2026'},{n:'Số hóa tư liệu di tích trên địa bàn',b:'Chi thường xuyên',p:35,s:'Đang thực hiện',ms:'03/2027'}],
 hcc:[{n:'Hỗ trợ người dân nộp hồ sơ trực tuyến',b:'Không phát sinh',p:80,s:'Đang thực hiện',ms:'Duy trì'}]
};
const PLANS={
 vpdu:[['Năm','Kế hoạch công tác văn phòng năm 2026',72,'Nội bộ'],['Quý','Chương trình công tác quý IV/2026',10,'Nội bộ']],
 xdd:[['Năm','Kế hoạch học tập, quán triệt nghị quyết 2026',75,'Công khai'],['Tháng','Kế hoạch sinh hoạt chuyên đề tháng 10',0,'Nội bộ']],
 ubkt:[['Năm','Chương trình kiểm tra, giám sát năm 2026',70,'Nội bộ']],
 mttq:[['Quý','Kế hoạch giám sát, phản biện quý IV',5,'Nội bộ'],['Năm','Kế hoạch vận động quỹ vì người nghèo',64,'Công khai']],
 vpub:[['Tháng','Lịch công tác tháng 10/2026',0,'Công khai'],['Năm','Kế hoạch cải cách hành chính 2026',70,'Công khai']],
 kt:[['Năm','Kế hoạch đầu tư công năm 2026',66,'Công khai'],['Quý','Kế hoạch kiểm tra trật tự xây dựng quý IV',8,'Nội bộ']],
 vhxh:[['Năm','Kế hoạch phát triển văn hóa đọc 2026',58,'Công khai'],['Tháng','Ngày hội đọc sách tháng 10',30,'Công khai'],['Quý','Kế hoạch số hóa tư liệu quý IV',12,'Nội bộ']],
 hcc:[['Năm','Kế hoạch nâng cao chỉ số hài lòng 2026',77,'Công khai']]
};

/* global audit log */
S.log=[
 ['30/09/2026 09:12','Cán bộ biên soạn · VH–XH','Lưu nháp','HS-2026-0144'],
 ['30/09/2026 08:40','Cán bộ Văn phòng Đảng ủy','Gửi duyệt','HS-2026-0142'],
 ['30/09/2026 07:55','Lãnh đạo phụ trách ban','Duyệt, chuyển Văn phòng','HS-2026-0143'],
 ['30/09/2026 02:00','Hệ thống','Sao lưu hằng đêm lên cloud: 12,6 TB, 30 phiên bản','NAS-CP-01'],
 ['28/09/2026 17:22','Văn phòng HĐND và UBND','Tải lên 14 tệp','Kho dùng chung'],
 ['28/09/2026 16:05','Lãnh đạo phụ trách ban','Duyệt, chuyển Văn phòng','HS-2026-0139'],
 ['28/09/2026 15:10','Phòng Kinh tế, HT và ĐT','Cập nhật tiến độ dự án 68%','Cải tạo vỉa hè'],
 ['27/09/2026 14:30','Lãnh đạo phụ trách ban','Trả lại chỉnh sửa','HS-2026-0131'],
 ['27/09/2026 10:02','Quản trị hệ thống','Cấp tài khoản phòng ban','pvhcc.campha']
].map(r=>({time:r[0],by:r[1],act:r[2],obj:r[3]}));
function audit(act,obj){S.log.unshift({time:nowStr(),by:ROLES[S.role].short,act,obj})}

/* ---------- visuals ---------- */
function trussPath(w,h,spans){
  let d='';const sw=w/spans,base=h*.92;
  for(let s=0;s<spans;s++){
    const x0=s*sw,x1=x0+sw,top=x=>{const u=(x-x0)/sw;return h*.12+ (h*.55)*Math.pow(2*u-1,2)};
    d+=`M${x0} ${base}H${x1}`;
    let p=`M${x0} ${top(x0)}`;for(let k=1;k<=20;k++){const x=x0+sw*k/20;p+=` L${x.toFixed(1)} ${top(x).toFixed(1)}`}d+=p;
    const n=10;for(let k=0;k<=n;k++){const x=x0+sw*k/n;d+=`M${x.toFixed(1)} ${base}V${top(x).toFixed(1)}`;if(k<n){const xn=x0+sw*(k+1)/n;d+= k%2?`M${x.toFixed(1)} ${base}L${xn.toFixed(1)} ${top(xn).toFixed(1)}`:`M${x.toFixed(1)} ${top(x).toFixed(1)}L${xn.toFixed(1)} ${base}`}}
  }
  return d;
}
function headframe(x,y,s,col){return `<g transform="translate(${x},${y}) scale(${s})" fill="none" stroke="${col}" stroke-width="3"><path d="M-30 0 L-8 -120 L8 -120 L30 0"/><path d="M-22 -40 H22 M-16 -75 H16 M-26 -20 L20 -60 M26 -20 L-20 -60"/><circle cx="0" cy="-124" r="13"/><path d="M8 -120 L64 0"/></g>`}
function wavesPath(w,h,n){let d='';for(let k=0;k<3;k++){const y=h*(.35+k*.22);d+=`M0 ${y}`;for(let i=0;i<n;i++){const x=w*i/n,x2=w*(i+1)/n;d+=` Q${x+(x2-x)/4} ${y-10+k*2} ${(x+x2)/2} ${y} T${x2} ${y}`}}return d}
function trussSvg(){return `<svg viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true"><path d="${trussPath(1200,120,5)}" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`}
function scene(kind,seed){
  const r=rng(seed||7),hue=['var(--river)','var(--rust)','var(--warn)'][Math.floor(r()*3)];
  const hills=`<path d="M0 150 Q80 ${110+r()*20} 160 140 T320 ${130+r()*15} T480 140 V240 H0Z" style="fill:var(--river);opacity:.25"/>`;
  const water=`<rect x="0" y="170" width="480" height="70" style="fill:var(--river);opacity:.35"/><path d="M20 190h60M140 205h80M300 188h70M380 212h50" style="stroke:var(--surface);opacity:.6" stroke-width="2"/>`;
  let fg='';
  if(kind==='bridge')fg=`${headframe(300,170,.95,"var(--rust)")}<g><rect x="120" y="140" width="80" height="30" style="fill:var(--rust);opacity:.7"/></g>`;
  else if(kind==='temple')fg=`<g><rect x="170" y="112" width="140" height="58" style="fill:var(--warn);opacity:.55"/><path d="M150 116 Q240 70 330 116 L310 104 Q240 66 170 104Z" style="fill:var(--rust)"/><path d="M185 96 Q240 60 295 96 L280 88 Q240 58 200 88Z" style="fill:var(--rust);opacity:.85"/><rect x="226" y="136" width="28" height="34" style="fill:var(--ink);opacity:.6"/></g>`;
  else if(kind==='food')fg=`<g><ellipse cx="240" cy="160" rx="110" ry="26" style="fill:var(--surface);opacity:.9"/><ellipse cx="240" cy="152" rx="82" ry="18" style="fill:var(--warn);opacity:.7"/><circle cx="210" cy="146" r="10" style="fill:var(--ok)"/><circle cx="262" cy="148" r="12" style="fill:var(--rust);opacity:.8"/></g>`;
  else fg=`<g>${[0,1,2,3,4].map(i=>`<rect x="${70+i*72}" y="${100-(i%3)*18}" width="50" height="${70+(i%3)*18}" style="fill:${hue};opacity:${.35+i*.1}"/>`).join('')}</g>`;
  return `<svg viewBox="0 0 480 240" role="img" aria-label="Hình minh họa"><rect width="480" height="240" style="fill:var(--river-soft)"/><circle cx="${380+r()*40}" cy="56" r="22" style="fill:var(--warn);opacity:.5"/>${hills}${water}${fg}</svg>`;
}
function sceneFor(b,i){return scene(b.shelf==='ditich'?(i%2?'bridge':'temple'):b.shelf==='amthuc'?'food':b.shelf==='dang'?'bridge':'city',(b.id.length*31+i*7+b.title.length))}
function coverHtml(b,cls=''){const sh=shelfOf(b);return `<div class="cover ${cls}" style="--c:${sh.color};--img:url(${b.art||sh.img})">${b.isNew?'<span class="new-dot">MỚI</span>':''}</div>`}
function statusPill(s){const m={draft:'Bản nháp',lead:'Chờ lãnh đạo ban duyệt',office:'Văn phòng kiểm tra',published:'Đã công khai',returned:'Trả lại chỉnh sửa'};return `<span class="pill p-${s}">${m[s]}</span>`}
function ficon(t){const f=FTYPES[t];return `<span class="ficon" style="color:${f.c};background:${f.bg}">${f.l}</span>`}
function fsize(mb){return mb>=1024?(mb/1024).toFixed(2).replace('.',',')+' GB':mb>=1?mb.toFixed(1).replace('.',',')+' MB':Math.round(mb*1024)+' KB'}

/* ---------- navigation ---------- */
function allowed(item){return item.roles==='*'||(item.roles||'').split(' ').includes(S.role)}
function pendingForMe(){const r=S.role;return S.subs.filter(s=>(r==='editor'&&(s.status==='returned'||s.status==='draft')&&s.dept==='vhxh')||(r==='lead'&&s.status==='lead')||(r==='office'&&s.status==='office')).length}
const INTERNAL=['kho','compose','workflow','archive','depts','dashboard','log','admin','migrate','security'];
const SNAV=[['Công việc',['kho','compose','workflow','depts']],['Dữ liệu',['archive','migrate']],['Điều hành',['dashboard','log']],['Quản trị',['admin','security']]];
const VIEW_NEW={kho:'Kho tài liệu không công khai: đăng nhập tài khoản phòng ban, phân quyền, tìm kiếm, thêm tài liệu theo 7 nhóm.',compose:'Tải bản thảo Word, ảnh giữ đúng vị trí, chèn video tại chỗ, xem trước như người đọc.',workflow:'Hai lần duyệt: lãnh đạo ban và Văn phòng; lưu mọi phiên bản và bản thảo gốc.',archive:'Kho dùng chung trên NAS tại trụ sở, sao lưu hằng đêm lên cloud trong nước.',depts:'Mỗi phòng ban một tài khoản, mục riêng đăng dự án và kế hoạch.',dashboard:'Lãnh đạo theo dõi lượt đọc, bài chờ duyệt, tiến độ dự án trên một màn hình.',log:'Lưu vết mọi thao tác, phục vụ kiểm tra và hồ sơ an toàn thông tin.',admin:'Tài khoản phòng ban, xác thực 2 lớp, phân quyền theo vai trò.',migrate:'Hợp nhất hồ sơ của 5 phường cũ vào một kho, có mã hồ sơ, tìm theo từ khóa.',security:'Dữ liệu đặt trong nước, tên miền cơ quan, ISO/IEC 27001:2022.'};
const PAGE_HREF={home:'index.html',shelves:'thu-vien.html',news:'ban-tin.html',links:'van-ban.html',kho:'kho-nghiep-vu.html',compose:'soan-thao.html',workflow:'phe-duyet.html',archive:'kho-luu-tru.html',depts:'phong-ban.html',dashboard:'dieu-hanh.html',log:'nhat-ky.html',admin:'tai-khoan.html',migrate:'so-hoa.html',security:'an-toan-thong-tin.html'};
const pageHref=id=>document.body.dataset.crmView?(PAGE_HREF[id]||`#${id}`):`#${id}`;
const nb=t=>`<span class="newb" tabindex="0" data-tip="${esc(t)}" aria-label="Chú giải">i</span>`;
const navT=id=>(NAV.find(n=>n.id===id)||{}).t||'';
function firstInternal(){return S.role==='chief'?'dashboard':S.role==='editor'?'compose':'workflow'}
function renderNav(){
  const internal=INTERNAL.includes(S.view);
  document.body.classList.toggle('internal',internal);
  document.body.classList.toggle('shownew',!!S.showNew);
  document.querySelectorAll('.newtog').forEach(b=>b.setAttribute('aria-pressed',S.showNew?'true':'false'));
  $('#nav').innerHTML=['home','shelves','news','links'].map(id=>`<a class="${S.view===id?'on':''}" onclick="go('${id}')" href="${pageHref(id)}">${navT(id)}</a>`).join('')+(S.role!=='public'?`<a class="to-sys" onclick="go(firstInternal())" href="${pageHref(firstInternal())}">Vào hệ thống nghiệp vụ →${nb('Khu làm việc riêng cho cán bộ: soạn, duyệt, kho, phòng ban, điều hành.')}</a>`:'');
  const pend=pendingForMe(),r=ROLES[S.role];
  $('#snav').innerHTML=`<div class="sn-brand" onclick="go('home')"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMTI4IiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCI+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjU0IiByPSI0NCIgZmlsbD0iI0YwOEE1RCIvPgo8cGF0aCBkPSJNNDIgNzAgTDYyIDM4IEw3NCA1MiBMOTIgMjIgTDExMiA1MCBMMTI2IDM0IEwxNTAgNzBaIiBmaWxsPSIjMEI0RjU3Ii8+CjxnIHN0cm9rZT0iI0ZCRjZFQyIgc3Ryb2tlLXdpZHRoPSIyLjQiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik04NiA3MCBMOTYgMzAgTDEwNCAzMCBMMTE0IDcwIE05MCA1NiBIMTEwIE05MiA0NCBIMTA4Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMjciIHI9IjYiLz48L2c+CjxwYXRoIGQ9Ik0zNCA3MiBxMTEgLTcgMjIgMCB0MjIgMCB0MjIgMCB0MjIgMCB0MjIgMCB0MjIgMCIgc3Ryb2tlPSIjMUY3QThDIiBzdHJva2Utd2lkdGg9IjUiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNNDQgODIgcTExIC02IDIyIDAgdDIyIDAgdDIyIDAgdDIyIDAgdDIyIDAiIHN0cm9rZT0iIzFGN0E4QyIgc3Ryb2tlLXdpZHRoPSIzLjUiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgb3BhY2l0eT0iLjciLz4KPHRleHQgeD0iMTAwIiB5PSIxMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSInQmUgVmlldG5hbSBQcm8nLCdTZWdvZSBVSScsQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMSIgZm9udC13ZWlnaHQ9IjgwMCIgbGV0dGVyLXNwYWNpbmc9IjEuNSIgZmlsbD0iIzBCNEY1NyI+Q+G6qE0gUEjhuqI8L3RleHQ+Cjwvc3ZnPg==" alt=""><div><b>Tủ sách Cẩm Phả</b><span>Hệ thống nghiệp vụ</span></div></div>
    ${SNAV.map(([g,ids])=>{const its=ids.filter(id=>allowed(NAV.find(n=>n.id===id)));return its.length?`<div class="sn-g">${g}</div>`+its.map(id=>`<a class="${S.view===id?'on':''}" onclick="go('${id}')" href="${pageHref(id)}">${navT(id)}${id==='workflow'&&pend?`<span class="cnt">${pend}</span>`:''}</a>`).join(''):''}).join('')}
    <a class="sn-pub" onclick="go('home')" href="${pageHref('home')}">← Cổng Tủ sách công khai</a>
    <div class="sn-foot">Vận hành bởi VHMT · ISO/IEC 27001:2022</div>`;
  const ini=(r.short.match(/\S+/g)||[]).slice(0,2).map(w=>w[0]).join('').toUpperCase();
  $('#ibar').innerHTML=`<div class="ib-t"><span class="eyebrow">Hệ thống nghiệp vụ</span><b>${navT(S.view)}</b>${internal&&VIEW_NEW[S.view]?nb(VIEW_NEW[S.view]):''}</div>
    <div class="ib-r"><button class="btn sm newtog" onclick="toggleNew()" aria-pressed="${S.showNew?'true':'false'}" aria-label="Bật hoặc tắt chú giải chức năng" title="Bật hoặc tắt chú giải chức năng"><span class="sw" aria-hidden="true"></span>Chú giải chức năng</button>
    <button class="bell" onclick="go('workflow')" aria-label="Việc cần xử lý: ${pend}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 004 0"/></svg>${pend?`<span>${pend}</span>`:''}</button>
    <div class="me"><span class="av">${ini}</span><span><b>${r.short}</b><small>${r.dept?deptName(r.dept):r.label.split('·').pop().trim()}</small></span></div>
    <select id="role2" onchange="setRole(this.value)" aria-label="Đổi vai trò (trình diễn)">${Object.entries(ROLES).map(([k,v])=>`<option value="${k}" ${k===S.role?'selected':''}>${v.short}</option>`).join('')}</select></div>`;
}
function toggleNew(){S.showNew=!S.showNew;renderNav();toast(S.showNew?'Đang bật chú giải. Rê chuột vào nhãn “i” để xem chức năng mang lại gì.':'Đã tắt chú giải')}
function setRole(r){
  stopSpeak();S.role=r;$('#role').value=r;
  const it=NAV.find(n=>n.id===S.view);if(!it||!allowed(it))S.view=r==='public'?'home':firstInternal();
  toast('Đang xem với vai trò: '+ROLES[r].label);render();
}
function go(v,opt){
  event&&event.preventDefault&&event.preventDefault();
  if(document.body.dataset.crmView){
    const pages={home:'index.html',shelves:'thu-vien.html',news:'ban-tin.html',links:'van-ban.html',kho:'kho-nghiep-vu.html',compose:'soan-thao.html',workflow:'phe-duyet.html',archive:'kho-luu-tru.html',depts:'phong-ban.html',dashboard:'dieu-hanh.html',log:'nhat-ky.html',admin:'tai-khoan.html',migrate:'so-hoa.html',security:'an-toan-thong-tin.html'};
    if(pages[v]){location.href=pages[v];return;}
  }
  S.view=v;if(opt)Object.assign(S,opt);if(v==='shelves'&&!(opt&&'shelf' in opt))S.shelf=null;render();window.scrollTo({top:0})
}
function render(){renderNav();const f=VIEWS[S.view]||VIEWS.home;$('#main').innerHTML=f();afterRender()}
function afterRender(){document.querySelectorAll('canvas[data-qr]').forEach(drawQR)}
const demoFlag=t=>`<div class="demo-flag"><span class="tag rust">Bản trình diễn</span><span>${t}</span></div>`;

/* ---------- views ---------- */
const VIEWS={};
const IC={"search": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"M20 20l-4-4\"/></svg>", "book": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linejoin=\"round\"><path d=\"M3 5.5C5.5 4.5 8.5 4.5 12 6.5c3.5-2 6.5-2 9-1V19c-2.5-1-5.5-1-9 1-3.5-2-6.5-2-9-1z\"/><path d=\"M12 6.5V20M6 9h3M6 12h3M15 9h3M15 12h3\"/></svg>", "shield": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linejoin=\"round\"><path d=\"M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z\"/><path d=\"M8.5 12l2.5 2.5 4.5-5\"/></svg>", "qr": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\"><rect x=\"3.5\" y=\"3.5\" width=\"6\" height=\"6\" rx=\"1\"/><rect x=\"14.5\" y=\"3.5\" width=\"6\" height=\"6\" rx=\"1\"/><rect x=\"3.5\" y=\"14.5\" width=\"6\" height=\"6\" rx=\"1\"/><path d=\"M14.5 14.5h2v2h-2zM18.5 14.5h2M14.5 18.5v2h2M18.5 18.5h2v2\"/></svg>", "hist": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\"><path d=\"M4 20V9l4-3 4 3v11M12 20V5l4-2 4 2v15M3 20h18M7 12h2M7 15h2M15 8h2M15 11h2M15 14h2\"/></svg>", "spark": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linejoin=\"round\"><path d=\"M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z\"/></svg>", "people": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\"><circle cx=\"12\" cy=\"8\" r=\"3\"/><circle cx=\"5\" cy=\"10\" r=\"2.2\"/><circle cx=\"19\" cy=\"10\" r=\"2.2\"/><path d=\"M6.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5M1.5 18c0-2 1.5-3.5 3.5-3.5M22.5 18c0-2-1.5-3.5-3.5-3.5\"/></svg>", "pin": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><path d=\"M12 21s-7-6.2-7-12a7 7 0 0114 0c0 5.8-7 12-7 12z\"/><circle cx=\"12\" cy=\"9\" r=\"2.5\"/></svg>", "doc": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linejoin=\"round\"><path d=\"M7 3h7l4 4v14H7z\"/><path d=\"M14 3v4h4M10 12h5M10 15h5M10 18h3\"/><path d=\"M4 7v14h2\"/></svg>"};
VIEWS.home=()=>{
  const pill=(ic,t,sh)=>`<button class="gpill" onclick="go('shelves',{shelf:'${sh}'})">${IC[ic]}${t}</button>`;
  const latest=[...S.books].filter(b=>b.isNew).concat(S.books.filter(b=>['Ngọn lửa 12/11/1936','Ký ức thợ mỏ','Sổ tay tuyên truyền Luật Đất đai 2024'].includes(b.title))).slice(0,3);
  return `
  <section class="cp-hero">
    <div class="cp-hero-tx">
      <span class="cp-kicker">Tủ sách điện tử · Phường Cẩm Phả</span>
      <h1>Tri thức <em>đất mỏ</em>,<br>hồn cốt biển xanh</h1>
      <p>Kho sách điện tử về lịch sử, truyền thống vùng mỏ, văn hóa và đời sống phường Cẩm Phả – kết nối quá khứ, hiểu hiện tại, kiến tạo tương lai.</p>
      <form class="hero-search" onsubmit="event.preventDefault();doSearch(document.getElementById('q-hero').value)">
        ${IC.search}<input id="q-hero" type="search" placeholder="Tìm tên sách, di tích, chủ đề…" aria-label="Tìm trong Tủ sách">
        <button class="go" type="submit" aria-label="Tìm kiếm">${IC.search}<span>Tìm kiếm</span></button>
      </form>
      <div class="hero-pills">${pill('hist','Lịch sử','dang')}${pill('spark','Văn hóa','vanhoa')}${pill('people','Tổ chức','tochuc')}${pill('pin','Địa phương','diaphuong')}${pill('doc','Ẩm thực','amthuc')}</div>
    </div>
    <div class="cp-hero-art" aria-hidden="true">
      <svg class="cp-local-art cp-flat-scene" viewBox="0 0 720 430" role="img" aria-label="Cẩm Phả với vịnh Bái Tử Long, núi đá ven biển và dấu ấn mỏ than" preserveAspectRatio="xMidYMid slice">
        <rect width="720" height="430" fill="#fbf7ef"/>
        <path d="M0 230 84 160l52 44 74-96 72 80 74-116 62 98 78-70 124 112v88H0Z" fill="#ddd0bc"/>
        <path d="M0 276c90-27 156-26 238 0s143 28 222 2 164-31 260-2v154H0Z" fill="#d9c6a5"/>
        <path d="M0 312c98-18 164-13 251 9s151 18 239-8 153-28 230-10v127H0Z" fill="#173c5e"/>
        <path d="M0 346c100-13 180-8 264 10s157 12 236-11 143-25 220-13v98H0Z" fill="#0b2a4a" opacity=".82"/>
        <g fill="none" stroke="#a97b35" stroke-width="5" stroke-linecap="square">
          <path d="M500 324V196m0 0 74 128m-74-128-74 128m37-64h74m-94 38h114"/>
          <path d="M594 335h92M611 335v-44m60 44v-44M611 291h60"/>
        </g>
        <g fill="#a64d2c">
          <rect x="389" y="323" width="44" height="27"/>
          <rect x="443" y="318" width="31" height="32"/>
          <rect x="480" y="326" width="27" height="24"/>
        </g>
        <path d="M0 365h720" stroke="#d9c6a5" stroke-width="3"/>
      </svg>
      <div class="cp-rail">${[1,3,0,4,5].map(k=>{const sh=SHELVES[k];return `<button tabindex="-1" onclick="go('shelves',{shelf:'${sh.id}'})"><img src="${sh.img}" alt=""></button>`}).join('')}</div>
      <div class="chip c1"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgMjgwIiB3aWR0aD0iMjQwIiBoZWlnaHQ9IjI4MCI+PHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIyODAiIGZpbGw9IiNGM0U2RDYiLz48cmVjdCB4PSIwIiB5PSI4MCIgd2lkdGg9IjI0MCIgaGVpZ2h0PSI0IiBmaWxsPSIjQjc5Qjc0Ii8+PHJlY3QgeD0iMTIiIHk9IjMwIiB3aWR0aD0iMTIiIGhlaWdodD0iNTAiIGZpbGw9IiM4RTNCMjIiIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iMzAiIHk9IjM0IiB3aWR0aD0iMTIiIGhlaWdodD0iNDYiIGZpbGw9IiMwQjRGNTciIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iNDgiIHk9IjM4IiB3aWR0aD0iMTIiIGhlaWdodD0iNDIiIGZpbGw9IiMyRjVBM0UiIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iNjYiIHk9IjMwIiB3aWR0aD0iMTIiIGhlaWdodD0iNTAiIGZpbGw9IiNCMDdBMkEiIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iODQiIHk9IjM0IiB3aWR0aD0iMTIiIGhlaWdodD0iNDYiIGZpbGw9IiMwQjRGNTciIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iMTAyIiB5PSIzOCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjQyIiBmaWxsPSIjOEUzQjIyIiBvcGFjaXR5PSIuNyIvPjxyZWN0IHg9IjEyMCIgeT0iMzAiIHdpZHRoPSIxMiIgaGVpZ2h0PSI1MCIgZmlsbD0iIzJFNkI2RSIgb3BhY2l0eT0iLjciLz48cmVjdCB4PSIxMzgiIHk9IjM0IiB3aWR0aD0iMTIiIGhlaWdodD0iNDYiIGZpbGw9IiNCMDdBMkEiIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iMTU2IiB5PSIzOCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjQyIiBmaWxsPSIjOEUzQjIyIiBvcGFjaXR5PSIuNyIvPjxyZWN0IHg9IjE3NCIgeT0iMzAiIHdpZHRoPSIxMiIgaGVpZ2h0PSI1MCIgZmlsbD0iIzBCNEY1NyIgb3BhY2l0eT0iLjciLz48cmVjdCB4PSIxOTIiIHk9IjM0IiB3aWR0aD0iMTIiIGhlaWdodD0iNDYiIGZpbGw9IiMyRjVBM0UiIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iMjEwIiB5PSIzOCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjQyIiBmaWxsPSIjQjA3QTJBIiBvcGFjaXR5PSIuNyIvPjxyZWN0IHg9IjIyOCIgeT0iMzAiIHdpZHRoPSIxMiIgaGVpZ2h0PSI1MCIgZmlsbD0iIzBCNEY1NyIgb3BhY2l0eT0iLjciLz48cmVjdCB4PSIyNDYiIHk9IjM0IiB3aWR0aD0iMTIiIGhlaWdodD0iNDYiIGZpbGw9IiMyRTZCNkUiIG9wYWNpdHk9Ii43Ii8+PHBhdGggZD0iTTc4IDEyMCBRNzYgMjUwIDk2IDI1MCBMMTQ0IDI1MCBRMTY0IDI1MCAxNjIgMTIwWiIgZmlsbD0iIzFFMUIxQSIvPjxyZWN0IHg9IjEwOCIgeT0iMTYwIiB3aWR0aD0iMjQiIGhlaWdodD0iMzAiIGZpbGw9IiNGMUM5QTUiLz48ZWxsaXBzZSBjeD0iMTIwIiBjeT0iMTMwIiByeD0iMzYiIHJ5PSI0MyIgZmlsbD0iI0YxQzlBNSIvPjxwYXRoIGQ9Ik04MiAxMjggUTg0IDg0IDEyMCA4NCBRMTU4IDg0IDE1OCAxMjggUTE0NiA5OCAxMTIgMTA0IFE5MiAxMTAgODIgMTI4WiIgZmlsbD0iIzFFMUIxQSIvPjxjaXJjbGUgY3g9IjEwNyIgY3k9IjEzMyIgcj0iMyIgZmlsbD0iIzJCMkIyQiIvPjxjaXJjbGUgY3g9IjEzMyIgY3k9IjEzMyIgcj0iMyIgZmlsbD0iIzJCMkIyQiIvPjxwYXRoIGQ9Ik0xMTEgMTUyIFExMjAgMTU5IDEyOSAxNTIiIHN0cm9rZT0iI0IwNDUzQSIgc3Ryb2tlLXdpZHRoPSIyLjUiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik00NCAyODAgUTQ2IDIwMiAxMjAgMTk2IFExOTQgMjAyIDE5NiAyODBaIiBmaWxsPSIjRjdGMUU2Ii8+PHBhdGggZD0iTTEwNCAxOTYgUTEyMCAyMTQgMTM2IDE5NiIgc3Ryb2tlPSIjMEI0RjU3IiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTUwIDIyNiBxMTAgMjAgLTIgNDAgTTE1NCAyMzYgcTggNCAxMiAtMiIgc3Ryb2tlPSIjOEUzQjIyIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSIxNjIiIGN5PSIyMzIiIHI9IjQiIGZpbGw9IiNDMDM5MkIiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNzYsMTYwKSI+PGNpcmNsZSByPSIyMCIgZmlsbD0iI0YwOEE1RCIvPjxwYXRoIGQ9Ik0tOCAtMiB2NiBNLTMgLTcgdjE2IE0yIC00IHYxMCBNNyAtOSB2MjAiIHN0cm9rZT0iIzBCNEY1NyIgc3Ryb2tlLXdpZHRoPSIyLjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvZz48L3N2Zz4=" alt=""><span><b>Hải An đang đọc</b><small>Sổ tay tuyên truyền Luật Đất đai 2024</small></span><i class="eq"><i></i><i></i><i></i><i></i></i></div>
      <div class="chip c2">${nb("Mọi bài trên Tủ sách đều đã qua lãnh đạo ban và Văn phòng duyệt.")}<span class="dot"></span><span><b>Đã duyệt, công khai</b><small>Văn phòng Đảng ủy · hôm nay</small></span></div>
    </div>
  </section>

  <section class="grid" style="gap:22px">
    <div class="sec-head"><div><span class="eyebrow">Sáu kệ sách chính</span><h2 style="margin-top:6px">Mỗi kệ là một đầu mục tổng</h2><p class="muted" style="margin-top:6px">Bấm vào bìa để mở các cuốn sách nhỏ có bìa và trình đọc riêng.</p></div><button class="btn" onclick="go('shelves')">Xem toàn bộ Tủ sách →</button></div>
    <div class="cp-shelves">${SHELVES.map((sh,k)=>{const n=S.books.filter(b=>b.shelf===sh.id).length;return `<button class="cp-shelf" style="--c:${sh.color}" onclick="go('shelves',{shelf:'${sh.id}'})"><img src="${sh.img}" alt="Bìa kệ ${sh.name}"><span style="min-width:0"><span class="no">KỆ ${String(k+1).padStart(2,'0')}</span><b>${sh.name}</b><small>${sh.desc}</small><span class="ft">${n} cuốn sách<i>Mở kệ →</i></span></span></button>`}).join('')}</div>
  </section>

  <section class="features">
    <div class="feat"><span class="ic">${IC.search}</span><div><b>Dễ tìm kiếm</b><span>Tìm cả tên kệ, sách con và tài liệu</span></div></div>
    <div class="feat"><span class="ic">${IC.book}</span><div><b>Kệ sách nhiều tầng</b><span>Bìa lớn mở ra các cuốn sách nhỏ</span></div></div>
    <div class="feat"><span class="ic">${IC.shield}</span><div><b>Nội dung tin cậy</b><span>Gắn nguồn và duyệt trước khi công khai</span></div></div>
    <div class="feat"><span class="ic">${IC.qr}</span><div><b>Một đường link</b><span>Tự thích ứng máy tính và điện thoại</span></div></div>
  </section>

  <section class="panel">
    <div class="grid" style="gap:12px"><span class="eyebrow">Tổng quan</span><h2>Tri thức địa phương được sắp xếp thành kệ và sách con</h2><p>Các ban tự biên soạn, lãnh đạo phụ trách duyệt, Văn phòng công khai. Dữ liệu lưu trên kho dùng chung của phường, sao lưu hằng đêm lên cloud trong nước.</p></div>
    <div class="boxes">
      <div class="bx"><b>06</b><span>Kệ sách chính</span></div>
      <div class="bx"><b>${S.books.length}</b><span>Sách và chuyên đề</span></div>
      <div class="bx"><b>${S.news.length}</b><span>Bản tin đã đăng</span></div>
      <div class="bx"><b>18.742</b><span>Tài liệu trong kho dùng chung</span></div>
    </div>
  </section>

  <section class="grid" style="gap:18px">
    <div class="sec-head"><div><span class="eyebrow">Nội dung mới cập nhật</span><h2 style="margin-top:6px">Những đầu sách vừa được bổ sung</h2></div><button class="btn" onclick="go('shelves')">Xem các kệ sách →</button></div>
    <div class="upd">${latest.map(b=>{const sh=shelfOf(b);return `<button onclick="openBook('${b.id}')"><span class="ti" style="background-image:url(${sh.img})"></span><span style="min-width:0"><span class="k">${sh.name}</span><b>${esc(b.title)}</b><span class="small muted">${b.flags.includes('audio')?'Có giọng đọc AI · ':''}${esc(b.sub)}</span></span><span class="arr">→</span></button>`}).join('')}</div>
  </section>

  <section class="grid" style="gap:18px">
    <div class="sec-head"><div><span class="eyebrow">Bản tin</span><h2 style="margin-top:6px">Tin mới từ phường ${nb("Bản tin do các ban tự đăng qua quy trình duyệt, không cần người quản trị kỹ thuật.")}</h2></div><button class="btn" onclick="go('news')">Tất cả bản tin →</button></div>
    <div class="card" style="padding-block:4px">${S.news.slice(0,4).map(newsRow).join('')}</div>
  </section>

  <section class="grid" style="gap:18px">
    <div class="sec-head"><div><span class="eyebrow">Người đọc AI Cẩm Phả</span><h2 style="margin-top:6px">Nghe sách theo cách gần gũi hơn ${nb("Giọng đọc chạy trên máy chủ, đọc giống nhau trên mọi thiết bị; hỏi đáp dựa trên nội dung đã duyệt.")}</h2><p class="muted" style="margin-top:6px">Hai nhân vật đã được duyệt đồng hành cùng người đọc, đọc thống nhất trên máy tính và điện thoại.</p></div><button class="btn primary" onclick="openBook(lawBook().id)">Nghe thử Sổ tay Luật Đất đai</button></div>
    <div class="readers">
      <div class="reader-card"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgMjgwIiB3aWR0aD0iMjQwIiBoZWlnaHQ9IjI4MCI+PHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIyODAiIGZpbGw9IiNEQ0U4RUUiLz48cmVjdCB4PSIwIiB5PSI4MCIgd2lkdGg9IjI0MCIgaGVpZ2h0PSI0IiBmaWxsPSIjQjc5Qjc0Ii8+PHJlY3QgeD0iMTIiIHk9IjMwIiB3aWR0aD0iMTIiIGhlaWdodD0iNTAiIGZpbGw9IiM4RTNCMjIiIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iMzAiIHk9IjM0IiB3aWR0aD0iMTIiIGhlaWdodD0iNDYiIGZpbGw9IiMwQjRGNTciIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iNDgiIHk9IjM4IiB3aWR0aD0iMTIiIGhlaWdodD0iNDIiIGZpbGw9IiMyRjVBM0UiIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iNjYiIHk9IjMwIiB3aWR0aD0iMTIiIGhlaWdodD0iNTAiIGZpbGw9IiNCMDdBMkEiIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iODQiIHk9IjM0IiB3aWR0aD0iMTIiIGhlaWdodD0iNDYiIGZpbGw9IiMwQjRGNTciIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iMTAyIiB5PSIzOCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjQyIiBmaWxsPSIjOEUzQjIyIiBvcGFjaXR5PSIuNyIvPjxyZWN0IHg9IjEyMCIgeT0iMzAiIHdpZHRoPSIxMiIgaGVpZ2h0PSI1MCIgZmlsbD0iIzJFNkI2RSIgb3BhY2l0eT0iLjciLz48cmVjdCB4PSIxMzgiIHk9IjM0IiB3aWR0aD0iMTIiIGhlaWdodD0iNDYiIGZpbGw9IiNCMDdBMkEiIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iMTU2IiB5PSIzOCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjQyIiBmaWxsPSIjOEUzQjIyIiBvcGFjaXR5PSIuNyIvPjxyZWN0IHg9IjE3NCIgeT0iMzAiIHdpZHRoPSIxMiIgaGVpZ2h0PSI1MCIgZmlsbD0iIzBCNEY1NyIgb3BhY2l0eT0iLjciLz48cmVjdCB4PSIxOTIiIHk9IjM0IiB3aWR0aD0iMTIiIGhlaWdodD0iNDYiIGZpbGw9IiMyRjVBM0UiIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iMjEwIiB5PSIzOCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjQyIiBmaWxsPSIjQjA3QTJBIiBvcGFjaXR5PSIuNyIvPjxyZWN0IHg9IjIyOCIgeT0iMzAiIHdpZHRoPSIxMiIgaGVpZ2h0PSI1MCIgZmlsbD0iIzBCNEY1NyIgb3BhY2l0eT0iLjciLz48cmVjdCB4PSIyNDYiIHk9IjM0IiB3aWR0aD0iMTIiIGhlaWdodD0iNDYiIGZpbGw9IiMyRTZCNkUiIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iMTA4IiB5PSIxNjAiIHdpZHRoPSIyNCIgaGVpZ2h0PSIzMCIgZmlsbD0iI0YxQzlBNSIvPjxlbGxpcHNlIGN4PSIxMjAiIGN5PSIxMzAiIHJ4PSIzOCIgcnk9IjQ0IiBmaWxsPSIjRjFDOUE1Ii8+PHBhdGggZD0iTTgyIDEyNiBRODAgODQgMTIwIDgyIFExNjIgODQgMTU4IDEyNiBRMTUwIDEwMCAxMjAgMTAyIFE5MiAxMDAgODIgMTI2WiIgZmlsbD0iIzFFMUIxQSIvPjxjaXJjbGUgY3g9IjEwNiIgY3k9IjEzMiIgcj0iMy4yIiBmaWxsPSIjMkIyQjJCIi8+PGNpcmNsZSBjeD0iMTM0IiBjeT0iMTMyIiByPSIzLjIiIGZpbGw9IiMyQjJCMkIiLz48cGF0aCBkPSJNMTEwIDE1MiBRMTIwIDE2MCAxMzAgMTUyIiBzdHJva2U9IiM4QjRBM0EiIHN0cm9rZS13aWR0aD0iMi41IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNNDAgMjgwIFE0MCAyMDAgMTIwIDE5NiBRMjAwIDIwMCAyMDAgMjgwWiIgZmlsbD0iIzBCNEY1NyIvPjxwYXRoIGQ9Ik0xMDQgMTk4IEwxMjAgMjM4IEwxMzYgMTk4WiIgZmlsbD0iI0RDRThGNSIvPjxwYXRoIGQ9Ik0xMTYgMjA2IEwxMjAgMjUwIEwxMjQgMjA2WiIgZmlsbD0iIzhFM0IyMiIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE3NiwxNjApIj48Y2lyY2xlIHI9IjIwIiBmaWxsPSIjRjA4QTVEIi8+PHBhdGggZD0iTS04IC0yIHY2IE0tMyAtNyB2MTYgTTIgLTQgdjEwIE03IC05IHYyMCIgc3Ryb2tlPSIjMEI0RjU3IiBzdHJva2Utd2lkdGg9IjIuNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9nPjwvc3ZnPg==" alt="Nhân vật người đọc AI giọng nam"><div class="tx"><span class="tag river">Giọng nam · Ấm và trang trọng</span><b>Minh Khôi</b><p class="small muted">Phù hợp sách lịch sử, văn bản pháp luật, sổ tay tuyên truyền.</p></div></div>
      <div class="reader-card"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgMjgwIiB3aWR0aD0iMjQwIiBoZWlnaHQ9IjI4MCI+PHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIyODAiIGZpbGw9IiNGM0U2RDYiLz48cmVjdCB4PSIwIiB5PSI4MCIgd2lkdGg9IjI0MCIgaGVpZ2h0PSI0IiBmaWxsPSIjQjc5Qjc0Ii8+PHJlY3QgeD0iMTIiIHk9IjMwIiB3aWR0aD0iMTIiIGhlaWdodD0iNTAiIGZpbGw9IiM4RTNCMjIiIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iMzAiIHk9IjM0IiB3aWR0aD0iMTIiIGhlaWdodD0iNDYiIGZpbGw9IiMwQjRGNTciIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iNDgiIHk9IjM4IiB3aWR0aD0iMTIiIGhlaWdodD0iNDIiIGZpbGw9IiMyRjVBM0UiIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iNjYiIHk9IjMwIiB3aWR0aD0iMTIiIGhlaWdodD0iNTAiIGZpbGw9IiNCMDdBMkEiIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iODQiIHk9IjM0IiB3aWR0aD0iMTIiIGhlaWdodD0iNDYiIGZpbGw9IiMwQjRGNTciIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iMTAyIiB5PSIzOCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjQyIiBmaWxsPSIjOEUzQjIyIiBvcGFjaXR5PSIuNyIvPjxyZWN0IHg9IjEyMCIgeT0iMzAiIHdpZHRoPSIxMiIgaGVpZ2h0PSI1MCIgZmlsbD0iIzJFNkI2RSIgb3BhY2l0eT0iLjciLz48cmVjdCB4PSIxMzgiIHk9IjM0IiB3aWR0aD0iMTIiIGhlaWdodD0iNDYiIGZpbGw9IiNCMDdBMkEiIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iMTU2IiB5PSIzOCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjQyIiBmaWxsPSIjOEUzQjIyIiBvcGFjaXR5PSIuNyIvPjxyZWN0IHg9IjE3NCIgeT0iMzAiIHdpZHRoPSIxMiIgaGVpZ2h0PSI1MCIgZmlsbD0iIzBCNEY1NyIgb3BhY2l0eT0iLjciLz48cmVjdCB4PSIxOTIiIHk9IjM0IiB3aWR0aD0iMTIiIGhlaWdodD0iNDYiIGZpbGw9IiMyRjVBM0UiIG9wYWNpdHk9Ii43Ii8+PHJlY3QgeD0iMjEwIiB5PSIzOCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjQyIiBmaWxsPSIjQjA3QTJBIiBvcGFjaXR5PSIuNyIvPjxyZWN0IHg9IjIyOCIgeT0iMzAiIHdpZHRoPSIxMiIgaGVpZ2h0PSI1MCIgZmlsbD0iIzBCNEY1NyIgb3BhY2l0eT0iLjciLz48cmVjdCB4PSIyNDYiIHk9IjM0IiB3aWR0aD0iMTIiIGhlaWdodD0iNDYiIGZpbGw9IiMyRTZCNkUiIG9wYWNpdHk9Ii43Ii8+PHBhdGggZD0iTTc4IDEyMCBRNzYgMjUwIDk2IDI1MCBMMTQ0IDI1MCBRMTY0IDI1MCAxNjIgMTIwWiIgZmlsbD0iIzFFMUIxQSIvPjxyZWN0IHg9IjEwOCIgeT0iMTYwIiB3aWR0aD0iMjQiIGhlaWdodD0iMzAiIGZpbGw9IiNGMUM5QTUiLz48ZWxsaXBzZSBjeD0iMTIwIiBjeT0iMTMwIiByeD0iMzYiIHJ5PSI0MyIgZmlsbD0iI0YxQzlBNSIvPjxwYXRoIGQ9Ik04MiAxMjggUTg0IDg0IDEyMCA4NCBRMTU4IDg0IDE1OCAxMjggUTE0NiA5OCAxMTIgMTA0IFE5MiAxMTAgODIgMTI4WiIgZmlsbD0iIzFFMUIxQSIvPjxjaXJjbGUgY3g9IjEwNyIgY3k9IjEzMyIgcj0iMyIgZmlsbD0iIzJCMkIyQiIvPjxjaXJjbGUgY3g9IjEzMyIgY3k9IjEzMyIgcj0iMyIgZmlsbD0iIzJCMkIyQiIvPjxwYXRoIGQ9Ik0xMTEgMTUyIFExMjAgMTU5IDEyOSAxNTIiIHN0cm9rZT0iI0IwNDUzQSIgc3Ryb2tlLXdpZHRoPSIyLjUiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik00NCAyODAgUTQ2IDIwMiAxMjAgMTk2IFExOTQgMjAyIDE5NiAyODBaIiBmaWxsPSIjRjdGMUU2Ii8+PHBhdGggZD0iTTEwNCAxOTYgUTEyMCAyMTQgMTM2IDE5NiIgc3Ryb2tlPSIjMEI0RjU3IiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTUwIDIyNiBxMTAgMjAgLTIgNDAgTTE1NCAyMzYgcTggNCAxMiAtMiIgc3Ryb2tlPSIjOEUzQjIyIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSIxNjIiIGN5PSIyMzIiIHI9IjQiIGZpbGw9IiNDMDM5MkIiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNzYsMTYwKSI+PGNpcmNsZSByPSIyMCIgZmlsbD0iI0YwOEE1RCIvPjxwYXRoIGQ9Ik0tOCAtMiB2NiBNLTMgLTcgdjE2IE0yIC00IHYxMCBNNyAtOSB2MjAiIHN0cm9rZT0iIzBCNEY1NyIgc3Ryb2tlLXdpZHRoPSIyLjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvZz48L3N2Zz4=" alt="Nhân vật người đọc AI giọng nữ"><div class="tx"><span class="tag river">Giọng nữ · Sáng và truyền cảm</span><b>Hải An</b><p class="small muted">Phù hợp sách văn hóa, ẩm thực, bản tin. Hỏi đáp dựa trên nội dung đã duyệt.</p></div></div>
    </div>
  </section>

  <section class="kho-home">
    <div class="kho-intro"><span class="eyebrow">Dành cho cán bộ, công chức</span><h2 style="margin-top:6px">Kho nghiệp vụ nội bộ ${nb("Đăng nhập tài khoản phòng ban, xác thực 2 lớp; tài liệu sắp xếp theo 7 nhóm.")}</h2><p class="muted" style="margin-top:8px">Không gian tra cứu tài liệu nghiệp vụ không công khai. Truy cập bằng tài khoản phòng ban và xác thực 2 lớp; mỗi phòng ban thấy đúng phạm vi được phân quyền.</p>
      <div class="row" style="margin-top:14px"><button class="btn primary" onclick="openKho()">Truy cập khu vực nội bộ</button><span class="small muted">${S.files.filter(f=>f.group&&f.group[0]==='g').length} tài liệu mẫu · 7 nhóm</span></div></div>
    <div class="kho-list">${GROUPS.map((g,k)=>`<button class="kho-row" onclick="openKho('${g.id}')"><span class="kn">${String(k+1).padStart(2,'0')}</span><span style="min-width:0"><b>${g.name}</b><small>${GDESC[g.id]}</small></span><span class="lock" aria-label="Cần đăng nhập">${S.role==='public'?'Nội bộ':'Mở'}</span></button>`).join('')}</div>
  </section>

  <section class="grid g2">
    <div class="card"><span class="eyebrow">Thư viện liên kết</span><h2 style="margin:6px 0 14px;font-size:24px">Kết nối nguồn tri thức chính thống</h2>
      <div class="grid" style="gap:8px">${LAWS.slice(0,5).map(l=>`<a class="acct" style="text-decoration:none;color:var(--ink);background:#fff" href="${l.url}" target="_blank" rel="noopener"><span class="tag river">${l.g}</span><b style="font-weight:600">${l.name}</b></a>`).join('')}</div></div>
    <div class="card row" style="align-items:center;gap:20px"><div class="qr"><canvas width="29" height="29" data-qr="tusach-campha"></canvas></div>
      <div style="flex:1 1 200px;min-width:0"><span class="eyebrow">Mã QR truy cập nhanh</span><h2 style="margin:6px 0 8px;font-size:24px">Mang Tủ sách Cẩm Phả theo bạn</h2><p class="muted small">In trên bảng tin khu phố, ấn phẩm, nhà văn hóa. Mã QR chính thức được tạo sau khi chốt tên miền .gov.vn của phường; mã trên đây là hình minh họa.</p></div></div>
  </section>
  ${footer()}`;
};
function footer(){return `<div class="footer"><img class="flogo" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMTI4IiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCI+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjU0IiByPSI0NCIgZmlsbD0iI0YwOEE1RCIvPgo8cGF0aCBkPSJNNDIgNzAgTDYyIDM4IEw3NCA1MiBMOTIgMjIgTDExMiA1MCBMMTI2IDM0IEwxNTAgNzBaIiBmaWxsPSIjMEI0RjU3Ii8+CjxnIHN0cm9rZT0iI0ZCRjZFQyIgc3Ryb2tlLXdpZHRoPSIyLjQiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik04NiA3MCBMOTYgMzAgTDEwNCAzMCBMMTE0IDcwIE05MCA1NiBIMTEwIE05MiA0NCBIMTA4Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMjciIHI9IjYiLz48L2c+CjxwYXRoIGQ9Ik0zNCA3MiBxMTEgLTcgMjIgMCB0MjIgMCB0MjIgMCB0MjIgMCB0MjIgMCB0MjIgMCIgc3Ryb2tlPSIjMUY3QThDIiBzdHJva2Utd2lkdGg9IjUiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNNDQgODIgcTExIC02IDIyIDAgdDIyIDAgdDIyIDAgdDIyIDAgdDIyIDAiIHN0cm9rZT0iIzFGN0E4QyIgc3Ryb2tlLXdpZHRoPSIzLjUiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgb3BhY2l0eT0iLjciLz4KPHRleHQgeD0iMTAwIiB5PSIxMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSInQmUgVmlldG5hbSBQcm8nLCdTZWdvZSBVSScsQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMSIgZm9udC13ZWlnaHQ9IjgwMCIgbGV0dGVyLXNwYWNpbmc9IjEuNSIgZmlsbD0iIzBCNEY1NyI+Q+G6qE0gUEjhuqI8L3RleHQ+Cjwvc3ZnPg==" alt="Biểu trưng Tủ sách Cẩm Phả"><div class="ftx"><b>Tủ sách điện tử phường Cẩm Phả</b><span>Không gian tri thức số của đất mỏ, phục vụ cộng đồng và công tác nghiệp vụ tại địa phương.</span><span>Bản trình diễn do Công ty CP Công nghệ VHMT Việt Nam xây dựng, đề xuất cho phường Cẩm Phả, tỉnh Quảng Ninh.</span><span class="fnote">Nội dung, hình ảnh và số liệu là minh họa, sẽ được thay bằng hồ sơ chính thức do phường cung cấp.</span></div></div>`}
function bookCard(b){const f=b.flags;return `<button class="book" aria-label="${esc(b.title)}" onclick="openBook('${b.id}')">${coverHtml(b)}<span class="bm">${f.includes('audio')?'<span class="tag rust">Sách nói</span>':''}${f.includes('media')?'<span class="tag river">Đa phương tiện</span>':''}<span class="tag num">${nf(b.views)} lượt</span></span></button>`}
function newsRow(n){return `<button class="news-item" onclick="openNews('${n.id}')"><div class="thumb">${scene(n.cat==='Văn hóa – xã hội'?'temple':n.cat==='Chính quyền'?'city':'bridge',n.id.length*13+n.title.length)}</div><div style="min-width:0;display:flex;flex-direction:column;gap:4px"><span class="eyebrow">${esc(n.cat)} · ${n.date}</span><h3>${esc(n.title)}</h3><p class="small muted">${esc(n.sum)}</p></div></button>`}

VIEWS.shelves=()=>{
  if(!S.shelf){
    return `<div class="sec-head"><div><span class="eyebrow">Tủ sách</span><h1>Sáu kệ sách chính</h1></div></div>
    ${SHELVES.map(sh=>{const bs=S.books.filter(b=>b.shelf===sh.id);return `<section class="grid" style="gap:12px"><div class="sec-head"><div class="row" style="gap:14px;flex-wrap:nowrap"><img src="${sh.img}" alt="" style="width:54px;border-radius:6px;flex:none"><div><h2>${sh.name}</h2><p class="muted small">${sh.desc} · ${bs.length} cuốn</p></div></div><button class="btn sm" onclick="go('shelves',{shelf:'${sh.id}'})">Mở kệ sách</button></div><div class="grid gbooks">${bs.map(bookCard).join('')}</div></section>`}).join('')}${footer()}`;
  }
  const sh=SHELVES.find(s=>s.id===S.shelf);let bs=S.books.filter(b=>b.shelf===sh.id);
  if(S.shelfFilter==='audio')bs=bs.filter(b=>b.flags.includes('audio'));
  if(S.shelfFilter==='media')bs=bs.filter(b=>b.flags.includes('media'));
  const fb=(k,t)=>`<button class="btn sm ${S.shelfFilter===k?'river':''}" onclick="S.shelfFilter='${k}';render()">${t}</button>`;
  return `<div class="row"><button class="btn sm" onclick="go('shelves',{shelf:null})">← Tất cả kệ sách</button></div>
  <section class="shelf-head"><img src="${sh.img}" alt="Bìa kệ ${sh.name}"><div style="min-width:0;display:flex;flex-direction:column;gap:8px"><span class="eyebrow">Kệ sách</span><h1 style="font-size:clamp(28px,3.6vw,40px)">${sh.name}</h1><p class="muted">${sh.desc}. Biên soạn bởi ${SHELF_AUTHOR[sh.id]}.</p></div></section>
  <div class="row">${fb('all','Tất cả')}${fb('audio','Sách nói')}${fb('media','Đa phương tiện')}</div>
  <div class="grid gbooks">${bs.map(bookCard).join('')||'<div class="empty">Chưa có sách thuộc loại này.</div>'}</div>`;
};

VIEWS.news=()=>{
  const cats=['Tất cả',...new Set(S.news.map(n=>n.cat))];
  const list=S.news.filter(n=>S.newsCat==='Tất cả'||n.cat===S.newsCat);
  return `<div class="sec-head"><div><span class="eyebrow">Bản tin</span><h1>Bản tin phường Cẩm Phả</h1><p class="muted">Tin do các phòng ban biên soạn, lãnh đạo phụ trách duyệt trước khi đăng.</p></div></div>
  <div class="row">${cats.map(c=>`<button class="btn sm ${S.newsCat===c?'river':''}" onclick="S.newsCat='${c}';render()">${c}</button>`).join('')}</div>
  <div class="card" style="padding-block:4px">${list.map(newsRow).join('')}</div>${footer()}`;
};

VIEWS.links=()=>{
  const g=[...new Set(LAWS.map(l=>l.g))];
  return `<div class="sec-head"><div><span class="eyebrow">Thư viện liên kết</span><h1>Văn bản và nguồn chính thống</h1><p class="muted">Tủ sách không sao chép văn bản mà liên kết về nguồn gốc, bảo đảm người đọc luôn xem đúng bản hiện hành. Người biên soạn chèn liên kết tới đúng văn bản ngay trong trang sách.</p></div></div>
  ${g.map(x=>`<section class="grid" style="gap:10px"><h2>${x}</h2><div class="grid g2">${LAWS.filter(l=>l.g===x).map(l=>`<a class="card row between" style="text-decoration:none;color:var(--ink)" href="${l.url}" target="_blank" rel="noopener"><div style="min-width:0"><b>${l.name}</b><p class="small muted" style="overflow-wrap:anywhere">${l.url.replace('https://','')}</p></div><span class="tag river">Mở nguồn ↗</span></a>`).join('')}</div></section>`).join('')}
  <section class="card"><span class="eyebrow">Ví dụ gắn liên kết trong sách</span><h3 style="margin:6px 0 8px">Sổ tay tuyên truyền Luật Đất đai 2024</h3><p class="muted small" style="margin-bottom:10px">Trang cuối của cuốn sổ tay dẫn thẳng tới văn bản Luật trên Cơ sở dữ liệu quốc gia về văn bản pháp luật.</p><button class="btn" onclick="openBook(lawBook().id)">Mở sổ tay</button></section>${footer()}`;
};

/* ---- compose: upload manuscript + arrange blocks + live preview ---- */
function blankDraft(){return {id:'HS-2026-0'+(SUBN++),title:'',kind:'Bản tin',cat:'Văn hóa – xã hội',shelf:'vanhoa',dept:'vhxh',author:'Cán bộ biên soạn · Phòng VH–XH',status:'draft',summary:'',blocks:[],orig:null,content:'',ver:0,versions:[],log:[],check:[false,false,false,false],comment:'',isNewDraft:true}}
const BT={h:'Tiêu đề mục',p:'Đoạn văn',img:'Ảnh',video:'Video',audio:'Âm thanh',law:'Liên kết văn bản',pdf:'Tài liệu PDF'};
function htmlToBlocks(html){
  const box=document.createElement('div');box.innerHTML=html||'';const out=[];
  [...box.children].forEach(el=>{const tx=el.textContent.trim();
    if(/^H[1-6]$/.test(el.tagName)){if(tx)out.push({t:'h',text:tx})}
    else if(el.classList.contains('mchip')){const m=tx.match(/^\[(Ảnh|Video|Âm thanh)\]\s*(.*?)(\s+·.*)?$/);out.push({t:m?{'Ảnh':'img','Video':'video','Âm thanh':'audio'}[m[1]]:'img',name:m?m[2]:tx,cap:''})}
    else if(tx)out.push({t:'p',text:tx})});
  return out;
}
function ensureBlocks(d){if(!d.blocks)d.blocks=htmlToBlocks(d.content);return d.blocks}
function blockHtml(b,i){
  const cap=b.cap?`<figcaption>${esc(b.cap)}</figcaption>`:'';
  if(b.t==='h')return `<h2>${esc(b.text||'')}</h2>`;
  if(b.t==='p')return `<p>${esc(b.text||'')}</p>`;
  if(b.t==='img')return `<figure class="bfig">${b.src?`<img src="${b.src}" alt="${esc(b.cap||b.name||'Ảnh')}">`:`<div class="fig">${scene(i%2?'temple':'bridge',(b.name||'').length+i)}</div>`}${cap||(b.name&&!b.src?`<figcaption>${esc(b.name)}</figcaption>`:'')}</figure>`;
  if(b.t==='video')return `<figure class="bfig">${b.src?`<video src="${b.src}" controls playsinline preload="metadata"></video>`:videoBox(b.name||'Video')}${cap}</figure>`;
  if(b.t==='audio')return `<figure class="bfig">${b.src?`<audio src="${b.src}" controls style="width:100%"></audio>`:audioBox(b.name||'Âm thanh','03:20')}${cap}</figure>`;
  if(b.t==='law'){const l=LAWS[b.idx||0];return `<p class="lawref">Văn bản liên quan: <a href="${l.url}" target="_blank" rel="noopener">${esc(l.name)}</a></p>`}
  if(b.t==='pdf')return `<figure class="bfig"><div class="pdfph"><span class="ficon" style="color:var(--bad);background:var(--bad-soft)">PDF</span><b>${esc(b.name)}</b><span>Giữ nguyên bố cục bản gốc · hiển thị dạng sách lật trang</span></div></figure>`;
  return '';
}
const blocksToHtml=bs=>bs.map(blockHtml).join('');
function previewHtml(d){const sh=SHELVES.find(s=>s.id===d.shelf)||SHELVES[0];
  return `<span class="eyebrow">${esc(d.kind==='Sách'?'Sách · '+sh.name:d.cat)}</span><h2 style="font-size:26px">${esc(d.title||'Tiêu đề bài viết')}</h2>${d.summary?`<p class="lead">${esc(d.summary)}</p>`:''}${d.blocks.length?blocksToHtml(d.blocks):'<p class="muted" style="font-family:var(--f-body);font-size:14px">Nội dung bài viết hiện ở đây khi tải bản thảo hoặc thêm khối nội dung.</p>'}`}
function pvUpdate(){const el=$('#pv');if(el&&S.compose)el.innerHTML=previewHtml(S.compose)}
function captureFields(){const d=S.compose;if(!d||!$('#f-title'))return;d.title=$('#f-title').value.trim();d.kind=$('#f-kind').value;if($('#f-shelf'))d.shelf=$('#f-shelf').value;if($('#f-cat'))d.cat=$('#f-cat').value;d.summary=$('#f-sum').value.trim()}
function syncCompose(){captureFields();const d=S.compose;if(d)d.content=blocksToHtml(d.blocks)}

function gapHtml(i){
  if(S.menuAt!==i)return `<div class="gap"><button class="gap-b" onclick="openMenu(${i})">+ Chèn nội dung vào đây</button></div>`;
  return `<div class="gap open"><div class="gapmenu">
    <span class="small muted">Chèn tại vị trí này:</span>
    <button class="btn sm" onclick="addBlk('p',${i})">Đoạn văn</button><button class="btn sm" onclick="addBlk('h',${i})">Tiêu đề mục</button>
    <button class="btn sm" onclick="uploadAt('img',${i})">Ảnh từ máy</button><button class="btn sm" onclick="pickerAt('jpg',${i})">Ảnh từ kho</button>
    <button class="btn sm" onclick="uploadAt('video',${i})">Video từ máy</button><button class="btn sm" onclick="pickerAt('mp4',${i})">Video từ kho</button>
    <button class="btn sm" onclick="pickerAt('mp3',${i})">Âm thanh từ kho</button><button class="btn sm" onclick="addBlk('law',${i})">Liên kết văn bản</button>
    <button class="btn sm" onclick="openMenu(${i})" aria-label="Đóng">✕</button></div></div>`;
}
function blockEditor(b,i,n){
  let body='';
  if(b.t==='h')body=`<div class="blk-h" contenteditable="true" data-ph="Nhập tiêu đề mục" oninput="edBlk(${i},this.innerText)">${esc(b.text||'')}</div>`;
  else if(b.t==='p')body=`<div class="blk-p" contenteditable="true" data-ph="Nhập đoạn văn" oninput="edBlk(${i},this.innerText)">${esc(b.text||'')}</div>`;
  else if(b.t==='law')body=`<select id="law-${i}" onchange="S.compose.blocks[${i}].idx=+this.value;pvUpdate()" aria-label="Chọn văn bản">${LAWS.map((l,k)=>`<option value="${k}" ${k===(b.idx||0)?'selected':''}>${l.name}</option>`).join('')}</select>`;
  else if(b.t==='pdf')body=`<div class="small">${esc(b.name)} · PDF giữ nguyên bố cục, người đọc xem dạng lật trang.</div>`;
  else{const th=b.t==='img'?(b.src?`<img src="${b.src}" alt="">`:scene(i%2?'temple':'bridge',(b.name||'').length+i)):`<div class="mthumb">${b.t==='video'?'▶':'♪'}</div>`;
    body=`<div class="blk-media"><div class="bthumb">${th}</div><div class="grid" style="gap:6px;min-width:0"><span class="small" style="overflow-wrap:anywhere"><b>${esc(b.name||'')}</b>${b.src?'':' <span class="tag">Từ kho</span>'}</span>
      <input id="cap-${i}" type="text" placeholder="Chú thích (nguồn, người chụp, nội dung)" value="${esc(b.cap||'')}" oninput="S.compose.blocks[${i}].cap=this.value;pvUpdate()">
      <div class="row">${b.t!=='audio'?`<button class="btn sm" onclick="replaceBlk(${i})">Thay tệp khác</button>`:''}</div></div></div>`}
  return `<div class="blk blk-${b.t}" data-i="${i}"><div class="blk-bar"><span class="blk-t">${BT[b.t]}</span><span class="blk-ctl"><button onclick="mvBlk(${i},-1)" ${i===0?'disabled':''} aria-label="Chuyển lên">↑</button><button onclick="mvBlk(${i},1)" ${i===n-1?'disabled':''} aria-label="Chuyển xuống">↓</button><button onclick="rmBlk(${i})" aria-label="Xóa khối">✕</button></span></div>${body}</div>`;
}
VIEWS.compose=()=>{
  if(!S.compose)S.compose=blankDraft();
  const d=S.compose;ensureBlocks(d);
  const kinds=['Bản tin','Sách'],cats=['Hoạt động Đảng','Chính quyền','Văn hóa – xã hội','Chuyển đổi số','Thông báo'];
  const st=['draft','lead','office','published'],cur=d.status==='returned'?0:st.indexOf(d.status);
  const mine=S.subs.filter(s=>s.dept==='vhxh'&&(s.status==='draft'||s.status==='returned'));
  const nImg=d.blocks.filter(b=>b.t==='img').length,nP=d.blocks.filter(b=>b.t==='p').length;
  return `<div class="sec-head"><div><span class="eyebrow">Soạn thảo · ${esc(d.id)}</span><h1>${d.isNewDraft?'Bài viết mới':'Chỉnh sửa bài viết'}</h1></div><div class="row"><button class="btn" onclick="S.compose=blankDraft();S.menuAt=null;render()">Tạo bài mới</button></div></div>
  <div class="steps">${['Biên soạn','Lãnh đạo ban duyệt','Văn phòng kiểm tra','Công khai'].map((t,i)=>`<div class="step ${i<cur?'done':i===cur?'cur':''}"><span class="eyebrow">Bước ${i+1}</span><b>${t}</b></div>`).join('')}</div>
  ${d.status==='returned'?`<div class="banner bad"><b>Lãnh đạo ban trả lại:</b><span>${esc(d.comment)}</span></div>`:''}

  <section class="src">
    <label class="drop ${S.importing?'busy':''}" for="doc-in">
      <input id="doc-in" type="file" accept=".docx,.pdf" hidden onchange="importDoc(this.files)">
      <span class="drop-ic">↑</span>
      <span><b>${S.importing?'Đang chuyển bản thảo: '+esc(S.importing)+'…':d.orig?'Tải bản thảo khác':'Tải bản thảo Word hoặc PDF'}</b>
      <small>${S.importing?'Tách đoạn văn, giữ ảnh đúng vị trí trong bài':'Hệ thống tự tách tiêu đề, đoạn văn và giữ ảnh đúng vị trí như trong file Word. PDF được giữ nguyên bố cục.'}</small></span>
    </label>
    <div class="src-side">
      ${d.orig?`<div class="acct" style="background:#fff">${ficon(d.orig.name.endsWith('.pdf')?'pdf':'docx')}<span style="min-width:0;flex:1"><b style="font-weight:600;overflow-wrap:anywhere">${esc(d.orig.name)}</b><br><span class="small muted">Bản thảo gốc · ${fsize(d.orig.size/1048576)} · lưu kèm hồ sơ để lãnh đạo đối chiếu</span></span></div>
        <p class="small muted">Đã tách: <b class="num">${nP}</b> đoạn văn, <b class="num">${nImg}</b> ảnh. Chỉnh lại bố cục bên dưới nếu cần.</p>`:
      `<button class="btn" onclick="fillSample()">Dùng bản thảo mẫu (Word)</button><button class="btn" onclick="captureFields();addBlk('p',S.compose.blocks.length)">Soạn trực tiếp bài ngắn</button>`}
    </div>
  </section>

  <div class="fields">
    <div class="field" style="grid-column:1/-1"><label for="f-title">Tiêu đề</label><input id="f-title" type="text" value="${esc(d.title)}" placeholder="Ví dụ: Ngày hội đọc sách tại nhà văn hóa khu phố" style="font-size:17px;padding:10px 12px" oninput="S.compose.title=this.value;pvUpdate()"></div>
    <div class="field"><label for="f-kind">Loại nội dung</label><select id="f-kind" onchange="captureFields();render()">${kinds.map(k=>`<option ${d.kind===k?'selected':''}>${k}</option>`).join('')}</select></div>
    ${d.kind==='Sách'?`<div class="field"><label for="f-shelf">Kệ sách</label><select id="f-shelf" onchange="captureFields();pvUpdate()">${SHELVES.map(s=>`<option value="${s.id}" ${d.shelf===s.id?'selected':''}>${s.name}</option>`).join('')}</select></div>`:`<div class="field"><label for="f-cat">Chuyên mục</label><select id="f-cat" onchange="captureFields();pvUpdate()">${cats.map(c=>`<option ${d.cat===c?'selected':''}>${c}</option>`).join('')}</select></div>`}
    <div class="field"><label for="f-dept">Phòng ban</label><select id="f-dept" disabled><option>${deptName(d.dept)}</option></select></div>
    <div class="field" style="grid-column:1/-1"><label for="f-sum">Tóm tắt</label><textarea id="f-sum" rows="2" placeholder="Một đến hai câu giới thiệu nội dung" oninput="S.compose.summary=this.value;pvUpdate()">${esc(d.summary)}</textarea></div>
  </div>

  <div class="cw">
    <section class="grid" style="gap:0;min-width:0"><div class="row between" style="margin-bottom:10px"><h3>Bố cục bài viết</h3><span class="small muted">${d.blocks.length} khối · kéo lên, xuống bằng mũi tên</span></div>
      ${gapHtml(0)}${d.blocks.map((b,i)=>blockEditor(b,i,d.blocks.length)+gapHtml(i+1)).join('')}
      ${d.blocks.length?'':'<div class="empty">Chưa có nội dung. Tải bản thảo Word ở trên, hoặc bấm “Chèn nội dung vào đây”.</div>'}
    </section>
    <aside class="pvw"><div class="row between" style="margin-bottom:10px"><h3>Xem trước như người đọc</h3><button class="btn sm" onclick="previewCompose()">Toàn màn hình</button></div><div class="page pv-page" id="pv">${previewHtml(d)}</div></aside>
  </div>
  <input id="blk-file" type="file" hidden onchange="blkFile(this.files)">

  <div class="row" style="position:sticky;bottom:0;background:var(--bg);padding-block:12px;border-top:1px solid var(--line);z-index:5">
    <button class="btn" onclick="saveDraft()">Lưu nháp</button>
    <button class="btn primary" onclick="submitDraft()">Gửi lãnh đạo ban duyệt</button>
    <span class="small muted">Bản thảo gốc và mọi phiên bản đều được lưu kèm hồ sơ.</span>
  </div>
  <div class="grid g3">
    <div class="card"><span class="eyebrow">Hướng dẫn</span><ul class="small" style="margin:8px 0 0;padding-left:18px;display:flex;flex-direction:column;gap:6px"><li>Soạn bài bằng Word như thường lệ, chèn ảnh ngay trong file.</li><li>Tải lên: ảnh giữ đúng vị trí, video và âm thanh chèn thêm tại chỗ cần.</li><li>Ghi chú thích và nguồn cho từng ảnh, video.</li><li>Không đưa tài liệu mật lên hệ thống.</li></ul></div>
    <div class="card"><span class="eyebrow">Phiên bản</span>${d.versions.length?`<div class="timeline" style="margin-top:10px">${d.versions.slice().reverse().map(v=>`<div class="tl"><i></i><div class="small"><b>Phiên bản ${v.v}</b> · ${v.time}<br><span class="muted">${esc(v.note)}</span></div></div>`).join('')}</div>`:'<p class="small muted" style="margin-top:6px">Chưa lưu phiên bản nào.</p>'}</div>
    <div class="card"><span class="eyebrow">Bài của phòng đang xử lý</span><div class="grid" style="gap:8px;margin-top:10px">${mine.map(s=>`<button class="k-card ${s.status==='returned'?'mine':''}" onclick="editSub('${s.id}')"><b>${esc(s.title)}</b>${statusPill(s.status)}</button>`).join('')||'<p class="small muted">Không có.</p>'}</div></div>
  </div>`;
};
function edBlk(i,v){S.compose.blocks[i].text=v;pvUpdate()}
function mvBlk(i,dd){captureFields();const b=S.compose.blocks,j=i+dd;if(j<0||j>=b.length)return;[b[i],b[j]]=[b[j],b[i]];S.menuAt=null;render()}
function rmBlk(i){captureFields();S.compose.blocks.splice(i,1);S.menuAt=null;render()}
function openMenu(i){captureFields();S.menuAt=S.menuAt===i?null:i;render()}
function addBlk(t,i){captureFields();const b={t};if(t==='p'||t==='h')b.text='';if(t==='law')b.idx=0;S.compose.blocks.splice(i,0,b);S.menuAt=null;render();setTimeout(()=>{const el=document.querySelector(`.blk[data-i="${i}"] [contenteditable]`);if(el)el.focus()},30)}
function acceptFor(t){return t==='img'?'image/*':t==='video'?'video/*':'audio/*'}
function uploadAt(t,i){captureFields();S.insertAt=i;S.insertType=t;S.replaceIdx=null;const inp=$('#blk-file');inp.accept=acceptFor(t);inp.value='';inp.click()}
function replaceBlk(i){captureFields();S.replaceIdx=i;S.insertType=S.compose.blocks[i].t;const inp=$('#blk-file');inp.accept=acceptFor(S.insertType);inp.value='';inp.click()}
function blkFile(files){
  const f=files&&files[0];if(!f)return;const t=S.insertType;
  const done=src=>{const d=S.compose;if(S.replaceIdx!=null)Object.assign(d.blocks[S.replaceIdx],{src,name:f.name});else d.blocks.splice(S.insertAt,0,{t,src,name:f.name,cap:''});
    S.files.unshift({id:'u'+Date.now(),name:f.name,type:t==='img'?'jpg':t==='video'?'mp4':'mp3',group:'tl',dept:'vhxh',mb:Math.max(f.size/1048576,0.01),date:nowStr().slice(0,10),sort:9999,code:'CP.VHXH.2026.'+(900+S.files.length%99),ver:1,status:'backed'});
    S.menuAt=null;S.replaceIdx=null;render();toast(`Đã chèn ${BT[t].toLowerCase()} vào đúng vị trí; tệp được lưu vào kho dùng chung`)};
  if(t==='img'){const r=new FileReader();r.onload=()=>done(r.result);r.readAsDataURL(f)}else{try{done(URL.createObjectURL(f))}catch(e){done('')}}
}
function pickerAt(type,i){captureFields();S.insertAt=i;openPicker(type)}
function openPicker(type){
  const lab={jpg:'ảnh',mp4:'video',mp3:'âm thanh'}[type];const fs=S.files.filter(f=>f.type===type).slice(0,12);
  modal(`<div class="modal narrow"><div class="m-head"><div><span class="eyebrow">Kho lưu trữ dùng chung</span><h3>Chọn ${lab} để chèn vào bài</h3></div><button class="x" onclick="closeModal()" aria-label="Đóng">×</button></div><div class="m-body"><div class="grid" style="gap:8px">${fs.map(f=>`<button class="acct" style="cursor:pointer;text-align:left" onclick="pickFile('${f.id}')">${ficon(f.type)}<span style="flex:1;min-width:0"><b style="font-weight:600">${esc(f.name)}</b><br><span class="small muted">${deptName(f.dept)} · ${fsize(f.mb)} · ${f.code}</span></span><span class="tag river">Chèn</span></button>`).join('')}</div></div></div>`);
}
function pickFile(id){
  const f=S.files.find(x=>x.id===id);closeModal();if(!S.compose)S.compose=blankDraft();const d=S.compose;ensureBlocks(d);
  const t={jpg:'img',mp4:'video',mp3:'audio'}[f.type]||'img';const at=(S.insertAt==null||S.insertAt>d.blocks.length)?d.blocks.length:S.insertAt;
  d.blocks.splice(at,0,{t,name:f.name,cap:'',kho:f.code});S.insertAt=null;S.menuAt=null;S.view='compose';render();toast('Đã chèn '+BT[t].toLowerCase()+' từ kho vào bài');
}
function loadMammoth(){
  if(window.mammoth)return Promise.resolve(window.mammoth);
  const tryUrl=u=>new Promise((res,rej)=>{const s=document.createElement('script');s.src=u;s.onload=()=>window.mammoth?res(window.mammoth):rej();s.onerror=rej;document.head.appendChild(s)});
  return tryUrl('https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js').catch(()=>tryUrl('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js'));
}
function mammothBlocks(html){
  const box=document.createElement('div');box.innerHTML=html;const out=[];
  const pushImgs=el=>el.querySelectorAll('img').forEach((im,k)=>out.push({t:'img',src:im.getAttribute('src'),name:'Ảnh trong bản thảo',cap:im.getAttribute('alt')||''}));
  [...box.children].forEach(el=>{const tx=el.textContent.replace(/\s+/g,' ').trim();
    if(/^H[1-6]$/.test(el.tagName)){if(tx)out.push({t:'h',text:tx});pushImgs(el)}
    else if(el.tagName==='UL'||el.tagName==='OL'){[...el.querySelectorAll('li')].forEach(li=>{const t=li.textContent.trim();if(t)out.push({t:'p',text:'• '+t})})}
    else if(el.tagName==='TABLE'){[...el.querySelectorAll('tr')].forEach(tr=>{const t=[...tr.children].map(c=>c.textContent.trim()).filter(Boolean).join(' | ');if(t)out.push({t:'p',text:t})})}
    else{if(tx)out.push({t:'p',text:tx});pushImgs(el)}});
  return out;
}
function importDoc(files){
  const f=files&&files[0];if(!f)return;captureFields();const d=S.compose;const ext=(f.name.split('.').pop()||'').toLowerCase();
  if(ext!=='docx'&&ext!=='pdf'){toast('Hệ thống nhận bản thảo Word (.docx) hoặc PDF');return}
  S.importing=f.name;render();
  if(ext==='pdf'){setTimeout(()=>{d.orig={name:f.name,size:f.size};d.blocks.push({t:'pdf',name:f.name});S.importing=null;render();toast('Đã đính kèm PDF. Bản PDF giữ nguyên bố cục, người đọc xem dạng lật trang.')},700);return}
  loadMammoth().then(m=>f.arrayBuffer().then(buf=>m.convertToHtml({arrayBuffer:buf}))).then(res=>{
    const bs=mammothBlocks(res.value);if(!d.title){const h=bs.find(b=>b.t==='h')||bs.find(b=>b.t==='p'&&b.text.length<120);if(h){d.title=h.text;bs.splice(bs.indexOf(h),1)}}
    d.blocks=bs;d.orig={name:f.name,size:f.size};S.importing=null;S.menuAt=null;render();
    toast(`Đã chuyển bản thảo: ${bs.filter(b=>b.t==='p').length} đoạn văn, ${bs.filter(b=>b.t==='img').length} ảnh giữ đúng vị trí`)
  }).catch(()=>{S.importing=null;render();toast('Chưa đọc được tệp Word này. Lưu lại dạng .docx trong Word rồi tải lên lần nữa.')});
}
function fillSample(){
  captureFields();S.importing='Ban-thao-Ngay-hoi-doc-sach.docx';render();
  setTimeout(()=>{const d=S.compose;Object.assign(d,{title:d.title||'Ngày hội đọc sách tại nhà văn hóa khu phố',kind:'Bản tin',cat:'Văn hóa – xã hội',summary:d.summary||'Thiếu nhi và người cao tuổi cùng trải nghiệm sách điện tử, nghe sách nói bằng giọng đọc AI.',orig:{name:'Ban-thao-Ngay-hoi-doc-sach.docx',size:2516582},
    blocks:[
      {t:'p',text:'Sáng Chủ nhật, nhà văn hóa khu phố tổ chức Ngày hội đọc sách với chủ đề “Tri thức Cẩm Phả trong tầm tay”, thu hút đông đảo thiếu nhi và người cao tuổi tham gia.'},
      {t:'img',name:'Ảnh tư liệu ngày hội đọc sách.jpg',cap:'Thiếu nhi quét mã QR mở Tủ sách điện tử trên điện thoại. Ảnh: Phòng Văn hóa – Xã hội',kho:'CP.VHXH.2026.201'},
      {t:'h',text:'Nghe sách bằng giọng đọc AI'},
      {t:'p',text:'Các cụ cao tuổi được hướng dẫn nghe cuốn “Sổ tay tuyên truyền Luật Đất đai 2024” bằng giọng đọc Hải An, không cần cài đặt thêm ứng dụng.'},
      {t:'img',name:'Ảnh người cao tuổi nghe sách nói.jpg',cap:'Người cao tuổi nghe sách nói tại nhà văn hóa. Ảnh: Phòng Văn hóa – Xã hội',kho:'CP.VHXH.2026.202'},
      {t:'p',text:'Chương trình nằm trong Kế hoạch phát triển văn hóa đọc năm 2026 của phường, hướng tới đưa Tủ sách điện tử đến từng khu phố.'}
    ]});S.importing=null;S.menuAt=null;render();toast('Đã chuyển bản thảo mẫu: 4 đoạn văn, 2 ảnh giữ đúng vị trí');},900);
}
function saveDraft(silent){
  syncCompose();const d=S.compose;
  if(!d.title){toast('Nhập tiêu đề trước khi lưu');const t=$('#f-title');if(t)t.focus();return false}
  if(!d.blocks.length){toast('Bài viết chưa có nội dung. Tải bản thảo hoặc thêm khối nội dung.');return false}
  d.ver++;d.versions.push({v:d.ver,time:nowStr(),by:ROLES[S.role].short,note:d.ver===1?(d.orig?'Chuyển từ bản thảo '+d.orig.name:'Bản thảo đầu'):'Cập nhật nội dung, bố cục'});
  d.log.push({time:nowStr(),by:'Cán bộ biên soạn',act:d.isNewDraft?'Tạo bản thảo':'Lưu phiên bản '+d.ver,note:''});
  if(d.isNewDraft){d.isNewDraft=false;S.subs.unshift(d)}
  d.updated=nowStr();audit('Lưu nháp',d.id);if(!silent){toast('Đã lưu phiên bản '+d.ver);render()}return true;
}
function submitDraft(){
  if(!saveDraft(true))return;const d=S.compose;
  d.status='lead';d.comment='';d.log.push({time:nowStr(),by:'Cán bộ biên soạn',act:'Gửi lãnh đạo ban duyệt',note:''});audit('Gửi duyệt',d.id);
  S.compose=null;S.menuAt=null;toast('Đã gửi lãnh đạo ban duyệt: '+d.id);go('workflow');
}
function editSub(id){const s=S.subs.find(x=>x.id===id);ensureBlocks(s);S.compose=s;S.menuAt=null;S.view='compose';closeModal();render()}
function previewCompose(){captureFields();modal(`<div class="modal narrow"><div class="m-head"><span class="eyebrow">Xem trước như người đọc</span><button class="x" onclick="closeModal()" aria-label="Đóng">×</button></div><div class="m-body"><div class="page pv-page">${previewHtml(S.compose)}</div></div></div>`)}
function openLawPicker(){addBlk('law',S.compose?S.compose.blocks.length:0)}

/* ---- workflow ---- */
function canAct(s){return (S.role==='editor'&&(s.status==='draft'||s.status==='returned')&&s.dept==='vhxh')||(S.role==='lead'&&s.status==='lead')||(S.role==='office'&&s.status==='office')}
VIEWS.workflow=()=>{
  const cols=[['Bản nháp, trả lại',s=>s.status==='draft'||s.status==='returned'],['Chờ lãnh đạo ban duyệt',s=>s.status==='lead'],['Văn phòng kiểm tra',s=>s.status==='office'],['Đã công khai',s=>s.status==='published']];
  let subs=S.subs;if(S.wfFilter==='mine')subs=subs.filter(canAct);
  const hint={editor:'Bạn soạn bài, lưu nháp và gửi lãnh đạo ban duyệt. Bài bị trả lại hiện viền đỏ.',lead:'Bạn duyệt hoặc trả lại bài ở cột “Chờ lãnh đạo ban duyệt”.',office:'Bạn kiểm tra hình thức, bản quyền rồi công khai lên Tủ sách.',chief:'Bạn theo dõi toàn bộ luồng bài; thao tác duyệt do lãnh đạo ban và Văn phòng thực hiện.'}[S.role];
  return `<div class="sec-head"><div><span class="eyebrow">Quy trình biên soạn – duyệt – công khai</span><h1>Phê duyệt bài viết</h1><p class="muted">${hint}</p></div><div class="row"><button class="btn sm ${S.wfFilter==='all'?'river':''}" onclick="S.wfFilter='all';render()">Tất cả</button><button class="btn sm ${S.wfFilter==='mine'?'river':''}" onclick="S.wfFilter='mine';render()">Việc của tôi (${pendingForMe()})</button>${S.role==='editor'?'<button class="btn sm primary" onclick="S.compose=null;go(\'compose\')">+ Bài mới</button>':''}</div></div>
  <div class="kanban">${cols.map(([t,f])=>{const it=subs.filter(f);return `<div class="col"><div class="col-h"><span>${t}</span><span class="n">${it.length}</span></div>${it.map(s=>`<button class="k-card ${canAct(s)?'mine':''}" onclick="openSub('${s.id}')"><span class="row between small"><span class="muted num">${s.id}</span><span class="tag">${s.kind}</span></span><b>${esc(s.title)}</b><span class="small muted">${deptName(s.dept)}</span><span class="row between">${statusPill(s.status)}<span class="small muted num">v${s.ver}</span></span></button>`).join('')||'<p class="small muted" style="padding:8px">Trống</p>'}</div>`}).join('')}</div>`;
};
function openSub(id){
  const s=S.subs.find(x=>x.id===id);const act=canAct(s);
  const checks=['Nguồn tư liệu đã ghi rõ','Hình ảnh, âm thanh, video có quyền sử dụng','Không chứa thông tin, tài liệu mật','Liên kết văn bản dẫn tới bản hiện hành'];
  let actions='';
  if(act&&S.role==='editor')actions=`<button class="btn" onclick="editSub('${s.id}')">Mở để chỉnh sửa</button><button class="btn primary" onclick="S.compose=S.subs.find(x=>x.id==='${s.id}');closeModal();S.view='compose';render();submitDraft()">Gửi duyệt ngay</button>`;
  if(act&&S.role==='lead')actions=`<div class="field" style="width:100%"><label for="c-note">Ý kiến của lãnh đạo ban</label><textarea id="c-note" rows="2" placeholder="Bắt buộc khi trả lại"></textarea></div><button class="btn danger" onclick="doReturn('${s.id}')">Trả lại chỉnh sửa</button><button class="btn ok" onclick="doApprove('${s.id}')">Duyệt, chuyển Văn phòng</button>`;
  if(act&&S.role==='office')actions=`<div style="width:100%"><span class="eyebrow">Danh mục kiểm tra trước khi công khai</span>${checks.map((c,i)=>`<label class="chk" for="ck${i}"><input type="checkbox" id="ck${i}" ${s.check[i]?'checked':''} onchange="setCheck('${s.id}',${i},this.checked)"> ${c}</label>`).join('')}</div><div class="field" style="width:100%"><label for="c-note">Ghi chú</label><textarea id="c-note" rows="2" placeholder="Bắt buộc khi trả lại"></textarea></div><button class="btn danger" onclick="doReturn('${s.id}')">Trả lại</button><button class="btn ok" id="pub-btn" onclick="doPublish('${s.id}')" ${s.check.every(Boolean)?'':'disabled'}>Công khai lên Tủ sách</button>`;
  modal(`<div class="modal"><div class="m-head"><div style="min-width:0"><span class="eyebrow">${s.id} · ${s.kind}${s.shelf&&s.kind==='Sách'?' · Kệ '+shelfOf(s).name:''}</span><h3>${esc(s.title)}</h3></div><button class="x" onclick="closeModal()" aria-label="Đóng">×</button></div>
  <div class="m-body"><div class="compose">
    <div class="grid" style="gap:12px;min-width:0"><div class="row">${statusPill(s.status)}<span class="small muted">${deptName(s.dept)} · ${esc(s.author)} · phiên bản ${s.ver}</span></div>
      ${s.status==='returned'&&s.comment?`<div class="banner bad"><b>Góp ý:</b> ${esc(s.comment)}</div>`:''}
      <p class="muted">${esc(s.summary)}</p>${s.orig?`<div class="acct">${ficon(s.orig.name.endsWith('.pdf')?'pdf':'docx')}<span style="flex:1;min-width:0"><b style="font-weight:600">Bản thảo gốc: ${esc(s.orig.name)}</b><br><span class="small muted">Lưu kèm hồ sơ để đối chiếu với bài đã dàn trang</span></span><button class="btn sm" onclick="toast('Bản thảo gốc mở trong trình xem tài liệu của hệ thống')">Mở bản gốc</button></div>`:''}<div class="preview-doc page pv-page" style="max-height:420px">${s.blocks?blocksToHtml(s.blocks):s.content}</div>
      ${actions?`<div class="row" style="border-top:1px solid var(--line);padding-top:14px">${actions}</div>`:(S.role==='chief'?'<div class="banner info">Lãnh đạo phường theo dõi, không thao tác duyệt ở bước này.</div>':'')}
    </div>
    <aside class="side"><div class="card"><span class="eyebrow">Lịch sử xử lý</span><div class="timeline" style="margin-top:10px">${s.log.slice().reverse().map(l=>`<div class="tl ${/Trả lại/.test(l.act)?'ret':/Công khai/.test(l.act)?'pub':''}"><i></i><div class="small"><b>${esc(l.act)}</b><br><span class="muted">${esc(l.by)} · ${l.time}</span>${l.note?`<br>“${esc(l.note)}”`:''}</div></div>`).join('')}</div></div>
    <div class="card"><span class="eyebrow">Phiên bản lưu</span><div class="small" style="margin-top:8px;display:flex;flex-direction:column;gap:4px">${s.versions.map(v=>`<span>v${v.v} · ${v.time} · ${esc(v.note)}</span>`).join('')}</div></div></aside>
  </div></div></div>`);
}
function setCheck(id,i,v){const s=S.subs.find(x=>x.id===id);s.check[i]=v;const b=$('#pub-btn');if(b)b.disabled=!s.check.every(Boolean)}
function note(){const n=$('#c-note');return n?n.value.trim():''}
function doApprove(id){const s=S.subs.find(x=>x.id===id);s.status='office';s.updated=nowStr();s.log.push({time:nowStr(),by:'Lãnh đạo phụ trách ban',act:'Duyệt, chuyển Văn phòng',note:note()||'Đồng ý nội dung'});audit('Duyệt, chuyển Văn phòng',id);closeModal();toast('Đã duyệt, chuyển Văn phòng kiểm tra');render()}
function doReturn(id){const n=note();if(!n){toast('Nhập góp ý trước khi trả lại');$('#c-note').focus();return}const s=S.subs.find(x=>x.id===id);s.status='returned';s.comment=n;s.updated=nowStr();s.log.push({time:nowStr(),by:ROLES[S.role].short,act:'Trả lại chỉnh sửa',note:n});audit('Trả lại chỉnh sửa',id);closeModal();toast('Đã trả lại cho cán bộ biên soạn');render()}
function doPublish(id){
  const s=S.subs.find(x=>x.id===id);if(s.blocks)s.content=blocksToHtml(s.blocks);s.status='published';s.updated=nowStr();s.log.push({time:nowStr(),by:'Văn phòng Đảng ủy',act:'Công khai trên Tủ sách',note:note()});audit('Công khai',id);
  if(s.kind==='Bản tin'){S.news.unshift({id:'n'+s.id,cat:s.cat||'Thông báo',title:s.title,date:nowStr().slice(0,10),sum:s.summary,dept:s.dept,views:0,body:s.content});closeModal();toast('Đã công khai. Bản tin hiện ở mục Bản tin và Trang chủ.')}
  else{const b={id:'bs'+s.id.replace(/\D/g,''),shelf:s.shelf||'vanhoa',title:s.title,sub:s.summary,flags:['flip','audio','media'],views:0,author:deptName(s.dept),date:nowStr().slice(0,10),isNew:true,content:s.content};S.books.unshift(b);closeModal();toast('Đã công khai. Sách mới hiện trên kệ '+shelfOf(b).name+'.')}
  render();
}

/* ---- archive ---- */
VIEWS.archive=()=>{
  const A=S.arch;let fs=S.files;
  const isGrp=id=>[...GROUPS,...MEDIA_GROUPS].some(g=>g.id===id);
  if(A.folder==='kho')fs=fs.filter(f=>f.group&&f.group[0]==='g');else if(A.folder!=='all')fs=fs.filter(f=>isGrp(A.folder)?f.group===A.folder:f.dept===A.folder);
  if(A.type!=='all')fs=fs.filter(f=>f.type===A.type);
  if(A.q){const q=A.q.toLowerCase();fs=fs.filter(f=>f.name.toLowerCase().includes(q)||f.code.toLowerCase().includes(q))}
  const per=12,pages=Math.max(1,Math.ceil(fs.length/per));A.page=Math.min(A.page,pages);const shown=fs.slice((A.page-1)*per,A.page*per);
  const mix=[['Văn bản, báo cáo','var(--info)',2.1],['Ảnh tư liệu','var(--warn)',2.6],['Video','var(--rust)',4.9],['Âm thanh','var(--river)',0.8],['Bản scan (OCR)','var(--muted)',1.7],['Sách điện tử','var(--ok)',0.5]];const tot=mix.reduce((a,m)=>a+m[2],0);
  return `<div class="sec-head"><div><span class="eyebrow">Kho dữ liệu dùng chung toàn phường</span><h1>Kho lưu trữ</h1><p class="muted">Kho nghiệp vụ nội bộ sắp xếp theo 7 nhóm tài liệu đề xuất, cùng tư liệu ảnh, âm thanh, video và hồ sơ số hóa. Quyền sửa theo phòng ban; tài liệu mật không đưa lên hệ thống.</p></div>
    <label class="btn primary" for="up" style="cursor:pointer">Tải tệp lên<input id="up" type="file" multiple hidden onchange="uploadFiles(this.files)"></label></div>
  <div class="store">
    <div class="card"><div class="row between"><span class="eyebrow">NAS tại trụ sở · NAS-CP-01</span><span class="pill p-published">Hoạt động</span></div>
      <div class="row between" style="margin-top:8px"><b style="font-family:var(--f-display);font-size:26px" class="num">12,6 / 40 TB</b><span class="small muted">RAID 6 · 8 ổ</span></div>
      <div class="meter rust" style="margin-top:8px"><i style="width:31.5%"></i></div>
      <div class="bays">${Array.from({length:8},()=>'<div class="bay" title="Ổ cứng hoạt động bình thường"></div>').join('')}</div></div>
    <div class="card"><div class="row between"><span class="eyebrow">Sao lưu cloud trong nước</span><span class="pill p-published">Đã đồng bộ</span></div>
      <div class="row between" style="margin-top:8px"><b style="font-family:var(--f-display);font-size:26px" class="num">30 phiên bản</b><span class="small muted">Giữ 30 ngày</span></div>
      <p class="small muted" style="margin-top:8px">Lần sao lưu gần nhất: 02:00 ngày 30/09/2026 · 12,6 TB · Khôi phục được từng tệp hoặc toàn bộ khi có sự cố, mã độc.</p></div>
    <div class="card"><span class="eyebrow">Cơ cấu dữ liệu · 18.742 tệp</span>
      <div class="typebar">${mix.map(m=>`<span style="width:${m[2]/tot*100}%;background:${m[1]}" title="${m[0]}"></span>`).join('')}</div>
      <div class="legend">${mix.map(m=>`<span><i style="background:${m[1]}"></i>${m[0]} ${String(m[2]).replace('.',',')} TB</span>`).join('')}</div></div>
  </div>
  <div class="arch">
    <div class="card" style="padding:10px"><div class="folders">
      <button class="${A.folder==='all'?'on':''}" onclick="setArch({folder:'all',page:1})">Toàn bộ kho<span>${S.files.length}</span></button>
      <div class="fgrp">Kho nghiệp vụ nội bộ · 7 nhóm</div>
      <button class="${A.folder==='kho'?'on':''}" onclick="setArch({folder:'kho',page:1})">Tất cả 7 nhóm<span>${S.files.filter(f=>f.group&&f.group[0]==='g').length}</span></button>
      ${GROUPS.map((g,i)=>`<button class="${A.folder===g.id?'on':''}" onclick="setArch({folder:'${g.id}',page:1})"><em>${i+1}.</em> ${g.name}<span>${S.files.filter(f=>f.group===g.id).length}</span></button>`).join('')}
      <div class="fgrp">Tư liệu và hồ sơ</div>
      ${MEDIA_GROUPS.map(g=>`<button class="${A.folder===g.id?'on':''}" onclick="setArch({folder:'${g.id}',page:1})">${g.name}<span>${S.files.filter(f=>f.group===g.id).length}</span></button>`).join('')}
      <div class="fgrp">Theo phòng ban</div>
      ${DEPTS.map(d=>`<button class="${A.folder===d.id?'on':''}" onclick="setArch({folder:'${d.id}',page:1})">${d.name}<span>${S.files.filter(f=>f.dept===d.id).length}</span></button>`).join('')}</div></div>
    <div class="grid" style="gap:12px;min-width:0">
      <div class="row"><input id="a-q" type="search" placeholder="Tìm theo tên tệp hoặc mã hồ sơ…" value="${esc(A.q)}" oninput="setArch({q:this.value,page:1},true)" style="flex:1 1 240px;border-radius:8px;border:1px solid var(--line);padding:8px 12px;background:var(--surface)" aria-label="Tìm trong kho">
      <select id="a-type" onchange="setArch({type:this.value,page:1})" aria-label="Loại tệp"><option value="all">Mọi loại tệp</option>${Object.entries(FTYPES).map(([k,v])=>`<option value="${k}" ${A.type===k?'selected':''}>${v.l}</option>`).join('')}</select></div>
      <div id="a-table">${archTable(shown,fs.length,pages)}</div>
    </div>
  </div>`;
};
function archTable(shown,total,pages){const A=S.arch;return `<div class="tbl-wrap"><table class="t"><thead><tr><th>Tên tệp</th><th>Mã hồ sơ</th><th>Nhóm</th><th>Phòng ban</th><th>Dung lượng</th><th>Ngày</th><th>Sao lưu</th></tr></thead><tbody>${shown.map(f=>`<tr class="click" onclick="openFile('${f.id}')"><td><span class="fname">${ficon(f.type)}<b>${esc(f.name)}</b></span></td><td class="num small">${f.code}</td><td class="small" style="min-width:150px">${groupName(f.group)}</td><td class="small">${deptName(f.dept)}</td><td class="num small">${fsize(f.mb)}</td><td class="num small">${f.date}</td><td>${f.status==='syncing'?'<span class="pill p-lead">Đang đồng bộ</span>':'<span class="pill p-published">Đã sao lưu</span>'}</td></tr>`).join('')||'<tr><td colspan="7"><div class="empty">Không tìm thấy tệp phù hợp.</div></td></tr>'}</tbody></table></div>
  <div class="pager"><span class="small muted">Hiển thị ${shown.length} / ${nf(total)} tệp mẫu trong bản trình diễn (kho thật: 18.742 tệp)</span><div class="row"><button class="btn sm" ${A.page<=1?'disabled':''} onclick="setArch({page:${A.page-1}})">← Trước</button><span class="small num">Trang ${A.page}/${pages}</span><button class="btn sm" ${A.page>=pages?'disabled':''} onclick="setArch({page:${A.page+1}})">Sau →</button></div></div>`}
function setArch(o,keepFocus){Object.assign(S.arch,o);if(keepFocus){const v=VIEWS.archive();const tmp=document.createElement('div');tmp.innerHTML=v;$('#a-table').innerHTML=tmp.querySelector('#a-table').innerHTML}else render()}
function openFile(id){
  const f=S.files.find(x=>x.id===id);const isMedia=['jpg','mp4','mp3'].includes(f.type);
  const pv=f.type==='jpg'?`<div class="fig">${scene('temple',f.id.length*9+f.name.length)}</div>`:f.type==='mp4'?videoBox(f.name):f.type==='mp3'?audioBox(f.name,'04:12'):f.type==='scan'?`<div class="preview-doc"><span class="eyebrow">Văn bản nhận dạng (OCR)</span><p style="margin-top:8px">ỦY BAN NHÂN DÂN PHƯỜNG LONG BIÊN… Căn cứ kế hoạch công tác năm… Nội dung nhận dạng tự động từ bản scan, có thể tìm kiếm theo từ khóa.</p></div>`:`<div class="preview-doc"><p><b>${esc(f.name.replace(/\.\w+$/,''))}</b></p><p>Bản xem trước nội dung tài liệu (minh họa).</p></div>`;
  modal(`<div class="modal narrow"><div class="m-head"><div style="min-width:0"><span class="eyebrow">${f.code}</span><h3 style="overflow-wrap:anywhere">${esc(f.name)}</h3></div><button class="x" onclick="closeModal()" aria-label="Đóng">×</button></div>
  <div class="m-body grid" style="gap:14px">${pv}
   <div class="row" style="gap:18px;align-items:flex-start"><div class="qr" style="width:96px;height:96px"><canvas width="25" height="25" data-qr="${f.code}"></canvas></div>
    <table class="t" style="flex:1 1 260px;width:auto"><tbody>
     <tr><td class="muted">Nhóm</td><td>${groupName(f.group)}</td></tr><tr><td class="muted">Phòng ban</td><td>${deptName(f.dept)}</td></tr><tr><td class="muted">Dung lượng</td><td class="num">${fsize(f.mb)}</td></tr><tr><td class="muted">Ngày tạo</td><td class="num">${f.date}</td></tr>
     <tr><td class="muted">Quyền truy cập</td><td>${deptName(f.dept)} (sửa) · Lãnh đạo phường (xem)</td></tr><tr><td class="muted">Phiên bản</td><td class="num">${f.ver} · lưu đủ lịch sử</td></tr><tr><td class="muted">Vị trí</td><td>NAS-CP-01 · bản sao trên cloud</td></tr></tbody></table></div>
   <div class="row">${isMedia&&S.role==='editor'?`<button class="btn primary" onclick="closeModal();S.view='compose';render();setTimeout(()=>pickFile('${f.id}'),60)">Chèn vào bài đang soạn</button>`:''}<button class="btn" onclick="toast('Đã tạo liên kết chia sẻ nội bộ, hết hạn sau 7 ngày')">Chia sẻ nội bộ</button><button class="btn" onclick="toast('Phiên bản ${f.ver} là bản mới nhất')">Lịch sử phiên bản</button></div>
  </div></div>`);afterRender();
}
function uploadFiles(list){
  const arr=[...list];if(!arr.length)return;
  const dept=S.role==='editor'?'vhxh':(DEPTS.some(x=>x.id===S.arch.folder)?S.arch.folder:'vpdu');const d=DEPTS.find(x=>x.id===dept);
  arr.forEach((file,i)=>{const ext=(file.name.split('.').pop()||'').toLowerCase();const type=['pdf','docx','xlsx','mp4','mp3'].includes(ext)?ext:['jpg','jpeg','png','webp'].includes(ext)?'jpg':'docx';
    const f={id:'u'+Date.now()+i,name:file.name,type,group:['jpg','mp4','mp3'].includes(type)?'tl':(S.arch.folder&&S.arch.folder[0]==='g'&&S.arch.folder.length===2?S.arch.folder:'g6'),dept,mb:Math.max(file.size/1048576,0.01),date:nowStr().slice(0,10),sort:9999,code:`CP.${d.code}.2026.${900+S.files.length%99}`,ver:1,status:'syncing'};S.files.unshift(f);
    setTimeout(()=>{f.status='backed';if(S.view==='archive')setArch({},true)},2400)});
  audit('Tải lên '+arr.length+' tệp','Kho dùng chung');S.arch.folder=S.arch.folder&&S.arch.folder.length===2?S.arch.folder:dept;S.arch.page=1;S.arch.type='all';S.arch.q='';toast('Đã tải lên '+arr.length+' tệp vào '+d.name+'. Đang sao lưu lên cloud…');render();
}

/* ---- departments ---- */
VIEWS.depts=()=>{
  if(!S.deptSel){
    return `<div class="sec-head"><div><span class="eyebrow">Không gian riêng của từng phòng ban</span><h1>Phòng ban</h1><p class="muted">Mỗi phòng ban có một tài khoản và mục riêng để đăng tải dự án, kế hoạch của phường. Phòng ban chỉ sửa nội dung của mình; lãnh đạo phường xem được toàn bộ.</p></div></div>
    ${['Đảng ủy','Mặt trận, đoàn thể','Chính quyền'].map(bk=>`<section class="grid" style="gap:10px"><h2>${bk}</h2><div class="grid g3">${DEPTS.filter(d=>d.block===bk).map(d=>{const pr=PROJ[d.id]||[],avg=Math.round(pr.reduce((a,p)=>a+p.p,0)/(pr.length||1));return `<button class="card dept-card" onclick="S.deptSel='${d.id}';S.deptTab='projects';render()"><div class="row between"><h3>${d.name}</h3>${ROLES[S.role].dept===d.id?'<span class="tag rust">Phòng của bạn</span>':''}</div><span class="small muted">Tài khoản: <b class="num">${d.acct}</b> · ${d.members} thành viên</span><div class="row between small"><span>${pr.length} dự án · ${(PLANS[d.id]||[]).length} kế hoạch</span><span class="num">${avg}%</span></div><div class="meter"><i style="width:${avg}%"></i></div></button>`}).join('')}</div></section>`).join('')}`;
  }
  const d=DEPTS.find(x=>x.id===S.deptSel),own=ROLES[S.role].dept===d.id||S.role==='office';const pr=PROJ[d.id]||[],pl=PLANS[d.id]||[];
  const fl=S.files.filter(f=>f.dept===d.id).slice(0,6);const nb=S.subs.filter(s=>s.dept===d.id);
  const tab=(k,t)=>`<button class="${S.deptTab===k?'on':''}" onclick="S.deptTab='${k}';render()">${t}</button>`;
  let body='';
  if(S.deptTab==='projects')body=`<div class="tbl-wrap"><table class="t"><thead><tr><th>Dự án</th><th>Nguồn kinh phí</th><th>Mốc tiếp theo</th><th>Trạng thái</th><th style="min-width:160px">Tiến độ</th></tr></thead><tbody>${pr.map((p,i)=>`<tr><td><b style="font-weight:600">${esc(p.n)}</b></td><td class="small">${p.b}</td><td class="small">${p.ms}</td><td><span class="pill ${p.p>=100?'p-published':p.p<25?'p-draft':'p-office'}">${p.s}</span></td><td><div class="row" style="flex-wrap:nowrap"><div class="meter" style="flex:1"><i style="width:${p.p}%"></i></div><span class="num small">${p.p}%</span>${own&&p.p<100?`<button class="btn sm" onclick="bump('${d.id}',${i})" aria-label="Cập nhật tiến độ">+10%</button>`:''}</div></td></tr>`).join('')}</tbody></table></div>
    ${own?`<form class="card grid" style="gap:10px" onsubmit="event.preventDefault();addProj('${d.id}')"><b>Đăng dự án mới</b><div class="fields"><div class="field"><label for="np-n">Tên dự án</label><input id="np-n" type="text" required placeholder="Ví dụ: Lắp màn hình tra cứu tại nhà văn hóa"></div><div class="field"><label for="np-b">Nguồn kinh phí</label><select id="np-b"><option>Chi thường xuyên</option><option>Ngân sách phường</option><option>Thuê dịch vụ</option><option>Xã hội hóa</option></select></div><div class="field"><label for="np-m">Mốc tiếp theo</label><input id="np-m" type="text" placeholder="Ví dụ: Khảo sát 11/2026"></div></div><div class="row"><button class="btn primary" type="submit">Đăng dự án</button><span class="small muted">Mặc định hiển thị nội bộ; công khai khi lãnh đạo phụ trách duyệt.</span></div></form>`:''}`;
  if(S.deptTab==='plans')body=`<div class="tbl-wrap"><table class="t"><thead><tr><th>Kỳ</th><th>Kế hoạch</th><th>Hiển thị</th><th style="min-width:160px">Hoàn thành</th></tr></thead><tbody>${pl.map(p=>`<tr><td><span class="tag">${p[0]}</span></td><td><b style="font-weight:600">${esc(p[1])}</b></td><td>${p[3]==='Công khai'?'<span class="pill p-published">Công khai</span>':'<span class="pill p-draft">Nội bộ</span>'}</td><td><div class="row" style="flex-wrap:nowrap"><div class="meter" style="flex:1"><i style="width:${p[2]}%"></i></div><span class="num small">${p[2]}%</span></div></td></tr>`).join('')}</tbody></table></div>
    ${own?`<form class="card grid" style="gap:10px" onsubmit="event.preventDefault();addPlan('${d.id}')"><b>Đăng kế hoạch</b><div class="fields"><div class="field"><label for="pl-k">Kỳ</label><select id="pl-k"><option>Năm</option><option>Quý</option><option>Tháng</option></select></div><div class="field" style="grid-column:span 2"><label for="pl-n">Tên kế hoạch</label><input id="pl-n" type="text" required placeholder="Ví dụ: Kế hoạch công tác tháng 11/2026"></div></div><button class="btn primary" type="submit" style="justify-self:start">Đăng kế hoạch</button></form>`:''}`;
  if(S.deptTab==='docs')body=`<div class="tbl-wrap"><table class="t"><tbody>${fl.map(f=>`<tr class="click" onclick="openFile('${f.id}')"><td><span class="fname">${ficon(f.type)}<b>${esc(f.name)}</b></span></td><td class="num small">${f.code}</td><td class="num small">${fsize(f.mb)}</td></tr>`).join('')}</tbody></table></div><button class="btn" style="justify-self:start" onclick="S.arch.folder='${d.id}';go('archive')">Mở thư mục phòng ban trong kho</button>`;
  if(S.deptTab==='posts')body=nb.length?`<div class="grid" style="gap:8px">${nb.map(s=>`<button class="k-card" onclick="openSub('${s.id}')"><b>${esc(s.title)}</b><span class="row between">${statusPill(s.status)}<span class="small muted">${s.kind}</span></span></button>`).join('')}</div>`:'<div class="empty">Phòng ban chưa có bài viết.</div>';
  return `<div class="row"><button class="btn sm" onclick="S.deptSel=null;render()">← Tất cả phòng ban</button></div>
  <div class="sec-head"><div><span class="eyebrow">${d.block}</span><h1>${d.name}</h1></div></div>
  <div class="acct"><span class="tag river">Tài khoản phòng ban</span><b class="num">${d.acct}</b><span class="muted">Quản trị: 1 · Thành viên: ${d.members} · Xác thực 2 lớp: bật</span>${own?'<span class="tag rust" style="margin-left:auto">Bạn có quyền chỉnh sửa</span>':'<span class="tag" style="margin-left:auto">Chỉ xem</span>'}</div>
  <div class="tabs">${tab('projects','Dự án')}${tab('plans','Kế hoạch')}${tab('docs','Tài liệu')}${tab('posts','Bài viết')}</div>
  <div class="grid" style="gap:14px">${body}</div>`;
};
function bump(d,i){const p=PROJ[d][i];p.p=Math.min(100,p.p+10);if(p.p>=100)p.s='Hoàn thành';else if(p.s==='Đang chuẩn bị')p.s='Đang thực hiện';audit('Cập nhật tiến độ '+p.p+'%',p.n);toast('Đã cập nhật tiến độ: '+p.p+'%');render()}
function addProj(d){const n=$('#np-n').value.trim();if(!n)return;(PROJ[d]=PROJ[d]||[]).unshift({n,b:$('#np-b').value,p:0,s:'Đang chuẩn bị',ms:$('#np-m').value.trim()||'Chưa xác định'});audit('Đăng dự án',n);toast('Đã đăng dự án');render()}
function addPlan(d){const n=$('#pl-n').value.trim();if(!n)return;(PLANS[d]=PLANS[d]||[]).unshift([$('#pl-k').value,n,0,'Nội bộ']);audit('Đăng kế hoạch',n);toast('Đã đăng kế hoạch');render()}

/* ---- dashboard ---- */
VIEWS.dashboard=()=>{
  const months=['T4','T5','T6','T7','T8','T9'],reads=[1240,1860,2410,3050,3720,4380];
  const byShelf=SHELVES.map(sh=>[sh,S.books.filter(b=>b.shelf===sh.id).reduce((a,b)=>a+b.views,0)]).sort((a,b)=>b[1]-a[1]);const mx=byShelf[0][1];
  const c={d:S.subs.filter(s=>s.status==='draft'||s.status==='returned').length,l:S.subs.filter(s=>s.status==='lead').length,o:S.subs.filter(s=>s.status==='office').length,p:S.subs.filter(s=>s.status==='published').length};const ct=c.d+c.l+c.o+c.p;
  const allP=Object.entries(PROJ).flatMap(([k,v])=>v.map(p=>({...p,d:k})));
  return `<div class="sec-head"><div><span class="eyebrow">Bảng điều hành · cập nhật ${nowStr()}</span><h1>Tổng quan Tủ sách và chuyển đổi số</h1></div><span class="tag">Số liệu minh họa</span></div>
  <div class="kpis">
    <div class="kpi"><span class="eyebrow">Lượt đọc tháng 9</span><b>4.380</b><span class="d">+17,7% so với tháng 8</span></div>
    <div class="kpi"><span class="eyebrow">Đầu sách</span><b>${S.books.length}</b><span class="small muted">6 kệ sách chính</span></div>
    <div class="kpi"><span class="eyebrow">Bản tin đã đăng</span><b>${S.news.length}</b><span class="small muted">Tháng 9/2026</span></div>
    <div class="kpi"><span class="eyebrow">Bài chờ duyệt</span><b>${c.l+c.o}</b><span class="d warn">${c.l} ở lãnh đạo ban · ${c.o} ở Văn phòng</span></div>
    <div class="kpi"><span class="eyebrow">Thời gian duyệt TB</span><b>1,6 ngày</b><span class="d">Mục tiêu dưới 3 ngày</span></div>
    <div class="kpi"><span class="eyebrow">Kho dùng chung</span><b>12,6 TB</b><span class="small muted">31% dung lượng NAS · sao lưu 02:00</span></div>
  </div>
  <div class="grid g2" style="align-items:start">
    <div class="card chart"><span class="eyebrow">Lượt đọc theo tháng, năm 2026</span><h3 style="margin:4px 0 10px">Lượt đọc tăng đều sau khi thêm sách nói</h3>${barChart(months,reads,5000)}</div>
    <div class="card"><span class="eyebrow">Lượt đọc theo kệ sách</span><h3 style="margin:4px 0 10px">Kệ được quan tâm nhiều nhất</h3>${byShelf.map(([sh,v])=>`<div class="hbar"><span style="overflow-wrap:anywhere">${sh.name}</span><div class="meter"><i style="width:${v/mx*100}%;background:${sh.color}"></i></div><span class="num small" style="text-align:right">${nf(v)}</span></div>`).join('')}</div>
  </div>
  <div class="card grid" style="gap:10px"><div class="row between"><div><span class="eyebrow">Luồng bài viết</span><h3>${ct} hồ sơ trong quy trình</h3></div><button class="btn sm" onclick="go('workflow')">Mở bảng phê duyệt</button></div>
    <div class="pipe">${[['Nháp, trả lại',c.d,'var(--surface-2)','var(--muted)'],['Chờ lãnh đạo ban',c.l,'var(--warn-soft)','var(--warn)'],['Văn phòng kiểm tra',c.o,'var(--info-soft)','var(--info)'],['Đã công khai',c.p,'var(--ok-soft)','var(--ok)']].filter(x=>x[1]).map(x=>`<div style="flex:${x[1]};background:${x[2]};color:${x[3]}">${x[0]}: ${x[1]}</div>`).join('')}</div></div>
  <div class="grid" style="gap:10px"><h2>Dự án của các phòng ban</h2>
    <div class="tbl-wrap"><table class="t"><thead><tr><th>Dự án</th><th>Phòng ban</th><th>Mốc tiếp theo</th><th style="min-width:170px">Tiến độ</th></tr></thead><tbody>${allP.sort((a,b)=>a.p-b.p).map(p=>`<tr class="click" onclick="S.deptSel='${p.d}';S.deptTab='projects';go('depts')"><td><b style="font-weight:600">${esc(p.n)}</b></td><td class="small">${deptName(p.d)}</td><td class="small">${p.ms}</td><td><div class="row" style="flex-wrap:nowrap"><div class="meter" style="flex:1"><i style="width:${p.p}%;${p.p<25?'background:var(--warn)':''}"></i></div><span class="num small">${p.p}%</span></div></td></tr>`).join('')}</tbody></table></div></div>
  <div class="grid" style="gap:10px"><h2>Hoạt động gần đây</h2>${logTable(S.log.slice(0,6))}</div>`;
};
function barChart(labels,vals,max){
  const W=560,H=240,pl=48,pr=10,pt=18,pb=30,iw=W-pl-pr,ih=H-pt-pb,step=iw/vals.length,bw=step*.56;let g='';
  for(let t=0;t<=5;t++){const v=max*t/5,y=pt+ih-ih*v/max;g+=`<line x1="${pl}" x2="${W-pr}" y1="${y}" y2="${y}" style="stroke:var(--line)" stroke-width="1"/><text x="${pl-8}" y="${y+4}" text-anchor="end" font-size="11" style="fill:var(--muted)">${nf(v)}</text>`}
  vals.forEach((v,i)=>{const x=pl+step*i+(step-bw)/2,h=ih*v/max,y=pt+ih-h,last=i===vals.length-1;g+=`<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="3" style="fill:${last?'var(--rust)':'var(--river)'};opacity:${last?1:.75}"/><text x="${x+bw/2}" y="${y-6}" text-anchor="middle" font-size="11" font-weight="600" style="fill:var(--ink)">${nf(v)}</text><text x="${x+bw/2}" y="${H-10}" text-anchor="middle" font-size="12" style="fill:var(--muted)">${labels[i]}</text>`});
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Biểu đồ lượt đọc theo tháng">${g}</svg>`;
}
function logTable(rows){return `<div class="tbl-wrap"><table class="t"><thead><tr><th>Thời gian</th><th>Người thực hiện</th><th>Thao tác</th><th>Đối tượng</th></tr></thead><tbody>${rows.map(l=>`<tr><td class="num small" style="white-space:nowrap">${l.time}</td><td class="small">${esc(l.by)}</td><td>${esc(l.act)}</td><td class="small num">${esc(l.obj)}</td></tr>`).join('')}</tbody></table></div>`}
VIEWS.log=()=>`<div class="sec-head"><div><span class="eyebrow">An toàn thông tin</span><h1>Nhật ký hệ thống</h1><p class="muted">Mọi thao tác soạn, duyệt, công khai, tải tệp và cấp quyền đều được lưu vết, phục vụ kiểm tra và hồ sơ an toàn hệ thống thông tin theo cấp độ.</p></div></div>${logTable(S.log)}`;


/* ---- accounts & permissions ---- */
const PERM_ROLES=['Người dân','Cán bộ biên soạn','Lãnh đạo ban','Văn phòng','Lãnh đạo phường','Quản trị hệ thống'];
const PERMS=[
 ['Xem Tủ sách, bản tin công khai',[1,1,1,1,1,1]],
 ['Soạn bài, lưu nháp, gửi duyệt',[0,1,0,1,0,0]],
 ['Duyệt nội dung của ban mình',[0,0,1,0,1,0]],
 ['Kiểm tra hình thức và công khai',[0,0,0,1,0,0]],
 ['Đăng dự án, kế hoạch của phòng ban',[0,1,1,1,0,0]],
 ['Xem kho của phòng ban mình',[0,1,1,1,1,0]],
 ['Xem toàn bộ kho dùng chung',[0,0,0,1,1,0]],
 ['Tải tệp lên kho',[0,1,1,1,0,0]],
 ['Xem bảng điều hành',[0,0,1,1,1,0]],
 ['Quản lý tài khoản, phân quyền',[0,0,0,0,0,1]],
 ['Xem nhật ký hệ thống',[0,0,0,1,1,1]]
];
S.accts=DEPTS.map((d,i)=>({id:d.acct,dept:d.id,members:d.members,mfa:i!==5,last:['30/09 08:41','30/09 07:55','28/09 16:20','28/09 10:02','30/09 09:05','28/09 15:10','30/09 09:12','30/09 08:30'][i],status:'active'}));
VIEWS.admin=()=>{
  const canEdit=S.role==='office'||S.role==='chief';
  return `<div class="sec-head"><div><span class="eyebrow">Quản trị</span><h1>Tài khoản và phân quyền</h1><p class="muted">Mỗi phòng ban có một tài khoản quản trị, được thêm tài khoản thành viên. Quyền gán theo vai trò; mọi thay đổi đều ghi nhật ký.</p></div></div>
  <div class="grid g4">
    <div class="kpi"><span class="eyebrow">Tài khoản phòng ban</span><b>${S.accts.length}</b><span class="small muted">${S.accts.filter(a=>a.status==='active').length} đang hoạt động</span></div>
    <div class="kpi"><span class="eyebrow">Tài khoản thành viên</span><b>${S.accts.reduce((a,x)=>a+x.members,0)}</b><span class="small muted">Cán bộ, công chức</span></div>
    <div class="kpi"><span class="eyebrow">Xác thực 2 lớp</span><b>${S.accts.filter(a=>a.mfa).length}/${S.accts.length}</b><span class="d ${S.accts.every(a=>a.mfa)?'':'warn'}">${S.accts.every(a=>a.mfa)?'Đã bật toàn bộ':'Còn tài khoản chưa bật'}</span></div>
    <div class="kpi"><span class="eyebrow">Chính sách mật khẩu</span><b>90 ngày</b><span class="small muted">Khóa sau 5 lần nhập sai</span></div>
  </div>
  <section class="grid" style="gap:10px"><h2>Tài khoản phòng ban</h2>
  <div class="tbl-wrap"><table class="t"><thead><tr><th>Tài khoản</th><th>Phòng ban</th><th>Thành viên</th><th>Xác thực 2 lớp</th><th>Đăng nhập gần nhất</th><th>Trạng thái</th><th></th></tr></thead><tbody>
  ${S.accts.map((a,i)=>`<tr><td class="num"><b style="font-weight:600">${a.id}</b></td><td class="small">${deptName(a.dept)}</td><td class="num">${a.members}</td><td>${a.mfa?'<span class="pill p-published">Đã bật</span>':`<span class="pill p-lead">Chưa bật</span>`}</td><td class="num small">${a.last}</td><td>${a.status==='active'?'<span class="pill p-published">Hoạt động</span>':'<span class="pill p-returned">Tạm khóa</span>'}</td>
  <td><div class="row" style="flex-wrap:nowrap">${canEdit?`${a.mfa?'':`<button class="btn sm" onclick="acctAct(${i},'mfa')">Bắt buộc 2 lớp</button>`}<button class="btn sm" onclick="acctAct(${i},'lock')">${a.status==='active'?'Tạm khóa':'Mở khóa'}</button><button class="btn sm" onclick="acctAct(${i},'reset')">Đặt lại mật khẩu</button>`:''}</div></td></tr>`).join('')}
  </tbody></table></div></section>
  <section class="grid" style="gap:10px"><div class="sec-head"><div><h2>Ma trận phân quyền theo vai trò</h2><p class="muted small" style="margin-top:6px">Bấm vào ô để bật, tắt quyền (minh họa). Quản trị hệ thống không đọc nội dung nghiệp vụ.</p></div></div>
  <div class="tbl-wrap"><table class="t perm"><thead><tr><th>Quyền</th>${PERM_ROLES.map(r=>`<th style="text-align:center">${r}</th>`).join('')}</tr></thead><tbody>
  ${PERMS.map((p,i)=>`<tr><td>${p[0]}</td>${p[1].map((v,j)=>`<td style="text-align:center"><button class="pc ${v?'on':''}" ${canEdit?`onclick="togglePerm(${i},${j})"`:'disabled'} aria-label="${p[0]} – ${PERM_ROLES[j]}">${v?'✓':''}</button></td>`).join('')}</tr>`).join('')}
  </tbody></table></div></section>
  <section class="grid g2">
    <div class="card"><span class="eyebrow">Đăng nhập</span><h3 style="margin:6px 0 10px">Chính sách truy cập</h3><ul class="small" style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px"><li>Tài khoản cấp theo phòng ban, không dùng chung mật khẩu cá nhân.</li><li>Bắt buộc xác thực 2 lớp qua ứng dụng xác thực trên điện thoại.</li><li>Phiên làm việc tự đóng sau 30 phút không thao tác.</li><li>Khi cán bộ chuyển công tác: chuyển quyền, dữ liệu ở lại phòng ban.</li><li>Có thể đăng nhập một lần (SSO) với hệ thống của tỉnh khi được cho phép kết nối.</li></ul></div>
    <form class="card grid" style="gap:10px" onsubmit="event.preventDefault();addAcct()"><span class="eyebrow">Cấp tài khoản</span><h3>Thêm tài khoản thành viên</h3>
      <div class="fields"><div class="field"><label for="na-name">Họ tên cán bộ</label><input id="na-name" type="text" required placeholder="Ví dụ: Nguyễn Văn A"></div><div class="field"><label for="na-dept">Phòng ban</label><select id="na-dept">${DEPTS.map(d=>`<option value="${d.id}">${d.name}</option>`).join('')}</select></div><div class="field"><label for="na-role">Vai trò</label><select id="na-role">${PERM_ROLES.slice(1,5).map(r=>`<option>${r}</option>`).join('')}</select></div></div>
      <button class="btn primary" type="submit" style="justify-self:start" ${canEdit?'':'disabled'}>Cấp tài khoản</button></form>
  </section>`;
};
function acctAct(i,a){const x=S.accts[i];if(a==='mfa'){x.mfa=true;audit('Bắt buộc xác thực 2 lớp',x.id);toast('Đã bắt buộc xác thực 2 lớp cho '+x.id)}if(a==='lock'){x.status=x.status==='active'?'locked':'active';audit(x.status==='active'?'Mở khóa tài khoản':'Tạm khóa tài khoản',x.id);toast((x.status==='active'?'Đã mở khóa ':'Đã tạm khóa ')+x.id)}if(a==='reset'){audit('Đặt lại mật khẩu',x.id);toast('Đã gửi liên kết đặt lại mật khẩu cho đầu mối '+x.id)}render()}
function togglePerm(i,j){if(j===5&&i!==9&&i!==10){toast('Quản trị hệ thống không được cấp quyền nội dung nghiệp vụ');return}PERMS[i][1][j]=PERMS[i][1][j]?0:1;audit((PERMS[i][1][j]?'Cấp quyền: ':'Thu hồi quyền: ')+PERMS[i][0],PERM_ROLES[j]);toast('Đã cập nhật quyền cho vai trò '+PERM_ROLES[j]);render()}
function addAcct(){const n=$('#na-name').value.trim();if(!n)return;const d=$('#na-dept').value;const a=S.accts.find(x=>x.dept===d);a.members++;audit('Cấp tài khoản thành viên ('+$('#na-role').value+')',n);toast('Đã cấp tài khoản cho '+n+' thuộc '+deptName(d));render()}

/* ---- digitize existing records of the 5 former wards ---- */
S.mig={state:'idle',step:0};
const MIG_SRC=[
 {k:'paper',name:'Hồ sơ giấy của 5 phường cũ',meta:'Cẩm Trung, Cẩm Thành, Cẩm Bình, Cẩm Tây, Cẩm Đông: nghị quyết, báo cáo, lịch sử địa phương',to:'Scan, nhận dạng chữ (OCR), gắn mã hồ sơ; tra cứu theo từ khóa trên kho dùng chung'},
 {k:'files',name:'Tệp Word, PDF trên máy các phòng ban',meta:'Tài liệu nghiệp vụ, biểu mẫu, kế hoạch lưu rải rác trên máy cá nhân, USB',to:'Đưa vào 7 nhóm kho nghiệp vụ, phân quyền theo phòng ban, lưu phiên bản'},
 {k:'media',name:'Ảnh, video tư liệu',meta:'Ảnh sự kiện, tư liệu truyền thống vùng mỏ của Phòng Văn hóa – Xã hội',to:'Lưu vào kho tư liệu, dùng lại khi biên soạn sách và bản tin'}
];
const MIG_ITEMS=[
 ['paper','Hồ sơ lưu trữ phường Cẩm Trung (bản scan)'],['paper','Hồ sơ lưu trữ phường Cẩm Thành (bản scan)'],['paper','Hồ sơ lưu trữ phường Cẩm Bình, Cẩm Tây, Cẩm Đông'],
 ['files','Tài liệu nghiệp vụ Văn phòng HĐND và UBND'],['files','Kế hoạch, báo cáo các phòng ban năm 2025–2026'],
 ['media','Ảnh tư liệu kỷ niệm Ngày truyền thống 12/11'],['media','Tư liệu lịch sử các phường trước sắp xếp'],['media','Ghi âm lời kể cựu thợ mỏ']
];
VIEWS.migrate=()=>{
  const M=S.mig,done=M.step,run=M.state==='running',fin=M.state==='done';
  return `<div class="sec-head"><div><span class="eyebrow">Hợp nhất dữ liệu sau sắp xếp</span><h1>Số hóa tài liệu hiện có</h1><p class="muted">Phường Cẩm Phả hình thành từ 5 phường cũ, tài liệu đang nằm ở nhiều nơi. Hệ thống đưa toàn bộ về một kho dùng chung, có mã hồ sơ, tìm được theo từ khóa và không thất lạc khi đổi cán bộ.</p></div>
    <button class="btn primary" onclick="runMig()" ${run?'disabled':''}>${fin?'Chạy lại số hóa thử':run?'Đang số hóa…':'Chạy thử số hóa'}</button></div>
  <div class="grid g3">${MIG_SRC.map(x=>`<div class="card grid" style="gap:8px"><span class="eyebrow">Nguồn</span><h3>${x.name}</h3><p class="small muted">${x.meta}</p><div class="mig-arrow">↓</div><p class="small"><b>Sau số hóa:</b> ${x.to}</p></div>`).join('')}</div>
  <section class="card grid" style="gap:10px"><div class="row between"><h3>Tiến trình số hóa</h3><span class="small muted num">${done}/${MIG_ITEMS.length} hạng mục</span></div>
    <div class="meter" style="height:10px"><i style="width:${done/MIG_ITEMS.length*100}%;transition:width .4s"></i></div>
    <div class="grid" style="gap:6px">${MIG_ITEMS.map((it,i)=>`<div class="mig-row ${i<done?'ok':i===done&&run?'run':''}"><span class="mi">${i<done?'✓':i===done&&run?'…':''}</span><span class="tag">${MIG_SRC.find(x=>x.k===it[0]).name.split(' ').slice(0,3).join(' ')}</span><span>${it[1]}</span></div>`).join('')}</div>
    ${fin?`<div class="banner ok"><span><b>Hoàn tất số hóa thử.</b> Tư liệu lịch sử của các phường trước sắp xếp đã có trên kệ Di tích vùng mỏ và trong kho dùng chung.</span><button class="btn sm" onclick="go('shelves',{shelf:'ditich'})">Mở kệ Di tích vùng mỏ</button></div>`:''}
  </section>`;
};
function runMig(){
  const M=S.mig;M.state='running';M.step=0;render();
  const tick=()=>{M.step++;if(M.step>=MIG_ITEMS.length){M.state='done';
      if(!S.books.some(b=>b.migrated)){[['Lịch sử các phường trước sắp xếp','Cẩm Trung, Cẩm Thành, Cẩm Bình, Cẩm Tây, Cẩm Đông'],['Tư liệu Ngày truyền thống 12/11','Ảnh và hồ sơ kỷ niệm qua các năm'],['Lời kể cựu thợ mỏ','Ghi âm và bản chép lời']].forEach((x,i)=>S.books.unshift({id:'bm'+i,shelf:'ditich',title:x[0],sub:x[1],flags:['flip','media'],views:0,author:'Phòng Văn hóa – Xã hội',date:nowStr().slice(0,10),isNew:true,migrated:true}));
        const olds=['Cẩm Trung','Cẩm Thành','Cẩm Bình','Cẩm Tây','Cẩm Đông'];
        for(let i=0;i<5;i++)S.files.unshift({id:'fm'+i,name:'Hồ sơ lưu trữ phường '+olds.at(i)+' (bản scan).pdf',type:'scan',group:'hs',dept:'vpub',mb:18+i*4,date:nowStr().slice(0,10),sort:9999,code:'CP.VPUB.2026.S'+(10+i),ver:1,status:'backed'});}
      audit('Số hóa thử: 8 hạng mục','Hồ sơ 5 phường cũ, tệp phòng ban, tư liệu');toast('Đã số hóa thử xong 8 hạng mục');}
    if(S.view==='migrate')render();if(M.state==='running')setTimeout(tick,650)};
  setTimeout(tick,650);
}

/* ---- information security ---- */
function archDiagram(){
  const box=(x,y,w,h,t,sub,cls)=>`<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" class="${cls||'db'}"/><text x="${x+w/2}" y="${y+h/2-(sub?6:-5)}" text-anchor="middle" class="dt">${t}</text>${sub?`<text x="${x+w/2}" y="${y+h/2+14}" text-anchor="middle" class="ds">${sub}</text>`:''}</g>`;
  const arr=(x1,y1,x2,y2,lab,ly)=>`<path d="M${x1} ${y1}L${x2} ${y2}" class="da" marker-end="url(#ah)"/>${lab?`<text x="${(x1+x2)/2}" y="${ly||((y1+y2)/2-8)}" text-anchor="middle" class="dl">${lab}</text>`:''}`;
  return `<svg viewBox="0 0 940 390" role="img" aria-label="Sơ đồ kiến trúc hệ thống"><defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dh"/></marker></defs>
   <rect x="300" y="14" width="340" height="150" rx="16" class="dz"/><text x="316" y="38" class="dzt">CLOUD TRONG NƯỚC</text>
   <rect x="300" y="210" width="340" height="166" rx="16" class="dz2"/><text x="316" y="234" class="dzt">TRỤ SỞ PHƯỜNG · MẠNG NỘI BỘ</text>
   ${box(20,60,210,70,'Người dân','Máy tính, điện thoại, mã QR','dp')}
   ${box(20,262,210,70,'Cán bộ, công chức','Tài khoản phòng ban + 2 lớp','dp')}
   ${box(330,52,280,52,'Cổng Tủ sách công khai','HTTPS · tên miền .gov.vn')}
   ${box(410,110,200,56,'Bản sao lưu mã hóa','30 phiên bản · giữ 30 ngày','db2')}
   ${box(330,250,280,56,'Hệ thống biên soạn – phê duyệt','Phân quyền · nhật ký thao tác')}
   ${box(330,314,280,52,'NAS-CP-01 · Kho dùng chung','RAID 6 · 40 TB')}
   ${box(700,40,220,76,'Nguồn chính thống','vbpl.vn · chinhphu.vn · quangninh.gov.vn','dp')}
   ${arr(230,95,326,78,'Chỉ đọc',80)}
   ${arr(230,297,326,280,'Đăng nhập',283)}
   ${arr(390,250,390,108,'Đẩy nội dung đã duyệt',184)}
   ${arr(612,340,660,340,'')}<path d="M660 340V138H614" class="da" marker-end="url(#ah)"/><text x="676" y="236" class="dl" transform="rotate(-90 676 236)" text-anchor="middle">Sao lưu 02:00 hằng đêm</text>
   ${arr(612,78,698,78,'Liên kết',70)}
  </svg>`;
}
VIEWS.security=()=>`<div class="sec-head"><div><span class="eyebrow">An toàn thông tin</span><h1>Dữ liệu do phường làm chủ</h1><p class="muted">Hệ thống đặt trên hạ tầng trong nước, tên miền của cơ quan, phân quyền theo phòng ban và lưu vết mọi thao tác. Dữ liệu của phường không phụ thuộc nền tảng nước ngoài.</p></div></div>
  <section class="card diagram">${archDiagram()}</section>
  <div class="grid g3">
   ${[['Dữ liệu trong lãnh thổ Việt Nam','Cổng công khai và bản sao lưu đặt tại nhà cung cấp cloud trong nước; kho nghiệp vụ đặt tại trụ sở phường.'],
      ['Tên miền của cơ quan','Truy cập qua tên miền .gov.vn của phường hoặc tỉnh, người dân phân biệt được trang thật.'],
      ['Hồ sơ cấp độ an toàn hệ thống','VHMT lập hồ sơ đề xuất cấp độ theo quy định, trình phê duyệt trước khi đưa vào vận hành.'],
      ['Sao lưu 3 – 2 – 1','Ba bản dữ liệu, hai loại thiết bị, một bản ở ngoài trụ sở. Diễn tập khôi phục định kỳ 6 tháng.'],
      ['Không lưu tài liệu mật','Quy chế sử dụng nêu rõ loại tài liệu được đưa lên. Tài liệu mật xử lý trên hệ thống riêng theo quy định.'],
      ['Lưu vết toàn bộ thao tác','Soạn, duyệt, công khai, tải tệp, cấp quyền đều ghi nhật ký, phục vụ kiểm tra khi cần.']].map(x=>`<div class="card"><h3 style="margin-bottom:6px">${x[0]}</h3><p class="small muted">${x[1]}</p></div>`).join('')}
  </div>
  <section class="panel" style="grid-template-columns:auto minmax(0,1fr)"><div class="iso"><b>ISO/IEC</b><span>27001:2022</span></div><div class="grid" style="gap:8px"><span class="eyebrow">Năng lực đơn vị triển khai</span><h2>VHMT vận hành theo hệ thống quản lý an toàn thông tin ISO/IEC 27001:2022</h2><p>Quy trình kiểm soát truy cập, sao lưu, xử lý sự cố và bảo mật dữ liệu khách hàng được đánh giá độc lập, giám sát định kỳ.</p></div></section>`;


/* ---- internal business repository (7 groups) ---- */
S.kho={g:null,q:''};
function openKho(g){if(S.role==='public'){loginModal(g);return}S.kho.g=g||null;S.kho.q='';go('kho')}
function loginModal(g){
  modal(`<div class="modal narrow" style="width:min(480px,100%)"><div class="m-head"><div><span class="eyebrow">Khu vực nội bộ</span><h3>Đăng nhập kho nghiệp vụ</h3></div><button class="x" onclick="closeModal()" aria-label="Đóng">×</button></div>
  <div class="m-body grid" style="gap:12px">
    <div class="field"><label for="lg-acct">Tài khoản phòng ban</label><select id="lg-acct">${DEPTS.map(d=>`<option value="${d.id}" ${d.id==='vhxh'?'selected':''}>${d.acct} · ${d.name}</option>`).join('')}</select></div>
    <div class="field"><label for="lg-otp">Mã xác thực 6 số trên ứng dụng điện thoại</label><input id="lg-otp" type="text" inputmode="numeric" value="482 913" aria-describedby="lg-note"></div>
    <p class="small muted" id="lg-note">Bản trình diễn dùng tài khoản mẫu, không cần mật khẩu thật. Hệ thống chính thức yêu cầu mật khẩu và mã xác thực 2 lớp; có thể đăng nhập một lần với hệ thống của tỉnh khi được cho phép.</p>
    <button class="btn primary" style="justify-self:start" onclick="doLogin('${g||''}')">Đăng nhập</button>
  </div></div>`);
}
function doLogin(g){const d=$('#lg-acct').value;closeModal();S.role=d==='vpdu'?'office':'editor';$('#role').value=S.role;audit('Đăng nhập kho nghiệp vụ',DEPTS.find(x=>x.id===d).acct);S.kho.g=g||null;S.kho.q='';toast('Đã đăng nhập bằng tài khoản '+DEPTS.find(x=>x.id===d).acct);go('kho')}
VIEWS.kho=()=>{
  const K=S.kho,all=S.files.filter(f=>f.group&&f.group[0]==='g');
  if(K.g){
    const g=GROUPS.find(x=>x.id===K.g),k=GROUPS.indexOf(g)+1;let fs=all.filter(f=>f.group===g.id);
    if(K.q){const q=K.q.toLowerCase();fs=fs.filter(f=>f.name.toLowerCase().includes(q)||f.code.toLowerCase().includes(q))}
    const byDept=DEPTS.map(d=>[d,all.filter(f=>f.group===g.id&&f.dept===d.id).length]).filter(x=>x[1]);
    return `<div class="row"><button class="btn sm" onclick="S.kho.g=null;S.kho.q='';render()">← Kho nghiệp vụ</button></div>
    <section class="kho-head"><span class="kn big">${String(k).padStart(2,'0')}</span><div style="min-width:0"><span class="eyebrow">Kho nghiệp vụ nội bộ · nhóm ${k}/7</span><h1 style="font-size:clamp(26px,3.4vw,38px)">${g.name}</h1><p class="muted">${GDESC[g.id]}</p></div></section>
    <div class="row"><input id="k-q" type="search" placeholder="Tìm trong nhóm theo tên hoặc mã hồ sơ…" value="${esc(K.q)}" oninput="S.kho.q=this.value;render();const e=document.getElementById('k-q');e.focus();e.setSelectionRange(e.value.length,e.value.length)" style="flex:1 1 260px" aria-label="Tìm trong nhóm">${S.role!=='chief'?`<label class="btn primary" for="k-up" style="cursor:pointer">Thêm tài liệu vào nhóm<input id="k-up" type="file" multiple hidden onchange="S.arch.folder='${g.id}';uploadFiles(this.files);S.view='kho';render()"></label>`:''}</div>
    <div class="chips-row">${byDept.map(([d,n])=>`<span class="tag">${d.name} · ${n}</span>`).join('')}</div>
    ${archTable(fs.slice(0,15),fs.length,1).replace(/<div class="pager">[\s\S]*$/,'')}
    <p class="small muted">Hiển thị ${Math.min(15,fs.length)} / ${fs.length} tài liệu mẫu của nhóm. Bấm vào tài liệu để xem trước, mã hồ sơ và quyền truy cập.</p>`;
  }
  const recent=all.slice(0,6);
  return `<div class="sec-head"><div><span class="eyebrow">Dành cho cán bộ, công chức</span><h1>Kho nghiệp vụ nội bộ</h1><p class="muted">Tài liệu nghiệp vụ không công khai, sắp xếp theo 7 nhóm VHMT đề xuất, phường điều chỉnh theo thực tế. Tài liệu lưu trên kho dùng chung tại trụ sở, sao lưu hằng đêm, phân quyền theo phòng ban.</p></div>
    <button class="btn" onclick="S.arch={folder:'kho',q:'',type:'all',page:1};go('archive')">Mở trong Kho lưu trữ</button></div>
  <div class="kho-grid">${GROUPS.map((g,k)=>{const n=all.filter(f=>f.group===g.id).length,last=all.find(f=>f.group===g.id);return `<button class="kho-card" onclick="S.kho.g='${g.id}';S.kho.q='';render()"><span class="kn">${String(k+1).padStart(2,'0')}</span><b>${g.name}</b><small>${GDESC[g.id]}</small><span class="kc-foot"><span class="num">${n} tài liệu</span>${last?`<span class="muted">Mới: ${last.date}</span>`:''}</span></button>`}).join('')}<button class="kho-card kho-all" onclick="S.arch={folder:'kho',q:'',type:'all',page:1};go('archive')"><span class="kn">⌕</span><b>Tìm trong toàn bộ kho</b><small>Tìm theo tên hoặc mã hồ sơ trên cả 7 nhóm, lọc theo phòng ban và loại tệp.</small><span class="kc-foot"><span class="num">${all.length} tài liệu</span><span>Mở →</span></span></button></div>
  <section class="grid" style="gap:10px"><h2>Tài liệu mới cập nhật</h2>
    <div class="tbl-wrap"><table class="t"><thead><tr><th>Tên tài liệu</th><th>Nhóm</th><th>Phòng ban</th><th>Ngày</th></tr></thead><tbody>${recent.map(f=>`<tr class="click" onclick="openFile('${f.id}')"><td><span class="fname">${ficon(f.type)}<b>${esc(f.name)}</b></span></td><td class="small">${groupName(f.group)}</td><td class="small">${deptName(f.dept)}</td><td class="num small">${f.date}</td></tr>`).join('')}</tbody></table></div></section>`;
};


/* ---- intro: from mock-up to working system ---- */
function showIntro(){
  const el=$('#intro');el.hidden=false;document.body.style.overflow='hidden';
  el.innerHTML=`<div class="in-wrap">
   <div class="in-top"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMTI4IiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCI+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjU0IiByPSI0NCIgZmlsbD0iI0YwOEE1RCIvPgo8cGF0aCBkPSJNNDIgNzAgTDYyIDM4IEw3NCA1MiBMOTIgMjIgTDExMiA1MCBMMTI2IDM0IEwxNTAgNzBaIiBmaWxsPSIjMEI0RjU3Ii8+CjxnIHN0cm9rZT0iI0ZCRjZFQyIgc3Ryb2tlLXdpZHRoPSIyLjQiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik04NiA3MCBMOTYgMzAgTDEwNCAzMCBMMTE0IDcwIE05MCA1NiBIMTEwIE05MiA0NCBIMTA4Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMjciIHI9IjYiLz48L2c+CjxwYXRoIGQ9Ik0zNCA3MiBxMTEgLTcgMjIgMCB0MjIgMCB0MjIgMCB0MjIgMCB0MjIgMCB0MjIgMCIgc3Ryb2tlPSIjMUY3QThDIiBzdHJva2Utd2lkdGg9IjUiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNNDQgODIgcTExIC02IDIyIDAgdDIyIDAgdDIyIDAgdDIyIDAgdDIyIDAiIHN0cm9rZT0iIzFGN0E4QyIgc3Ryb2tlLXdpZHRoPSIzLjUiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgb3BhY2l0eT0iLjciLz4KPHRleHQgeD0iMTAwIiB5PSIxMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSInQmUgVmlldG5hbSBQcm8nLCdTZWdvZSBVSScsQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMSIgZm9udC13ZWlnaHQ9IjgwMCIgbGV0dGVyLXNwYWNpbmc9IjEuNSIgZmlsbD0iIzBCNEY1NyI+Q+G6qE0gUEjhuqI8L3RleHQ+Cjwvc3ZnPg==" alt="Biểu trưng Tủ sách Cẩm Phả"><span class="in-x">×</span><span class="vh">VHMT</span><span class="small muted">Tủ sách điện tử phường Cẩm Phả · Bản trình diễn đề xuất 30/09/2026</span></div>
   <h1>Tủ sách điện tử phường Cẩm Phả</h1>
   <p class="lead">Không gian tri thức số của đất mỏ: người dân đọc, nghe sách về lịch sử, truyền thống, văn hóa địa phương; cán bộ có kho nghiệp vụ và dữ liệu dùng chung sau khi hợp nhất 5 phường.</p>
   <div class="in-cols">
     <div class="in-col"><span class="eyebrow">Hiện trạng</span><h3>Sau sắp xếp từ 5 phường</h3><ul><li>Chưa có tủ sách, thư viện số của phường</li><li>Tư liệu truyền thống vùng mỏ chưa được hệ thống hóa</li><li>Hồ sơ của 5 phường cũ lưu ở nhiều nơi</li><li>Tài liệu nghiệp vụ trên máy cá nhân, USB, nhóm Zalo</li><li>Chưa có số liệu văn hóa đọc để báo cáo</li></ul></div>
     <div class="in-arrow">→</div>
     <div class="in-col hl"><span class="eyebrow">VHMT đề xuất</span><h3>Tủ sách và hệ thống nghiệp vụ</h3><ul><li>Cổng Tủ sách 6 kệ, sách đa phương tiện, người đọc AI</li><li>Các ban tự biên soạn từ file Word, hai lần duyệt</li><li>Kho nghiệp vụ nội bộ theo 7 nhóm, phân quyền</li><li>Số hóa, hợp nhất hồ sơ của 5 phường cũ</li><li>Tài khoản phòng ban, bảng điều hành cho lãnh đạo</li><li>Kho dữ liệu tại trụ sở, sao lưu hằng đêm</li></ul></div>
     <div class="in-arrow">→</div>
     <div class="in-col"><span class="eyebrow">Giá trị cho phường</span><h3>Vận hành lâu dài</h3><ul><li>Lưu giữ, lan tỏa truyền thống “Kỷ luật và Đồng tâm”</li><li>Nội dung cập nhật thường xuyên, có kiểm soát</li><li>Tài liệu không thất lạc khi đổi cán bộ</li><li>Dữ liệu đặt trong nước, tên miền cơ quan</li><li>Có số liệu báo cáo văn hóa đọc, chuyển đổi số</li></ul></div>
   </div>
   <div class="row" style="justify-content:center;margin-top:8px"><button class="btn primary" onclick="hideIntro()">Vào bản trình diễn</button><button class="btn" onclick="hideIntro();S.showNew=true;render();toast('Đang bật chú giải chức năng')">Vào và bật chú giải chức năng</button><button class="btn" onclick="hideIntro();toggleScript()">Xem kịch bản 12 bước</button></div>
   <p class="small muted" style="text-align:center">Nội dung và số liệu trong bản trình diễn là minh họa.</p>
  </div>`;
}
function hideIntro(){$('#intro').hidden=true;document.body.style.overflow=''}

/* ---- search ---- */
function doSearch(q){S.q=(q||'').trim();S.view='search';render();window.scrollTo({top:0})}
VIEWS.search=()=>{
  const q=S.q.toLowerCase();const bs=S.books.filter(b=>(b.title+' '+b.sub).toLowerCase().includes(q));const ns=S.news.filter(n=>(n.title+' '+n.sum).toLowerCase().includes(q));
  const fs=S.role==='public'?[]:S.files.filter(f=>f.name.toLowerCase().includes(q)).slice(0,8);
  return `<div class="sec-head"><div><span class="eyebrow">Kết quả tìm kiếm</span><h1>“${esc(S.q)}”</h1><p class="muted">${bs.length} sách · ${ns.length} bản tin${S.role==='public'?'':' · '+fs.length+' tài liệu trong kho'}</p></div></div>
  ${bs.length?`<section class="grid" style="gap:10px"><h2>Sách</h2><div class="grid gbooks">${bs.map(bookCard).join('')}</div></section>`:''}
  ${ns.length?`<section class="card" style="padding-block:4px">${ns.map(newsRow).join('')}</section>`:''}
  ${fs.length?`<section class="grid" style="gap:10px"><h2>Tài liệu trong kho</h2>${archTable(fs,fs.length,1).replace(/<div class="pager">[\s\S]*$/,'')}</section>`:''}
  ${!bs.length&&!ns.length&&!fs.length?'<div class="empty">Không tìm thấy kết quả. Thử từ khóa khác, ví dụ “thợ mỏ”, “Luật Đất đai”, “ẩm thực”.</div>':''}`;
};

/* ---------- modal plumbing ---------- */
function modal(html){$('#modal-root').innerHTML=`<div class="modal-back" onclick="if(event.target===this)closeModal()">${html}</div>`;document.body.style.overflow='hidden'}
function closeModal(){stopSpeak();stopMedia();$('#modal-root').innerHTML='';document.body.style.overflow='';R=null}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#modal-root').innerHTML)closeModal();if(R&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){if(e.key==='ArrowRight')turn(1);if(e.key==='ArrowLeft')turn(-1)}});

/* ---------- news article ---------- */
function openNews(id){
  const n=S.news.find(x=>x.id===id);n.views++;
  const body=n.body?n.body:(NEWS_BODY[n.id]||[n.sum,'Nội dung bản tin minh họa. Khi vận hành chính thức, bản tin do phòng ban biên soạn trên hệ thống, lãnh đạo phụ trách duyệt và Văn phòng công khai.']).map(p=>`<p>${esc(p)}</p>`).join('');
  modal(`<div class="modal narrow"><div class="m-head"><span class="eyebrow">${esc(n.cat)} · ${n.date}</span><button class="x" onclick="closeModal()" aria-label="Đóng">×</button></div><div class="m-body grid" style="gap:14px"><h2 style="font-size:26px">${esc(n.title)}</h2><div class="fig">${scene('bridge',n.title.length)}</div><div class="page" style="min-height:0;box-shadow:none;border:0;padding:0;background:none;color:var(--ink)">${body}</div><div class="row small muted"><span>Nguồn: ${deptName(n.dept)}</span><span>·</span><span class="num">${nf(n.views)} lượt xem</span></div>
  <div class="row"><button class="btn" onclick="speakNews('${n.id}')">Nghe bản tin (Hải An)</button></div></div></div>`);
}
function speakNews(id){const n=S.news.find(x=>x.id===id);const txt=n.title+'. '+(n.body?stripTags(n.body):n.sum);R={voice:'nu',rate:1,news:true};speak(txt,null)}

/* ---------- book reader ---------- */
let R=null;
function lawBook(){return S.books.find(b=>b.flags.includes('law'))}
function buildPages(b){
  const T=SHELF_TEXT[b.shelf],P=[{k:'cover',t:'Bìa sách'}];
  if(b.content){P.push({k:'html',t:'Nội dung',h:b.title,html:b.content});P.push({k:'end',t:'Kết thúc'});return P}
  if(b.flags.includes('law')){
    P.push({k:'text',t:'Giới thiệu',h:'Vì sao cần đọc sổ tay này',p:['Luật Đất đai số 31/2024/QH15 được Quốc hội thông qua ngày 18 tháng 01 năm 2024 và có hiệu lực từ ngày 01 tháng 8 năm 2024.','Sổ tay tóm tắt những điểm mới liên quan trực tiếp đến đời sống người dân, trình bày ngắn gọn, có giọng đọc để người cao tuổi dễ tiếp cận.']});
    P.push({k:'text',t:'Những điểm cần biết',h:'Những điểm người dân cần biết',p:['Sổ tay tóm tắt các nội dung người dân thường hỏi: quyền của người sử dụng đất, cấp giấy chứng nhận, bồi thường khi Nhà nước thu hồi đất.','Nội dung chi tiết từng điều khoản được liên kết về Cơ sở dữ liệu quốc gia về văn bản pháp luật, bảo đảm người đọc luôn xem đúng bản hiện hành.']});
    P.push({k:'video',t:'Video tuyên truyền',h:'Video tuyên truyền (minh họa)'});
    P.push({k:'audio',t:'Bản ghi âm',h:'Nghe toàn văn sổ tay'});
    P.push({k:'law',t:'Văn bản liên kết'});P.push({k:'end',t:'Kết thúc'});return P;
  }
  P.push({k:'text',t:'Lời giới thiệu',h:'Lời giới thiệu',p:[`Cuốn “${b.title}” thuộc kệ ${shelfOf(b).name} của Tủ sách điện tử phường Cẩm Phả. ${b.sub}.`,T[0]]});
  P.push({k:'image',t:'Hình ảnh tư liệu',h:'Hình ảnh tư liệu'});
  P.push({k:'text',t:'Nội dung chính',h:'Nội dung chính',p:[T[1],T[2]]});
  if(b.flags.includes('media')){P.push({k:'video',t:'Phim tư liệu',h:'Phim tư liệu ngắn (minh họa)'});P.push({k:'gallery',t:'Bộ sưu tập ảnh',h:'Bộ sưu tập ảnh'})}
  if(b.flags.includes('audio'))P.push({k:'audio',t:'Sách nói',h:'Nghe lời kể, thuyết minh'});
  P.push({k:'law',t:'Nguồn và liên kết'});P.push({k:'end',t:'Kết thúc'});
  return P;
}
function openBook(id){const b=S.books.find(x=>x.id===id);b.views++;R={book:b,pages:buildPages(b),i:0,voice:'nu',rate:1};renderReaderShell()}
function renderReaderShell(){
  const b=R.book,sh=shelfOf(b);
  modal(`<div class="modal"><div class="m-head"><div style="min-width:0"><span class="eyebrow">${sh.name} · ${esc(b.author)}</span><h3>${esc(b.title)}</h3></div><button class="x" onclick="closeModal()" aria-label="Đóng">×</button></div>
  <div class="m-body"><div class="reader"><div style="min-width:0"><div id="page-host"></div>
    <div class="pager"><button class="btn" id="prev" onclick="turn(-1)">← Trang trước</button><span class="small muted num" id="pnum"></span><button class="btn river" id="next" onclick="turn(1)">Trang sau →</button></div></div>
    <aside class="side">
      <div class="card"><span class="eyebrow">Người đọc AI</span><div class="voice-pick" style="margin-top:10px"><button id="v-nam" onclick="setVoice('nam')"><b>Minh Khôi</b><br><span class="muted">Giọng nam</span></button><button id="v-nu" onclick="setVoice('nu')"><b>Hải An</b><br><span class="muted">Giọng nữ</span></button></div>
        <div class="row" style="margin-top:10px"><button class="btn primary sm" onclick="readPage()">Nghe trang này</button><button class="btn sm" onclick="stopSpeak()">Dừng</button>
        <select id="rate" onchange="R.rate=+this.value" aria-label="Tốc độ đọc"><option value="0.85">Chậm</option><option value="1" selected>Bình thường</option><option value="1.2">Nhanh</option></select></div>
        <p class="small muted" id="tts-note" style="margin-top:8px">Câu đang đọc được tô sáng để người đọc dễ theo dõi.</p></div>
      <div class="card"><span class="eyebrow">Mục lục</span><div class="toc" id="toc" style="margin-top:8px"></div></div>
      <div class="card"><span class="eyebrow">Hỏi đáp về nội dung</span> ${nb("Người đọc đặt câu hỏi, AI trả lời từ nội dung sách đã duyệt.")}<form class="row" style="margin-top:8px" onsubmit="event.preventDefault();ask()"><input id="ask-q" type="text" placeholder="Ví dụ: Sách này nói về gì?" style="flex:1 1 140px;min-width:0"><button class="btn sm" type="submit">Hỏi</button></form><p class="small" id="ask-a" style="margin-top:8px"></p></div>
    </aside></div></div></div>`);
  drawPage(false);
}
function setVoice(v){R.voice=v;$('#v-nam').classList.toggle('on',v==='nam');$('#v-nu').classList.toggle('on',v==='nu')}
function turn(d){if(!R||!R.pages)return;const n=R.i+d;if(n<0||n>=R.pages.length)return;stopSpeak();stopMedia();R.i=n;drawPage(true)}
function gotoPage(i){stopSpeak();stopMedia();R.i=i;drawPage(true)}
function drawPage(anim){
  const b=R.book,p=R.pages[R.i],sh=shelfOf(b),folio=`<div class="folio"><span>Tủ sách điện tử phường Cẩm Phả</span><span class="num">${R.i+1} / ${R.pages.length}</span></div>`;
  let h='';
  if(p.k==='cover')h=`<div class="page page-cover ${anim?'turn':''}">${coverHtml(b)}</div>`;
  else{
    let inner='';
    if(p.k==='text')inner=`<h2>${esc(p.h)}</h2>${p.p.map(t=>`<p>${t.split(/(?<=[.!?])\s+/).map(s=>`<span class="s">${esc(s)}</span>`).join(' ')}</p>`).join('')}`;
    if(p.k==='html')inner=`<h2>${esc(p.h)}</h2><div class="preview-doc" style="max-height:none;border:0;padding:0;background:none">${p.html}</div>`;
    if(p.k==='image')inner=`<h2>${esc(p.h)}</h2><div class="fig">${sceneFor(b,1)}</div><p class="cap">Ảnh minh họa. Ảnh gốc lưu trong kho dữ liệu dùng chung, mã hồ sơ CP.VHXH.2026.${String(100+b.title.length)} · Nguồn: ${esc(b.author)}.</p>`;
    if(p.k==='video')inner=`<h2>${esc(p.h)}</h2>${videoBox(b.title)}<p class="cap">Phim ngắn phát trực tiếp trên hệ thống, không phụ thuộc nền tảng video nước ngoài.</p>`;
    if(p.k==='gallery')inner=`<h2>${esc(p.h)}</h2><div class="gallery">${[2,3,4,5,6,7].map(i=>`<div class="fig">${sceneFor(b,i)}</div>`).join('')}</div><p class="cap">6 ảnh minh họa · xem toàn màn hình trên hệ thống chính thức.</p>`;
    if(p.k==='audio')inner=`<h2>${esc(p.h)}</h2><p>Bản ghi âm do Người đọc AI thực hiện từ nội dung đã được duyệt, hoặc ghi âm lời kể thực tế lưu trong kho.</p>${audioBox(b.title,'06:40')}`;
    if(p.k==='law')inner=`<h2>Nguồn tư liệu và văn bản liên kết</h2><p>Các văn bản dưới đây được liên kết về nguồn chính thống, luôn dẫn tới bản hiện hành.</p><div class="grid" style="gap:8px">${(b.flags.includes('law')?[LAWS[0],LAWS[1],LAWS[6]]:[LAWS[0],LAWS[4],LAWS[6]]).map(l=>`<a class="acct" style="text-decoration:none;color:var(--ink)" href="${l.url}" target="_blank" rel="noopener"><span class="tag river">${l.g}</span><b style="font-weight:600">${b.flags.includes('law')&&l===LAWS[0]?'Luật Đất đai số 31/2024/QH15 – tra cứu tại ':''}${l.name}</b><span class="small muted" style="margin-left:auto">↗</span></a>`).join('')}</div><p class="cap">Biên soạn: ${esc(b.author)} · Duyệt: lãnh đạo phụ trách · Công khai: Văn phòng Đảng ủy.</p>`;
    if(p.k==='end')inner=`<h2>Cảm ơn bạn đã đọc</h2><p>Bạn có thể nghe lại bằng giọng đọc AI, chia sẻ bằng mã QR, hoặc xem các cuốn khác trong kệ ${sh.name}.</p><div class="row"><div class="qr" style="width:96px;height:96px"><canvas width="25" height="25" data-qr="${b.id}"></canvas></div><button class="btn" onclick="closeModal();go('shelves',{shelf:'${b.shelf}'})">Xem kệ ${sh.name}</button></div>`;
    h=`<div class="page ${anim?'turn':''}">${inner}${folio}</div>`;
  }
  $('#page-host').innerHTML=h;$('#pnum').textContent=`Trang ${R.i+1} / ${R.pages.length}`;
  $('#prev').disabled=R.i===0;$('#next').disabled=R.i===R.pages.length-1;
  $('#toc').innerHTML=R.pages.map((pg,i)=>`<button class="${i===R.i?'on':''}" onclick="gotoPage(${i})"><span class="num">${i+1}</span>${esc(pg.t)}</button>`).join('');
  setVoice(R.voice);afterRender();
}
function videoBox(title){return `<div class="video" data-media><svg viewBox="0 0 480 270" aria-hidden="true"><rect width="480" height="270" fill="#14252A"/>${headframe(300,226,1.1,"#E2572B")}<rect y="226" width="480" height="44" fill="#0B4F57" opacity=".7"/></svg><button class="vplay" onclick="playMedia(this,204)" aria-label="Phát video">▶</button><div class="vbar"><span class="num t">00:00</span><div class="meter"><i style="width:0%"></i></div><span class="num">03:24</span></div></div><p class="cap">${esc(title)}</p>`}
function audioBox(title,dur){const [m,s]=dur.split(':').map(Number);return `<div class="player" data-media><button class="play" onclick="playMedia(this,${m*60+s})" aria-label="Phát âm thanh">▶</button><div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:6px"><span class="small" style="overflow-wrap:anywhere"><b>${esc(title)}</b></span><div class="meter"><i style="width:0%"></i></div></div><span class="num small t">00:00 / ${dur}</span></div>`}
let mediaTimer=null;
function stopMedia(){clearInterval(mediaTimer);mediaTimer=null;document.querySelectorAll('[data-media] button').forEach(b=>{b.textContent='▶';b.hidden=false})}
function playMedia(btn,total){
  const box=btn.closest('[data-media]');if(mediaTimer&&btn.textContent==='❚❚'){stopMedia();return}
  stopMedia();btn.textContent='❚❚';if(btn.classList.contains('vplay'))btn.hidden=false;
  let t=+(box.dataset.t||0);const bar=box.querySelector('.meter i'),lab=box.querySelector('.t');
  const f=x=>pad(Math.floor(x/60))+':'+pad(x%60);
  mediaTimer=setInterval(()=>{t=Math.min(total,t+4);box.dataset.t=t;bar.style.width=(t/total*100)+'%';lab.textContent=lab.textContent.includes('/')?f(t)+' / '+f(total):f(t);if(t>=total){stopMedia();box.dataset.t=0}},250);
}
/* TTS: uses the device's Vietnamese voice when present; always highlights the sentence being read */
let ttsTimer=null;
function stopSpeak(){try{speechSynthesis.cancel()}catch(e){}clearTimeout(ttsTimer);document.querySelectorAll('.s.hl').forEach(e=>e.classList.remove('hl'))}
function readPage(){
  const spans=[...document.querySelectorAll('#page-host .s')];
  if(!spans.length){const txt=($('#page-host h2')||{}).textContent||R.book.title;speak(txt+'. '+[...document.querySelectorAll('#page-host p')].map(p=>p.textContent).join(' '),null);return}
  let i=0;stopSpeak();const next=()=>{spans.forEach(s=>s.classList.remove('hl'));if(i>=spans.length)return;const s=spans[i++];s.classList.add('hl');speak(s.textContent,next,true)};next();
}
function speak(text,done,keep){
  if(!keep)stopSpeak();
  let used=false;
  try{if('speechSynthesis' in window){const vs=speechSynthesis.getVoices().filter(v=>/^vi/i.test(v.lang));const u=new SpeechSynthesisUtterance(text);u.lang='vi-VN';if(vs.length){u.voice=vs[R&&R.voice==='nam'&&vs.length>1?1:0];used=true}u.pitch=R&&R.voice==='nam'?0.8:1.1;u.rate=(R&&R.rate)||1;u.onend=()=>{clearTimeout(ttsTimer);done&&done()};if(used){speechSynthesis.speak(u);ttsTimer=setTimeout(()=>done&&done(),Math.max(2500,text.length*120/((R&&R.rate)||1)))}}}catch(e){used=false}
  const n=$('#tts-note');
  if(!used){if(n)n.textContent='Thiết bị trình chiếu chưa cài giọng tiếng Việt, đang mô phỏng nhịp đọc. Hệ thống chính thức dùng giọng AI Minh Khôi, Hải An chạy trên máy chủ, đọc giống nhau trên mọi thiết bị.';else toast('Đang mô phỏng giọng đọc Hải An trên thiết bị này');ttsTimer=setTimeout(()=>done&&done(),Math.max(1400,text.length*70/((R&&R.rate)||1)))}
}
function ask(){const q=$('#ask-q').value.trim();if(!q)return;const b=R.book;$('#ask-a').innerHTML=`<b>Người đọc AI:</b> “${esc(b.title)}” thuộc kệ ${shelfOf(b).name}, do ${esc(b.author)} biên soạn. ${esc(b.sub)}. Câu trả lời chỉ dựa trên nội dung sách đã được duyệt; trên hệ thống chính thức AI trích dẫn số trang nguồn.`}

/* ---------- QR (illustrative pattern, not a scannable code) ---------- */
function drawQR(cv){const n=cv.width,ctx=cv.getContext('2d'),r=rng([...cv.dataset.qr].reduce((a,c)=>a*31+c.charCodeAt(0)|0,7));ctx.fillStyle='#fff';ctx.fillRect(0,0,n,n);ctx.fillStyle='#17211E';
  for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(r()>.52)ctx.fillRect(x,y,1,1);
  [[0,0],[n-7,0],[0,n-7]].forEach(([x,y])=>{ctx.fillStyle='#fff';ctx.fillRect(x-1<0?0:x-1,y-1<0?0:y-1,9,9);ctx.fillStyle='#17211E';ctx.fillRect(x,y,7,7);ctx.fillStyle='#fff';ctx.fillRect(x+1,y+1,5,5);ctx.fillStyle='#A2411C';ctx.fillRect(x+2,y+2,3,3)})}

/* ---------- presentation script ---------- */
const SCRIPT=[
 {t:'Người dân mở Tủ sách',d:'Trang chủ, 6 kệ sách, tìm kiếm, mã QR',run:()=>{location.href='index.html'}},
 {t:'Đọc sách đa phương tiện, nghe AI',d:'Sổ tay Luật Đất đai: lật trang, video, sách nói',run:()=>{location.href='doc-sach.html?id=0'}},
 {t:'Cán bộ soạn bản tin',d:'Điền nội dung mẫu, chèn ảnh từ kho, gửi duyệt',run:()=>{setRole('editor');S.compose=null;go('compose');setTimeout(fillSample,50)}},
 {t:'Lãnh đạo ban duyệt hoặc trả lại',d:'Mở bài ở cột “Chờ lãnh đạo ban duyệt”',run:()=>{setRole('lead');S.wfFilter='all';go('workflow')}},
 {t:'Văn phòng kiểm tra, công khai',d:'Đánh dấu danh mục kiểm tra, bấm Công khai',run:()=>{setRole('office');S.wfFilter='all';go('workflow')}},
 {t:'Kho lưu trữ dùng chung',d:'7 nhóm kho nghiệp vụ, NAS 40 TB, sao lưu cloud',run:()=>{setRole('chief');S.arch={folder:'kho',q:'',type:'all',page:1};go('archive')}},
 {t:'Kho nghiệp vụ nội bộ',d:'Đăng nhập tài khoản phòng ban, tra cứu 7 nhóm tài liệu',run:()=>{setRole('public');go('home');setTimeout(()=>loginModal(''),80)}},
 {t:'Phòng ban đăng dự án, kế hoạch',d:'Tài khoản riêng, cập nhật tiến độ',run:()=>{setRole('editor');S.deptSel='vhxh';S.deptTab='projects';go('depts')}},
 {t:'Bảng điều hành của lãnh đạo',d:'Lượt đọc, bài chờ duyệt, tiến độ dự án',run:()=>{setRole('chief');go('dashboard')}},
 {t:'Tài khoản và phân quyền',d:'Tài khoản phòng ban, xác thực 2 lớp, ma trận quyền',run:()=>{setRole('office');go('admin')}},
 {t:'Số hóa tài liệu 5 phường cũ',d:'Hợp nhất hồ sơ giấy, tệp phòng ban, tư liệu vào một kho',run:()=>{setRole('office');go('migrate')}},
 {t:'An toàn thông tin',d:'Sơ đồ hạ tầng, dữ liệu trong nước, ISO 27001',run:()=>{setRole('chief');go('security')}}
];
function toggleScript(){const el=$('#script');el.hidden=!el.hidden;if(!el.hidden)renderScript()}
function renderScript(){$('#script').innerHTML=`<div class="row between"><b>Kịch bản trình diễn · ${SCRIPT.length} bước</b><button class="x" onclick="toggleScript()" aria-label="Đóng">×</button></div><p class="small muted">Bấm từng bước để chuyển vai trò và màn hình tương ứng.</p><ol>${SCRIPT.map((s,i)=>`<li><button class="${S.scriptStep===i?'on':''}" onclick="runStep(${i})">${s.t}<small>${s.d}</small></button></li>`).join('')}</ol>`}
function runStep(i){closeModal();hideIntro();S.scriptStep=i;SCRIPT[i].run();renderScript()}

/* ---------- index infographic override ---------- */
function showIntro(){
  const el=$('#intro');el.hidden=false;document.body.style.overflow='hidden';
  el.innerHTML=`<div class="index-wrap">
   <header class="index-top"><div class="index-brand"><img src="Logo-VHMT2-Final.svg" alt="Logo VHMT"><span class="index-divider">×</span><div><b>Tủ sách điện tử</b><span>Phường Cẩm Phả · Bản trình diễn đề xuất</span></div></div><span class="index-stamp">TRANG INDEX · 30.09.2026</span></header>
   <section class="index-hero"><div class="index-copy"><span class="index-kicker">CẨM PHẢ · ĐẤT MỎ · BIỂN XANH</span><h1>Từ tư liệu rời rạc<br><em>thành một không gian tri thức.</em></h1><p class="index-lead">Tủ sách điện tử phường Cẩm Phả giúp người dân đọc và nghe về lịch sử, truyền thống, văn hóa địa phương; đồng thời giúp cán bộ quản lý kho nghiệp vụ và dữ liệu dùng chung sau khi hợp nhất 5 phường.</p></div><div class="index-visual" aria-label="Sơ đồ hệ thống Tủ sách Cẩm Phả"><div class="iv-line iv-line-a"></div><div class="iv-line iv-line-b"></div><div class="iv-line iv-line-c"></div><div class="iv-core"><span>CP</span><b>TRI THỨC<br>ĐỊA PHƯƠNG</b></div><div class="iv-node iv-node-a"><strong>06</strong><span>Kệ sách</span></div><div class="iv-node iv-node-b"><strong>07</strong><span>Nhóm kho</span></div><div class="iv-node iv-node-c"><strong>02</strong><span>Lần duyệt</span></div><div class="iv-node iv-node-d"><strong>05</strong><span>Phường hợp nhất</span></div></div></section>
   <section class="index-flow" aria-label="Mô hình vận hành"><div class="index-section-label"><span>01</span><b>Một hệ thống, bốn chuyển động</b><small>Từ người dân đến cán bộ, mọi nội dung đi qua đúng một đường dẫn.</small></div><div class="flow-track"><div class="flow-step"><i>01</i><b>Đọc & nghe</b><span>Người dân tìm sách, bản tin và tư liệu địa phương.</span></div><div class="flow-arrow">→</div><div class="flow-step"><i>02</i><b>Biên soạn</b><span>Các ban tạo bản thảo từ Word, ảnh, âm thanh và video.</span></div><div class="flow-arrow">→</div><div class="flow-step"><i>03</i><b>Duyệt nội dung</b><span>Lãnh đạo ban và Văn phòng kiểm tra trước khi công khai.</span></div><div class="flow-arrow">→</div><div class="flow-step"><i>04</i><b>Lưu & báo cáo</b><span>Kho dùng chung, phân quyền, sao lưu và có số liệu đọc.</span></div></div></section>
   <section class="index-panels" aria-label="Hiện trạng, đề xuất và giá trị"><article class="index-panel problem"><span class="panel-no">02 / HIỆN TRẠNG</span><h2>Sau sắp xếp từ 5 phường</h2><ul><li>Chưa có tủ sách, thư viện số của phường</li><li>Tư liệu truyền thống vùng mỏ chưa được hệ thống hóa</li><li>Hồ sơ của 5 phường cũ lưu ở nhiều nơi</li><li>Tài liệu nghiệp vụ nằm trên máy cá nhân, USB, nhóm Zalo</li><li>Chưa có số liệu văn hóa đọc để báo cáo</li></ul></article><article class="index-panel solution"><span class="panel-no">03 / VHMT ĐỀ XUẤT</span><h2>Tủ sách và hệ thống nghiệp vụ</h2><ul><li>Cổng Tủ sách 6 kệ, sách đa phương tiện, người đọc AI</li><li>Các ban tự biên soạn từ file Word, qua hai lần duyệt</li><li>Kho nghiệp vụ nội bộ theo 7 nhóm, có phân quyền</li><li>Số hóa, hợp nhất hồ sơ của 5 phường cũ</li><li>Tài khoản phòng ban và bảng điều hành cho lãnh đạo</li><li>Kho dữ liệu tại trụ sở, sao lưu hằng đêm</li></ul></article><article class="index-panel value"><span class="panel-no">04 / GIÁ TRỊ</span><h2>Vận hành lâu dài</h2><ul><li>Lưu giữ, lan tỏa truyền thống “Kỷ luật và Đồng tâm”</li><li>Nội dung cập nhật thường xuyên, có kiểm soát</li><li>Tài liệu không thất lạc khi đổi cán bộ</li><li>Dữ liệu đặt trong nước, tên miền cơ quan</li><li>Có số liệu báo cáo văn hóa đọc, chuyển đổi số</li></ul></article></section>
   <section class="index-bottom"><div><span class="index-kicker">ĐIỂM ĐẾN CỦA BẢN DEMO</span><h2>Chọn một vai trò để bắt đầu xem hệ thống.</h2><p>Nội dung và số liệu trong bản trình diễn là minh họa, sẽ được thay bằng hồ sơ chính thức do phường cung cấp.</p></div><div class="index-actions"><button class="btn primary" onclick="hideIntro()">Vào bản trình diễn</button><button class="btn" onclick="hideIntro();S.showNew=true;render();toast('Đang bật chú giải chức năng')">Bật chú giải chức năng</button><button class="btn" onclick="hideIntro();toggleScript()">Xem kịch bản 12 bước</button></div></section>
  </div>`;
}

/* ---------- boot ---------- */
const camPhaCoverArt={dang:'cam-pha-cover-dang.jpg',ditich:'cam-pha-cover-ditich.jpg',vanhoa:'cam-pha-cover-vanhoa.jpg',tochuc:'cam-pha-cover-tochuc.jpg',diaphuong:'cam-pha-cover-diaphuong.jpg',amthuc:'cam-pha-cover-amthuc.jpg'};
SHELVES.forEach(sh=>{if(camPhaCoverArt[sh.id])sh.img=camPhaCoverArt[sh.id]});
S.books.forEach((b,i)=>{b.art=`cam-pha-book-${String(i+1).padStart(2,'0')}.jpg`});
function scene(kind,seed){const art=kind==='food'?camPhaCoverArt.amthuc:kind==='temple'||kind==='bridge'?camPhaCoverArt.ditich:kind==='city'?camPhaCoverArt.diaphuong:camPhaCoverArt.vanhoa;return `<img class="scene-art" src="${art}" alt="Minh họa Cẩm Phả" loading="lazy">`}
const readerAudio={nam:'giong-nam-minh-long.mp3',nu:'giong-nu-an-ha.mp3'};
function readerAudioSrc(v){return readerAudio[v||'nu']||readerAudio.nu}
function syncReaderAssets(){
  document.querySelectorAll('.reader-card img').forEach((img,i)=>{img.src=i===0?'ai-reader-nam.jpg':'ai-reader-nu.jpg'});
  document.querySelectorAll('.reader-card').forEach((card,i)=>{
    const tx=card.querySelector('.tx');
    if(!tx||tx.querySelector('.reader-demo'))return;
    const voice=i===0?'nam':'nu';
    const name=voice==='nam'?'Minh Long':'An Hà';
    const title=tx.querySelector('b');if(title)title.textContent=name;
    tx.insertAdjacentHTML('beforeend',`<div class="reader-demo"><span>Nghe demo giọng đọc</span><audio controls preload="metadata" src="${readerAudioSrc(voice)}" aria-label="Demo giọng đọc ${name}"></audio></div>`);
  });
}
function afterRender(){document.querySelectorAll('canvas[data-qr]').forEach(drawQR);syncReaderAssets()}
function audioBox(title,dur){return `<div class="player real-audio" data-media><div class="audio-copy"><span class="eyebrow">Demo giọng đọc AI</span><b>${esc(title)}</b><small>Đang chọn: ${R&&R.voice==='nam'?'Minh Long · giọng nam':'An Hà · giọng nữ'}</small></div><audio id="book-audio" controls preload="metadata" src="${readerAudioSrc(R&&R.voice)}" aria-label="Bản đọc ${esc(title)}"></audio></div>`}
function setVoice(v){R.voice=v;$('#v-nam').classList.toggle('on',v==='nam');$('#v-nu').classList.toggle('on',v==='nu');$('#v-nam').querySelector('b').textContent='Minh Long';$('#v-nu').querySelector('b').textContent='An Hà';const a=$('#book-audio');if(a){a.pause();a.src=readerAudioSrc(v);a.load();const n=a.closest('.real-audio')?.querySelector('small');if(n)n.textContent=`Đang chọn: ${v==='nam'?'Minh Long · giọng nam':'An Hà · giọng nữ'}`}}
(()=>{const d=new Date(),w=['Chủ nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'][d.getDay()];$('#today').textContent=`${w}, ngày ${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`})();
$('#role').innerHTML=Object.entries(ROLES).map(([k,v])=>`<option value="${k}">${v.short}</option>`).join('');
try{if('speechSynthesis' in window)speechSynthesis.getVoices()}catch(e){}
const initialRole=document.body.dataset.crmRole||'public';
if(ROLES[initialRole]) S.role=initialRole;
const h=(document.body.dataset.crmView||location.hash||'').replace(/^#/,'');
if(VIEWS[h]) S.view=h;
render();

