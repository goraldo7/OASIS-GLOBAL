const body = document.body;
const header = document.querySelector('.site-header');
const progressBar = document.querySelector('.progress-bar');
const mobileToggle = document.querySelector('.mobile-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.showcase-card');
const faqButtons = document.querySelectorAll('.faq-question');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const statValues = document.querySelectorAll('.stat-value');
const cursor = document.querySelector('.cursor');
const heroVideo = document.querySelector('.hero-video');
const heroGradients = document.querySelector('.hero-gradients');
const heroDecor = document.querySelector('.hero-decor');

const animateHeader = () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

const updateProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = `${progress}%`;
};

const toggleMobileMenu = () => {
  const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
  mobileToggle.setAttribute('aria-expanded', String(!expanded));
  mobileMenu.style.display = expanded ? 'none' : 'flex';
};

mobileToggle.addEventListener('click', toggleMobileMenu);

window.addEventListener('scroll', () => {
  animateHeader();
  updateProgress();
});

window.addEventListener('click', (event) => {
  if (!mobileMenu.contains(event.target) && !mobileToggle.contains(event.target)) {
    mobileMenu.style.display = 'none';
    mobileToggle.setAttribute('aria-expanded', 'false');
  }
});

const activateTab = (targetName) => {
  tabs.forEach((tab) => {
    const active = tab.dataset.target === targetName;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', active);
  });
  panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === targetName));
};

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    activateTab(tab.dataset.target);
  });
});

faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    const answer = button.nextElementSibling;
    answer.classList.toggle('open', !expanded);
  });
});

const slideTestimonials = () => {
  let index = 0;
  const showSlide = (current) => {
    testimonialCards.forEach((card, i) => {
      card.classList.toggle('active', i === current);
    });
  };
  showSlide(index);
  setInterval(() => {
    index = (index + 1) % testimonialCards.length;
    showSlide(index);
  }, 5200);
};

const animateCounters = () => {
  statValues.forEach((value) => {
    const target = +value.dataset.target;
    let current = 0;
    const increment = Math.ceil(target / 140);
    const counter = setInterval(() => {
      current += increment;
      if (current >= target) {
        value.textContent = target;
        clearInterval(counter);
      } else {
        value.textContent = current;
      }
    }, 18);
  });
};

const revealOnScroll = () => {
  const revealItems = document.querySelectorAll('.section-head, .property-card, .service-card, .about-grid, .showcase-card, .testimonial-card, .stat-item, .faq-item, .newsletter-card');
  const options = { threshold: 0.15 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, options);
  revealItems.forEach((item) => observer.observe(item));
};

const enableCursor = () => {
  window.addEventListener('mousemove', (event) => {
    cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  });
  document.querySelectorAll('a, button').forEach((element) => {
    element.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    element.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });
};

// Parallax the decorative hero elements with mouse movement
const mouseParallax = () => {
  if (!heroDecor && !heroGradients) return;
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 18; // -9 to 9
    const y = (e.clientY / window.innerHeight - 0.5) * 12; // -6 to 6
    if (heroDecor) heroDecor.style.transform = `translate3d(${x * -0.6}px, ${y * -0.6}px, 0)`;
    if (heroGradients) heroGradients.style.transform = `translate3d(${x * 0.9}px, ${y * 0.5}px, 0)`;
  });
};

// 3D tilt effect for property cards
const enableCardTilt = () => {
  const cards = document.querySelectorAll('.property-card');
  cards.forEach((card) => {
    const inner = card;
    card.addEventListener('mousemove', (e) => {
      const rect = inner.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const tiltX = (dy * 6).toFixed(2);
      const tiltY = (dx * -6).toFixed(2);
      inner.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      inner.style.transform = '';
    });
  });
};

const initGsap = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // Animated gradient headline: split into words and animate word-by-word with GSAP
  const gradientEl = document.querySelector('.gradient-text');
  if (gradientEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const raw = gradientEl.textContent.trim();
    gradientEl.setAttribute('aria-label', raw);
    const words = raw.split(' ');
    const wordHtml = words.map((word, index) => {
      const chars = Array.from(word).map((ch) => `<span class="char">${ch}</span>`).join('');
      return `<span class="word">${chars}</span>${index < words.length - 1 ? '<span class="space">&nbsp;</span>' : ''}`;
    }).join('');
    gradientEl.innerHTML = wordHtml;

    const wordEls = gradientEl.querySelectorAll('.word');
    const charEls = gradientEl.querySelectorAll('.char');
    gsap.set(gradientEl, { x: 0 });
    gsap.set(charEls, { opacity: 0, y: 16, filter: 'blur(4px)' });

    const wordDelay = 0.85;
    const revealDuration = 0.35;
    const headlineTimeline = gsap.timeline({ repeat: -1, repeatDelay: 1.6 });

    wordEls.forEach((word, index) => {
      const chars = word.querySelectorAll('.char');
      headlineTimeline.to(chars, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: revealDuration,
        ease: 'power3.out',
        stagger: { each: 0.04, from: 'start' },
      }, index * wordDelay);
    });

    const resetDelay = wordEls.length * wordDelay + revealDuration + 1.2;
    headlineTimeline.to(charEls, {
      opacity: 0,
      y: -16,
      filter: 'blur(4px)',
      duration: 0.35,
      ease: 'power1.in',
      stagger: { each: 0.03, from: 'end' },
    }, resetDelay);
  }

  gsap.from('.hero-text, .hero-actions', {
    opacity: 0,
    y: 36,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.14,
    delay: 0.1,
  });

  gsap.from('.hero-copy .hero-text, .hero-actions', {
    opacity: 0,
    y: 40,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.18,
    delay: 0.35,
  });

  gsap.from('.stat-card', {
    opacity: 0,
    y: 40,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.14,
    scrollTrigger: { trigger: '.hero-stats', start: 'top 75%' },
  });

  gsap.from('.property-card', {
    opacity: 0,
    y: 40,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.15,
    scrollTrigger: { trigger: '.property-grid', start: 'top 90%' },
  });

  gsap.from('.service-card', {
    opacity: 0,
    y: 40,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: { trigger: '.service-grid', start: 'top 90%' },
  });

  gsap.from('.about-copy, .about-image', {
    opacity: 0,
    y: 40,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.18,
    scrollTrigger: { trigger: '.about-grid', start: 'top 85%' },
  });

  gsap.from('.showcase-card.active', {
    opacity: 0,
    y: 50,
    duration: 1.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.showcase', start: 'top 90%' },
  });

  gsap.from('.testimonial-card.active', {
    opacity: 0,
    y: 40,
    duration: 1.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.testimonials', start: 'top 90%' },
  });

  gsap.from('.final-cta', {
    opacity: 0,
    y: 50,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.final-cta', start: 'top 90%' },
  });

  if (heroVideo) {
    gsap.to(heroVideo, {
      yPercent: -4,
      scale: 1.01,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        scrub: true,
        start: 'top top',
        end: 'bottom top',
      },
    });
  }

  if (heroDecor) {
    gsap.to(heroDecor, {
      yPercent: -6,
      xPercent: -6,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        scrub: true,
        start: 'top top',
        end: 'bottom top',
      },
    });
  }
};

const initReveal = () => {
  revealOnScroll();
  slideTestimonials();
  animateCounters();
  enableCursor();
  initGsap();
  mouseParallax();
  enableCardTilt();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReveal);
} else {
  initReveal();
}

body.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
});

body.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
});
