'use strict';

export function setupLazyLoading() {
    const lazyElements = document.querySelectorAll('.fade-in-scroll');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        lazyElements.forEach(el => observer.observe(el));
    } else {
        // Fallback para navegadores sin IntersectionObserver
        lazyElements.forEach(el => el.classList.add('visible'));
    }
}
