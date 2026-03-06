// ============================================================
// SYNTHCASH LOGS — app.js
// Вся логика: навигация, рендер, темы, модалки
// ============================================================

// ── УРОВНИ ──
const LEVELS = [
  { level:1, name:'Rookie Creator',  minXP:0,     maxXP:1000  },
  { level:2, name:'Street Hustler', minXP:1000,  maxXP:3000  },
  { level:3, name:'Content Mage',   minXP:3000,  maxXP:7000  },
  { level:4, name:'AI Warlord',     minXP:7000,  maxXP:15000 },
  { level:5, name:'Neural Overlord',minXP:15000, maxXP:99999 },
];

// ── HELPERS ──
function getLevel(xp) {
  return LEVELS.find(l => xp >= l.minXP && xp < l.maxXP) || LEVELS[LEVELS.length - 1];
}

function getDayCount() {
  const launch = new Date(LAUNCH_DATE);
  const now    = new Date();
  const diff   = Math.floor((now - launch) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diff);
}

function formatDayCount() {
  return String(getDayCount()).padStart(3, '0');
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('ru-RU', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

function formatContent(c) {
  return c
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

function pomoHours(minutes) {
  return Math.floor(minutes / 60) + 'ч ' + (minutes % 60) + 'м';
}

function pomoTime(minutes) {
  return Math.floor(minutes / 60) + ':' + String(minutes % 60).padStart(2, '0');
}

// Суммарное время из всех постов
function totalMinutes() {
  return POSTS.reduce((a, p) => a + (p.minutes || 0), 0);
}

// ── ТЕМА ──
function initTheme() {
  const saved = localStorage.getItem('sc-theme') || 'dark';
  applyTheme(saved, false);
}

function applyTheme(theme, save = true) {
  document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : '');
  const thumb = document.getElementById('toggleThumb');
  if (thumb) thumb.textContent = theme === 'light' ? '☀️' : '🌙';
  if (save) localStorage.setItem('sc-theme', theme);
}

function toggleTheme() {
  const current = localStorage.getItem('sc-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// ── НАВИГАЦИЯ ──
const VIEWS = ['dashboard', 'posts', 'badges', 'stats'];
let currentView = 'dashboard';

function initNav() {
  // Читаем hash из URL
  const hash = location.hash.replace('#', '');
  if (VIEWS.includes(hash)) currentView = hash;

  // Вешаем обработчики на кнопки
  VIEWS.forEach(view => {
    const btn = document.getElementById('nav-' + view);
    if (btn) {
      btn.addEventListener('click', () => navigate(view));
    }
  });

  // Слушаем изменения hash (кнопка назад/вперёд)
  window.addEventListener('hashchange', () => {
    const h = location.hash.replace('#', '');
    if (VIEWS.includes(h) && h !== currentView) {
      currentView = h;
      renderView();
      updateNavActive();
    }
  });
}

function navigate(view) {
  currentView = view;
  location.hash = view;
  renderView();
  updateNavActive();
  // Закрываем мобильный сайдбар
  if (window.innerWidth <= 768) setSidebar(false);
}

function updateNavActive() {
  VIEWS.forEach(v => {
    const btn = document.getElementById('nav-' + v);
    if (btn) btn.classList.toggle('active', v === currentView);
  });
}

// ── РЕНДЕР ──
function renderView() {
  const el = document.getElementById('mainArea');
  const div = document.createElement('div');
  div.className = 'view-animate';

  switch (currentView) {
    case 'dashboard': div.innerHTML = viewDashboard(); break;
    case 'posts':     div.innerHTML = viewPosts();     break;
    case 'badges':    div.innerHTML = viewBadges();    break;
    case 'stats':     div.innerHTML = viewStats();     break;
  }

  el.innerHTML = '';
  el.appendChild(div);

  // Вешаем обработчики на бейджи после рендера
  el.querySelectorAll('[data-badge-id]').forEach(el => {
    el.addEventListener('click', () => openModal(el.dataset.badgeId));
  });
}

// ── SIDEBAR данные ──
function updateSidebarData() {
  const lv = getLevel(PROFILE.currentXP);
  const pct = Math.round(((PROFILE.currentXP - lv.minXP) / (lv.maxXP - lv.minXP)) * 100);

  const el = id => document.getElementById(id);

  if (el('dayCountFooter')) el('dayCountFooter').textContent = formatDayCount();
  if (el('dayCountMob'))    el('dayCountMob').textContent    = formatDayCount();
  if (el('headerDay'))      el('headerDay').textContent      = 'DAY ' + formatDayCount();
}

// ── VIEWS ──

function viewDashboard() {
  const lv  = getLevel(PROFILE.currentXP);
  const pct = Math.round(((PROFILE.currentXP - lv.minXP) / (lv.maxXP - lv.minXP)) * 100);
  const pomoTotal = totalMinutes();
  const pomodoros = Math.floor(pomoTotal / 25);
  const pomoDisplay = pomodoros;
  const pomoMinutes = pomoTotal + ' мин';
  const unlockedCount = BADGES.filter(b => b.unlocked).length;

  const nextLevels = LEVELS.slice(lv.level).slice(0, 3);

  return `
  <div class="page-topbar">
    <div class="page-title">Дашборд</div>
    <div class="page-meta">SEASON 01 · DAY ${formatDayCount()}</div>
  </div>

  <!-- CHARACTER HERO -->
  <div class="char-hero">
    <div class="char-avatar-wrap">
      <div class="char-avatar">🤖</div>
      <div class="lv-badge">LV. ${String(lv.level).padStart(2,'0')}</div>
    </div>

    <div class="char-info">
      <div class="char-name">SynthCash</div>
      <div class="char-class">★ ${lv.name} ★</div>
      <div class="bars">
        <div class="bar-row">
          <div class="bar-lbl hp">HP</div>
          <div class="bar-track"><div class="bar-fill hp" style="width:100%"></div></div>
          <div class="bar-val">100/100</div>
        </div>
        <div class="bar-row">
          <div class="bar-lbl fp">FOCUS</div>
          <div class="bar-track"><div class="bar-fill fp" style="width:70%"></div></div>
          <div class="bar-val">70/100</div>
        </div>
        <div class="bar-row">
          <div class="bar-lbl xp">XP</div>
          <div class="bar-track"><div class="bar-fill xp" style="width:${pct}%"></div></div>
          <div class="bar-val">${PROFILE.currentXP}/${lv.maxXP}</div>
        </div>
      </div>
    </div>

    <div class="char-rank">
      <span class="rank-label">РАНГ</span>
      <div class="rank-box">
        <div class="rank-ico">⚔️</div>
        <div class="rank-name">${lv.name}</div>
      </div>
    </div>
  </div>

  <!-- STATS -->
  <div class="stats-grid">
    <div class="stat-tile st1">
      <span class="s-ico">💰</span>
      <div class="s-val green">$${PROFILE.totalEarnings}</div>
      <div class="s-name">Заработано</div>
    </div>
    <div class="stat-tile st2">
      <span class="s-ico">🎬</span>
      <div class="s-val blue">${PROFILE.videos}</div>
      <div class="s-name">Видео</div>
    </div>
    <div class="stat-tile st3">
      <span class="s-ico">⚔️</span>
      <div class="s-val purple">${getDayCount()}</div>
      <div class="s-name">Дней в пути</div>
    </div>
    <div class="stat-tile st4">
      <span class="s-ico">🍅</span>
      <div class="s-val gold">${pomoDisplay}</div>
      <div class="s-name">Помодоро</div>
    </div>
  </div>

  <!-- POMO + XP -->
  <div class="two-col">
    <div class="panel">
      <div class="panel-head">
        <span class="panel-ico">⏱</span>
        <span class="panel-title">Часы в работе</span>
        <span class="panel-meta" style="color:var(--red)">● LIVE</span>
      </div>
      <div class="panel-body">
        <div class="pomo-list">
          <div class="pomo-row">
            <div class="pomo-dot on"></div>
            <div class="pomo-info">
              <div class="pomo-lbl">AI Content</div>
              <div class="pomo-xp">суммарно за все дни</div>
            </div>
            <div class="pomo-time ${pomoTotal === 0 ? 'dim' : ''}">${pomoTime(pomoTotal)} ч</div>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <span class="panel-ico">⚡</span>
        <span class="panel-title">Прокачка</span>
      </div>
      <div class="panel-body">
        <div style="margin-bottom:16px">
          <div class="xp-top">
            <div class="xp-level">${lv.name}</div>
            <div class="xp-count">${PROFILE.currentXP} / ${lv.maxXP}</div>
          </div>
          <div class="xp-track">
            <div class="xp-fill" style="width:${pct}%"></div>
          </div>
          <div class="xp-sub">До Lv.${lv.level + 1} — ещё ${lv.maxXP - PROFILE.currentXP} XP</div>
        </div>
        <div class="levels-list">
          ${nextLevels.map(l => `
          <div class="level-row">
            <div class="level-row-name ${l.level === 5 ? 'epic' : ''}">Lv.${l.level} — ${l.name}</div>
            <div class="level-row-xp">${l.minXP} XP</div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- ACHIEVEMENTS PREVIEW -->
  <div class="panel">
    <div class="panel-head">
      <span class="panel-ico">🏆</span>
      <span class="panel-title">Достижения</span>
      <span class="panel-meta">${unlockedCount} / ${BADGES.length}</span>
    </div>
    <div class="panel-body">
      <div class="ach-grid">
        ${BADGES.map(b => `
        <div class="ach ${b.unlocked ? 'unlocked' : 'locked'}"
             ${b.unlocked ? `data-badge-id="${b.id}"` : ''}>
          <div class="rarity-bar ${b.rarity}"></div>
          <div class="rarity-tag ${b.rarity}">${b.rarity[0].toUpperCase()}</div>
          <span class="ach-ico">${b.ico}</span>
          <div class="ach-name">${b.name}</div>
          <div class="ach-desc">${b.desc}</div>
          ${b.unlocked ? `<div class="ach-date">✓ ${b.date}</div>` : ''}
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

function viewPosts() {
  return `
  <div class="page-topbar">
    <div class="page-title">Журнал квестов</div>
    <div class="page-meta">${POSTS.length} записей</div>
  </div>

  ${POSTS.length === 0 ? `
  <div class="empty-state">
    <div class="empty-ico">📜</div>
    <div class="empty-txt">Записей пока нет<br>Первая появится скоро</div>
  </div>` : POSTS.slice().reverse().map(post => `
  <div class="post-card">
    <div class="post-meta">${formatDate(post.date)} // ЗАПИСЬ #${String(post.id).padStart(3,'0')}${post.minutes ? ' // ⏱ ' + post.minutes + ' МИН' : ''}</div>
    <div class="post-title">${post.title}</div>
    <div class="post-body">${formatContent(post.content)}</div>
    <div class="post-footer">
      <div class="post-tags">${(post.tags || []).map(t => `<span class="tag">#${t}</span>`).join('')}</div>
      <div class="post-stats">
        ${post.earnings ? `<span class="post-stat-pill earn">+$${post.earnings}</span>` : ''}
        ${post.videos ? `<span class="post-stat-pill video">🎬 ${post.videos} видео</span>` : ''}
      </div>
    </div>
  </div>`).join('')}`;
}

function viewBadges() {
  const unlocked = BADGES.filter(b => b.unlocked);
  const locked   = BADGES.filter(b => !b.unlocked);

  return `
  <div class="page-topbar">
    <div class="page-title">Достижения</div>
    <div class="page-meta">${unlocked.length} / ${BADGES.length} получено</div>
  </div>

  <div class="panel">
    <div class="panel-head">
      <span class="panel-ico">✅</span>
      <span class="panel-title">Получены</span>
      <span class="panel-meta">${unlocked.length} шт</span>
    </div>
    <div class="panel-body">
      ${unlocked.length === 0
        ? '<div style="text-align:center;color:var(--text-dim);font-size:14px;padding:20px">Пока нет — всё впереди</div>'
        : `<div class="ach-grid">${unlocked.map(b => `
        <div class="ach unlocked" data-badge-id="${b.id}">
          <div class="rarity-bar ${b.rarity}"></div>
          <div class="rarity-tag ${b.rarity}">${b.rarity[0].toUpperCase()}</div>
          <span class="ach-ico">${b.ico}</span>
          <div class="ach-name">${b.name}</div>
          <div class="ach-desc">${b.desc}</div>
          <div class="ach-date">✓ ${b.date}</div>
        </div>`).join('')}</div>`}
    </div>
  </div>

  <div class="panel">
    <div class="panel-head">
      <span class="panel-ico">🔒</span>
      <span class="panel-title">Ещё не получены</span>
      <span class="panel-meta">${locked.length} шт</span>
    </div>
    <div class="panel-body">
      <div class="ach-grid">
        ${locked.map(b => `
        <div class="ach locked">
          <div class="rarity-bar ${b.rarity}"></div>
          <div class="rarity-tag ${b.rarity}">${b.rarity[0].toUpperCase()}</div>
          <span class="ach-ico">${b.ico}</span>
          <div class="ach-name">${b.name}</div>
          <div class="ach-desc">${b.cond}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

function viewStats() {
  const pomoTotal = totalMinutes();

  return `
  <div class="page-topbar">
    <div class="page-title">Статистика</div>
    <div class="page-meta">SEASON 01</div>
  </div>

  <div class="stats-big-grid">
    <div class="stat-big">
      <div class="stat-big-val">$${PROFILE.totalEarnings}</div>
      <div class="stat-big-lbl">Всего заработано</div>
    </div>
    <div class="stat-big">
      <div class="stat-big-val">$${PROFILE.monthlyEarnings}</div>
      <div class="stat-big-lbl">Этот месяц</div>
    </div>
    <div class="stat-big">
      <div class="stat-big-val">${PROFILE.videos}</div>
      <div class="stat-big-lbl">Видео загружено</div>
    </div>
    <div class="stat-big">
      <div class="stat-big-val">${POSTS.length}</div>
      <div class="stat-big-lbl">Записей в журнале</div>
    </div>
    <div class="stat-big">
      <div class="stat-big-val">${getDayCount()}</div>
      <div class="stat-big-lbl">Дней в пути</div>
    </div>
    <div class="stat-big">
      <div class="stat-big-val">${PROFILE.currentXP}</div>
      <div class="stat-big-lbl">Опыта набрано</div>
    </div>
    <div class="stat-big">
      <div class="stat-big-val">${Math.floor(pomoTotal / 60)}ч ${pomoTotal % 60}м</div>
      <div class="stat-big-lbl">Время в работе</div>
    </div>
    <div class="stat-big">
      <div class="stat-big-val">${BADGES.filter(b => b.unlocked).length}</div>
      <div class="stat-big-lbl">Бейджей получено</div>
    </div>
  </div>

  <div class="panel">
    <div class="panel-head">
      <span class="panel-ico">⏱</span>
      <span class="panel-title">Время по дням</span>
    </div>
    <div class="panel-body">
      <div class="pomo-list">
        ${POSTS.slice().reverse().map(p => p.minutes ? `
        <div class="pomo-row">
          <div class="pomo-dot off"></div>
          <div class="pomo-info"><div class="pomo-lbl">${p.title}</div></div>
          <div class="pomo-time">${pomoHours(p.minutes)}</div>
        </div>` : '').join('')}
      </div>
    </div>
  </div>`;
}

// ── MODAL ──
function openModal(id) {
  const b = BADGES.find(x => x.id === id);
  if (!b) return;
  document.getElementById('mIco').textContent  = b.ico;
  document.getElementById('mName').textContent = b.name;
  document.getElementById('mDesc').textContent = b.desc;
  document.getElementById('mCond').textContent = 'Условие: ' + b.cond;
  document.getElementById('mXp').textContent   = '+' + b.xp + ' XP';
  document.getElementById('achModal').classList.add('active');
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('achModal')) {
    document.getElementById('achModal').classList.remove('active');
  }
}

// ── MOBILE SIDEBAR ──
function setSidebar(open) {
  document.getElementById('sidebar').classList.toggle('open', open);
  document.getElementById('sidebarOverlay').classList.toggle('active', open);
}

function toggleSidebar() {
  const isOpen = document.getElementById('sidebar').classList.contains('open');
  setSidebar(!isOpen);
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  updateSidebarData();
  renderView();
  updateNavActive();

  // Theme toggle button
  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);

  // Mobile menu
  const menuBtn = document.getElementById('mobMenuBtn');
  if (menuBtn) menuBtn.addEventListener('click', toggleSidebar);

  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) overlay.addEventListener('click', () => setSidebar(false));

  // Modal close
  const modal = document.getElementById('achModal');
  if (modal) modal.addEventListener('click', closeModal);

  // ESC closes modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
});
