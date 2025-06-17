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
        // Forzar scroll nativo para probar la fluidez y detección
        console.log('ScrollSystem: Forzando scroll nativo suave.');
        document.documentElement.style.scrollBehavior = 'smooth';
        // Comentamos la lógica anterior para desactivar el scroll personalizado temporalmente
        /*
        if (!config.isMobile && !config.reducedMotion) {
            this.enableAdvancedSmooth();
        } else {
            document.documentElement.style.scrollBehavior = 'smooth';
        }
        */
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
        const updateScroll = Utils.rafThrottle(() => {
            state.scrollY = window.pageYOffset;
            this.updateParallax();
        });
        
        window.addEventListener('scroll', updateScroll, { passive: true });
    },
    
    updateParallax() {
        const scrollPercent = state.scrollY / (document.body.scrollHeight - window.innerHeight);
        
        // Parallax background
        document.body.style.setProperty('--scroll-percent', scrollPercent);
        
        // Aplicar efectos basados en scroll
        this.applyScrollEffects(scrollPercent);
    },
    
    applyScrollEffects(percent) {
        // Efecto de hue rotation en el background
        if (!config.reducedMotion) {
            // Comentamos temporalmente para probar rendimiento
            // document.body.style.filter = `hue-rotate(${percent * 60}deg)`;
            // console.log('Hue rotate effect disabled for performance test'); 
        }
    }
};
