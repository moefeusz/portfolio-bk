// revamp-anim-A — animations M + cursor aura, filters, typing, parallax
const MOTION_LEVEL = 'M'; // S / M / L

document.addEventListener('DOMContentLoaded', () => {
  // Typing
  const roles = ['Front-end Developer', '3D Designer', 'UI/UX Enthusiast'];
  const el = document.getElementById('typed-text');
  let i=0,pos=0,dir=1,hold=0; const raf=(cb)=>requestAnimationFrame(cb);
  function tick(){
    if(!el) return;
    if(hold>0){ hold--; return raf(tick); }
    const txt = roles[i]; pos += dir; el.textContent = txt.slice(0,pos);
    if(pos===txt.length){ dir=-1; hold=30; }
    if(pos===0 && dir===-1){ dir=1; i=(i+1)%roles.length; hold=12; }
    raf(tick);
  }
  tick();

  // Scroll-reveal
  const obs=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }});
  },{threshold:.12, rootMargin:"0px 0px -10% 0px"});
  document.querySelectorAll('.reveal,.section,.card,.pricing-card,.project-card').forEach(n=>obs.observe(n));

  // Hero parallax
  const hero=document.querySelector('.hero'), heroBg=document.querySelector('.hero-bg'); let lastY=0;
  function onScroll(){
    if(!hero||!heroBg) return;
    const rect=hero.getBoundingClientRect(); const sc=Math.min(1,Math.max(0,1-(rect.top/rect.height)));
    const scaleBoost = MOTION_LEVEL==='L'?0.06: MOTION_LEVEL==='M'?0.04:0.02;
    const y=(rect.top*-0.06); if(Math.abs(y-lastY)<0.5) return;
    heroBg.style.transform=`translate3d(0,${y}px,0)`;
    heroBg.querySelectorAll('video,img').forEach(v=> v.style.transform=`scale(${1.04+scaleBoost*sc})`);
    lastY=y;
  }
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  // Magnet CTA
  document.querySelectorAll('.magnet').forEach(btn=>{
    const strength = MOTION_LEVEL==='L'?16: MOTION_LEVEL==='M'?10:6; let rAF=null;
    btn.addEventListener('mousemove', e=>{
      const r=btn.getBoundingClientRect(), x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
      cancelAnimationFrame(rAF); rAF=requestAnimationFrame(()=> btn.style.transform=`translate(${x/strength}px,${y/strength}px)`);
    });
    btn.addEventListener('mouseleave', ()=> btn.style.transform='translate(0,0)');
  });

  // Cursor aura
  const aura=document.querySelector('.cursor-aura');
  if(aura && matchMedia('(pointer: fine)').matches){
    let ax=-9999,ay=-9999,tx=ax,ty=ay; const lag = MOTION_LEVEL==='L'?0.18: MOTION_LEVEL==='M'?0.22:0.28;
    window.addEventListener('mousemove', e=>{ tx=e.clientX-aura.offsetWidth/2; ty=e.clientY-aura.offsetHeight/2; aura.style.opacity=.9; }, {passive:true});
    (function loop(){ ax+=(tx-ax)*lag; ay+=(ty-ay)*lag; aura.style.transform=`translate3d(${ax}px,${ay}px,0)`; requestAnimationFrame(loop); })();
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id=a.getAttribute('href').slice(1), t=document.getElementById(id);
      if(!t) return; e.preventDefault(); t.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // Projects filter
  const filterBar=document.querySelector('.projects-filter');
  if(filterBar){
    const buttons=filterBar.querySelectorAll('button[data-filter]'); const cards=[...document.querySelectorAll('.project-card')];
    buttons.forEach(b=>{
      b.addEventListener('click', ()=>{
        const f=b.dataset.filter; buttons.forEach(x=>x.classList.remove('active')); b.classList.add('active');
        const vis=[],hid=[]; cards.forEach(c=> ((f==='all')||(c.dataset.category===f)?vis:hid).push(c));
        const hideDelay=40; hid.forEach((c,i)=>{ c.style.transitionDelay=`${i*hideDelay}ms`; c.style.opacity=.0; c.style.transform='translateY(12px)'; setTimeout(()=> c.style.display='none', 250+i*hideDelay); });
        const showDelay=40; setTimeout(()=>{ vis.forEach((c,i)=>{ c.style.display=''; c.style.opacity=.0; c.style.transform='translateY(12px)'; c.style.transition='opacity .45s var(--ease), transform .45s var(--ease)'; c.style.transitionDelay=`${i*showDelay}ms`; requestAnimationFrame(()=>{ c.style.opacity=1; c.style.transform='translateY(0)'; }); }); }, 250+hid.length*hideDelay+60);
      });
    });
  }

  // Hack the Code (5-char)
  function generateCode(len=5){ const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; return Array.from({length:len},()=> chars[Math.floor(Math.random()*chars.length)]).join(''); }
  let accessCode=generateCode(5);
  const termOut=document.getElementById('terminal-output'), termInp=document.getElementById('terminal-input'), termBtn=document.getElementById('terminal-submit');
  function printLine(t){ if(termOut){ const p=document.createElement('div'); p.textContent=t; termOut.appendChild(p); termOut.scrollTop=termOut.scrollHeight; } }
  printLine('System locked. Wprowadź 5-znakowy kod dostępu.');
  function speak(t){ try{ const u=new SpeechSynthesisUtterance(t); u.lang='pl-PL'; u.rate=1; u.pitch=1; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch(e){} }
  function confetti(){
    const n=40; for(let i=0;i<n;i++){ const s=document.createElement('span'); s.style.position='fixed'; s.style.left=(Math.random()*100)+'vw'; s.style.top='-10px'; s.style.width='6px'; s.style.height='10px'; s.style.background=`hsl(${Math.random()*360},90%,60%)`; s.style.opacity='.9'; s.style.transform=`rotate(${Math.random()*360}deg)`; s.style.transition='transform 1.2s linear, top 1.2s linear, opacity .3s ease .9s'; document.body.appendChild(s); requestAnimationFrame(()=>{ s.style.top='110vh'; s.style.transform+=' translateY(100vh)'; s.style.opacity='0'; }); setTimeout(()=> s.remove(),1400); }
  }
  function handleGuess(){
    const v=(termInp?.value||'').trim(); if(!v) return;
    if(v.toLowerCase()==='konki'){ printLine('Wygrałeś talon na kurwę i balon! 🚀'); speak('Wygrałeś talon na kurwę i balon!'); confetti(); termInp.value=''; return; }
    if(v.length!==5){ printLine('Kod ma mieć 5 znaków.'); termInp.value=''; return; }
    if(v.toUpperCase()===accessCode){ printLine('Odblokowano! ✅'); speak('Odblokowano!'); confetti(); } else { printLine('Błędny kod. Spróbuj ponownie.'); }
    termInp.value='';
  }
  termBtn?.addEventListener('click', handleGuess);
  termInp?.addEventListener('keydown', e=>{ if(e.key==='Enter') handleGuess(); });
});
