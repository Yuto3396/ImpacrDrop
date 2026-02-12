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

    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'ja';
    switchLanguage(preferredLanguage);

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

    // Carousel Logic
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const track = document.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-button.next');
        const prevButton = document.querySelector('.carousel-button.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        
        if (slides.length === 0) return;

        let currentIndex = 0;
        let slideWidth = slides[0].getBoundingClientRect().width;

        // Create dots
        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.children);

        const updateCarousel = () => {
            track.style.transform = 'translateX(-' + slideWidth * currentIndex + 'px)';
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
            prevButton.style.display = currentIndex === 0 ? 'none' : 'flex';
            nextButton.style.display = currentIndex === slides.length - 1 ? 'none' : 'flex';
        };

        const goToNext = () => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
                updateCarousel();
            }
        };

        const goToPrev = () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        };

        nextButton.addEventListener('click', goToNext);
        prevButton.addEventListener('click', goToPrev);

        // Swipe functionality
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        let isSwiping = false;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isSwiping = true;
        });

        track.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
        
            const deltaX = e.touches[0].clientX - touchStartX;
            const deltaY = e.touches[0].clientY - touchStartY;
        
            // If it's a vertical scroll, don't interfere
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                isSwiping = false; // It's a scroll, not a swipe
                return;
            }
            // Prevent default to stop scrolling while swiping horizontally
            e.preventDefault();

        });

        track.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
        
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;
        
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const swipeThreshold = 50; // Minimum distance for a swipe
        
            // Check for horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
                if (deltaX < 0) {
                    // Swiped left
                    goToNext();
                } else {
                    // Swiped right
                    goToPrev();
                }
            }
            isSwiping = false;
        });

        window.addEventListener('resize', () => {
            slideWidth = slides[0].getBoundingClientRect().width;
            updateCarousel();
        });

        updateCarousel();
    }
});