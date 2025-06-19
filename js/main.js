'use strict';

import { config, state } from './config.js';
import { Utils } from './utils.js';
// Cursor personalizado eliminado
import { ScrollSystem } from './scroll.js';
import { AnimationSystem } from './animations.js';
import { setupLazyLoading } from './lazyLoad.js';
import './parallax.js';

// GSAP and ScrollTrigger are expected to be loaded, potentially dynamically.

const init = () => {
    if (state.isInitialized) return;
    
    console.log('🚀 Iniciando aplicación modular...');

    document.body.style.opacity = '1';
    document.body.classList.remove('loading');
    
    setupLazyLoading();
    
    console.log('🚀 IA Deslumbrante - App Visible y Lazy Loading Configurado (Modular)');
    
    try {
        // CursorSystem eliminado
        ScrollSystem.init();
        
        // AnimationSystem.init() will be called after GSAP is confirmed loaded in startApp
        // If GSAP is already present, AnimationSystem.init() will be called by startApp directly.

        state.isInitialized = true;
        console.log('✅ Aplicación inicializada (Sistemas base)');
        
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                console.log('Optimizaciones de rendimiento aplicadas (Modular)');
            });
        }
        
        // Initialize service worker in production-like environments
        // Note: process.env.NODE_ENV is typically set by a build tool.
        // For pure client-side, you might check hostname or a config flag.
        if ('serviceWorker' in navigator && (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')) {
            navigator.serviceWorker.register('/service-worker.js') // Ensure service-worker.js is in the root
                .then(registration => {
                    console.log('ServiceWorker registrado correctamente (Modular)');
                })
                .catch(error => {
                    console.error('Error al registrar ServiceWorker (Modular):', error);
                });
        }
    } catch (e) {
        console.error("Error during initialization (Modular)", e);
        state.isInitialized = true; // Avoid re-running init on error
    }
};

const setupScrollOptimization = () => {
    let isScrolling;
    window.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        if (typeof gsap !== 'undefined' && gsap.globalTimeline) {
            gsap.globalTimeline.pause();
        }

        isScrolling = setTimeout(() => {
            if (typeof gsap !== 'undefined' && gsap.globalTimeline) {
                gsap.globalTimeline.resume();
            }
        }, 150);
    }, { passive: true });
};

const handleResize = Utils.throttle(() => {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
    // Potentially re-calculate/adjust other layout-dependent things here
    console.log('Handled resize (Modular)');
}, 250);

window.addEventListener('resize', handleResize);

const startApp = () => {
    const initializeWithGsap = () => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            try {
                // Registrar plugins disponibles
                gsap.registerPlugin(ScrollTrigger);
                if (typeof MotionPathPlugin !== 'undefined') {
                    gsap.registerPlugin(MotionPathPlugin);
                    console.log('MotionPathPlugin registrado correctamente');
                }
                AnimationSystem.init(); // Initialize animations now that GSAP is ready
            } catch (error) {
                console.error('Error al inicializar GSAP o AnimationSystem (Modular):', error);
                AnimationSystem.initFallbackAnimations();
            }
        } else {
            console.warn('GSAP no está disponible, usando animaciones alternativas (Modular)');
            AnimationSystem.initFallbackAnimations();
        }
        init(); // Initialize core app logic
        setupScrollOptimization();
    };

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.log('Cargando GSAP dinámicamente (Modular)...');
        const gsapScript = document.createElement('script');
        gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        gsapScript.async = true;
        
        gsapScript.onload = () => {
            console.log('GSAP cargado.');
            // Asegurándonos de que GSAP esté completamente cargado antes de continuar
            if (typeof gsap === 'undefined') {
                console.error('GSAP no se cargó correctamente');
                initializeWithGsap();
                return;
            }
            
            // Cargar ScrollTrigger
            const stScript = document.createElement('script');
            stScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
            stScript.async = true;
            stScript.onload = () => {
                console.log('ScrollTrigger cargado.');
                
                // Cargar MotionPathPlugin
                const mpScript = document.createElement('script');
                mpScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/MotionPathPlugin.min.js';
                mpScript.async = true;
                mpScript.onload = () => {
                    console.log('MotionPathPlugin cargado.');
                    initializeWithGsap();
                };
                mpScript.onerror = () => {
                    console.warn('MotionPathPlugin falló al cargar, continuando sin él.');
                    initializeWithGsap();
                };
                document.head.appendChild(mpScript);
            };
            stScript.onerror = () => {
                console.error('Error cargando ScrollTrigger. Usando fallbacks.');
                initializeWithGsap(); // Attempt to init with what we have, or fallbacks
            };
            document.head.appendChild(stScript);
        };
        gsapScript.onerror = () => {
            console.error('Error cargando GSAP. Usando fallbacks.');
            initializeWithGsap(); // Attempt to init with fallbacks
        };
        document.head.appendChild(gsapScript);
    } else {
        console.log('GSAP y ScrollTrigger ya disponibles (Modular).');
        initializeWithGsap();
    }
};

// Iniciar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    setTimeout(startApp, 0); // Ensure it runs after current script block
}

// Exponer API pública si es necesario para debugging o extensiones
const publicAPI = {
    init,
    config,
    state,
    utils: Utils,
    // CursorSystem eliminado,
    ScrollSystem,
    AnimationSystem,
    setupLazyLoading
};

window.APP = publicAPI;
console.log('APP API expuesta en window.APP (Modular)');

// Limpiar al cerrar la página
window.addEventListener('beforeunload', () => {
    if (AnimationSystem && typeof AnimationSystem.cleanup === 'function') {
        console.log('Ejecutando cleanup de AnimationSystem antes de salir (Modular)...');
        AnimationSystem.cleanup();
    }
});
