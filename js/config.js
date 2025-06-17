'use strict';

// Configuración global
export const config = {
    isMobile: window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent),
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    debug: false
};

// Estado de la aplicación
export const state = {
    isInitialized: false,
    scrollY: 0,
    mouseX: 0,
    mouseY: 0,
    cursorVisible: true
};
