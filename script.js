document.addEventListener('DOMContentLoaded', () => {
    const langSwitcher = document.getElementById('lang-switcher');
    // data-lang-ja属性を持つすべての要素を取得
    const translatableElements = document.querySelectorAll('[data-lang-ja]');

    const switchLanguage = (lang) => {
        translatableElements.forEach(el => {
            // alt属性も翻訳対象にする
            if (el.tagName === 'IMG' && el.dataset.langJaAlt) {
                if (lang === 'ja') {
                    el.alt = el.dataset.langJaAlt;
                } else {
                    el.alt = el.dataset.langEnAlt;
                }
            } else { // それ以外の要素はテキスト内容を切り替え
                if (lang === 'ja') {
                    el.textContent = el.dataset.langJa;
                } else {
                    el.textContent = el.dataset.langEn;
                }
            }
        });

        // ボタンのテキストと状態を更新
        langSwitcher.textContent = lang === 'ja' ? 'English' : '日本語';
        langSwitcher.dataset.currentLang = lang;
        // 言語設定をブラウザに保存
        localStorage.setItem('preferredLanguage', lang);
    };

    // ボタンクリック時のイベント
    langSwitcher.addEventListener('click', () => {
        const currentLang = langSwitcher.dataset.currentLang || 'ja';
        const nextLang = currentLang === 'ja' ? 'en' : 'ja';
        switchLanguage(nextLang);
    });

    // ページ読み込み時に、保存された言語設定またはデフォルト言語を適用
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'ja'; // デフォルトは日本語
    switchLanguage(preferredLanguage);

    const refillButton = document.getElementById('refill-button');
    const refillProgressBar = document.getElementById('refill-progress-bar');
    const refillCountDisplay = document.getElementById('refill-count-display');

    let refillCount = localStorage.getItem('refillCount') ? parseInt(localStorage.getItem('refillCount')) : 0;

    function updateRefillCounter() {
        const progress = (refillCount % 1000) / 10; // 1000回で100%
        refillProgressBar.style.width = progress + '%';
        refillCountDisplay.textContent = refillCount % 1000;
        localStorage.setItem('refillCount', refillCount);
    }

    if (refillButton) {
        refillButton.addEventListener('click', function() {
            refillCount++;
            updateRefillCounter();
        });
    }

    updateRefillCounter();
});
