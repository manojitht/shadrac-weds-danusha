/* ── Music ────────────────────────────────────── */
const bgMusic    = document.getElementById('bg-music');
const musicBtn   = document.getElementById('music-btn');

function startMusic() {
  bgMusic.volume = 0.35;
  bgMusic.play().catch(() => {});   // silently ignore if no file / blocked
  musicBtn.style.display = 'flex';
  musicBtn.classList.add('playing');
}

musicBtn.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicBtn.classList.replace('paused', 'playing');
    musicBtn.setAttribute('aria-label', 'Pause background music');
  } else {
    bgMusic.pause();
    musicBtn.classList.replace('playing', 'paused');
    musicBtn.setAttribute('aria-label', 'Play background music');
  }
});

/* ── Curtain open ─────────────────────────────── */
function openCurtains() {
  const overlay = document.getElementById('curtain-overlay');
  if (overlay.classList.contains('opening')) return;
  overlay.classList.add('opening');

  setTimeout(() => {
    overlay.classList.add('gone');
    document.getElementById('invitation').classList.add('visible');
    startPetals();
    observeReveal();
    startMusic();
  }, 1700);
}

// Also open on Enter / Space key
document.addEventListener('keydown', e => {
  const overlay = document.getElementById('curtain-overlay');
  if ((e.key === 'Enter' || e.key === ' ') && !overlay.classList.contains('gone')) {
    e.preventDefault();
    openCurtains();
  }
});

/* ── Countdown ────────────────────────────────── */
const weddingDate = new Date('2026-06-27T19:00:00+05:30'); // Sri Lanka time

function pad(n) {
  return String(n).padStart(2, '0');
}

function updateCD() {
  const diff = weddingDate - Date.now();
  if (diff <= 0) {
    ['days', 'hours', 'minutes', 'seconds'].forEach(k => {
      document.getElementById('cd-' + k).textContent = '00';
    });
    return;
  }
  document.getElementById('cd-days').textContent    = pad(Math.floor(diff / 86400000));
  document.getElementById('cd-hours').textContent   = pad(Math.floor(diff % 86400000 / 3600000));
  document.getElementById('cd-minutes').textContent = pad(Math.floor(diff % 3600000 / 60000));
  document.getElementById('cd-seconds').textContent = pad(Math.floor(diff % 60000 / 1000));
}

updateCD();
setInterval(updateCD, 1000);

/* ── Petals ───────────────────────────────────── */
const petalContainer = document.getElementById('petals');

function mkPetal() {
  const p   = document.createElement('div');
  const sz  = Math.random() * 14 + 7;
  const dur = Math.random() * 9 + 7;
  const del = Math.random() * -12;
  const hue = Math.random() > 0.5
    ? 'rgba(244,184,200,0.65)'
    : 'rgba(248,210,220,0.5)';

  p.className = 'petal';
  p.style.cssText =
    `left:${Math.random() * 100}%;` +
    `width:${sz}px;height:${sz}px;` +
    `animation-duration:${dur}s;animation-delay:${del}s;`;
  p.innerHTML =
    `<svg viewBox="0 0 20 24" width="${sz}" height="${sz}" style="transform:rotate(${Math.random() * 360}deg)">` +
    `<ellipse cx="10" cy="13" rx="6" ry="10" fill="${hue}"/>` +
    `<ellipse cx="10" cy="7"  rx="4" ry="6"  fill="${hue}" opacity=".7"/>` +
    `</svg>`;

  petalContainer.appendChild(p);
  setTimeout(() => p.remove(), (dur + Math.abs(del) + 1) * 1000);
}

function startPetals() {
  for (let i = 0; i < 18; i++) setTimeout(mkPetal, i * 180);
  setInterval(mkPetal, 900);
}

/* ── RSVP Form (Formspree) ────────────────────── */
const FORMSPREE_URL = 'https://formspree.io/f/mjgdvpjv';

document.getElementById('rsvp-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form   = this;
  const btn    = document.getElementById('rsvp-submit');
  const error  = document.getElementById('rsvp-error');
  const success = document.getElementById('rsvp-success');

  // Basic validation
  const name = form.querySelector('#rsvp-name').value.trim();
  const guests = form.querySelector('#rsvp-guests').value;
  if (!name || !guests) {
    form.querySelector('#rsvp-name').reportValidity();
    form.querySelector('#rsvp-guests').reportValidity();
    return;
  }

  btn.textContent = 'Sending…';
  btn.disabled = true;
  error.hidden = true;

  try {
    const res = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form),
    });

    if (res.ok) {
      form.style.transition = 'opacity 0.4s ease';
      form.style.opacity = '0';
      setTimeout(() => {
        form.hidden = true;
        success.hidden = false;
        success.classList.add('visible');
      }, 420);
    } else {
      error.hidden = false;
      btn.textContent = 'Register Attendance ✶';
      btn.disabled = false;
    }
  } catch {
    error.hidden = false;
    btn.textContent = 'Register Attendance ✶';
    btn.disabled = false;
  }
});

/* ── Scroll reveal ────────────────────────────── */
function observeReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in'), i * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}
