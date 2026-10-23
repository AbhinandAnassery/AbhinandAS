/* ===========================
   ABHINAND A S — Portfolio JS
   =========================== */

// ── Custom Cursor ──────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
(function animFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animFollower);
})();

// ── Navbar scroll behaviour ────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveLink();
});

// ── Hamburger ──────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── Active nav link on scroll ──────────────────────────────
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

// ── Scroll-triggered AOS-like animations ──────────────────
const observerOpts = { threshold: 0.12, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.aosDelay || 0);
      setTimeout(() => entry.target.classList.add('aos-animate'), delay);
      // Animate skill bars when skill section enters view
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach(fill => {
        setTimeout(() => { fill.style.width = fill.dataset.width; }, delay + 300);
      });
      observer.unobserve(entry.target);
    }
  });
}, observerOpts);

document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// Also fire immediately for elements already in viewport
window.addEventListener('load', () => {
  document.querySelectorAll('[data-aos]').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      const delay = parseInt(el.dataset.aosDelay || 0);
      setTimeout(() => el.classList.add('aos-animate'), delay);
      el.querySelectorAll('.skill-fill').forEach(f => {
        setTimeout(() => { f.style.width = f.dataset.width; }, delay + 300);
      });
    }
  });
  updateActiveLink();
});

// ── Particle Canvas ────────────────────────────────────────
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); spawnParticles(); });

const PARTICLE_COUNT = 60;

function rand(min, max) { return Math.random() * (max - min) + min; }

function spawnParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: rand(0, W), y: rand(0, H),
      r: rand(0.5, 2.2),
      vx: rand(-0.15, 0.15), vy: rand(-0.3, -0.08),
      alpha: rand(0.1, 0.5),
      color: Math.random() > 0.5 ? '255,107,26' : '255,209,102'
    });
  }
}
spawnParticles();

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
    ctx.fill();
    p.x += p.vx; p.y += p.vy;
    if (p.y < -5) { p.y = H + 5; p.x = rand(0, W); }
    if (p.x < -5) p.x = W + 5;
    if (p.x > W + 5) p.x = -5;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── Hero image parallax on mouse move ─────────────────────
const heroImg = document.getElementById('hero-img');
const heroSection = document.querySelector('.hero');
if (heroImg && heroSection) {
  heroSection.addEventListener('mousemove', e => {
    const rect  = heroSection.getBoundingClientRect();
    const xPct  = (e.clientX - rect.left) / rect.width  - 0.5;
    const yPct  = (e.clientY - rect.top)  / rect.height - 0.5;
    heroImg.style.transform = `translate(${xPct * 6}px, ${yPct * 4}px) scale(1.02)`;
  });
  heroSection.addEventListener('mouseleave', () => {
    heroImg.style.transform = 'translate(0,0) scale(1)';
  });
}

// ── Smooth scroll for anchor links ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.offsetTop - 70;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

// ── Hero text stagger on load ──────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const heroText = document.querySelector('.hero-text');
  if (heroText) {
    setTimeout(() => heroText.classList.add('aos-animate'), 200);
  }
  const heroImg = document.querySelector('.hero-image-wrap');
  if (heroImg) {
    setTimeout(() => heroImg.classList.add('aos-animate'), 500);
  }
});
