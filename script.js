// Mobile nav
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
mainNav.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
  mainNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', false);
}));

// Stat counters
function animateCounter(el) {
  const target = +el.dataset.target;
  const dur = 1800;
  const start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.floor(e * target);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  })(start);
}
let counted = false;
new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !counted) {
    counted = true;
    document.querySelectorAll('.stat-num').forEach(animateCounter);
  }
}, { threshold: 0.4 }).observe(document.querySelector('.stats-bar'));

// Calculator
const state = { low: 3, high: 6, unit: 'sqft', sqft: 500, cracks: 3, mult: 1.0 };

function formatDollar(n) {
  return '$' + Math.round(n).toLocaleString();
}

function updateResult() {
  let lo, hi, unit;
  if (state.unit === 'per crack') {
    lo = state.low * state.cracks * state.mult;
    hi = state.high * state.cracks * state.mult;
    unit = `for ${state.cracks} crack${state.cracks > 1 ? 's' : ''}`;
  } else {
    lo = state.low * state.sqft * state.mult;
    hi = state.high * state.sqft * state.mult;
    unit = `for ${state.sqft.toLocaleString()} sq ft`;
  }
  document.getElementById('resultRange').textContent = `${formatDollar(lo)} – ${formatDollar(hi)}`;
  document.getElementById('resultUnit').textContent = unit;
}

// Service options
document.querySelectorAll('.calc-option').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.calc-option').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.low = +btn.dataset.low;
    state.high = +btn.dataset.high;
    state.unit = btn.dataset.unit || 'sqft';
    const isCrack = state.unit === 'per crack';
    document.getElementById('sqftField').style.display = isCrack ? 'none' : '';
    document.getElementById('crackField').style.display = isCrack ? '' : 'none';
    updateResult();
  });
});

// Sqft slider
const sqftSlider = document.getElementById('sqftSlider');
sqftSlider.addEventListener('input', () => {
  state.sqft = +sqftSlider.value;
  document.getElementById('sqftDisplay').textContent = state.sqft.toLocaleString() + ' sq ft';
  updateResult();
});

// Crack slider
const crackSlider = document.getElementById('crackSlider');
crackSlider.addEventListener('input', () => {
  state.cracks = +crackSlider.value;
  document.getElementById('crackDisplay').textContent = state.cracks + ` crack${state.cracks > 1 ? 's' : ''}`;
  updateResult();
});

// Complexity
document.querySelectorAll('.cmplx-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cmplx-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.mult = +btn.dataset.mult;
    updateResult();
  });
});

updateResult();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Promo popup
const overlay = document.getElementById('promoOverlay');
const closeBtn = document.getElementById('promoClose');
const submitBtn = document.getElementById('promoSubmit');

const dismissed = sessionStorage.getItem('promoDismissed');
if (!dismissed) {
  setTimeout(() => { overlay.classList.remove('hidden'); }, 3000);
}

closeBtn.addEventListener('click', () => {
  overlay.classList.add('hidden');
  sessionStorage.setItem('promoDismissed', 'true');
});

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    overlay.classList.add('hidden');
    sessionStorage.setItem('promoDismissed', 'true');
  }
});

submitBtn.addEventListener('click', async () => {
  const name = document.getElementById('promoName').value.trim();
  const phone = document.getElementById('promoPhone').value.trim();

  if (!name || !phone) {
    alert('Please enter your name and phone number.');
    return;
  }

  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  try {
    const response = await fetch('https://formspree.io/f/xxxxxxxx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: name,
        phone: phone,
        offer: 'July 4th — Free Consultation + 15% Discount',
        source: 'Popup Form — concretedoctor.com'
      })
    });

    if (response.ok) {
      submitBtn.textContent = '✓ We\'ll be in touch soon!';
      submitBtn.style.background = '#2a7a2a';
      setTimeout(() => {
        overlay.classList.add('hidden');
        sessionStorage.setItem('promoDismissed', 'true');
      }, 2500);
    } else {
      submitBtn.textContent = 'Something went wrong — try again';
      submitBtn.style.background = '#a83422';
      submitBtn.disabled = false;
    }
  } catch (error) {
    submitBtn.textContent = 'Connection error — try again';
    submitBtn.style.background = '#a83422';
    submitBtn.disabled = false;
  }
});
