// ═══════════════════════════
//  LOGBOOK.JS
// ═══════════════════════════

let entries   = {};
let activeDay = null;

document.addEventListener('DOMContentLoaded', () => {
  entries = getLogbook();
  buildCalendar();
  updateStats();

  const ta = document.getElementById('entry-ta');
  if (ta) {
    ta.addEventListener('input', () => {
      document.getElementById('chars-count').textContent = ta.value.length + ' characters';
    });
  }

  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter' && activeDay) saveEntry();
  });
});

function buildCalendar() {
  const grid = document.getElementById('cal-grid');
  if (!grid) return;
  grid.innerHTML = '';

  let dayNum = 1;
  for (let slot = 0; slot < 49; slot++) {
    const weekDay = slot % 7;
    const div = document.createElement('div');

    if (weekDay >= 5 || dayNum > 30) {
      div.className = 'cal-day empty-slot';
      grid.appendChild(div);
      continue;
    }

    const d = dayNum++;
    div.className = buildDayClass(d);
    div.innerHTML = `<span class="cal-day-num">${d}</span><span class="cal-day-label">Day</span>`;
    div.addEventListener('click', () => selectDay(d));
    grid.appendChild(div);
  }
}

function buildDayClass(d) {
  let cls = 'cal-day';
  if (entries[d]?.trim()) cls += ' filled';
  if (d === activeDay)    cls += ' selected';
  return cls;
}

function selectDay(day) {
  activeDay = day;
  buildCalendar();

  document.getElementById('ep-num').textContent   = day;
  document.getElementById('ep-title').textContent = `Day ${day}`;
  document.getElementById('ep-sub').textContent   = `Internship day ${day}`;

  const ta = document.getElementById('entry-ta');
  ta.value    = entries[day] || '';
  ta.disabled = false;
  ta.placeholder = 'What did you do today? Topics worked on, things learned...';
  document.getElementById('chars-count').textContent = ta.value.length + ' characters';

  const btnDel  = document.getElementById('btn-del');
  const btnSave = document.getElementById('btn-save');
  if (btnDel)  btnDel.style.display  = entries[day]?.trim() ? 'flex' : 'none';
  if (btnSave) btnSave.disabled = false;

  ta.focus();
}
let calendarExpanded = false;

function toggleCalendar() {
  const grid = document.getElementById("cal-grid");
  const btn  = document.getElementById("cal-toggle-btn");

  calendarExpanded = !calendarExpanded;

  if (calendarExpanded) {
    grid.classList.add("expanded");
    btn.textContent = "Show less";
  } else {
    grid.classList.remove("expanded");
    btn.textContent = "Show more";
  }
}

function saveEntry() {
  if (!activeDay) return;
  const text = document.getElementById('entry-ta').value.trim();

  if (text) {
    entries[activeDay] = text;
    showToast(`✓  Day ${activeDay} saved`, 'success');
  } else {
    delete entries[activeDay];
    showToast(`Day ${activeDay} cleared`, 'delete');
  }

  saveLogbook(entries);
  updateStats();
  buildCalendar();

  const btnDel = document.getElementById('btn-del');
  if (btnDel) btnDel.style.display = entries[activeDay]?.trim() ? 'flex' : 'none';

  const badge = document.getElementById('sb-badge');
  const c = logCount();
  if (badge) {
    if (c > 0) { badge.textContent = c; badge.classList.add('show'); }
    else badge.classList.remove('show');
  }
}

function deleteEntry() {
  if (!activeDay) return;
  delete entries[activeDay];
  saveLogbook(entries);

  const ta = document.getElementById('entry-ta');
  ta.value = '';
  document.getElementById('chars-count').textContent = '0 characters';
  document.getElementById('btn-del').style.display = 'none';

  updateStats();
  buildCalendar();
  showToast(`Day ${activeDay} deleted`, 'delete');

  const badge = document.getElementById('sb-badge');
  const c = logCount();
  if (badge) {
    if (c > 0) { badge.textContent = c; badge.classList.add('show'); }
    else badge.classList.remove('show');
  }
}

function updateStats() {
  const c   = Object.values(entries).filter(v => v?.trim()).length;
  const pct = Math.round((c / 30) * 100);

  const sf = document.getElementById('stat-filled');
  const sp = document.getElementById('stat-pct');
  const sr = document.getElementById('stat-remain');
  const cm = document.getElementById('cal-meta');

  if (sf) sf.textContent = c;
  if (sp) sp.textContent = pct + '%';
  if (sr) sr.textContent = 30 - c;
  if (cm) cm.textContent = `${c} / 30 completed`;
}