document.addEventListener('DOMContentLoaded', () => {
    const langSwitcher = document.getElementById('lang-switcher');
    const translatableElements = document.querySelectorAll('[data-lang-ja]');
    const pageTitle = document.querySelector('title');

    const switchLanguage = (lang) => {
        translatableElements.forEach(el => {
            const jaText = el.getAttribute('data-lang-ja');
            const enText = el.getAttribute('data-lang-en');
            
            if (lang === 'ja') {
                el.textContent = jaText;
            } else {
                el.textContent = enText;
            }
        });

        // Update page title
        if (pageTitle) {
            const titleJa = pageTitle.getAttribute('data-lang-ja');
            const titleEn = pageTitle.getAttribute('data-lang-en');
            pageTitle.textContent = lang === 'ja' ? titleJa : titleEn;
        }

        // Update switcher button
        if (langSwitcher) {
            langSwitcher.textContent = lang === 'ja' ? 'English' : '日本語';
            langSwitcher.setAttribute('data-current-lang', lang);
            if (lang === 'en') {
                langSwitcher.classList.add('active');
            } else {
                langSwitcher.classList.remove('active');
            }
        }

        localStorage.setItem('preferredLanguage', lang);
        document.documentElement.lang = lang;
    };

    if (langSwitcher) {
        langSwitcher.addEventListener('click', () => {
            const currentLang = langSwitcher.getAttribute('data-current-lang') || 'ja';
            const nextLang = currentLang === 'ja' ? 'en' : 'ja';
            switchLanguage(nextLang);
        });
    }

    // Hamburger Menu Logic
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav a');

    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Scroll Reveal Animation
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15
    });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // Set default language to Japanese (as per brief)
    // But check localStorage first for returning users
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'ja';
    switchLanguage(preferredLanguage);
});
