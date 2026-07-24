document.addEventListener('DOMContentLoaded', () => {
  console.log('FreeDoc loaded');
  initHeaderNav();
  initHeaderSearch();
  initQuizGame();
  initMemoryGame();
  initFlashcardQuiz();
  initMemoryLevels();
  initDocExplorer();
  initDocPreviewPage();
  initDocDetailPage();
  initBookReviewPage();
  initWorksheetList();
  initStoryList();
  initQaList();
  initTipsList();
  initWorksheetGenerator();
  initBookshelf();
  initFaq();
  initNewsletter();
  initAuthModal();
  initScrollToTop();
  initSocialFixedButtons();
  initStickyHeader();
});

function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const inner = header.querySelector('.site-header__inner');
  let headerHeight = header.offsetHeight;
  let innerHeight = inner ? inner.offsetHeight : headerHeight;
  let isFixed = false;

  function updateHeaderHeightVar() {
    const current = isFixed ? innerHeight : headerHeight;
    document.documentElement.style.setProperty('--site-header-height', `${current}px`);
  }

  updateHeaderHeightVar();

  function toggleFixed() {
    const shouldFix = window.scrollY > headerHeight;
    if (shouldFix === isFixed) return;

    isFixed = shouldFix;
    header.classList.toggle('site-header--fixed', isFixed);
    document.body.style.paddingTop = isFixed ? `${innerHeight}px` : '';
    updateHeaderHeightVar();
  }

  window.addEventListener('resize', () => {
    header.classList.remove('site-header--fixed');
    document.body.style.paddingTop = '';
    headerHeight = header.offsetHeight;
    innerHeight = inner ? inner.offsetHeight : headerHeight;
    isFixed = false;
    updateHeaderHeightVar();
    toggleFixed();
  });

  window.addEventListener('scroll', toggleFixed, { passive: true });
  toggleFixed();
}

function initHeaderNav() {
  const nav = document.querySelector('[data-header-nav]');
  if (!nav) return;

  const navToggle = document.querySelector('[data-header-nav-toggle]');
  const items = Array.from(nav.querySelectorAll('.site-header__nav-item.has-submenu'));

  const closeAllSubmenus = () => {
    items.forEach((item) => {
      item.classList.remove('is-open');
      item.querySelector('[data-submenu-toggle]').setAttribute('aria-expanded', 'false');
    });
  };

  const closeNav = () => {
    nav.classList.remove('is-open');
    closeAllSubmenus();
    document.documentElement.classList.remove('no-scroll');
    if (navToggle) {
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  };

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const expanded = nav.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', expanded);
      navToggle.setAttribute('aria-expanded', String(expanded));
      document.documentElement.classList.toggle('no-scroll', expanded);
      if (!expanded) closeAllSubmenus();
    });
  }

  items.forEach((item) => {
    const toggle = item.querySelector('[data-submenu-toggle]');
    toggle.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      closeAllSubmenus();
      if (!wasOpen) {
        item.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !(navToggle && navToggle.contains(event.target))) {
      closeNav();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });

  const desktopQuery = window.matchMedia('(min-width: 901px)');
  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) closeNav();
  });
}

function initHeaderSearch() {
  const wrap = document.querySelector('[data-header-search]');
  if (!wrap) return;

  const toggle = wrap.querySelector('[data-header-search-toggle]');
  const input = wrap.querySelector('[data-header-search-input]');

  toggle.addEventListener('click', () => {
    const expanded = wrap.classList.toggle('is-expanded');
    toggle.setAttribute('aria-expanded', String(expanded));
    if (expanded) input.focus();
  });

  document.addEventListener('click', (event) => {
    if (!wrap.contains(event.target)) {
      wrap.classList.remove('is-expanded');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

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

function initBookshelf() {
  const section = document.querySelector('.bookshelf');
  if (!section) return;

  const tabs = section.querySelectorAll('[data-book-filter]');
  const wrapperEl = section.querySelector('[data-book-grid]');
  const cards = Array.from(wrapperEl.querySelectorAll('[data-book-preview]'));
  const modal = section.querySelector('[data-book-modal]');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.bookFilter;
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));

      cards.forEach((card) => {
        card.hidden = filter !== 'all' && card.dataset.bookAge !== filter;
      });
    });
  });

  function openPreview(card) {
    if (!modal) return;
    modal.querySelector('[data-book-modal-image]').src = card.dataset.image;
    modal.querySelector('[data-book-modal-image]').alt = card.dataset.title;
    modal.querySelector('[data-book-modal-title]').textContent = card.dataset.title;
    modal.querySelector('[data-book-modal-desc]').textContent = card.dataset.desc;
    modal.hidden = false;
  }

  function activateCard(card) {
    if (card.dataset.reviewLink) {
      window.open(card.dataset.reviewLink, '_blank');
    } else {
      openPreview(card);
    }
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => activateCard(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activateCard(card);
      }
    });
  });

  if (modal) {
    modal.querySelectorAll('[data-book-modal-close]').forEach((el) => {
      el.addEventListener('click', () => { modal.hidden = true; });
    });
  }
}

async function initFaq() {
  const list = document.querySelector('[data-faq-list]');
  if (!list) return;

  let items;
  try {
    const res = await fetch('/assets/json/faq.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    items = await res.json();
  } catch (err) {
    console.error('Không tải được dữ liệu FAQ:', err);
    return;
  }

  items.forEach((item, i) => {
    const details = document.createElement('details');
    details.className = 'faq__item';
    if (i === 0) details.open = true;

    const summary = document.createElement('summary');
    summary.className = 'faq__question';
    summary.textContent = item.question;

    const answer = document.createElement('p');
    answer.className = 'faq__answer';
    answer.textContent = item.answer;

    details.appendChild(summary);
    details.appendChild(answer);
    list.appendChild(details);
  });
}

function initNewsletter() {
  const form = document.querySelector('[data-newsletter-form]');
  if (!form) return;

  const successMsg = document.querySelector('[data-newsletter-success]');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    successMsg.hidden = false;
    form.reset();
  });
}

function initAuthModal() {
  const modal = document.querySelector('[data-auth-modal]');
  if (!modal) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const panels = Array.from(modal.querySelectorAll('[data-auth-panel]'));
  const brands = Array.from(modal.querySelectorAll('[data-auth-brand]'));

  function showPanel(view) {
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.authPanel !== view;
    });
    const brandView = view === 'signup' ? 'signup' : 'login';
    brands.forEach((brand) => {
      brand.hidden = brand.dataset.authBrand !== brandView;
    });
    if (view === 'login' || view === 'reset') {
      const emailInput = modal.querySelector(`[data-auth-panel="${view}"] input[type="email"]`);
      if (emailInput) requestAnimationFrame(() => emailInput.focus());
    }
  }

  function resetAuthUI() {
    modal.querySelectorAll('[data-auth-form]').forEach((form) => {
      form.reset();
      form.hidden = false;
      form.querySelectorAll('[data-auth-error]').forEach((el) => {
        el.hidden = true;
        el.textContent = '';
      });
      form.querySelectorAll('.auth-modal__field').forEach((field) => field.classList.remove('is-invalid'));
      form.querySelectorAll('[data-auth-field="password"]').forEach((input) => { input.type = 'password'; });
      const submitBtn = form.querySelector('.auth-modal__submit');
      if (submitBtn) {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
      }
    });
    modal.querySelectorAll('[data-auth-password-toggle]').forEach((btn) => {
      btn.textContent = '👁️';
      btn.setAttribute('aria-label', 'Hiện mật khẩu');
    });
    modal.querySelectorAll('[data-auth-success]').forEach((el) => { el.hidden = true; });
  }

  function openModal(view) {
    resetAuthUI();
    modal.hidden = false;
    document.documentElement.classList.add('no-scroll');
    showPanel(view === 'login' ? 'login' : 'signup');
  }

  function closeModal() {
    modal.hidden = true;
    document.documentElement.classList.remove('no-scroll');
  }

  document.querySelectorAll('[data-auth-modal-open]').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.authModalOpen));
  });

  modal.querySelectorAll('[data-auth-modal-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  modal.querySelectorAll('[data-auth-switch]').forEach((btn) => {
    btn.addEventListener('click', () => showPanel(btn.dataset.authSwitch));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });

  modal.querySelectorAll('[data-auth-password-toggle]').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const input = toggle.previousElementSibling;
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      toggle.textContent = showing ? '👁️' : '🙈';
      toggle.setAttribute('aria-label', showing ? 'Hiện mật khẩu' : 'Ẩn mật khẩu');
    });
  });

  function setFieldError(form, name, message) {
    const input = form.querySelector(`[data-auth-field="${name}"]`);
    const field = input ? input.closest('.auth-modal__field') : null;
    const errorEl = form.querySelector(`[data-auth-error="${name}"]`);
    if (!field || !errorEl) return;
    field.classList.toggle('is-invalid', Boolean(message));
    errorEl.textContent = message || '';
    errorEl.hidden = !message;
  }

  function validateForm(form) {
    let firstInvalid = null;

    if (form.dataset.authForm === 'signup') {
      const nameInput = form.querySelector('[data-auth-field="fullname"]');
      if (!nameInput.value.trim()) {
        setFieldError(form, 'fullname', 'Vui lòng nhập họ và tên.');
        firstInvalid = firstInvalid || nameInput;
      } else {
        setFieldError(form, 'fullname', '');
      }
    }

    const emailInput = form.querySelector('[data-auth-field="email"]');
    if (!EMAIL_RE.test(emailInput.value.trim())) {
      setFieldError(form, 'email', 'Email không hợp lệ.');
      firstInvalid = firstInvalid || emailInput;
    } else {
      setFieldError(form, 'email', '');
    }

    if (form.dataset.authForm !== 'reset') {
      const passwordInput = form.querySelector('[data-auth-field="password"]');
      if (passwordInput.value.length < 6) {
        setFieldError(form, 'password', 'Mật khẩu phải có ít nhất 6 ký tự.');
        firstInvalid = firstInvalid || passwordInput;
      } else {
        setFieldError(form, 'password', '');
      }
    }

    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  modal.querySelectorAll('[data-auth-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!validateForm(form)) return;

      const submitBtn = form.querySelector('.auth-modal__submit');
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
        const successEl = modal.querySelector(`[data-auth-success="${form.dataset.authForm}"]`);
        form.hidden = true;
        if (successEl) successEl.hidden = false;
      }, 900);
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
  const subjectByKey = {};
  const allDocuments = [];

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

      if (!subjectByKey[subject.key]) subjectByKey[subject.key] = { title: subject.title, groups: [] };
      subjectByKey[subject.key].groups.push({
        heading: grade.title,
        documents: subject.categories.flatMap((category) => category.documents),
      });

      subject.categories.forEach((category) => {
        const categoryKey = `${subjectKey}__${category.key}`;
        const breadcrumb = `${grade.title} • ${subject.title} • ${category.title}`;
        categoryIndex[categoryKey] = {
          breadcrumb,
          groups: [{ heading: null, documents: category.documents }],
        };

        category.documents.forEach((doc) => {
          allDocuments.push({ ...doc, breadcrumb });
        });
      });
    });
  });

  const main = document.querySelector('[data-doc-explorer-main]');
  const emptyMsg = main.querySelector('[data-doc-explorer-empty]');
  const titleEl = main.querySelector('[data-doc-explorer-title]');
  const viewToggle = main.querySelector('[data-doc-explorer-view-toggle]');
  const docsWrap = main.querySelector('[data-doc-explorer-docs]');
  const viewButtons = viewToggle.querySelectorAll('[data-view]');
  const searchInput = document.querySelector('[data-doc-explorer-search]');
  const defaultEmptyText = emptyMsg.textContent;

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

  function resetToDefault() {
    sidebar.querySelectorAll('.is-active').forEach((el) => el.classList.remove('is-active'));
    titleEl.hidden = true;
    viewToggle.hidden = true;
    docsWrap.hidden = true;
    emptyMsg.textContent = defaultEmptyText;
    emptyMsg.hidden = false;
  }

  function renderSearch(keyword) {
    const matches = allDocuments.filter((doc) => doc.title.toLowerCase().includes(keyword));

    if (matches.length === 0) {
      sidebar.querySelectorAll('.is-active').forEach((el) => el.classList.remove('is-active'));
      titleEl.hidden = true;
      viewToggle.hidden = true;
      docsWrap.hidden = true;
      emptyMsg.textContent = `Không tìm thấy tài liệu nào khớp với "${keyword}".`;
      emptyMsg.hidden = false;
      return;
    }

    const byBreadcrumb = new Map();
    matches.forEach((doc) => {
      if (!byBreadcrumb.has(doc.breadcrumb)) byBreadcrumb.set(doc.breadcrumb, []);
      byBreadcrumb.get(doc.breadcrumb).push(doc);
    });

    selectEntry({
      breadcrumb: `Kết quả tìm kiếm cho "${keyword}" (${matches.length})`,
      groups: Array.from(byBreadcrumb, ([heading, documents]) => ({ heading, documents })),
    }, null);
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const keyword = searchInput.value.trim().toLowerCase();
      if (keyword) {
        renderSearch(keyword);
      } else {
        resetToDefault();
      }
    });

    const initialQuery = new URLSearchParams(window.location.search).get('q');
    if (initialQuery && initialQuery.trim()) {
      searchInput.value = initialQuery;
      renderSearch(initialQuery.trim().toLowerCase());
    }
  }

  function selectBySubjectKey(subjectKey) {
    const subject = subjectByKey[subjectKey];
    if (!subject) return;

    selectEntry({
      breadcrumb: `${subject.title} • Tất cả khối lớp`,
      groups: subject.groups,
    }, null);
  }

  const initialSubject = new URLSearchParams(window.location.search).get('mon');
  if (initialSubject) selectBySubjectKey(initialSubject);
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

function formatDocDetailNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function renderBreadcrumbNav(container, items) {
  container.innerHTML = '';
  items.forEach((item, i) => {
    if (i > 0) container.appendChild(document.createTextNode(' › '));
    const isLast = i === items.length - 1;
    if (item.href && !isLast) {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      container.appendChild(a);
    } else {
      const span = document.createElement('span');
      span.textContent = item.label;
      container.appendChild(span);
    }
  });
}

function createDocDetailRelatedCard(doc) {
  const a = document.createElement('a');
  a.className = 'doc-detail__related-card';
  a.href = `/tai-lieu/chi-tiet/index.html?id=${encodeURIComponent(doc.id)}`;

  const thumb = document.createElement('span');
  thumb.className = 'doc-detail__related-thumb';
  const img = document.createElement('img');
  img.src = doc.thumbnails[0];
  img.alt = doc.title;
  img.loading = 'lazy';
  thumb.appendChild(img);

  const title = document.createElement('h3');
  title.className = 'doc-detail__related-title';
  title.textContent = doc.title;

  a.appendChild(thumb);
  a.appendChild(title);
  return a;
}

function createDocDetailReviewItem(review) {
  const li = document.createElement('li');
  li.className = 'doc-detail__review';

  const avatar = document.createElement('img');
  avatar.src = review.avatar || '/assets/images/testimonial-avatar-parent.svg';
  avatar.alt = review.name;

  const body = document.createElement('div');

  const name = document.createElement('span');
  name.className = 'doc-detail__review-name';
  name.textContent = review.name;

  const date = document.createElement('span');
  date.className = 'doc-detail__review-date';
  date.textContent = review.date;

  const stars = document.createElement('span');
  stars.className = 'doc-detail__review-stars-static';
  stars.textContent = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

  const comment = document.createElement('p');
  comment.className = 'doc-detail__review-comment';
  comment.textContent = review.comment;

  body.appendChild(name);
  body.appendChild(date);
  body.appendChild(stars);
  body.appendChild(comment);

  li.appendChild(avatar);
  li.appendChild(body);
  return li;
}

function initDocDetailPage() {
  const root = document.querySelector('[data-doc-detail]');
  if (!root) return;

  const id = new URLSearchParams(window.location.search).get('id');

  fetch('/assets/json/documents.json')
    .then((res) => res.json())
    .then((docs) => {
      const doc = docs.find((d) => d.id === id) || docs[0];
      if (!doc) return;
      renderDocDetail(doc, docs);
    });
}

function renderDocDetail(doc, allDocs) {
  document.title = `FreeDoc - ${doc.title}`;

  renderBreadcrumbNav(document.querySelector('[data-doc-detail-breadcrumb]'), doc.breadcrumb);

  document.querySelector('[data-doc-detail-filetype]').textContent = `File ${doc.fileType}`;
  document.querySelector('[data-doc-detail-title]').textContent = doc.title;
  document.querySelector('[data-doc-detail-grade]').textContent = `${doc.grade} • ${doc.subject}`;
  document.querySelector('[data-doc-detail-downloads]').textContent = `⬇ ${formatDocDetailNumber(doc.downloads)} lượt tải`;
  document.querySelector('[data-doc-detail-rating]').textContent = `⭐ ${doc.rating}/5 (${doc.ratingCount} đánh giá)`;
  document.querySelector('[data-doc-detail-updated]').textContent = `Cập nhật: ${doc.updatedDate}`;

  // Mô tả & highlights
  document.querySelector('[data-doc-detail-desc]').textContent = doc.description;

  const highlightsEl = document.querySelector('[data-doc-detail-highlights]');
  doc.highlights.forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    highlightsEl.appendChild(li);
  });

  const tagsEl = document.querySelector('[data-doc-detail-tags]');
  (doc.curriculumTags || []).forEach((tag) => {
    const span = document.createElement('span');
    span.className = 'doc-detail__tag';
    span.textContent = tag;
    tagsEl.appendChild(span);
  });

  // Thumbnails + modal xem ảnh phóng to
  const thumbsEl = document.querySelector('[data-doc-detail-thumbnails]');
  const imageModal = document.querySelector('[data-doc-image-modal]');
  const imageModalImg = document.querySelector('[data-doc-image-modal-img]');

  doc.thumbnails.forEach((src) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'doc-detail__thumbnail';
    const img = document.createElement('img');
    img.src = src;
    img.alt = doc.title;
    img.loading = 'lazy';
    btn.appendChild(img);
    btn.addEventListener('click', () => {
      imageModalImg.src = src;
      imageModal.hidden = false;
    });
    thumbsEl.appendChild(btn);
  });

  document.querySelectorAll('[data-doc-image-modal-close]').forEach((el) => {
    el.addEventListener('click', () => { imageModal.hidden = true; });
  });

  // Tài liệu liên quan
  const relatedIds = doc.relatedIds || [];
  const relatedDocs = relatedIds
    .map((relId) => allDocs.find((d) => d.id === relId))
    .filter(Boolean);

  if (relatedDocs.length) {
    document.querySelector('[data-doc-detail-related-block]').hidden = false;
    const relatedEl = document.querySelector('[data-doc-detail-related]');
    relatedDocs.forEach((relDoc) => relatedEl.appendChild(createDocDetailRelatedCard(relDoc)));
  }

  // Đánh giá
  document.querySelector('[data-doc-detail-rating-score]').textContent = `⭐ ${doc.rating}/5`;
  document.querySelector('[data-doc-detail-rating-count]').textContent = `(${doc.ratingCount} đánh giá)`;

  const reviewsEl = document.querySelector('[data-doc-detail-reviews]');
  (doc.reviews || []).forEach((review) => reviewsEl.appendChild(createDocDetailReviewItem(review)));

  const reviewForm = document.querySelector('[data-doc-review-form]');
  const starButtons = reviewForm.querySelectorAll('[data-doc-review-stars] button');
  let selectedStars = 0;

  starButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedStars = Number(btn.dataset.star);
      starButtons.forEach((b) => b.classList.toggle('is-active', Number(b.dataset.star) <= selectedStars));
    });
  });

  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = reviewForm.elements.name.value.trim();
    const comment = reviewForm.elements.comment.value.trim();
    if (!name || !comment) return;

    reviewsEl.prepend(createDocDetailReviewItem({
      name,
      rating: selectedStars || 5,
      date: 'Vừa xong',
      comment,
      avatar: '/assets/images/testimonial-avatar-parent.svg',
    }));

    reviewForm.reset();
    selectedStars = 0;
    starButtons.forEach((b) => b.classList.remove('is-active'));
  });

  // Action card
  document.querySelector('[data-doc-detail-price]').textContent = doc.price;

  function triggerDownload() {
    const a = document.createElement('a');
    a.href = doc.file;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    a.remove();

    const downloadModal = document.querySelector('[data-doc-download-modal]');
    downloadModal.hidden = false;
  }

  document.querySelectorAll('[data-doc-detail-download], [data-doc-viewer-lock-download]').forEach((btn) => {
    btn.addEventListener('click', triggerDownload);
  });

  document.querySelectorAll('[data-doc-download-modal-close]').forEach((el) => {
    el.addEventListener('click', () => {
      document.querySelector('[data-doc-download-modal]').hidden = true;
    });
  });

  const downloadEmailForm = document.querySelector('[data-doc-download-email-form]');
  downloadEmailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelector('[data-doc-download-modal-step="ask"]').hidden = true;
    document.querySelector('[data-doc-download-modal-step="thanks"]').hidden = false;
  });

  // Lưu vào tủ sách
  const saveBtn = document.querySelector('[data-doc-detail-save]');
  const favorites = JSON.parse(localStorage.getItem('freedoc_favorites') || '[]');
  const isSaved = () => favorites.includes(doc.id);
  const renderSaveState = () => {
    saveBtn.setAttribute('aria-pressed', String(isSaved()));
    saveBtn.textContent = isSaved() ? '✅ Đã lưu vào tủ sách' : '🔖 Lưu vào tủ sách';
  };
  renderSaveState();
  saveBtn.addEventListener('click', () => {
    const idx = favorites.indexOf(doc.id);
    if (idx === -1) favorites.push(doc.id); else favorites.splice(idx, 1);
    localStorage.setItem('freedoc_favorites', JSON.stringify(favorites));
    renderSaveState();
  });

  // In trực tiếp: mở PDF trong iframe ẩn rồi gọi lệnh in của trình duyệt
  document.querySelector('[data-doc-detail-print]').addEventListener('click', () => {
    const printFrame = document.createElement('iframe');
    printFrame.style.display = 'none';
    printFrame.src = doc.file;
    printFrame.addEventListener('load', () => {
      printFrame.contentWindow.print();
    });
    document.body.appendChild(printFrame);
  });

  // Chia sẻ
  const shareToggle = document.querySelector('[data-doc-detail-share-toggle]');
  const shareMenu = document.querySelector('[data-doc-detail-share-menu]');
  shareToggle.addEventListener('click', () => { shareMenu.hidden = !shareMenu.hidden; });
  document.addEventListener('click', (e) => {
    if (!shareMenu.hidden && !e.target.closest('[data-doc-detail-share]')) shareMenu.hidden = true;
  });

  const pageUrl = window.location.href;
  document.querySelector('[data-doc-detail-share-copy]').addEventListener('click', (e) => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      e.target.textContent = 'Đã copy!';
      setTimeout(() => { e.target.textContent = 'Copy link'; }, 1500);
    });
  });
  document.querySelector('[data-doc-detail-share-fb]').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
  document.querySelector('[data-doc-detail-share-zalo]').href = `https://zalo.me/share?u=${encodeURIComponent(pageUrl)}&d=${encodeURIComponent(doc.title)}`;

  // Thông số kỹ thuật
  const metaListEl = document.querySelector('[data-doc-detail-meta-list]');
  const metaFields = [
    ['📄 Định dạng', doc.format],
    ['📏 Dung lượng', doc.fileSize],
    ['📑 Số trang', `${doc.pageCount} trang`],
    ['🖨️ Khổ in chuẩn', doc.printSize],
    ['✅ Có đáp án', doc.hasAnswerKey ? 'Có' : 'Không'],
  ];
  metaFields.forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'doc-detail__meta-list-item';
    const l = document.createElement('span');
    l.textContent = label;
    const v = document.createElement('span');
    v.textContent = value;
    row.appendChild(l);
    row.appendChild(v);
    metaListEl.appendChild(row);
  });

  // Tác giả
  document.querySelector('[data-doc-detail-author-avatar]').src = doc.author.avatar;
  document.querySelector('[data-doc-detail-author-name]').textContent = doc.author.name;
  const authorLink = document.querySelector('[data-doc-detail-author-link]');
  authorLink.textContent = `Xem thêm ${doc.author.docCount} tài liệu của tác giả này →`;
  authorLink.href = `/tailieu/tieuhoc/index.html?q=${encodeURIComponent(doc.author.name)}`;

  // Up-sell bộ tài liệu lớn
  if (doc.seriesInfo) {
    document.querySelector('[data-doc-detail-upsell]').hidden = false;
    document.querySelector('[data-doc-detail-upsell-text]').textContent =
      `Tài liệu này nằm trong "${doc.seriesInfo.name}" (${doc.seriesInfo.totalCount} tuần).`;
    document.querySelector('[data-doc-detail-upsell-cta]').href =
      `/tailieu/tieuhoc/index.html?q=${encodeURIComponent(doc.seriesInfo.name)}`;
  }
}

function createBookReviewComment(comment) {
  const li = document.createElement('li');
  li.className = 'book-review__comment';

  const avatar = document.createElement('img');
  avatar.src = comment.avatar || '/assets/images/testimonial-avatar-parent.svg';
  avatar.alt = comment.name;

  const body = document.createElement('div');

  const name = document.createElement('span');
  name.className = 'book-review__comment-name';
  name.textContent = comment.name;

  const date = document.createElement('span');
  date.className = 'book-review__comment-date';
  date.textContent = comment.date;

  const text = document.createElement('p');
  text.className = 'book-review__comment-text';
  text.textContent = comment.comment;

  body.appendChild(name);
  body.appendChild(date);
  body.appendChild(text);

  li.appendChild(avatar);
  li.appendChild(body);
  return li;
}

function createBookReviewRelatedCard(item) {
  const a = document.createElement('a');
  a.className = 'book-review__related-card';
  a.href = item.href;

  const thumb = document.createElement('span');
  thumb.className = 'book-review__related-thumb';
  const img = document.createElement('img');
  img.src = item.image;
  img.alt = item.title;
  img.loading = 'lazy';
  thumb.appendChild(img);

  const title = document.createElement('h3');
  title.textContent = item.title;

  a.appendChild(thumb);
  a.appendChild(title);
  return a;
}

function initBookReviewPage() {
  const root = document.querySelector('[data-book-review]');
  if (!root) return;

  const id = new URLSearchParams(window.location.search).get('id');

  fetch('/assets/json/book-reviews.json')
    .then((res) => res.json())
    .then((reviews) => {
      const review = reviews.find((r) => r.id === id) || reviews[0];
      if (!review) return;
      renderBookReview(review);
    });
}

function renderBookReview(review) {
  document.title = `FreeDoc - ${review.book.title}`;

  renderBreadcrumbNav(document.querySelector('[data-review-breadcrumb]'), review.breadcrumb);

  document.querySelector('[data-review-title]').textContent = review.articleTitle;
  document.querySelector('[data-review-author]').textContent = `✍️ ${review.reviewer.name}`;
  document.querySelector('[data-review-date]').textContent = review.reviewer.date;
  document.querySelector('[data-review-readtime]').textContent = `⏱ ${review.reviewer.readTime}`;
  document.querySelector('[data-review-views]').textContent = `👁 ${formatDocDetailNumber(review.reviewer.views)} lượt xem`;

  document.querySelector('[data-review-intro]').textContent = review.intro;

  const prosEl = document.querySelector('[data-review-pros]');
  review.pros.forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    prosEl.appendChild(li);
  });

  const consEl = document.querySelector('[data-review-cons]');
  review.cons.forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    consEl.appendChild(li);
  });

  // Các section H2 + mục lục (TOC)
  const sectionsEl = document.querySelector('[data-review-sections]');
  const tocEl = document.querySelector('[data-review-toc]');

  review.sections.forEach((section) => {
    const sectionEl = document.createElement('div');
    sectionEl.className = 'book-review__section';
    sectionEl.id = section.id;

    const h2 = document.createElement('h2');
    h2.textContent = section.heading;
    sectionEl.appendChild(h2);

    section.paragraphs.forEach((text) => {
      const p = document.createElement('p');
      p.textContent = text;
      sectionEl.appendChild(p);
    });

    if (section.images && section.images.length) {
      const imagesEl = document.createElement('div');
      imagesEl.className = 'book-review__section-images';
      section.images.forEach((src) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = section.heading;
        img.loading = 'lazy';
        imagesEl.appendChild(img);
      });
      sectionEl.appendChild(imagesEl);
    }

    sectionsEl.appendChild(sectionEl);

    const tocItem = document.createElement('li');
    const tocLink = document.createElement('a');
    tocLink.href = `#${section.id}`;
    tocLink.textContent = section.heading;
    tocItem.appendChild(tocLink);
    tocEl.appendChild(tocItem);
  });

  // Scroll-spy: highlight mục lục theo section đang đọc
  const tocLinks = Array.from(tocEl.querySelectorAll('a'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      tocLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sectionsEl.querySelectorAll('.book-review__section').forEach((el) => observer.observe(el));

  // Gallery xem trước trang sách + modal có nút chuyển ảnh
  const galleryEl = document.querySelector('[data-review-gallery]');
  const imageModal = document.querySelector('[data-review-image-modal]');
  const imageModalImg = document.querySelector('[data-review-image-modal-img]');
  const imageModalCount = document.querySelector('[data-review-image-modal-count]');
  const images = review.samplePreviewImages;
  let galleryIndex = 0;

  function showGalleryImage(index) {
    galleryIndex = (index + images.length) % images.length;
    imageModalImg.src = images[galleryIndex];
    imageModalCount.textContent = `${galleryIndex + 1} / ${images.length}`;
  }

  images.forEach((src, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'book-review__thumbnail';
    const img = document.createElement('img');
    img.src = src;
    img.alt = review.book.title;
    img.loading = 'lazy';
    btn.appendChild(img);
    btn.addEventListener('click', () => {
      showGalleryImage(index);
      imageModal.hidden = false;
    });
    galleryEl.appendChild(btn);
  });

  document.querySelector('[data-review-image-modal-prev]').addEventListener('click', () => showGalleryImage(galleryIndex - 1));
  document.querySelector('[data-review-image-modal-next]').addEventListener('click', () => showGalleryImage(galleryIndex + 1));
  document.querySelectorAll('[data-review-image-modal-close]').forEach((el) => {
    el.addEventListener('click', () => { imageModal.hidden = true; });
  });

  // Tổng kết / điểm số
  const scoresEl = document.querySelector('[data-review-verdict-scores]');
  const scoreLabels = { content: 'Nội dung', design: 'Thiết kế/In ấn', easeOfLearning: 'Tính dễ học' };
  Object.entries(review.verdict.scores).forEach(([key, value]) => {
    const row = document.createElement('div');
    row.className = 'book-review__score-row';
    const label = document.createElement('span');
    label.textContent = scoreLabels[key] || key;
    const score = document.createElement('span');
    score.textContent = `${value}/10`;
    row.appendChild(label);
    row.appendChild(score);
    scoresEl.appendChild(row);
  });

  const recommendEl = document.querySelector('[data-review-recommend-for]');
  review.verdict.recommendFor.forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    recommendEl.appendChild(li);
  });

  const notRecommendEl = document.querySelector('[data-review-not-recommend-for]');
  review.verdict.notRecommendFor.forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    notRecommendEl.appendChild(li);
  });

  // Tác giả bài review
  document.querySelector('[data-review-author-bio-avatar]').src = review.authorBio.avatar;
  document.querySelector('[data-review-author-bio-name]').textContent = review.authorBio.name;
  document.querySelector('[data-review-author-bio-title]').textContent = review.authorBio.title;
  document.querySelector('[data-review-author-bio-text]').textContent = review.authorBio.bio;

  // Bình luận
  const commentsEl = document.querySelector('[data-review-comments]');
  review.comments.forEach((comment) => commentsEl.appendChild(createBookReviewComment(comment)));

  const commentForm = document.querySelector('[data-review-comment-form]');
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = commentForm.elements.name.value.trim();
    const comment = commentForm.elements.comment.value.trim();
    if (!name || !comment) return;

    commentsEl.appendChild(createBookReviewComment({
      name,
      comment,
      date: 'Vừa xong',
      avatar: '/assets/images/testimonial-avatar-parent.svg',
    }));
    commentForm.reset();
  });

  // Bài viết liên quan
  const relatedEl = document.querySelector('[data-review-related]');
  review.relatedReviews.forEach((item) => relatedEl.appendChild(createBookReviewRelatedCard(item)));

  // Sidebar: card thông tin sách
  document.querySelector('[data-review-book-cover]').src = review.book.coverImage;
  document.querySelector('[data-review-book-title]').textContent = review.book.title;
  document.querySelector('[data-review-book-publisher]').textContent = review.book.publisher;
  document.querySelector('[data-review-book-rating]').textContent = `⭐ ${review.book.rating}/5 (Điểm review của biên tập viên)`;
  document.querySelector('[data-review-book-age]').textContent = review.book.targetAge;

  // Lưu bài viết (localStorage, tái dùng kiểu favorite của trang chi tiết tài liệu)
  const saveBtn = document.querySelector('[data-review-save]');
  const savedReviews = JSON.parse(localStorage.getItem('freedoc_saved_reviews') || '[]');
  const isSaved = () => savedReviews.includes(review.id);
  const renderSaveState = () => {
    saveBtn.setAttribute('aria-pressed', String(isSaved()));
    saveBtn.textContent = isSaved() ? '✅ Đã lưu bài viết' : '🔖 Lưu bài viết';
  };
  renderSaveState();
  saveBtn.addEventListener('click', () => {
    const idx = savedReviews.indexOf(review.id);
    if (idx === -1) savedReviews.push(review.id); else savedReviews.splice(idx, 1);
    localStorage.setItem('freedoc_saved_reviews', JSON.stringify(savedReviews));
    renderSaveState();
  });

  // Đăng ký nhận thông báo (demo phía client, chưa nối backend gửi email thật)
  const notifyForm = document.querySelector('[data-review-notify-form]');
  notifyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    notifyForm.querySelector('[data-review-notify-step="ask"]').hidden = true;
    notifyForm.querySelector('[data-review-notify-step="thanks"]').hidden = false;
  });
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
  const activeTagEl = root.querySelector('[data-list-active-tag]');
  const activeTagLabelEl = root.querySelector('[data-list-active-tag-label]');
  const activeTagClearBtn = root.querySelector('[data-list-active-tag-clear]');

  let viewMode = 'grid';
  let activeTag = null;

  const queryFromUrl = new URLSearchParams(window.location.search).get('q');
  if (queryFromUrl) searchInput.value = queryFromUrl;

  const tagFromUrl = new URLSearchParams(window.location.search).get('tag');
  if (tagFromUrl && config.tagLabels && config.tagLabels[tagFromUrl]) {
    activeTag = tagFromUrl;
  }

  function updateActiveTagUi() {
    if (!activeTagEl) return;
    if (activeTag) {
      activeTagLabelEl.textContent = config.tagLabels[activeTag];
      activeTagEl.hidden = false;
    } else {
      activeTagEl.hidden = true;
    }
  }

  function render() {
    const keyword = searchInput.value.trim().toLowerCase();
    const sortFn = config.sortFns[sortSelect.value] || config.sortFns.default;
    const filtered = items
      .filter((item) => item.title.toLowerCase().includes(keyword))
      .filter((item) => !activeTag || (item.tags && item.tags.includes(activeTag)))
      .slice()
      .sort(sortFn);

    rowEl.innerHTML = '';
    rowEl.className = `${config.rowBaseClass} ${config.rowBaseClass}--${viewMode}`;
    filtered.forEach((item) => rowEl.appendChild(config.createCard(item)));

    emptyEl.hidden = filtered.length > 0;
    rowEl.hidden = filtered.length === 0;
  }

  updateActiveTagUi();

  if (activeTagClearBtn) {
    activeTagClearBtn.addEventListener('click', () => {
      activeTag = null;
      updateActiveTagUi();
      render();
    });
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
    tagLabels: {
      toan: 'Toán tư duy',
      'tap-to': 'Tập tô chữ & số',
      'to-mau': 'Tô màu',
    },
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

// Các loại bài tập Tiếng Việt cần viết câu/đoạn dài nên hiển thị toàn trang (1 cột)
// và có thêm phần ô li để bé viết lại ngay dưới đề bài.
const WORKSHEET_VI_WRITING_TYPES = ['simple-sentence', 'paragraph', 'word-order', 'inference-sentence'];

const WORKSHEET_RANGE_LABELS = {
  10: 'phạm vi 10',
  20: 'phạm vi 20',
  '100-no-carry': 'phạm vi 100 - không nhớ',
  '100-carry': 'phạm vi 100 - có nhớ',
};

// Dữ liệu từ vựng (Tiếng Việt/Tiếng Anh) được tách sang assets/json/worksheet-word-banks.json,
// mỗi loại bài tập Tiếng Việt (câu đơn, đoạn văn, sắp xếp từ, câu suy luận) có 1 file JSON riêng
// để thêm/bớt dữ liệu sau này không cần đụng vào code - xem worksheetLoadWordBanks().
let WORKSHEET_VI_WORD_BANK = {};
let WORKSHEET_EN_WORD_BANK = {};
let WORKSHEET_VI_SIMPLE_SENTENCE_BANK = {};
let WORKSHEET_VI_PARAGRAPH_BANK = [];
let WORKSHEET_VI_WORD_ORDER_BANK = {};
let WORKSHEET_VI_INFERENCE_BANK = {};

async function worksheetFetchJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${path}`);
  return res.json();
}

async function worksheetLoadWordBanks() {
  try {
    const [wordBanks, simpleSentences, paragraphs, wordOrder, inferenceQuestions] = await Promise.all([
      worksheetFetchJson('/assets/json/worksheet-word-banks.json'),
      worksheetFetchJson('/assets/json/worksheet-vi-simple-sentences.json'),
      worksheetFetchJson('/assets/json/worksheet-vi-paragraphs.json'),
      worksheetFetchJson('/assets/json/worksheet-vi-word-order.json'),
      worksheetFetchJson('/assets/json/worksheet-vi-inference-questions.json'),
    ]);

    WORKSHEET_VI_WORD_BANK = wordBanks.vi || {};
    WORKSHEET_EN_WORD_BANK = wordBanks.en || {};
    WORKSHEET_VI_SIMPLE_SENTENCE_BANK = simpleSentences;
    WORKSHEET_VI_PARAGRAPH_BANK = paragraphs;
    WORKSHEET_VI_WORD_ORDER_BANK = wordOrder;
    WORKSHEET_VI_INFERENCE_BANK = inferenceQuestions;
  } catch (err) {
    console.error('Không tải được dữ liệu từ vựng/câu mẫu cho worksheet:', err);
  }
}

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
  if (!pool || !pool.length) return [];

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

// "Tách - gộp": chọn ngẫu nhiên 1 trong 3 ô (số lớn hoặc 1 trong 2 số phần) để trẻ điền vào,
// hai ô còn lại hiển thị sẵn - giúp luyện cả chiều "tách" (biết tổng, tìm 1 phần) và "gộp" (biết 2 phần, tìm tổng).
function worksheetGenerateTreeItem(range) {
  const [left, right] = worksheetPickOperands('add', range);
  const whole = left + right;
  const hiddenSlot = ['whole', 'left', 'right'][worksheetRandInt(0, 2)];

  return {
    tree: {
      whole: hiddenSlot === 'whole' ? null : whole,
      left: hiddenSlot === 'left' ? null : left,
      right: hiddenSlot === 'right' ? null : right,
    },
  };
}

function worksheetGenerateMathItems(count, operation, range) {
  const items = [];

  for (let i = 0; i < count; i++) {
    if (operation === 'split') {
      items.push(worksheetGenerateTreeItem(range));
      continue;
    }

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

function worksheetGenerateSimpleSentenceItems(count, pool) {
  return worksheetBuildPool(pool, count);
}

function worksheetGenerateParagraphItems(count, pool) {
  return worksheetBuildPool(pool, count);
}

// Tách câu thành các từ, xáo trộn và nối lại bằng dấu "/" để bé sắp xếp lại cho đúng thứ tự.
function worksheetGenerateWordOrderItems(count, pool) {
  return worksheetBuildPool(pool, count).map((sentence) => {
    const words = sentence.trim().replace(/[.?!]+$/, '').split(/\s+/).filter(Boolean);
    return worksheetShuffle(words).join(' / ');
  });
}

function worksheetGenerateInferenceItems(count, pool) {
  return worksheetBuildPool(pool, count);
}

function worksheetGenerateEnglishItems(count, pool) {
  return worksheetBuildPool(pool, count).map(({ word, meaning }) => `${worksheetBlankRandomLetter(word)} (${meaning})`);
}

function worksheetBuildTreeBox(value) {
  const box = document.createElement('span');
  box.className = 'worksheet-tree__box';
  if (value === null) {
    box.classList.add('worksheet-tree__box--blank');
  } else {
    box.textContent = String(value);
  }
  return box;
}

function worksheetBuildTreeNode(tree) {
  const wrap = document.createElement('div');
  wrap.className = 'worksheet-tree';

  const top = document.createElement('div');
  top.className = 'worksheet-tree__top';
  top.appendChild(worksheetBuildTreeBox(tree.whole));
  wrap.appendChild(top);

  const linesSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  linesSvg.setAttribute('class', 'worksheet-tree__lines');
  linesSvg.setAttribute('viewBox', '0 0 100 30');
  linesSvg.setAttribute('preserveAspectRatio', 'none');
  ['18', '82'].forEach((x2) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '50');
    line.setAttribute('y1', '0');
    line.setAttribute('x2', x2);
    line.setAttribute('y2', '30');
    linesSvg.appendChild(line);
  });
  wrap.appendChild(linesSvg);

  const parts = document.createElement('div');
  parts.className = 'worksheet-tree__parts';
  parts.appendChild(worksheetBuildTreeBox(tree.left));
  parts.appendChild(worksheetBuildTreeBox(tree.right));
  wrap.appendChild(parts);

  return wrap;
}

// Ô li tập viết: mỗi dòng là 1 lưới ô vuông 4x4 (mm) để bé viết lại câu ngay dưới đề bài.
function worksheetBuildWritingLines(lineCount) {
  const wrap = document.createElement('div');
  wrap.className = 'worksheet-writing-lines';

  for (let i = 0; i < lineCount; i++) {
    const row = document.createElement('div');
    row.className = 'worksheet-writing-lines__row';
    wrap.appendChild(row);
  }

  return wrap;
}

function worksheetBuildPreviewTitle(subject, operation, range, viType) {
  if (subject === 'toan') {
    const opLabel = { add: 'Phép cộng', sub: 'Phép trừ', mixed: 'Cộng trừ hỗn hợp', split: 'Tách - gộp số' }[operation];
    return `${opLabel} (${WORKSHEET_RANGE_LABELS[range]})`;
  }

  if (subject === 'tviet') {
    if (viType === 'simple-sentence') return 'Luyện viết câu đơn - Tiếng Việt';
    if (viType === 'paragraph') return 'Luyện viết đoạn văn - Tiếng Việt';
    if (viType === 'word-order') return 'Sắp xếp từ thành câu - Tiếng Việt';
    if (viType === 'inference-sentence') return 'Viết câu suy luận - Tiếng Việt';
    return 'Điền chữ còn thiếu - Tiếng Việt';
  }
  return 'Điền chữ còn thiếu - Tiếng Anh';
}

function worksheetClampCount(blockEl) {
  return Math.max(5, Math.min(40, Number(blockEl.querySelector('[data-gen-count]').value) || 10));
}

function worksheetGenerateBlockItems(blockEl, state) {
  if (state.subject === 'toan') {
    const count = worksheetClampCount(blockEl);
    const operation = blockEl.querySelector('[data-gen-operation]').value;
    const range = blockEl.querySelector('[data-gen-range]').value;
    return worksheetGenerateMathItems(count, operation, range);
  }

  if (state.subject === 'tviet') {
    const viType = blockEl.querySelector('[data-gen-vi-type]').value;

    // Đoạn văn luôn chỉ có 1 đoạn/block, không phụ thuộc vào "Số lượng câu hỏi" (đã bị disable).
    if (viType === 'paragraph') {
      return worksheetGenerateParagraphItems(1, WORKSHEET_VI_PARAGRAPH_BANK);
    }

    const count = worksheetClampCount(blockEl);
    if (viType === 'simple-sentence') {
      return worksheetGenerateSimpleSentenceItems(count, WORKSHEET_VI_SIMPLE_SENTENCE_BANK[state.grade]);
    }
    if (viType === 'word-order') {
      return worksheetGenerateWordOrderItems(count, WORKSHEET_VI_WORD_ORDER_BANK[state.grade]);
    }
    if (viType === 'inference-sentence') {
      return worksheetGenerateInferenceItems(count, WORKSHEET_VI_INFERENCE_BANK[state.grade]);
    }
    return worksheetGenerateWordItems(count, WORKSHEET_VI_WORD_BANK[state.grade]);
  }

  const count = worksheetClampCount(blockEl);

  return worksheetGenerateEnglishItems(count, WORKSHEET_EN_WORD_BANK[state.grade]);
}

async function initWorksheetGenerator() {
  const section = document.querySelector('.worksheet-generator');
  if (!section) return;

  await worksheetLoadWordBanks();

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
    const isViet = state.subject === 'tviet';
    getBlocks().forEach((blockEl) => {
      blockEl.querySelector('[data-field-operation]').hidden = !isMath;
      blockEl.querySelector('[data-field-range]').hidden = !isMath;
      blockEl.querySelector('[data-field-vi-type]').hidden = !isViet;
    });
  }

  // Reset các trường khác cho phù hợp với loại bài tập Tiếng Việt vừa chọn.
  function resetBlockFieldsForViType(blockEl, viType) {
    const columnsSelect = blockEl.querySelector('[data-gen-columns]');
    const countInput = blockEl.querySelector('[data-gen-count]');

    const isFullPage = WORKSHEET_VI_WRITING_TYPES.includes(viType);
    columnsSelect.disabled = isFullPage;
    if (isFullPage) columnsSelect.value = '1';

    // Đoạn văn luôn chỉ có 1 đoạn/block nên khoá "Số lượng câu hỏi" lại; các loại khác
    // vẫn dùng chung ô đó nên trả về giá trị mặc định khi rời khỏi loại đoạn văn.
    const isParagraph = viType === 'paragraph';
    if (isParagraph) {
      countInput.value = '1';
      countInput.disabled = true;
    } else if (countInput.disabled) {
      countInput.disabled = false;
      countInput.value = '10';
    }
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

  // Đổi môn/lớp coi như bắt đầu lại: chỉ giữ 1 bài tập và trả các trường về giá trị mặc định ban đầu.
  function resetGeneratorDefaults() {
    const blocks = getBlocks();
    blocks.slice(1).forEach((blockEl) => blockEl.remove());

    const firstBlock = blocks[0];
    firstBlock.querySelector('[data-gen-count]').value = 10;
    firstBlock.querySelector('[data-gen-operation]').value = 'add';
    firstBlock.querySelector('[data-gen-range]').value = WORKSHEET_GRADE_RANGE_DEFAULT[state.grade];
    firstBlock.querySelector('[data-gen-columns]').value = '3';
    firstBlock.querySelector('[data-gen-vi-type]').value = 'fill-word';
    firstBlock._wsViType = 'fill-word';
    resetBlockFieldsForViType(firstBlock, 'fill-word');
    invalidateBlock(firstBlock);
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
      const viType = blockEl.querySelector('[data-gen-vi-type]').value;

      const sectionEl = document.createElement('div');
      sectionEl.className = 'worksheet-preview__section';

      const titleEl = document.createElement('h3');
      titleEl.className = 'worksheet-preview__title';
      const badge = document.createElement('span');
      badge.textContent = String(index + 1);
      titleEl.appendChild(badge);
      titleEl.appendChild(document.createTextNode(worksheetBuildPreviewTitle(state.subject, operation, range, viType)));
      sectionEl.appendChild(titleEl);

      const gridEl = document.createElement('div');
      gridEl.className = `worksheet-preview__grid worksheet-preview__grid--cols-${columns}`;
      blockEl._wsItems.forEach((entry, i) => {
        const item = document.createElement('div');
        item.className = 'worksheet-preview__item';

        if (entry && entry.tree) {
          item.classList.add('worksheet-preview__item--tree');
          const number = document.createElement('span');
          number.className = 'worksheet-tree__number';
          number.textContent = `${i + 1}.`;
          item.appendChild(number);
          item.appendChild(worksheetBuildTreeNode(entry.tree));
        } else {
          const textEl = document.createElement('div');
          textEl.className = 'worksheet-preview__item-text';
          textEl.textContent = `${i + 1}. ${entry}`;
          item.appendChild(textEl);

          if (state.subject === 'tviet' && WORKSHEET_VI_WRITING_TYPES.includes(viType)) {
            item.classList.add('worksheet-preview__item--writing');
            item.appendChild(worksheetBuildWritingLines(viType === 'paragraph' ? 10 : 2));
          }
        }

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
    const viTypeSelect = blockEl.querySelector('[data-gen-vi-type]');
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

    blockEl._wsViType = viTypeSelect.value;
    resetBlockFieldsForViType(blockEl, blockEl._wsViType);

    viTypeSelect.addEventListener('change', () => {
      const nextViType = viTypeSelect.value;
      if (nextViType !== blockEl._wsViType) {
        resetBlockFieldsForViType(blockEl, nextViType);
        blockEl._wsViType = nextViType;
      }
      invalidateBlock(blockEl);
      renderAll();
    });

    regenerateBtn.addEventListener('click', () => {
      invalidateBlock(blockEl);
      renderAll();
    });

    duplicateBtn.addEventListener('click', (event) => {
      // Nút nằm trong <summary>, phải chặn bubbling để không kích hoạt toggle đóng/mở accordion.
      event.preventDefault();
      event.stopPropagation();

      const clone = blockEl.cloneNode(true);

      // cloneNode chỉ sao chép attribute mặc định, không phải giá trị người dùng đang chọn
      // (vd đổi select bằng JS không cập nhật lại attribute "selected") nên phải gán tay.
      clone.querySelector('[data-gen-count]').value = countInput.value;
      clone.querySelector('[data-gen-operation]').value = operationSelect.value;
      clone.querySelector('[data-gen-range]').value = rangeSelect.value;
      clone.querySelector('[data-gen-columns]').value = columnsSelect.value;
      clone.querySelector('[data-gen-vi-type]').value = viTypeSelect.value;

      blockEl.insertAdjacentElement('afterend', clone);
      wireBlock(clone);
      updateFieldsVisibility();
      updateBlockChrome();
      renderAll();
    });

    removeBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (getBlocks().length <= 1) return;
      blockEl.remove();
      updateBlockChrome();
      renderAll();
    });
  }

  gradeSelect.addEventListener('change', () => {
    state.grade = gradeSelect.value;
    resetGeneratorDefaults();
    updateBlockChrome();
    renderAll();
  });

  subjectButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.subject = btn.dataset.subject;
      setActive(subjectButtons, 'subject', state.subject);
      resetGeneratorDefaults();
      updateFieldsVisibility();
      updateBlockChrome();
      renderAll();
    });
  });

  printBtn.addEventListener('click', () => window.print());

  getBlocks().forEach(wireBlock);
  updateFieldsVisibility();
  updateBlockChrome();
  renderAll();
}

function initScrollToTop() {
  const btn = document.querySelector('[data-scroll-to-top]');
  if (!btn) return;

  const keyvisual = document.querySelector('.keyvisual');
  const threshold = keyvisual ? keyvisual.offsetTop + keyvisual.offsetHeight : window.innerHeight;

  function toggleVisibility() {
    btn.hidden = window.scrollY < threshold;
  }

  toggleVisibility();
  window.addEventListener('scroll', toggleVisibility, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initSocialFixedButtons() {
  const container = document.querySelector('[data-social-fixed-buttons]');
  if (!container) return;

  setTimeout(() => {
    container.hidden = false;
    requestAnimationFrame(() => container.classList.add('is-visible'));
  }, 1500);

  const scrollTopBtn = document.querySelector('[data-scroll-to-top]');
  if (!scrollTopBtn) return;

  function syncPushState() {
    container.classList.toggle('is-pushed', !scrollTopBtn.hidden);
  }

  syncPushState();
  window.addEventListener('scroll', syncPushState, { passive: true });
}
