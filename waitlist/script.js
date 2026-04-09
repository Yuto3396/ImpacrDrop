document.addEventListener('DOMContentLoaded', () => {
    const heroForm = document.getElementById('waitlist-form-hero');
    const footerForm = document.getElementById('waitlist-form-footer');
    
    const heroFormContainer = document.getElementById('hero-form-container');
    const footerFormContainer = document.getElementById('footer-form-container');
    
    const successHero = document.getElementById('success-hero');
    const successFooter = document.getElementById('success-footer');

    const langSwitcher = document.getElementById('lang-switcher');
    const translatableElements = document.querySelectorAll('[data-lang-ja]');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    const body = document.body;

    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xgopbnee';

    // 1. Language Switcher Logic (Synced with Root)
    const switchLanguage = (lang) => {
        translatableElements.forEach(el => {
            if (el.tagName === 'INPUT' && el.dataset.langPlaceholderJa) {
                el.placeholder = lang === 'ja' ? el.dataset.langPlaceholderJa : el.dataset.langPlaceholderEn;
            } else {
                if (lang === 'ja') {
                    el.textContent = el.dataset.langJa;
                } else {
                    el.textContent = el.dataset.langEn;
                }
            }
        });

        if (langSwitcher) {
            langSwitcher.textContent = lang === 'ja' ? 'English' : '日本語';
            langSwitcher.dataset.currentLang = lang;
        }
        localStorage.setItem('preferredLanguage', lang);
    };

    if (langSwitcher) {
        langSwitcher.addEventListener('click', () => {
            const currentLang = langSwitcher.dataset.currentLang || 'ja';
            const nextLang = currentLang === 'ja' ? 'en' : 'ja';
            switchLanguage(nextLang);
        });
    }

    // Initialize Language from localStorage
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'ja';
    switchLanguage(preferredLanguage);

    // 2. Mobile Nav Logic
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
    }

    if (mobileNav) {
        mobileNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });
    }

    // 3. Form Handling Logic
    const handleSubmit = async (e, container, successElement) => {
        e.preventDefault();
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value;
        const submitBtn = form.querySelector('button');

        if (!email || !email.includes('@')) return;

        const currentLang = localStorage.getItem('preferredLanguage') || 'ja';
        const originalText = submitBtn.textContent;
        submitBtn.textContent = currentLang === 'ja' ? '送信中...' : 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                container.style.transition = 'opacity 0.4s ease';
                container.style.opacity = '0';
                
                setTimeout(() => {
                    container.style.display = 'none';
                    successElement.style.display = 'block';
                    successElement.style.opacity = '0';
                    setTimeout(() => {
                        successElement.style.transition = 'opacity 0.5s ease';
                        successElement.style.opacity = '1';
                    }, 50);
                }, 400);

            } else {
                const data = await response.json();
                throw new Error(data.error || 'Submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            const errorMsg = currentLang === 'ja' ? 'エラーが発生しました。もう一度お試しください。' : 'Something went wrong. Please try again.';
            alert(errorMsg);
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    };

    if (heroForm) {
        heroForm.addEventListener('submit', (e) => handleSubmit(e, heroFormContainer, successHero));
    }

    if (footerForm) {
        footerForm.addEventListener('submit', (e) => handleSubmit(e, footerFormContainer, successFooter));
    }
});
