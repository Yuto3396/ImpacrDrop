document.addEventListener('DOMContentLoaded', () => {
    const langSwitcher = document.getElementById('lang-switcher');
    const translatableElements = document.querySelectorAll('[data-lang-ja]');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    const body = document.body;

    // Page transition logic
    const handleLinkClick = (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const url = link.href;
        // Only apply to internal, non-anchor links
        if (url.includes(window.location.host) && !url.includes('#')) {
            e.preventDefault();
            body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = url;
            }, 400); // Match CSS transition duration
        }
    };

    document.addEventListener('click', handleLinkClick);

    const switchLanguage = (lang) => {
        translatableElements.forEach(el => {
            if (el.tagName === 'IMG' && el.dataset.langJaAlt) {
                if (lang === 'ja') {
                    el.alt = el.dataset.langJaAlt;
                } else {
                    el.alt = el.dataset.langEnAlt;
                }
            } else { 
                if (lang === 'ja') {
                    el.textContent = el.dataset.langJa;
                } else {
                    el.textContent = el.dataset.langEn;
                }
            }
        });

        langSwitcher.textContent = lang === 'ja' ? 'English' : '日本語';
        langSwitcher.dataset.currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
    };

    langSwitcher.addEventListener('click', () => {
        const currentLang = langSwitcher.dataset.currentLang || 'ja';
        const nextLang = currentLang === 'ja' ? 'en' : 'ja';
        switchLanguage(nextLang);
    });

    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'ja';
    switchLanguage(preferredLanguage);

    const refillButton = document.getElementById('refill-button');
    const refillProgressBar = document.getElementById('refill-progress-bar');
    const refillCountDisplay = document.getElementById('refill-count-display');

    let refillCount = localStorage.getItem('refillCount') ? parseInt(localStorage.getItem('refillCount')) : 0;

    function updateRefillCounter() {
        const progress = (refillCount % 1000) / 10;
        if (refillProgressBar) {
            refillProgressBar.style.width = progress + '%';
        }
        if (refillCountDisplay) {
            refillCountDisplay.textContent = refillCount % 1000;
        }
        localStorage.setItem('refillCount', refillCount);
    }

    if (refillButton) {
        refillButton.addEventListener('click', function() {
            refillCount++;
            updateRefillCounter();
        });
    }

    updateRefillCounter();

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
    }

    // Close mobile nav on link click
    if (mobileNav) {
        mobileNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });
    }
});