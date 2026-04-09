document.addEventListener('DOMContentLoaded', () => {
    const heroForm = document.getElementById('waitlist-form-hero');
    const footerForm = document.getElementById('waitlist-form-footer');
    
    const heroFormContainer = document.getElementById('hero-form-container');
    const footerFormContainer = document.getElementById('footer-form-container');
    
    const successHero = document.getElementById('success-hero');
    const successFooter = document.getElementById('success-footer');

    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xgopbnee';

    const handleSubmit = async (e, container, successElement) => {
        e.preventDefault();
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value;
        const submitBtn = form.querySelector('button');

        if (!email || !email.includes('@')) return;

        // Visual feedback
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
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
                // Success
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
                // Error response
                const data = await response.json();
                throw new Error(data.error || 'Submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Something went wrong. Please try again or check your email address.');
            
            // Re-enable button
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
