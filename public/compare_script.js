// ── GLOBAL DATA ────────────────────────────────────────────
let PHONES_DATA = [];

// ── SPEC LABELS ────────────────────────────────────────────
const SPEC_LABELS = {
  display:         '🖥 Display',
  processor:       '⚡ Processor',
  ram:             '🧠 RAM',
  storage:         '💾 Storage',
  battery:         '🔋 Battery',
  charging:        '🔌 Charging',
  rearCamera:      '📷 Rear Camera',
  frontCamera:     '🤳 Front Camera',
  os:              '🤖 OS',
  network:         '📶 Network',
  dimensions:      '📐 Dimensions',
  weight:          '⚖️ Weight',
  colors:          '🎨 Colors',
  fingerprint:     '👆 Fingerprint',
  waterResistance: '💧 Water Resistance',
};

// ── DOM READY ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  fetchPhones();

  document.getElementById('phone1').addEventListener('change', compare);
  document.getElementById('phone2').addEventListener('change', compare);
});

// ── FETCH DATA ─────────────────────────────────────────────
async function fetchPhones() {
  try {
    const res = await fetch('/api/phones');
    PHONES_DATA = await res.json();

    console.log("Loaded phones:", PHONES_DATA); // debug

    loadPhones();
  } catch (err) {
    console.error('Error fetching phones:', err);
  }
}

// ── POPULATE DROPDOWNS ─────────────────────────────────────
function loadPhones() {
  const sel1 = document.getElementById('phone1');
  const sel2 = document.getElementById('phone2');

  sel1.innerHTML = '<option value="">Select Phone 1</option>';
  sel2.innerHTML = '<option value="">Select Phone 2</option>';

  PHONES_DATA.forEach(p => {
    const label = `${p.brand} ${p.model}`;

    const opt1 = new Option(label, p.id);
    const opt2 = new Option(label, p.id);

    sel1.appendChild(opt1);
    sel2.appendChild(opt2);
  });
}

// ── COMPARE ────────────────────────────────────────────────
function compare() {
  const sel1 = document.getElementById('phone1');
  const sel2 = document.getElementById('phone2');

  const id1 = sel1.value;
  const id2 = sel2.value;

  const compareBody = document.getElementById('compare-body');
  const p1Name = document.getElementById('p1-name');
  const p2Name = document.getElementById('p2-name');
  const reviews1 = document.getElementById('reviews1');
  const reviews2 = document.getElementById('reviews2');

  if (!id1 || !id2) {
    compareBody.innerHTML = '';
    p1Name.textContent = 'Phone 1';
    p2Name.textContent = 'Phone 2';
    reviews1.innerHTML = '';
    reviews2.innerHTML = '';
    return;
  }

  const p1 = PHONES_DATA.find(p => p.id == id1);
  const p2 = PHONES_DATA.find(p => p.id == id2);

  if (!p1 || !p2) {
    console.warn("Phones not found:", id1, id2);
    return;
  }

  // Titles
  p1Name.textContent = `${p1.brand} ${p1.model}`;
  p2Name.textContent = `${p2.brand} ${p2.model}`;

  compareBody.innerHTML = '';

  // Price row
  compareBody.innerHTML += `
    <tr>
      <td>💰 Price</td>
      <td>${p1.price}</td>
      <td>${p2.price}</td>
    </tr>
  `;

  // Specs
  Object.entries(SPEC_LABELS).forEach(([key, label]) => {
    const v1 = p1.specs?.[key] || '—';
    const v2 = p2.specs?.[key] || '—';

    compareBody.innerHTML += `
      <tr>
        <td>${label}</td>
        <td>${v1}</td>
        <td>${v2}</td>
      </tr>
    `;
  });

  // Reviews
  reviews1.innerHTML = '';
  (p1.reviews || []).forEach(r => {
    const li = document.createElement('li');
    li.textContent = r;
    reviews1.appendChild(li);
  });

  reviews2.innerHTML = '';
  (p2.reviews || []).forEach(r => {
    const li = document.createElement('li');
    li.textContent = r;
    reviews2.appendChild(li);
  });

  // Titles update
  document.querySelector('.review-box:first-child h2').textContent =
    `Reviews – ${p1.brand} ${p1.model}`;

  document.querySelector('.review-box:last-child h2').textContent =
    `Reviews – ${p2.brand} ${p2.model}`;
}