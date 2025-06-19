'use strict';

import { config, state } from './config.js';
import { Utils } from './utils.js';

export const ScrollSystem = {
    current: 0,
    target: 0,
    ease: 0.08,
    
    init() {
        this.setupSmoothScroll();
        this.bindEvents();
    },
    
    setupSmoothScroll() {
        // SCROLL NATIVO PURO - Sin smooth behavior que pueda causar saltos
        console.log('ScrollSystem: Usando scroll nativo PURO sin smooth para evitar saltos.');
        document.documentElement.style.scrollBehavior = 'auto';
        
        // COMPLETAMENTE DESHABILITADO: Todo scroll personalizado
        // Solo scroll nativo del navegador
    },
    
    enableAdvancedSmooth() {
        let scrollHeight = document.body.scrollHeight;
        let isScrolling = false;
        let animationFrameId = null;
        let velocity = 0;
        let lastTime = 0;
        
        // Update scroll height on resize with debounce
        const updateScrollHeight = Utils.throttle(() => {
            scrollHeight = document.body.scrollHeight;
            this.target = Utils.clamp(this.target, 0, scrollHeight - window.innerHeight);
        }, 100);
        
        // Smooth update function with momentum
        const smoothUpdate = (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;
            
            // Apply momentum
            velocity += (this.target - this.current) * 0.1;
            velocity *= 0.85; // Friction
            
            this.current += velocity;
            
            // Apply easing
            this.current = Utils.lerp(this.current, this.target, 0.1);
            
            // Apply scroll
            window.scrollTo(0, this.current);
            
            // Continue animation if needed
            if (Math.abs(velocity) > 0.1 || Math.abs(this.target - this.current) > 0.5) {
                animationFrameId = requestAnimationFrame(smoothUpdate);
            } else {
                isScrolling = false;
                this.current = window.scrollY;
                this.target = this.current;
            }
        };
        
        // Handle wheel events
        const handleWheel = (e) => {
            if (e.ctrlKey) return; // Allow zooming
            
            e.preventDefault();
            
            // Apply momentum
            velocity += e.deltaY * 0.2;
            this.target += e.deltaY * 0.8;
            this.target = Utils.clamp(this.target, 0, scrollHeight - window.innerHeight);
            
            // Start animation if not already running
            if (!isScrolling) {
                isScrolling = true;
                lastTime = 0;
                animationFrameId = requestAnimationFrame(smoothUpdate);
            }
        };
        
        // Add event listeners
        window.addEventListener('resize', updateScrollHeight, { passive: true });
        window.addEventListener('wheel', handleWheel, { passive: false });
        
        // Cleanup function
        this.cleanupSmoothScroll = () => {
            window.removeEventListener('resize', updateScrollHeight);
            window.removeEventListener('wheel', handleWheel);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    },
    
    bindEvents() {
        // DESHABILITADO: Eventos de scroll que pueden causar saltos
        console.log('ScrollSystem: Eventos de parallax deshabilitados para máxima fluidez.');
        
        // El scroll nativo maneja todo automáticamente
        // Sin parallax ni efectos que interfieran con el scroll
    },
    
    updateParallax() {
        // DESHABILITADO: Efectos de parallax que causan saltos
        // Sin modificaciones de CSS durante el scroll
    },
    
    applyScrollEffects(percent) {
        // DESHABILITADO: Efectos de scroll que causan saltos
        // Sin hue rotation ni otros efectos durante scroll
    }
};
