/* ==========================================================================
   FERNANDES CONSTRUTORA - GSAP & SCROLL ANIMATIONS (ROCK-SOLID EDITION)
   Flawless performance, zero hidden elements, full card visibility & 3D Tilt
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Registrar plugins do GSAP se disponíveis
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 1. PRELOADER CINEMATOGRÁFICO
  const preloader = document.getElementById('preloader');
  const progressFill = document.querySelector('.preloader-progress-fill');
  const counterText = document.querySelector('.preloader-counter');

  let loadPercent = 0;
  const loadInterval = setInterval(() => {
    loadPercent += Math.floor(Math.random() * 12) + 8;
    if (loadPercent > 100) loadPercent = 100;

    if (progressFill) progressFill.style.width = `${loadPercent}%`;
    if (counterText) counterText.textContent = `${loadPercent}%`;

    if (loadPercent >= 100) {
      clearInterval(loadInterval);
      setTimeout(() => {
        if (preloader) preloader.classList.add('loaded');
        initHeroEntranceAnimations();
      }, 250);
    }
  }, 25);

  // 2. ENTRADA DO HERO
  function initHeroEntranceAnimations() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.0 } });

    tl.from('.header-main', {
      y: -40,
      opacity: 0,
      duration: 0.8
    })
    .from('.hero-main-title', {
      y: 40,
      opacity: 0,
      duration: 1.0,
      stagger: 0.15
    }, '-=0.4')
    .from('.hero-description', {
      y: 20,
      opacity: 0,
      duration: 0.8
    }, '-=0.6')
    .from('.hero-cta-group', {
      y: 20,
      opacity: 0,
      duration: 0.7
    }, '-=0.5')
    .from('.control-panel-3d', {
      x: 30,
      opacity: 0,
      duration: 0.8
    }, '-=0.6');
  }

  // 3. CURSOR MAGNÉTICO CUSTOMIZADO
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');

  if (cursor && follower && window.innerWidth > 992) {
    let mousePos = { x: -100, y: -100 };
    let followerPos = { x: -100, y: -100 };

    window.addEventListener('mousemove', e => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    });

    // Lerp suave para o follower
    function updateFollower() {
      followerPos.x += (mousePos.x - followerPos.x) * 0.15;
      followerPos.y += (mousePos.y - followerPos.y) * 0.15;
      follower.style.transform = `translate3d(${followerPos.x}px, ${followerPos.y}px, 0)`;
      requestAnimationFrame(updateFollower);
    }
    updateFollower();

    // Hover em elementos interativos
    document.querySelectorAll('a, button, input, .option-toggle-box, .filter-btn, .project-card, .pillar-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });

    document.querySelectorAll('[data-cursor-view]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-view-project');
        follower.textContent = 'Ver';
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-view-project');
        follower.textContent = '';
      });
    });
  }

  // 4. CONTADORES NUMÉRICOS ANIMADOS (COUNTUP)
  const metricBoxes = document.querySelectorAll('.metric-num');
  if (metricBoxes.length > 0 && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: '.metrics-strip',
      start: 'top 95%',
      onEnter: () => {
        metricBoxes.forEach(box => {
          const target = parseFloat(box.getAttribute('data-target') || '0');
          const isDecimal = target % 1 !== 0;
          gsap.fromTo(box, 
            { innerText: 0 },
            {
              innerText: target,
              duration: 2.0,
              ease: 'power2.out',
              snap: { innerText: isDecimal ? 0.1 : 1 },
              onUpdate: function () {
                const val = parseFloat(box.innerText);
                if (target >= 1000) {
                  box.innerText = val.toLocaleString('pt-BR');
                } else {
                  box.innerText = val;
                }
              }
            }
          );
        });
      },
      once: true
    });
  }

  // 5. CARD 3D TILT EFFECT (Suave e sem alterar opacidade)
  const tiltCards = document.querySelectorAll('.project-card, .pillar-card, .simulator-glass-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / (rect.height / 2)) * 4;
      const rotateY = (x / (rect.width / 2)) * 4;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 6. ALTERNADOR DE MODOS 3D DO HERO
  const modeButtons = document.querySelectorAll('.mode-tab-btn');
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const selectedMode = btn.getAttribute('data-mode');
      if (typeof window.setThreeRenderMode === 'function') {
        window.setThreeRenderMode(selectedMode);
      }
    });
  });

  // 7. HEADER SCROLL STATE
  const header = document.querySelector('.header-main');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

});
