// Basic interactions: mobile nav, hero slideshow, filters, lightbox, year
(function(){
  const $ = (sel, ctx=document)=>ctx.querySelector(sel);
  const $$ = (sel, ctx=document)=>Array.from(ctx.querySelectorAll(sel));

  // Mobile Nav
  const hamburger = $('.hamburger');
  const nav = $('#primary-nav');
  if(hamburger && nav){
    hamburger.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    // Close on link click (mobile)
    $$('#primary-nav a').forEach(a=>a.addEventListener('click', ()=>{
      nav.classList.remove('open'); hamburger.setAttribute('aria-expanded','false');
    }));
  }

  // Year
  const year = new Date().getFullYear();
  const yearEl = $('#year');
  if(yearEl) yearEl.textContent = year;

  // Hero Slideshow
  const slidesWrap = $('.slides');
  if(slidesWrap){
    const slides = $$('.slide', slidesWrap);
    const prev = $('.prev', slidesWrap);
    const next = $('.next', slidesWrap);
    let index = 0;
    let timer;
    const interval = Number(slidesWrap.dataset.interval || 6000);
    const autoplay = slidesWrap.dataset.autoplay === 'true';

    function show(i){
      slides[index].classList.remove('is-active');
      index = (i + slides.length) % slides.length;
      slides[index].classList.add('is-active');
    }
    function start(){
      if(autoplay){
        stop();
        timer = setInterval(()=> show(index+1), interval);
      }
    }
    function stop(){ if(timer) clearInterval(timer); }

    prev?.addEventListener('click', ()=>{ show(index-1); start(); });
    next?.addEventListener('click', ()=>{ show(index+1); start(); });
    slidesWrap.addEventListener('mouseenter', stop);
    slidesWrap.addEventListener('mouseleave', start);
    start();
  }

  // Filters
  const filterButtons = $$('.filter');
  const items = $$('.grid .item');
  filterButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      filterButtons.forEach(b=>b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const f = btn.dataset.filter;
      items.forEach(it=>{
        const cat = it.dataset.cat || '';
        const show = (f === 'all') || cat.includes(f);
        it.style.display = show ? '' : 'none';
      });
    });
  });

  // Lightbox
  const lb = $('.lightbox');
  const lbImg = $('.lightbox-img', lb);
  const lbPrev = $('.lightbox-prev', lb);
  const lbNext = $('.lightbox-next', lb);
  const lbClose = $('.lightbox-close', lb);
  let lbIndex = -1;
  const gallery = items;

  function openLightbox(i){
    lbIndex = i;
    const href = gallery[i].getAttribute('href');
    lbImg.src = href;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
  }
  function closeLightbox(){
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    lbImg.removeAttribute('src');
  }
  function prevImg(){ if(lbIndex>=0){ lbIndex = (lbIndex - 1 + gallery.length) % gallery.length; lbImg.src = gallery[lbIndex].getAttribute('href'); } }
  function nextImg(){ if(lbIndex>=0){ lbIndex = (lbIndex + 1) % gallery.length; lbImg.src = gallery[lbIndex].getAttribute('href'); } }

  gallery.forEach((el, i)=>{
    el.addEventListener('click', (e)=>{
      e.preventDefault();
      openLightbox(i);
    });
  });

  lbPrev?.addEventListener('click', prevImg);
  lbNext?.addEventListener('click', nextImg);
  lbClose?.addEventListener('click', closeLightbox);
  lb?.addEventListener('click', (e)=>{
    if(e.target === lb) closeLightbox(); // click outside image to close
  });
  window.addEventListener('keydown', (e)=>{
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowLeft') prevImg();
    if(e.key === 'ArrowRight') nextImg();
  });
})();