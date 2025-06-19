'use strict';

/**
 * ScrollReveal - Sistema de animaciones de aparición modernas
 * Usa Intersection Observer para máximo rendimiento
 */

export const ScrollReveal = {
    observer: null,
    elements: new Map(),
    lastScrollY: 0,
    scrollDirection: 'down',
    isMobile: false,
    
    init() {
        this.isMobile = this.detectMobile();
        this.lastScrollY = window.scrollY;
        
        // CRÍTICO: Ocultar elementos INMEDIATAMENTE para evitar FOUC
        this.hideElementsImmediately();
        
        this.trackScrollDirection();
        this.setupObserver();
        this.observeElements();
        console.log(`ScrollReveal inicializado - ${this.isMobile ? 'Móvil' : 'Desktop'}`);
    },
    
    hideElementsImmediately() {
        // Aplicar scroll-hidden a todos los elementos target ANTES de que sean visibles
        const selectors = ['h1', 'h2', 'p', '.hero-orb', '.neural-network-animation', 
                          '.data-flow-animation', '.closing-animation-container', 
                          '.contact-details', 'footer'];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('scroll-hidden');
                // Force immediate style application
                element.offsetHeight; // Trigger reflow
            });
        });
    },
    
    detectMobile() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               ('ontouchstart' in window);
    },
    
    trackScrollDirection() {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            this.scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
            this.lastScrollY = currentScrollY;
        }, { passive: true });
        
        // Detectar cambios de orientación en móviles
        if (this.isMobile) {
            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    this.isMobile = this.detectMobile();
                    // Reconfigurar observer después del cambio de orientación
                    if (this.observer) {
                        this.observer.disconnect();
                        this.setupObserver();
                        // Re-observar elementos
                        this.elements.forEach((config, element) => {
                            this.observer.observe(element);
                        });
                    }
                }, 500); // Delay para que termine la animación de orientación
            });
        }
    },
    
    setupObserver() {
        // Configuración optimizada según el dispositivo
        const options = {
            root: null,
            // Móvil: trigger más temprano para compensar scroll táctil
            rootMargin: this.isMobile ? '-5% 0px -5% 0px' : '-15% 0px -15% 0px',
            threshold: this.isMobile ? [0, 0.05, 0.15, 0.3] : [0, 0.1, 0.25, 0.5, 0.75, 1]
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const config = this.elements.get(element);
                
                // Móvil: threshold más bajo para activación más temprana
                const threshold = this.isMobile ? 0.05 : 0.1;
                
                if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
                    this.revealElement(element, config);
                } else if (!entry.isIntersecting && config.revealed) {
                    // Ocultar cuando sale de vista
                    this.hideElement(element, config);
                }
            });
        }, options);
    },
    
    observeElements() {
        // Configurar elementos para animar con delays optimizados para móvil
        const elementsConfig = [
            {
                selector: 'h1',
                animation: 'fadeInUp',
                delay: this.isMobile ? 50 : 100
            },
            {
                selector: 'h2',
                animation: 'fadeInUp',
                delay: this.isMobile ? 100 : 200
            },
            {
                selector: 'p',
                animation: 'fadeInUp',
                delay: this.isMobile ? 150 : 300
            },
            {
                selector: '.hero-orb',
                animation: 'fadeInScale',
                delay: 0
            },
            {
                selector: '.neural-network-animation',
                animation: 'fadeInRight',
                delay: this.isMobile ? 200 : 400
            },
            {
                selector: '.data-flow-animation',
                animation: 'fadeInLeft',
                delay: this.isMobile ? 200 : 400
            },
            {
                selector: '.closing-animation-container',
                animation: 'fadeInScale',
                delay: this.isMobile ? 250 : 500
            },
            {
                selector: '.contact-details',
                animation: 'fadeInUp',
                delay: this.isMobile ? 150 : 300
            },
            {
                selector: 'footer',
                animation: 'fadeInUp',
                delay: this.isMobile ? 100 : 200
            }
        ];
        
        elementsConfig.forEach(config => {
            const elements = document.querySelectorAll(config.selector);
            elements.forEach((element, index) => {
                // NO agregar scroll-hidden aquí - ya se agregó en hideElementsImmediately()
                // Solo verificar que la clase esté presente
                if (!element.classList.contains('scroll-hidden')) {
                    element.classList.add('scroll-hidden');
                }
                
                // Configurar delay staggered - más corto en móvil
                const staggerDelay = config.delay + (index * (this.isMobile ? 75 : 150));
                this.elements.set(element, {
                    ...config,
                    delay: staggerDelay,
                    revealed: false
                });
                
                // Observar el elemento
                this.observer.observe(element);
            });
        });
    },
    
    revealElement(element, config) {
        if (config.revealed) return;
        
        config.revealed = true;
        
        // Delay más corto para móviles y scroll hacia arriba
        let delay = config.delay;
        if (this.isMobile) {
            delay = Math.min(delay, 100); // Máximo 100ms en móvil
        }
        if (this.scrollDirection === 'up') {
            delay = Math.min(delay, this.isMobile ? 50 : 100);
        }
        
        setTimeout(() => {
            element.classList.remove('scroll-hidden');
            element.classList.add('scroll-revealed', `animate-${config.animation}`);
            
            // Limpiar clases después de la animación - más rápido en móvil
            const cleanupDelay = this.isMobile ? 500 : 800;
            setTimeout(() => {
                element.classList.remove(`animate-${config.animation}`);
            }, cleanupDelay);
            
        }, delay);
        
        // NO dejar de observar - mantener observando para animaciones bidireccionales
    },
    
    hideElement(element, config) {
        config.revealed = false;
        
        // Agregar clase de salida suave
        element.classList.remove('scroll-revealed');
        element.classList.add('scroll-hidden', 'animate-fadeOut');
        
        // Limpiar clases después de la animación
        setTimeout(() => {
            element.classList.remove('animate-fadeOut');
        }, 600);
    },
    
    cleanup() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.elements.clear();
        console.log('ScrollReveal cleanup completado');
    }
};
