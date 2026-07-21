document.addEventListener('DOMContentLoaded', () => {
  console.log('FreeDoc loaded');
  initQuizGame();
  initMemoryGame();
  initFlashcardQuiz();
  initMemoryLevels();
  initDocExplorer();
  initDocPreviewPage();
  initWorksheetList();
  initStoryList();
  initQaList();
  initTipsList();
  initWorksheetGenerator();
});

function initQuizGame() {
  const game = document.querySelector('[data-quiz-game]');
  if (!game) return;

  const options = game.querySelectorAll('[data-quiz-option]');
  const result = game.querySelector('[data-quiz-result]');
  const moreLink = game.querySelector('[data-quiz-more]');
  let answered = false;

  options.forEach((option) => {
    option.addEventListener('click', () => {
      if (answered) return;

      const isCorrect = option.dataset.correct === 'true';
      options.forEach((o) => o.disabled = true);
      option.classList.add(isCorrect ? 'is-correct' : 'is-wrong');

      if (isCorrect) {
        answered = true;
        result.textContent = '🎉 Chính xác! Bé nhận được 1 sticker 🌟';
        if (moreLink) moreLink.hidden = false;
      } else {
        result.textContent = '❌ Chưa đúng, thử lại nhé!';
        setTimeout(() => {
          option.classList.remove('is-wrong');
          option.disabled = false;
        }, 800);
      }

      result.hidden = false;
    });
  });
}

function initMemoryGame() {
  const game = document.querySelector('[data-memory-game]');
  if (!game) return;

  const cards = Array.from(game.querySelectorAll('[data-memory-card]'));
  const result = game.querySelector('[data-memory-result]');
  const moreLink = game.querySelector('[data-memory-more]');
  const totalPairs = cards.length / 2;
  let flipped = [];
  let matchedCount = 0;
  let isLocked = false;

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      if (isLocked) return;
      if (card.classList.contains('is-flipped') || card.classList.contains('is-matched')) return;

      card.classList.add('is-flipped');
      flipped.push(card);

      if (flipped.length === 2) {
        isLocked = true;
        const [first, second] = flipped;

        if (first.dataset.value === second.dataset.value) {
          first.classList.add('is-matched');
          second.classList.add('is-matched');
          matchedCount++;
          flipped = [];
          isLocked = false;

          if (matchedCount === totalPairs) {
            result.textContent = '🎉 Bé đã hoàn thành! Nhận ngay huy hiệu 🏅';
            result.hidden = false;
            if (moreLink) moreLink.hidden = false;
          }
        } else {
          setTimeout(() => {
            first.classList.remove('is-flipped');
            second.classList.remove('is-flipped');
            flipped = [];
            isLocked = false;
          }, 800);
        }
      }
    });
  });
}

function initFlashcardQuiz() {
  const categoriesWrap = document.querySelector('[data-quiz-categories]');
  const dataEl = document.getElementById('quiz-data');
  if (!categoriesWrap || !dataEl) return;

  const categories = JSON.parse(dataEl.textContent);
  const categoryButtons = categoriesWrap.querySelectorAll('[data-quiz-category]');
  const emptyMsg = document.querySelector('[data-quiz-empty]');
  const flashcardBox = document.querySelector('[data-quiz-flashcard]');
  const progressEl = document.querySelector('[data-quiz-progress]');
  const cardInner = document.querySelector('[data-quiz-card-inner]');
  const questionEl = document.querySelector('[data-quiz-question]');
  const answerEl = document.querySelector('[data-quiz-answer]');
  const cardEl = document.querySelector('[data-quiz-card]');
  const flipBtn = document.querySelector('[data-quiz-flip]');
  const nextBtn = document.querySelector('[data-quiz-next]');

  let currentCategory = null;
  let currentIndex = 0;

  function renderCard() {
    const card = currentCategory.flashcards[currentIndex];
    progressEl.textContent = `${currentCategory.icon} ${currentCategory.title} — Câu ${currentIndex + 1}/${currentCategory.flashcards.length}`;
    questionEl.textContent = card.question;
    answerEl.textContent = card.answer;
    cardInner.classList.remove('is-flipped');
  }

  function selectCategory(key) {
    currentCategory = categories.find((c) => c.key === key);
    if (!currentCategory) return;
    currentIndex = 0;

    categoryButtons.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.quizCategory === key);
    });

    emptyMsg.hidden = true;
    flashcardBox.hidden = false;
    renderCard();
  }

  categoryButtons.forEach((btn) => {
    btn.addEventListener('click', () => selectCategory(btn.dataset.quizCategory));
  });

  cardEl.addEventListener('click', () => {
    cardInner.classList.toggle('is-flipped');
  });

  flipBtn.addEventListener('click', () => {
    cardInner.classList.toggle('is-flipped');
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentCategory.flashcards.length;
    renderCard();
  });
}

function initMemoryLevels() {
  const levelsWrap = document.querySelector('[data-memory-levels]');
  const grid = document.querySelector('[data-memory-page-grid]');
  if (!levelsWrap || !grid) return;

  const POOL = ['🍎', '🐶', '⭐', '🍌', '🐱', '🌙', '🍇', '🐸'];
  const MAX_LEVEL = POOL.length - 2;

  const levelButtons = levelsWrap.querySelectorAll('[data-memory-level]');
  const statusEl = document.querySelector('[data-memory-status]');
  const resultEl = document.querySelector('[data-memory-page-result]');

  let currentLevel = 1;
  let totalPairs = 0;
  let matchedCount = 0;
  let flipped = [];
  let isLocked = false;

  function shuffle(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function handleCardClick(card) {
    if (isLocked) return;
    if (card.classList.contains('is-flipped') || card.classList.contains('is-matched')) return;

    card.classList.add('is-flipped');
    flipped.push(card);

    if (flipped.length === 2) {
      isLocked = true;
      const [first, second] = flipped;

      if (first.dataset.value === second.dataset.value) {
        first.classList.add('is-matched');
        second.classList.add('is-matched');
        matchedCount++;
        flipped = [];
        isLocked = false;

        if (matchedCount === totalPairs) {
          if (currentLevel < MAX_LEVEL) {
            resultEl.textContent = `🎉 Hoàn thành cấp ${currentLevel}! Đang chuyển sang cấp ${currentLevel + 1}...`;
            resultEl.hidden = false;
            setTimeout(() => buildLevel(currentLevel + 1), 1500);
          } else {
            resultEl.textContent = '🏆 Chúc mừng bé đã chinh phục tất cả các cấp độ!';
            resultEl.hidden = false;
          }
        }
      } else {
        setTimeout(() => {
          first.classList.remove('is-flipped');
          second.classList.remove('is-flipped');
          flipped = [];
          isLocked = false;
        }, 800);
      }
    }
  }

  function buildLevel(level) {
    currentLevel = level;
    totalPairs = level + 2;
    matchedCount = 0;
    flipped = [];
    isLocked = false;
    resultEl.hidden = true;

    const values = shuffle([...POOL.slice(0, totalPairs), ...POOL.slice(0, totalPairs)]);

    grid.innerHTML = '';
    values.forEach((value) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'memory-page__card';
      card.dataset.value = value;
      card.innerHTML =
        '<span class="memory-page__card-inner">' +
        '<span class="memory-page__card-face memory-page__card-face--back">❓</span>' +
        `<span class="memory-page__card-face memory-page__card-face--front">${value}</span>` +
        '</span>';
      card.addEventListener('click', () => handleCardClick(card));
      grid.appendChild(card);
    });

    statusEl.textContent = `Cấp độ ${level} — ${totalPairs} cặp hình`;
    levelButtons.forEach((btn) => {
      btn.classList.toggle('is-active', Number(btn.dataset.memoryLevel) === level);
    });
  }

  levelButtons.forEach((btn) => {
    btn.addEventListener('click', () => buildLevel(Number(btn.dataset.memoryLevel)));
  });

  buildLevel(1);
}

function openDocPreviewPage(doc) {
  const params = new URLSearchParams({
    title: doc.title,
    desc: doc.desc,
    file: doc.file,
  });
  window.open(`/doc-preview/index.html?${params.toString()}`, '_blank');
}

function createDocCard(doc) {
  const article = document.createElement('article');
  article.className = 'doc-card';

  const link = document.createElement('a');
  link.className = 'doc-card__link';
  link.href = '#';
  link.addEventListener('click', (e) => {
    e.preventDefault();
    openDocPreviewPage(doc);
  });

  const imageWrap = document.createElement('div');
  imageWrap.className = 'doc-card__image';
  const img = document.createElement('img');
  img.src = doc.image;
  img.alt = doc.title;
  imageWrap.appendChild(img);

  const body = document.createElement('div');
  body.className = 'doc-card__body';
  const h4 = document.createElement('h4');
  h4.textContent = doc.title;
  const p = document.createElement('p');
  p.textContent = doc.desc;
  body.appendChild(h4);
  body.appendChild(p);

  link.appendChild(imageWrap);
  link.appendChild(body);
  article.appendChild(link);
  return article;
}

function renderDocGroups(container, groups) {
  container.innerHTML = '';
  groups.forEach((group) => {
    const groupEl = document.createElement('div');
    groupEl.className = 'doc-explorer-main__group';

    if (group.heading) {
      const h3 = document.createElement('h3');
      h3.className = 'doc-explorer-main__group-title';
      h3.textContent = group.heading;
      groupEl.appendChild(h3);
    }

    const cardsWrap = document.createElement('div');
    cardsWrap.className = 'doc-explorer-main__cards';
    group.documents.forEach((doc) => cardsWrap.appendChild(createDocCard(doc)));
    groupEl.appendChild(cardsWrap);

    container.appendChild(groupEl);
  });
}

function initDocExplorer() {
  const sidebar = document.querySelector('[data-doc-explorer-sidebar]');
  const dataEl = document.getElementById('doc-explorer-data');
  if (!sidebar || !dataEl) return;

  const grades = JSON.parse(dataEl.textContent);
  const subjectIndex = {};
  const categoryIndex = {};

  grades.forEach((grade) => {
    grade.subjects.forEach((subject) => {
      const subjectKey = `${grade.key}__${subject.key}`;
      subjectIndex[subjectKey] = {
        breadcrumb: `${grade.title} • ${subject.title}`,
        groups: subject.categories.map((category) => ({
          heading: category.title,
          documents: category.documents,
        })),
      };

      subject.categories.forEach((category) => {
        const categoryKey = `${subjectKey}__${category.key}`;
        categoryIndex[categoryKey] = {
          breadcrumb: `${grade.title} • ${subject.title} • ${category.title}`,
          groups: [{ heading: null, documents: category.documents }],
        };
      });
    });
  });

  const main = document.querySelector('[data-doc-explorer-main]');
  const emptyMsg = main.querySelector('[data-doc-explorer-empty]');
  const titleEl = main.querySelector('[data-doc-explorer-title]');
  const viewToggle = main.querySelector('[data-doc-explorer-view-toggle]');
  const docsWrap = main.querySelector('[data-doc-explorer-docs]');
  const viewButtons = viewToggle.querySelectorAll('[data-view]');

  let viewMode = 'grid';

  function selectEntry(entry, activeEl) {
    sidebar.querySelectorAll('.is-active').forEach((el) => el.classList.remove('is-active'));
    if (activeEl) activeEl.classList.add('is-active');

    titleEl.textContent = entry.breadcrumb;
    titleEl.hidden = false;
    emptyMsg.hidden = true;
    viewToggle.hidden = false;
    docsWrap.hidden = false;
    docsWrap.className = `doc-explorer-main__docs doc-explorer-main__docs--${viewMode}`;
    renderDocGroups(docsWrap, entry.groups);
  }

  function openOnly(el, siblings) {
    const wasOpen = el.classList.contains('is-open');
    siblings.forEach((sibling) => sibling.classList.remove('is-open'));
    if (!wasOpen) el.classList.add('is-open');
  }

  sidebar.querySelectorAll('[data-group-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const groupEl = btn.closest('[data-group]');
      openOnly(groupEl, sidebar.querySelectorAll('[data-group]'));
    });
  });

  sidebar.querySelectorAll('[data-subgroup-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const subgroupEl = btn.closest('[data-subgroup]');
      openOnly(subgroupEl, sidebar.querySelectorAll('[data-subgroup]'));

      const entry = subjectIndex[subgroupEl.dataset.subgroup];
      if (entry) selectEntry(entry, btn);
    });
  });

  sidebar.querySelectorAll('[data-leaf-select]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const entry = categoryIndex[btn.dataset.target];
      if (entry) selectEntry(entry, btn);
    });
  });

  viewButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      viewMode = btn.dataset.view;
      viewButtons.forEach((b) => b.classList.toggle('is-active', b === btn));
      docsWrap.className = `doc-explorer-main__docs doc-explorer-main__docs--${viewMode}`;
    });
  });
}

function initDocPreviewPage() {
  const titleEl = document.querySelector('[data-doc-preview-page-title]');
  const pdfFrame = document.querySelector('[data-doc-preview-page-pdf]');
  const descEl = document.querySelector('[data-doc-preview-page-desc]');
  if (!titleEl || !pdfFrame || !descEl) return;

  const params = new URLSearchParams(window.location.search);
  const title = params.get('title') || 'Tài liệu';
  const desc = params.get('desc') || '';
  const file = params.get('file') || '';

  document.title = `FreeDoc - ${title}`;
  titleEl.textContent = title;
  descEl.textContent = desc;
  pdfFrame.src = file;
}

function createListCard(prefix, item, options) {
  const article = document.createElement('article');
  article.className = `${prefix}__card`;

  const link = document.createElement('a');
  link.className = `${prefix}__card-link`;
  link.href = '#';
  link.addEventListener('click', (e) => e.preventDefault());

  const imageWrap = document.createElement('div');
  imageWrap.className = `${prefix}__image`;
  const img = document.createElement('img');
  img.src = item.image;
  img.alt = item.title;
  imageWrap.appendChild(img);

  const body = document.createElement('div');
  body.className = `${prefix}__body`;
  const h3 = document.createElement('h3');
  h3.textContent = item.title;
  const p = document.createElement('p');
  p.textContent = item.desc;
  body.appendChild(h3);
  body.appendChild(p);

  if (options && options.readMoreText) {
    const readMore = document.createElement('span');
    readMore.className = `${prefix}__read-more`;
    readMore.textContent = options.readMoreText;
    body.appendChild(readMore);
  }

  link.appendChild(imageWrap);
  link.appendChild(body);
  article.appendChild(link);
  return article;
}

// Toolbar dùng chung (search + sort + grid/list) cho các trang danh sách card
// có data-* root + <script type="application/json"> chứa item list.
function initFilterableList(config) {
  const root = document.querySelector(config.rootSelector);
  const dataEl = document.getElementById(config.dataElId);
  if (!root || !dataEl) return;

  const items = JSON.parse(dataEl.textContent);
  const rowEl = root.querySelector(config.rowSelector);
  const emptyEl = root.querySelector(config.emptySelector);
  const searchInput = root.querySelector('[data-list-search]');
  const sortSelect = root.querySelector('[data-list-sort]');
  const viewButtons = root.querySelectorAll('[data-view]');

  let viewMode = 'grid';

  function render() {
    const keyword = searchInput.value.trim().toLowerCase();
    const sortFn = config.sortFns[sortSelect.value] || config.sortFns.default;
    const filtered = items
      .filter((item) => item.title.toLowerCase().includes(keyword))
      .slice()
      .sort(sortFn);

    rowEl.innerHTML = '';
    rowEl.className = `${config.rowBaseClass} ${config.rowBaseClass}--${viewMode}`;
    filtered.forEach((item) => rowEl.appendChild(config.createCard(item)));

    emptyEl.hidden = filtered.length > 0;
    rowEl.hidden = filtered.length === 0;
  }

  searchInput.addEventListener('input', render);
  sortSelect.addEventListener('change', render);

  viewButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      viewMode = btn.dataset.view;
      viewButtons.forEach((b) => b.classList.toggle('is-active', b === btn));
      render();
    });
  });

  render();
}

function initWorksheetList() {
  initFilterableList({
    rootSelector: '[data-worksheet-list]',
    dataElId: 'worksheet-list-data',
    rowSelector: '[data-worksheet-row]',
    emptySelector: '[data-worksheet-empty]',
    rowBaseClass: 'worksheet-list__row',
    createCard: (item) => createListCard('worksheet-list', item),
    sortFns: {
      date_desc: (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0),
      views_desc: (a, b) => b.views - a.views,
      title_asc: (a, b) => a.title.localeCompare(b.title, 'vi'),
      default: (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0),
    },
  });
}

function initStoryList() {
  initFilterableList({
    rootSelector: '[data-story-list]',
    dataElId: 'story-list-data',
    rowSelector: '[data-story-row]',
    emptySelector: '[data-story-empty]',
    rowBaseClass: 'story-list__row',
    createCard: (item) => createListCard('story-list', item, { readMoreText: 'Đọc tiếp →' }),
    sortFns: {
      title_asc: (a, b) => a.title.localeCompare(b.title, 'vi'),
      views_desc: (a, b) => b.views - a.views,
      likes_desc: (a, b) => b.likes - a.likes,
      default: (a, b) => a.title.localeCompare(b.title, 'vi'),
    },
  });
}

function initQaList() {
  initFilterableList({
    rootSelector: '[data-qa-list]',
    dataElId: 'qa-list-data',
    rowSelector: '[data-qa-row]',
    emptySelector: '[data-qa-empty]',
    rowBaseClass: 'qa-list__row',
    createCard: (item) => createListCard('qa-list', item, { readMoreText: 'Đọc tiếp →' }),
    sortFns: {
      title_asc: (a, b) => a.title.localeCompare(b.title, 'vi'),
      views_desc: (a, b) => b.views - a.views,
      likes_desc: (a, b) => b.likes - a.likes,
      default: (a, b) => a.title.localeCompare(b.title, 'vi'),
    },
  });
}

function initTipsList() {
  initFilterableList({
    rootSelector: '[data-tips-list]',
    dataElId: 'tips-list-data',
    rowSelector: '[data-tips-row]',
    emptySelector: '[data-tips-empty]',
    rowBaseClass: 'tips-list__row',
    createCard: (item) => createListCard('tips-list', item, { readMoreText: 'Đọc tiếp →' }),
    sortFns: {
      title_asc: (a, b) => a.title.localeCompare(b.title, 'vi'),
      views_desc: (a, b) => b.views - a.views,
      likes_desc: (a, b) => b.likes - a.likes,
      default: (a, b) => a.title.localeCompare(b.title, 'vi'),
    },
  });
}

const WORKSHEET_GRADE_RANGE_DEFAULT = { mamnon: '10', lop1: '20', lop2: '100-no-carry' };

const WORKSHEET_RANGE_LABELS = {
  10: 'phạm vi 10',
  20: 'phạm vi 20',
  '100-no-carry': 'phạm vi 100 - không nhớ',
  '100-carry': 'phạm vi 100 - có nhớ',
};

const WORKSHEET_VI_WORD_BANK = {
  mamnon: ['bé', 'cá', 'gà', 'mèo', 'chó', 'hoa', 'lá', 'quả', 'bàn', 'ghế'],
  lop1: ['sách', 'bút', 'thước', 'bảng', 'trường', 'lớp', 'bạn bè', 'ông bà', 'cha mẹ', 'anh chị'],
  lop2: ['chăm chỉ', 'siêng năng', 'đoàn kết', 'yêu thương', 'trung thực', 'dũng cảm', 'lễ phép', 'sạch sẽ', 'ngăn nắp', 'ham học'],
};

const WORKSHEET_EN_WORD_BANK = {
  mamnon: [
    { word: 'cat', meaning: 'con mèo' },
    { word: 'dog', meaning: 'con chó' },
    { word: 'sun', meaning: 'mặt trời' },
    { word: 'red', meaning: 'màu đỏ' },
    { word: 'big', meaning: 'to lớn' },
  ],
  lop1: [
    { word: 'apple', meaning: 'quả táo' },
    { word: 'happy', meaning: 'vui vẻ' },
    { word: 'table', meaning: 'cái bàn' },
    { word: 'water', meaning: 'nước' },
    { word: 'green', meaning: 'màu xanh lá' },
  ],
  lop2: [
    { word: 'family', meaning: 'gia đình' },
    { word: 'school', meaning: 'trường học' },
    { word: 'friend', meaning: 'bạn bè' },
    { word: 'garden', meaning: 'khu vườn' },
    { word: 'yellow', meaning: 'màu vàng' },
  ],
};

function worksheetRandInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function worksheetShuffle(list) {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function worksheetBuildPool(pool, count) {
  const result = [];
  while (result.length < count) {
    result.push(...worksheetShuffle(pool));
  }
  return result.slice(0, count);
}

function worksheetBlankRandomLetter(word) {
  const letterIndexes = [];
  for (let i = 0; i < word.length; i++) {
    if (word[i] !== ' ') letterIndexes.push(i);
  }
  const idx = letterIndexes[worksheetRandInt(0, letterIndexes.length - 1)];
  const chars = word.split('');
  chars[idx] = '_';
  return chars.join('');
}

// "Không nhớ": tổng/hiệu ở hàng đơn vị không vượt quá 9, không cần nhớ/mượn sang hàng chục.
function worksheetAddNoCarry() {
  const totalTens = worksheetRandInt(0, 9);
  const tensA = worksheetRandInt(0, totalTens);
  const tensB = totalTens - tensA;
  const unitsA = worksheetRandInt(0, 9);
  const unitsB = worksheetRandInt(0, 9 - unitsA);
  return [tensA * 10 + unitsA, tensB * 10 + unitsB];
}

// "Có nhớ": ép hàng đơn vị cộng lại vượt quá 9, bắt buộc phải nhớ 1 sang hàng chục.
function worksheetAddCarry() {
  const totalTens = worksheetRandInt(0, 8);
  const tensA = worksheetRandInt(0, totalTens);
  const tensB = totalTens - tensA;
  const unitsA = worksheetRandInt(1, 9);
  const unitsB = worksheetRandInt(10 - unitsA, 9);
  return [tensA * 10 + unitsA, tensB * 10 + unitsB];
}

function worksheetSubNoBorrow() {
  const tensA = worksheetRandInt(0, 9);
  const tensB = worksheetRandInt(0, tensA);
  const unitsA = worksheetRandInt(0, 9);
  const unitsB = worksheetRandInt(0, unitsA);
  return [tensA * 10 + unitsA, tensB * 10 + unitsB];
}

// Ép hàng đơn vị của số bị trừ nhỏ hơn số trừ -> bắt buộc phải mượn 1 từ hàng chục.
function worksheetSubBorrow() {
  const tensA = worksheetRandInt(1, 9);
  const tensB = worksheetRandInt(0, tensA - 1);
  const unitsB = worksheetRandInt(1, 9);
  const unitsA = worksheetRandInt(0, unitsB - 1);
  return [tensA * 10 + unitsA, tensB * 10 + unitsB];
}

function worksheetPickOperands(op, range) {
  if (range === '100-no-carry') return op === 'add' ? worksheetAddNoCarry() : worksheetSubNoBorrow();
  if (range === '100-carry') return op === 'add' ? worksheetAddCarry() : worksheetSubBorrow();

  const max = Number(range);
  if (op === 'add') {
    const a = worksheetRandInt(0, max);
    const b = worksheetRandInt(0, max - a);
    return [a, b];
  }
  const a = worksheetRandInt(0, max);
  const b = worksheetRandInt(0, a);
  return [a, b];
}

function worksheetGenerateMathItems(count, operation, range) {
  const items = [];

  for (let i = 0; i < count; i++) {
    const op = operation === 'mixed' ? (Math.random() < 0.5 ? 'add' : 'sub') : operation;
    const [a, b] = worksheetPickOperands(op, range);
    const symbol = op === 'add' ? '+' : '-';
    items.push(`${a} ${symbol} ${b} = ..........`);
  }

  return items;
}

function worksheetGenerateWordItems(count, pool) {
  return worksheetBuildPool(pool, count).map((word) => `${worksheetBlankRandomLetter(word)}  ................`);
}

function worksheetGenerateEnglishItems(count, pool) {
  return worksheetBuildPool(pool, count).map(({ word, meaning }) => `${worksheetBlankRandomLetter(word)} (${meaning})`);
}

function worksheetBuildPreviewTitle(subject, grade, operation, range) {
  const gradeLabel = { mamnon: 'Mầm non', lop1: 'Lớp 1', lop2: 'Lớp 2' }[grade];

  if (subject === 'toan') {
    const opLabel = { add: 'Phép cộng', sub: 'Phép trừ', mixed: 'Cộng trừ hỗn hợp' }[operation];
    return `${opLabel} (${WORKSHEET_RANGE_LABELS[range]}) - ${gradeLabel}`;
  }

  if (subject === 'tviet') return `Điền chữ còn thiếu - Tiếng Việt - ${gradeLabel}`;
  return `Điền chữ còn thiếu - Tiếng Anh - ${gradeLabel}`;
}

function worksheetGenerateBlockItems(blockEl, state) {
  const count = Math.max(5, Math.min(40, Number(blockEl.querySelector('[data-gen-count]').value) || 10));

  if (state.subject === 'toan') {
    const operation = blockEl.querySelector('[data-gen-operation]').value;
    const range = blockEl.querySelector('[data-gen-range]').value;
    return worksheetGenerateMathItems(count, operation, range);
  }
  if (state.subject === 'tviet') return worksheetGenerateWordItems(count, WORKSHEET_VI_WORD_BANK[state.grade]);
  return worksheetGenerateEnglishItems(count, WORKSHEET_EN_WORD_BANK[state.grade]);
}

function initWorksheetGenerator() {
  const section = document.querySelector('.worksheet-generator');
  if (!section) return;

  const gradeSelect = section.querySelector('[data-filter-grade]');
  const subjectButtons = section.querySelectorAll('[data-subject]');
  const blocksWrap = section.querySelector('[data-generator-blocks]');
  const printBtn = section.querySelector('[data-gen-print]');
  const previewSections = section.querySelector('[data-gen-preview-sections]');

  const state = { grade: gradeSelect.value, subject: 'toan' };

  function setActive(buttons, datasetKey, value) {
    buttons.forEach((btn) => btn.classList.toggle('is-active', btn.dataset[datasetKey] === value));
  }

  function getBlocks() {
    return Array.from(blocksWrap.querySelectorAll('[data-generator-block]'));
  }

  function updateFieldsVisibility() {
    const isMath = state.subject === 'toan';
    getBlocks().forEach((blockEl) => {
      blockEl.querySelector('[data-field-operation]').hidden = !isMath;
      blockEl.querySelector('[data-field-range]').hidden = !isMath;
    });
  }

  // Đánh lại số thứ tự "Bài tập N" + chỉ cho phép xoá khi còn nhiều hơn 1 bài.
  function updateBlockChrome() {
    const blocks = getBlocks();
    blocks.forEach((blockEl, i) => {
      blockEl.querySelector('[data-block-number]').textContent = String(i + 1);
      blockEl.querySelector('[data-gen-remove]').hidden = blocks.length <= 1;
    });
  }

  function invalidateBlock(blockEl) {
    blockEl._wsItems = undefined;
  }

  // Mỗi block giữ cache câu hỏi riêng: chỉ những block bị invalidate mới random lại,
  // tránh việc sửa 1 bài tập làm xáo trộn số liệu của các bài tập khác đang hiển thị.
  function renderAll() {
    previewSections.innerHTML = '';

    getBlocks().forEach((blockEl, index) => {
      if (!blockEl._wsItems) {
        blockEl._wsItems = worksheetGenerateBlockItems(blockEl, state);
      }

      const operation = blockEl.querySelector('[data-gen-operation]').value;
      const range = blockEl.querySelector('[data-gen-range]').value;
      const columns = blockEl.querySelector('[data-gen-columns]').value;

      const sectionEl = document.createElement('div');
      sectionEl.className = 'worksheet-preview__section';

      const titleEl = document.createElement('h3');
      titleEl.className = 'worksheet-preview__title';
      const badge = document.createElement('span');
      badge.textContent = String(index + 1);
      titleEl.appendChild(badge);
      titleEl.appendChild(document.createTextNode(worksheetBuildPreviewTitle(state.subject, state.grade, operation, range)));
      sectionEl.appendChild(titleEl);

      const gridEl = document.createElement('div');
      gridEl.className = `worksheet-preview__grid worksheet-preview__grid--cols-${columns}`;
      blockEl._wsItems.forEach((text, i) => {
        const item = document.createElement('div');
        item.className = 'worksheet-preview__item';
        item.textContent = `${i + 1}. ${text}`;
        gridEl.appendChild(item);
      });
      sectionEl.appendChild(gridEl);

      previewSections.appendChild(sectionEl);
    });
  }

  function wireBlock(blockEl) {
    const countInput = blockEl.querySelector('[data-gen-count]');
    const operationSelect = blockEl.querySelector('[data-gen-operation]');
    const rangeSelect = blockEl.querySelector('[data-gen-range]');
    const columnsSelect = blockEl.querySelector('[data-gen-columns]');
    const regenerateBtn = blockEl.querySelector('[data-gen-regenerate]');
    const duplicateBtn = blockEl.querySelector('[data-gen-duplicate]');
    const removeBtn = blockEl.querySelector('[data-gen-remove]');

    [countInput, operationSelect, rangeSelect].forEach((el) => {
      const onChange = () => {
        invalidateBlock(blockEl);
        renderAll();
      };
      el.addEventListener('input', onChange);
      el.addEventListener('change', onChange);
    });

    columnsSelect.addEventListener('change', renderAll);

    regenerateBtn.addEventListener('click', () => {
      invalidateBlock(blockEl);
      renderAll();
    });

    duplicateBtn.addEventListener('click', () => {
      const clone = blockEl.cloneNode(true);

      // cloneNode chỉ sao chép attribute mặc định, không phải giá trị người dùng đang chọn
      // (vd đổi select bằng JS không cập nhật lại attribute "selected") nên phải gán tay.
      clone.querySelector('[data-gen-count]').value = countInput.value;
      clone.querySelector('[data-gen-operation]').value = operationSelect.value;
      clone.querySelector('[data-gen-range]').value = rangeSelect.value;
      clone.querySelector('[data-gen-columns]').value = columnsSelect.value;

      blockEl.insertAdjacentElement('afterend', clone);
      wireBlock(clone);
      updateFieldsVisibility();
      updateBlockChrome();
      renderAll();
    });

    removeBtn.addEventListener('click', () => {
      if (getBlocks().length <= 1) return;
      blockEl.remove();
      updateBlockChrome();
      renderAll();
    });
  }

  gradeSelect.addEventListener('change', () => {
    state.grade = gradeSelect.value;
    if (state.subject === 'toan') {
      getBlocks().forEach((blockEl) => {
        blockEl.querySelector('[data-gen-range]').value = WORKSHEET_GRADE_RANGE_DEFAULT[state.grade];
      });
    }
    getBlocks().forEach(invalidateBlock);
    renderAll();
  });

  subjectButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.subject = btn.dataset.subject;
      setActive(subjectButtons, 'subject', state.subject);
      updateFieldsVisibility();
      getBlocks().forEach(invalidateBlock);
      renderAll();
    });
  });

  printBtn.addEventListener('click', () => window.print());

  getBlocks().forEach(wireBlock);
  updateFieldsVisibility();
  updateBlockChrome();
  renderAll();
}
