// ════════════════════════════════
//  APP.JS — Shared utilities
// ════════════════════════════════

const STORAGE = {
  logbook: 'staj_logbook_v2',
  student: 'staj_student_v2',
};

const DEFAULT_STUDENT = {
  name:      'Ahmet Yılmaz',
  school:    '',
  position:  'Frontend Developer Intern',
  company:   'TechCorp A.Ş.',
  city:      'Maslak, İstanbul',
  coord:     'Prof. Dr. Elif Kaya',
  coordMail: 'elif.kaya@itu.edu.tr',
  startDate: '1 Temmuz 2025',
  endDate:   '31 Temmuz 2025',
};

function getStudent() {
  try { return { ...DEFAULT_STUDENT, ...JSON.parse(localStorage.getItem(STORAGE.student)) }; }
  catch { return DEFAULT_STUDENT; }
}

function getLogbook() {
  try { return JSON.parse(localStorage.getItem(STORAGE.logbook)) || {}; }
  catch { return {}; }
}

function saveLogbook(data) {
  localStorage.setItem(STORAGE.logbook, JSON.stringify(data));
}

function logCount() {
  return Object.values(getLogbook()).filter(v => v?.trim()).length;
}

function initials(name) {
  return name.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Günaydın ☀️';
  if (h < 18) return 'Merhaba 👋';
  return 'İyi akşamlar 🌙';
}

function todayStr() {
  return new Date().toLocaleDateString('tr-TR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = `toast toast-${type} show`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = 'toast'; }, 2800);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ── Init sidebar on every page ──
document.addEventListener('DOMContentLoaded', () => {
  const s = getStudent();
  const c = logCount();

  setText('sb-name',   s.name);
  setText('sb-avatar', initials(s.name));

  const badge = document.getElementById('sb-badge');
  if (badge) {
    if (c > 0) { badge.textContent = c; badge.classList.add('show'); }
    else badge.classList.remove('show');
  }

  setText('topbar-date', todayStr());
});