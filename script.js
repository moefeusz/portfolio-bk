// Poziom animacji (S, M, L – do ewentualnej rozbudowy, domyślnie M)
const MOTION_LEVEL = 'M';

document.addEventListener('DOMContentLoaded', () => {
  // Animacja "typing" – wypisywanie zmieniających się ról
  const roles = ['Front-end Developer', '3D Designer', 'UI/UX Enthusiast'];
  const typedTextEl = document.getElementById('typed-text');
  let i = 0, pos = 0, dir = 1, hold = 0;
  const tick = () => {
    if (!typedTextEl) return;
    if (hold > 0) { hold--; requestAnimationFrame(tick); return; }
    const txt = roles[i];
    pos += dir;
    typedTextEl.textContent = txt.slice(0, pos);
    if (pos === txt.length) { dir = -1; hold = 45; }            // chwilowa pauza po napisaniu całego słowa
    if (pos === 0 && dir === -1) { dir = 1; i = (i + 1) % roles.length; hold = 20; }  // pauza przed rozpoczęciem kolejnego słowa
    requestAnimationFrame(tick);
  };
  tick();

  // Pojawianie się elementów w momencie przewijania (reveal)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -10% 0px" });
  document.querySelectorAll('.reveal, .section, .card, .pricing-card, .project-card')
          .forEach(el => observer.observe(el));

  // Paralaksa dla tła hero (przesuwanie wideo przy scrollu)
  const heroSection = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg');
  let lastY = 0;
  function onScroll() {
    if (!heroSection || !heroBg) return;
    const rect = heroSection.getBoundingClientRect();
    const scrollProgress = Math.min(1, Math.max(0, 1 - (rect.top / rect.height)));
    const scaleBoost = (MOTION_LEVEL === 'L' ? 0.06 : MOTION_LEVEL === 'M' ? 0.04 : 0.02);
    const offsetY = rect.top * -0.06;
    if (Math.abs(offsetY - lastY) < 0.5) return; // nie aktualizuj przy minimalnych zmianach (dla wydajności)
    heroBg.style.transform = `translate3d(0, ${offsetY}px, 0)`;
    heroBg.querySelectorAll('video').forEach(v => {
      v.style.transform = `scale(${1.04 + scaleBoost * scrollProgress})`;
    });
    lastY = offsetY;
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Efekt "magnesu" na przyciskach (przyciąganie do kursora)
  document.querySelectorAll('.magnet').forEach(btn => {
    const strength = (MOTION_LEVEL === 'L' ? 16 : MOTION_LEVEL === 'M' ? 10 : 6);
    let rafId = null;
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top - rect.height/2;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        btn.style.transform = `translate(${x/strength}px, ${y/strength}px)`;
      });
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  // Aura podążająca za kursorem
  const aura = document.querySelector('.cursor-aura');
  if (aura && matchMedia('(pointer: fine)').matches) {  // tylko na urządzeniach z dokładnym wskaźnikiem (mysz)
    let ax = -9999, ay = -9999, tx = ax, ty = ay;
    const lag = (MOTION_LEVEL === 'L' ? 0.18 : MOTION_LEVEL === 'M' ? 0.22 : 0.28);
    window.addEventListener('mousemove', e => {
      tx = e.clientX - aura.offsetWidth/2;
      ty = e.clientY - aura.offsetHeight/2;
      aura.style.opacity = 0.9;
    }, { passive: true });
    (function moveAura() {
      ax += (tx - ax) * lag;
      ay += (ty - ay) * lag;
      aura.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
      requestAnimationFrame(moveAura);
    })();
  }

  // Płynne przewijanie do sekcji po kliknięciu linku (anchor link smoothing)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Filtrowanie projektów (Przycisk => pokazuje tylko projekty danej kategorii)
  const filterBar = document.querySelector('.projects-filter');
  if (filterBar) {
    const buttons = filterBar.querySelectorAll('button[data-filter]');
    const projectCards = Array.from(document.querySelectorAll('.project-card'));
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        // podświetl aktywny przycisk
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // filtruj karty projektów
        const toShow = [], toHide = [];
        projectCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            toShow.push(card);
          } else {
            toHide.push(card);
          }
        });
        // ukryj niepasujące karty (z lekkim opóźnieniem dla animacji)
        const hideDelay = 40;
        toHide.forEach((card, i) => {
          card.style.transitionDelay = `${i * hideDelay}ms`;
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => { card.style.display = 'none'; }, 250 + i * hideDelay);
        });
        // pokaż pasujące karty
        const showDelay = 40;
        setTimeout(() => {
          toShow.forEach((card, i) => {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            card.style.transition = 'opacity .45s var(--ease), transform .45s var(--ease)';
            card.style.transitionDelay = `${i * showDelay}ms`;
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        }, 300 + toHide.length * hideDelay);
      });
    });
  }

  // "Hack the Code" mini-gra
  function generateCode(len = 5) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // bez łatwych do pomyłki znaków (0/O, 1/I itp.)
    return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }
  let accessCode = generateCode(5);
  const termOutput = document.getElementById('terminal-output');
  const termInput = document.getElementById('terminal-input-field');  // zmieniony ID pola
  const termBtn = document.getElementById('terminal-submit');
  function printLine(text) {
    if (termOutput) {
      const p = document.createElement('div');
      p.textContent = text;
      termOutput.appendChild(p);
      termOutput.scrollTop = termOutput.scrollHeight;
    }
  }
  // Komunikat startowy
  printLine('System locked. Wprowadź 5-znakowy kod dostępu.');
  // Funkcja mowy (Polski lektor)
  function speak(text) {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pl-PL';
      utterance.rate = 1;
      utterance.pitch = 1;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } catch (e) { /* speech API może nie działać w każdej przeglądarce */ }
  }
  // Konfetti – generuje kolorowe paski spadające
  function confetti() {
    const count = 40;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.style.position = 'fixed';
      s.style.left = (Math.random() * 100) + 'vw';
      s.style.top = '-10px';
      s.style.width = '6px';
      s.style.height = '10px';
      s.style.background = `hsl(${Math.random() * 360}, 90%, 60%)`;
      s.style.opacity = '0.9';
      s.style.transform = `rotate(${Math.random() * 360}deg)`;
      s.style.transition = 'transform 1.2s linear, top 1.2s linear, opacity .3s ease .9s';
      document.body.appendChild(s);
      // animacja spadania
      requestAnimationFrame(() => {
        s.style.top = '110vh';
        s.style.transform += ' translateY(100vh)';
        s.style.opacity = '0';
      });
      // usunięcie elementu po animacji
      setTimeout(() => s.remove(), 1500);
    }
  }
  // Obsługa zgadywania kodu
  function handleGuess() {
    const val = (termInput?.value || '').trim();
    if (!val) return;
    const guess = val.toLowerCase();
    if (guess === 'konki') {
      printLine('Wygrałeś talon na kurwę i balon! 🚀');
      speak('Wygrałeś talon na kurwę i balon!');
      confetti();
      termInput.value = '';
      return;
    }
    if (val.length !== 5) {
      printLine('Kod ma mieć 5 znaków.');
      termInput.value = '';
      return;
    }
    if (val.toUpperCase() === accessCode) {
      printLine('Odblokowano! ✅');
      speak('Odblokowano!');
      confetti();
      // Tutaj ewentualnie można dodać logikę wygranej (np. pokazanie ukrytego elementu)
    } else {
      printLine('Błędny kod. Spróbuj ponownie.');
    }
    termInput.value = '';
  }
  termBtn?.addEventListener('click', handleGuess);
  termInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleGuess();
  });

  // HAMBURGER MENU – pokazywanie/chowanie menu na mobile
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      const menuOpen = nav.classList.toggle('menu-open');
      // Zmień ikonę na 'close' gdy otwarte menu, i z powrotem na 'menu' gdy zamknięte
      navToggle.textContent = menuOpen ? 'close' : 'menu';
    });
  }
});

