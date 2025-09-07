
// Mobile nav
const burger=document.querySelector('.burger'); const navlinks=document.querySelector('.navlinks');
burger?.addEventListener('click',()=>navlinks.classList.toggle('open'));

// Slider
const track=document.querySelector('.slide-track'); const dots=[...document.querySelectorAll('.slider .dots button')];
let idx=0; function show(i){ if(!track) return; idx=(i+dots.length)%dots.length; track.style.transform=`translateX(-${idx*100}%)`; dots.forEach((d,n)=>d.classList.toggle('active', n===idx)); }
dots.forEach((d,i)=>d.addEventListener('click',()=>show(i))); setInterval(()=>show(idx+1), 6000);

// Corner tabs
function setActiveTab(target){
  document.querySelectorAll('[data-tab]').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('[data-panel]').forEach(p=>p.hidden=true);
  document.querySelector(`[data-tab="${target}"]`)?.classList.add('active');
  document.querySelector(`[data-panel="${target}"]`)?.removeAttribute('hidden');
  history.replaceState(null,'',`#${target}`);
}
window.setActiveTab=setActiveTab;

// List search/pagination
function setupListSearch(containerSelector){
  const wrap=document.querySelector(containerSelector); if(!wrap) return;
  const s=wrap.querySelector('input[type="search"]'); const sel=wrap.querySelector('select');
  const list=wrap.querySelector('.list'); const items=[...list.querySelectorAll('.item')];
  let page=1, perPage=8;
  function apply(){
    const q=(s?.value||'').toLowerCase(); const cat=sel?.value||'all';
    const filtered=items.filter(el=>{
      const text=el.innerText.toLowerCase(); const tag=el.dataset.cat||'all';
      const okQ=!q||text.includes(q); const okC=cat==='all'||cat===tag;
      el.style.display=(okQ&&okC)?'':'none'; return okQ&&okC;
    });
    const visible=filtered; const totalPages=Math.max(1, Math.ceil(visible.length/perPage));
    if(page>totalPages) page=1;
    visible.forEach((el,idx)=>{ el.style.display=(Math.floor(idx/perPage)+1===page)?'':'none'; });
    const pager=wrap.querySelector('.pagination');
    if(pager){ pager.querySelector('.page-info').textContent=`Page ${page} / ${totalPages}`; pager.querySelector('.prev').disabled=page===1; pager.querySelector('.next').disabled=page===totalPages; }
  }
  s?.addEventListener('input',apply); sel?.addEventListener('change',apply);
  const pager=wrap.querySelector('.pagination');
  pager?.querySelector('.prev')?.addEventListener('click',()=>{page=Math.max(1,page-1); apply();});
  pager?.querySelector('.next')?.addEventListener('click',()=>{page=page+1; apply();});
  apply();
}
window.setupListSearch=setupListSearch;

// Lightbox
function setupLightbox(){
  const links=document.querySelectorAll('[data-lightbox]'); if(!links.length) return;
  const overlay=document.createElement('div'); overlay.style.cssText='position:fixed; inset:0; background:rgba(0,0,0,.75); display:none; align-items:center; justify-content:center; z-index:1000;';
  const img=document.createElement('img'); img.style.cssText='max-width:90vw; max-height:85vh; border-radius:12px; box-shadow:0 20px 60px rgba(0,0,0,.45)';
  overlay.appendChild(img); overlay.addEventListener('click',()=>overlay.style.display='none'); document.body.appendChild(overlay);
  links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); img.src=a.getAttribute('href'); overlay.style.display='flex';}));
}
window.setupLightbox=setupLightbox;

// Sticky year
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
  setupListSearch('#notice-wrap'); setupLightbox();
  const hash=location.hash?.replace('#',''); if(hash) setActiveTab(hash);
});
