// ===== 背景色＋文字色切り替え =====
function setTheme(theme) {
  document.body.classList.remove('normal', 'dark', 'blue');
  document.body.classList.add(theme);
  // 選択状態を更新
  document.getElementById('themeSelect').value = theme;
}

// ===== 文字サイズ切り替え =====
function setFontSize(size) {
  console.log('setFontSize called with:', size);
  console.log('Before - html classes:', document.documentElement.className);

  document.documentElement.classList.remove(
    'normal-font',
    'large-font',
    'xlarge-font'
  );
  if (size === 'normal') document.documentElement.classList.add('normal-font');
  if (size === 'large') document.documentElement.classList.add('large-font');
  if (size === 'xlarge') document.documentElement.classList.add('xlarge-font');

  console.log('After - html classes:', document.documentElement.className);
  console.log(
    'Computed font-size:',
    window.getComputedStyle(document.documentElement).fontSize
  );

  // 選択状態を更新
  document.getElementById('fontSizeSelect').value = size;
}

// ===== 言語切り替え =====
function changeLanguage(lang) {
  if (lang === 'ja') {
    // 日本語の場合は翻訳をリセット
    if (window.google && window.google.translate) {
      const translateElement = document.querySelector('.goog-te-combo');
      if (translateElement) {
        translateElement.value = '';
        translateElement.dispatchEvent(new Event('change'));
      }
    }
  } else {
    // 他の言語の場合はGoogle翻訳を使用
    if (window.google && window.google.translate) {
      const translateElement = document.querySelector('.goog-te-combo');
      if (translateElement) {
        translateElement.value = lang;
        translateElement.dispatchEvent(new Event('change'));
      }
    }
  }
  // 選択状態を更新
  document.getElementById('languageSelect').value = lang;
}

// ===== 音声読み上げ =====
// 発音置換辞書（読み上げ時の発音を修正）
function applyPronunciationCorrection(text) {
  // 発音置換のマッピング
  const pronunciationMap = {
    山武: 'サンブ',
    山武郡: 'サンブグン',
    山武市: 'サンブシ',
    山武郡市: 'サンブグンシ',
    山武郡市広域水道企業団: 'サンブグンシコウイキスイドウキギョウダン',
  };

  let correctedText = text;

  // 長い文字列から順に置換（部分一致を防ぐため）
  Object.keys(pronunciationMap)
    .sort((a, b) => b.length - a.length) // 長い順にソート
    .forEach(key => {
      const regex = new RegExp(key, 'g');
      correctedText = correctedText.replace(regex, pronunciationMap[key]);
    });

  return correctedText;
}

function readAll() {
  const elements = document.querySelectorAll('h1, h2, p, li');
  let text = '';
  elements.forEach(el => {
    text += el.innerText + '。';
  });

  // 発音修正を適用
  const correctedText = applyPronunciationCorrection(text);

  const utterance = new SpeechSynthesisUtterance(correctedText);
  utterance.lang = 'ja-JP';
  speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  speechSynthesis.cancel();
}

// ===== Google翻訳ウィジェット =====
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: 'ja', includedLanguages: 'ja,en,zh-CN,ko,fr,es' },
    'google_translate_element'
  );
}

// ===== メガメニュー制御 =====
function initMegaMenu() {
  const navItems = document.querySelectorAll('.nav-item');
  const header = document.querySelector('header');

  // ヘッダー下のスペーサー要素
  let headerSpacer = null;

  // メガメニューの表示状態を追跡
  let isMegaMenuActive = false;

  // リサイズイベントのデバウンス用タイマー
  let resizeTimer = null;

  // スペーサーの高さを更新する関数
  function updateSpacerHeight() {
    // メガメニューが非表示またはスペーサーが存在しない場合は何もしない
    if (!isMegaMenuActive || !headerSpacer || !header) return;

    // ヘッダーの高さを取得（fixedになった後も正確な高さを取得）
    // requestAnimationFrameでレイアウトが確定してから取得
    requestAnimationFrame(() => {
      const headerHeight = header.offsetHeight;
      if (headerSpacer) {
        headerSpacer.style.height = headerHeight + 'px';
      }
    });
  }

  // リサイズ時のデバウンス処理付き更新関数
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateSpacerHeight();
    }, 150); // 150msのデバウンス
  }

  // メガメニューの状態を管理する関数
  function updateMegaMenuState() {
    const activeMenus = document.querySelectorAll('.mega-menu.active');

    if (activeMenus.length > 0) {
      // メガメニューが表示される場合
      if (!isMegaMenuActive) {
        isMegaMenuActive = true;

        // ヘッダーの高さを取得（fixedになる前）
        const headerHeight = header ? header.offsetHeight : 0;

        // ヘッダー下にスペーサーを追加（まだ存在しない場合）
        if (!headerSpacer && header) {
          headerSpacer = document.createElement('div');
          headerSpacer.id = 'header-spacer';
          headerSpacer.style.height = headerHeight + 'px';
          headerSpacer.style.width = '100%';
          headerSpacer.style.display = 'block';
          // ヘッダーの直後に挿入
          header.insertAdjacentElement('afterend', headerSpacer);
        }

        // ヘッダーを固定
        if (header) {
          header.classList.add('fixed');
        }

        // スペーサーの高さを更新（fixedになった後の正確な高さ）
        updateSpacerHeight();

        // ウィンドウリサイズ時の対応（デバウンス付き）
        window.addEventListener('resize', handleResize, { passive: true });
      } else {
        // 既に表示中の場合も高さを再計算（ヘッダー内要素が変更された可能性）
        updateSpacerHeight();
      }
    } else {
      // メガメニューが非表示になる場合
      if (isMegaMenuActive) {
        isMegaMenuActive = false;

        // スペーサーを削除
        if (headerSpacer) {
          headerSpacer.remove();
          headerSpacer = null;
        }

        // ヘッダーのfixedを解除
        if (header) {
          header.classList.remove('fixed');
        }

        // リサイズイベントリスナーを削除（メモリリーク防止）
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimer);
      }
    }
  }

  navItems.forEach(item => {
    const megaMenu = item.querySelector('.mega-menu');
    if (megaMenu) {
      // ホバー時の表示制御
      item.addEventListener('mouseenter', function () {
        // 他のメガメニューを非表示
        document.querySelectorAll('.mega-menu').forEach(menu => {
          menu.classList.remove('active');
        });

        // 現在のメガメニューを表示
        megaMenu.classList.add('active');
        updateMegaMenuState();

        // メガメニューの位置を調整（ヘッダー固定後に実行）
        requestAnimationFrame(() => {
          const mainNav = document.querySelector('.main-nav');
          const navRect = mainNav.getBoundingClientRect();
          megaMenu.style.top = navRect.bottom + window.scrollY + 'px';
        });
      });

      // メガメニュー内でのマウス移動時は表示を維持
      megaMenu.addEventListener('mouseenter', function () {
        megaMenu.classList.add('active');
        updateMegaMenuState();
      });

      // メガメニューから離れた時の非表示
      item.addEventListener('mouseleave', function () {
        setTimeout(() => {
          megaMenu.classList.remove('active');
          updateMegaMenuState();
        }, 200);
      });
    }
  });

  // メガメニュー外をクリックした時の非表示
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.main-nav')) {
      document.querySelectorAll('.mega-menu').forEach(menu => {
        menu.classList.remove('active');
      });
      updateMegaMenuState();
    }
  });
}

// ===== ページ読み込み時の初期化 =====
window.addEventListener('load', function () {
  // 初期状態を設定
  document.getElementById('themeSelect').value = 'normal';
  document.getElementById('fontSizeSelect').value = 'normal';
  document.getElementById('languageSelect').value = 'ja';

  // メガメニューを初期化
  initMegaMenu();

  // モバイルアコーディオンを初期化
  initMobileAccordion();

  // お知らせタブを初期化
  initNewsTabs();
});

// ===== スクロールトップ機能 =====
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

// ===== 広告バナー制御 =====
function closeAdBanner() {
  const adBanner = document.getElementById('adBanner');
  if (adBanner) {
    // まず初期状態を解除
    adBanner.classList.remove('initial');
    // 閉じた状態に変更
    adBanner.classList.add('collapsed');

    // 少し遅延してから完全に表示
    setTimeout(() => {
      adBanner.classList.remove('hidden');
    }, 300);
  }
}

// ページ読み込み時に広告バナーを初期状態で表示
window.addEventListener('load', function () {
  const adBanner = document.getElementById('adBanner');
  if (adBanner) {
    adBanner.classList.add('initial');
  }
});

// ===== お知らせタブ制御 =====
function initNewsTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');

  tabButtons.forEach(button => {
    button.addEventListener('click', function () {
      // すべてのタブボタンからactiveクラスを削除
      tabButtons.forEach(btn => btn.classList.remove('active'));

      // クリックされたボタンにactiveクラスを追加
      this.classList.add('active');

      // タブの切り替え処理（必要に応じて実装）
      const tabType = this.getAttribute('data-tab');
      console.log('タブ切り替え:', tabType);
    });
  });
}

// ===== モバイルメニュー制御 =====
function toggleMobileMenu() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNav = document.querySelector('.mobile-nav');

  console.log('Toggle clicked', hamburgerBtn, mobileNav);

  if (hamburgerBtn) {
    hamburgerBtn.classList.toggle('active');
    console.log('Hamburger active:', hamburgerBtn.classList.contains('active'));
  }

  if (mobileNav) {
    mobileNav.classList.toggle('active');
    console.log('Mobile nav active:', mobileNav.classList.contains('active'));
  }
}

// ===== モバイルアコーディオン制御 =====
function initMobileAccordion() {
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  mobileNavItems.forEach(item => {
    const h3 = item.querySelector('h3');
    const subMenu = item.querySelector('.mobile-sub-menu');

    if (h3 && subMenu) {
      h3.addEventListener('click', function () {
        // 他のアコーディオンを閉じる
        mobileNavItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        // 現在のアコーディオンをトグル
        item.classList.toggle('active');
      });
    }
  });
}

// モバイルメニュー外をクリックした時の非表示
document.addEventListener('click', function (e) {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNav = document.querySelector('.mobile-nav');

  if (!e.target.closest('.hamburger-btn') && !e.target.closest('.mobile-nav')) {
    hamburgerBtn.classList.remove('active');
    mobileNav.classList.remove('active');
  }
});
