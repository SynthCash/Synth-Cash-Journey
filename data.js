// ============================================================
// SYNTHCASH LOGS — data.js
// Это единственный файл, который ты редактируешь регулярно.
// Добавить пост = скопировать блок и заполнить поля.
// ============================================================

// Дата запуска сайта — меняй только один раз
const LAUNCH_DATE = '2026-04-03';

// Профиль — обновляй вручную по мере роста
const PROFILE = {
  currentXP:      50,
  totalEarnings:  0,
  monthlyEarnings:0,
  videos:         0,
  pomodoro: {
    'AI Content (PH)':    0,  // минуты
    'Другие AI-проекты':  0,
    'Обучение / ресёрч':  0,
  }
};

// Бейджи — меняй unlocked: true когда достиг
const BADGES = [
  {
    id: 'first-blood',
    ico: '🔥',
    name: 'First Blood',
    desc: 'Создан аккаунт и начат путь',
    cond: 'Зарегистрироваться на платформе',
    rarity: 'common',
    xp: 50,
    unlocked: true,
    date: 'День 1'
  },
  {
    id: 'first-session',
    ico: '🍅',
    name: 'First Session',
    desc: 'Первый помодоро на проекте',
    cond: 'Запустить первую рабочую сессию',
    rarity: 'common',
    xp: 50,
    unlocked: true,
    date: 'День 1'
  },
  {
    id: 'first-upload',
    ico: '🎬',
    name: 'First Upload',
    desc: 'Первое видео загружено на PH',
    cond: 'Загрузить 1 видео на платформу',
    rarity: 'rare',
    xp: 100,
    unlocked: false,
    date: null
  },
  {
    id: 'first-dollar',
    ico: '💰',
    name: 'First Dollar',
    desc: 'Первый заработанный доллар',
    cond: 'Заработать $1',
    rarity: 'rare',
    xp: 100,
    unlocked: false,
    date: null
  },
  {
    id: 'viral-spark',
    ico: '👁️',
    name: 'Viral Spark',
    desc: '1000 просмотров на одном видео',
    cond: 'Набрать 1000 просмотров',
    rarity: 'rare',
    xp: 150,
    unlocked: false,
    date: null
  },
  {
    id: 'hustle-mode',
    ico: '🚀',
    name: 'Hustle Mode',
    desc: 'Заработано $100',
    cond: 'Заработать $100 суммарно',
    rarity: 'epic',
    xp: 250,
    unlocked: false,
    date: null
  },
  {
    id: 'grind-100h',
    ico: '⚡',
    name: '100h Grind',
    desc: '100 часов в помодоро на проекте',
    cond: '100 часов суммарного трекинга',
    rarity: 'epic',
    xp: 250,
    unlocked: false,
    date: null
  },
  {
    id: 'neural-king',
    ico: '👑',
    name: 'Neural King',
    desc: '$1000 в один месяц',
    cond: 'Заработать $1000 за календарный месяц',
    rarity: 'legend',
    xp: 500,
    unlocked: false,
    date: null
  },
];

// Посты — добавляй снизу, копируя блок
// Чтобы добавить новый пост: скопируй блок ниже, заполни поля, сохрани файл
const POSTS = [
  // {
  //   id: 1,
  //   date: '2025-01-15',
  //   title: 'День 1: Начало пути',
  //   content: `Текст поста. Можно использовать **жирный** текст.
  //
  // Новая строка — просто Enter.`,
  //   tags: ['старт', 'план'],
  //   earnings: 0,
  //   videos: 0,
  // },
];
