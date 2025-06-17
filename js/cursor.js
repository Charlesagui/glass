'use strict';

import { config, state } from './config.js';
import { Utils } from './utils.js';

export const CursorSystem = {
    elements: {},
    animation: null,
    
    init() {
        if (config.isMobile || config.reducedMotion) return;
        
        this.createElement();
        this.bindEvents();
        this.startAnimation();
    },
    
    createElement() {
        // Cursor principal
        this.elements.cursor = document.createElement('div');
        this.elements.cursor.className = 'cursor-ultra';
        this.elements.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, #00f6ff, #ff00e0);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: screen;
            transform: translate3d(-50%, -50%, 0);
            transition: transform 0.1s ease-out;
            will-change: transform;
            box-shadow: 0 0 20px rgba(0, 246, 255, 0.8);
        `;
        
        // Trail del cursor
        this.elements.trail = document.createElement('div');
        this.elements.trail.className = 'cursor-trail-ultra';
        this.elements.trail.style.cssText = `
            position: fixed;
            width: 40px;
            height: 40px;
            background: radial-gradient(circle, transparent 60%, rgba(0, 246, 255, 0.3) 70%, transparent 80%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transform: translate3d(-50%, -50%, 0);
            transition: transform 0.15s ease-out;
            will-change: transform;
        `;
        
        document.body.appendChild(this.elements.cursor);
        document.body.appendChild(this.elements.trail);
        document.body.style.cursor = 'none';
    },
    
    bindEvents() {
        const updateMouse = Utils.rafThrottle((e) => {
            state.mouseX = e.clientX;
            state.mouseY = e.clientY;
        });
        
        document.addEventListener('mousemove', updateMouse, { passive: true });
        
        document.addEventListener('mouseleave', () => {
            state.cursorVisible = false;
            if (this.elements.cursor) this.elements.cursor.style.opacity = '0';
            if (this.elements.trail) this.elements.trail.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            state.cursorVisible = true;
            if (this.elements.cursor) this.elements.cursor.style.opacity = '1';
            if (this.elements.trail) this.elements.trail.style.opacity = '1';
        });
        
        // Efectos de hover optimizados
        this.setupHoverEffects();
    },
    
    setupHoverEffects() {
        const interactives = document.querySelectorAll('h1, h2, p, button, .hero-orb');
        
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (!this.elements.cursor) return;
                this.elements.cursor.style.transform = 'translate3d(-50%, -50%, 0) scale(1.5)';
                this.elements.cursor.style.backgroundColor = '#ff00e0';
            });
            
            el.addEventListener('mouseleave', () => {
                if (!this.elements.cursor) return;
                this.elements.cursor.style.transform = 'translate3d(-50%, -50%, 0) scale(1)';
                this.elements.cursor.style.background = 'radial-gradient(circle, #00f6ff, #ff00e0)';
            });
        });
    },
    
    startAnimation() {
        let cursorX = 0, cursorY = 0;
        let trailX = 0, trailY = 0;
        
        const animate = () => {
            if (!this.elements.cursor || !state.cursorVisible) {
                this.animation = requestAnimationFrame(animate);
                return;
            }
            
            // Smooth cursor follow
            cursorX = Utils.lerp(cursorX, state.mouseX, 0.15);
            cursorY = Utils.lerp(cursorY, state.mouseY, 0.15);
            
            trailX = Utils.lerp(trailX, state.mouseX, 0.08);
            trailY = Utils.lerp(trailY, state.mouseY, 0.08);
            
            this.elements.cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
            this.elements.trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;
            
            this.animation = requestAnimationFrame(animate);
        };
        
        animate();
    }
};
