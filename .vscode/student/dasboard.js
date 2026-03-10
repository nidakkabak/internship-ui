// ════════════════════════════════
//  DASHBOARD.JS
// ════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const s = getStudent();
  const lb = getLogbook();
  const c  = logCount();
  const pct = Math.round((c / 30) * 100);

  // Greeting
  setText('topbar-title', `${greeting()}, ${s.name.split(' ')[0]}`);

  // Hero
  setText('hero-avatar', initials(s.name));
  setText('hero-name',   s.name);
  setText('hero-school', s.school);
  setText('hero-pos',    s.position);
  setText('hstat-logs',  c);
  setText('hstat-pct',   pct + '%');

  // Progress
  setText('prog-val', `${c} / 30 gün`);
  setTimeout(() => {
    const bar = document.getElementById('prog-fill');
    if (bar) bar.style.width = pct + '%';
  }, 150);

  // Info cards
  setText('ic-company',    s.company);
  setText('ic-city',       s.city);
  setText('ic-coord',      s.coord);
  setText('ic-coord-mail', s.coordMail);
  setText('ic-start',      s.startDate);
  setText('ic-end',        '→ ' + s.endDate);

  // Feed
  const feedBody = document.getElementById('feed-body');
  if (!feedBody) return;

  const entries = Object.entries(lb)
    .filter(([, v]) => v?.trim())
    .sort(([a], [b]) => Number(b) - Number(a))
    .slice(0, 5);

  if (entries.length === 0) {
    feedBody.innerHTML = `
      <div class="feed-empty">
        <div class="feed-empty-icon">📖</div>
        <p>Henüz logbook girişi yok.<br><a href="logbook.html">İlk günü yazmaya başla →</a></p>
      </div>`;
    return;
  }

  feedBody.innerHTML = entries.map(([day, text]) => `
    <a href="logbook.html" class="feed-item" style="text-decoration:none">
      <div class="feed-day-badge">
        <div class="feed-day-num">${day}</div>
        <div class="feed-day-lbl">Gün</div>
      </div>
      <div class="feed-content">
        <div class="feed-text">${escHtml(text)}</div>
      </div>
    </a>
  `).join('');
});

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}