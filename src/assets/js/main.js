document.addEventListener('DOMContentLoaded', () => {
  console.log('FreeDoc loaded');
  initQuizGame();
  initMemoryGame();
  initFlashcardQuiz();
  initMemoryLevels();
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
