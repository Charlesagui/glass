// IA DESLUMBRANTE - SISTEMA ULTRA OPTIMIZADO
// Performance-first approach con animaciones fluidas

(() => {
    'use strict';
    
    const APP = {
        config: {
            isMobile: window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent),
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            debug: false
        },
        
        performance: {
            frameTime: 16.67, // 60fps target
            lastFrame: 0,
            throttleTime: 16
        },
        
        state: {
            isInitialized: false,
            scrollY: 0,
            mouseX: 0,
            mouseY: 0,
            cursorVisible: true
        }
    };

    // ========================================
    // UTILITIES & PERFORMANCE
    // ========================================
    
    const Utils = {
        // Throttle optimizado para animaciones
        throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // RAF throttle para scroll y mouse
        rafThrottle(func) {
            let isScheduled = false;
            return function(...args) {
                if (!isScheduled) {
                    isScheduled = true;
                    requestAnimationFrame(() => {
                        func.apply(this, args);
                        isScheduled = false;
                    });
                }
            };
        },
        
        // Interpolación suave
        lerp(start, end, factor) {
            return start + (end - start) * factor;
        },
        
        // Mapear valores
        map(value, start1, stop1, start2, stop2) {
            return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
        },
        
        // Clamp valores
        clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        }
    };

    // ========================================
    // CURSOR SYSTEM - ULTRA OPTIMIZED
    // ========================================
    
    const CursorSystem = {
        elements: {},
        animation: null,
        
        init() {
            if (APP.config.isMobile || APP.config.reducedMotion) return;
            
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
                APP.state.mouseX = e.clientX;
                APP.state.mouseY = e.clientY;
            });
            
            document.addEventListener('mousemove', updateMouse, { passive: true });
            
            document.addEventListener('mouseleave', () => {
                APP.state.cursorVisible = false;
                this.elements.cursor.style.opacity = '0';
                this.elements.trail.style.opacity = '0';
            });
            
            document.addEventListener('mouseenter', () => {
                APP.state.cursorVisible = true;
                this.elements.cursor.style.opacity = '1';
                this.elements.trail.style.opacity = '1';
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
                if (!this.elements.cursor || !APP.state.cursorVisible) {
                    this.animation = requestAnimationFrame(animate);
                    return;
                }
                
                // Smooth cursor follow
                cursorX = Utils.lerp(cursorX, APP.state.mouseX, 0.15);
                cursorY = Utils.lerp(cursorY, APP.state.mouseY, 0.15);
                
                trailX = Utils.lerp(trailX, APP.state.mouseX, 0.08);
                trailY = Utils.lerp(trailY, APP.state.mouseY, 0.08);
                
                this.elements.cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
                this.elements.trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;
                
                this.animation = requestAnimationFrame(animate);
            };
            
            animate();
        }
    };

    // ========================================
    // SCROLL SYSTEM - SMOOTH & OPTIMIZED
    // ========================================
    
    const ScrollSystem = {
        current: 0,
        target: 0,
        ease: 0.08,
        
        init() {
            this.setupSmoothScroll();
            this.bindEvents();
        },
        
        setupSmoothScroll() {
            // Usar scroll-behavior nativo cuando sea posible
            document.documentElement.style.scrollBehavior = 'smooth';
            
            // Solo para desktop avanzado
            if (!APP.config.isMobile && !APP.config.reducedMotion) {
                this.enableAdvancedSmooth();
            }
        },
        
        enableAdvancedSmooth() {
            let scrollHeight = document.body.scrollHeight;
            
            const updateScrollHeight = Utils.throttle(() => {
                scrollHeight = document.body.scrollHeight;
            }, 100);
            
            window.addEventListener('resize', updateScrollHeight);
            
            const smoothUpdate = () => {
                this.current = Utils.lerp(this.current, this.target, this.ease);
                
                if (Math.abs(this.target - this.current) > 0.1) {
                    window.scrollTo(0, this.current);
                    requestAnimationFrame(smoothUpdate);
                }
            };
            
            // Wheel handler optimizado
            const handleWheel = Utils.throttle((e) => {
                e.preventDefault();
                this.target += e.deltaY * 0.8;
                this.target = Utils.clamp(this.target, 0, scrollHeight - window.innerHeight);
                
                smoothUpdate();
            }, 16);
            
            window.addEventListener('wheel', handleWheel, { passive: false });
        },
        
        bindEvents() {
            const updateScroll = Utils.rafThrottle(() => {
                APP.state.scrollY = window.pageYOffset;
                this.updateParallax();
            });
            
            window.addEventListener('scroll', updateScroll, { passive: true });
        },
        
        updateParallax() {
            const scrollPercent = APP.state.scrollY / (document.body.scrollHeight - window.innerHeight);
            
            // Parallax background
            document.body.style.setProperty('--scroll-percent', scrollPercent);
            
            // Aplicar efectos basados en scroll
            this.applyScrollEffects(scrollPercent);
        },
        
        applyScrollEffects(percent) {
            // Efecto de hue rotation en el background
            if (!APP.config.reducedMotion) {
                document.body.style.filter = `hue-rotate(${percent * 60}deg)`;
            }
        }
    };

    // ========================================
    // ANIMATION SYSTEM - GSAP OPTIMIZED
    // ========================================
    
    const AnimationSystem = {
        timelines: {},
        
        init() {
            if (typeof gsap === 'undefined') {
                console.warn('GSAP not loaded, using fallback animations');
                this.initFallbackAnimations();
                return;
            }
            
            gsap.registerPlugin(ScrollTrigger);
            this.setupGSAPAnimations();
        },
        
        setupGSAPAnimations() {
            // Configuración global optimizada
            gsap.config({ nullTargetWarn: false });
            gsap.defaults({ ease: "power2.out", duration: 0.8 });
            
            this.animateHero();
            this.animateSections();
            this.animateElements();
        },
        
        animateHero() {
            const hero = document.getElementById('hero');
            if (!hero) return;
            
            const orb = hero.querySelector('.hero-orb');
            const title = hero.querySelector('h1');
            const subtitle = hero.querySelector('p');
            
            // Animación continua del orbe
            if (orb) {
                gsap.to(orb, {
                    rotation: 360,
                    duration: 20,
                    repeat: -1,
                    ease: "none"
                });
                
                // Efecto de pulsación
                gsap.to(orb, {
                    scale: 1.1,
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }
            
            // Parallax del hero
            ScrollTrigger.create({
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    if (orb) gsap.set(orb, { y: progress * 100, opacity: 1 - progress });
                    if (title) gsap.set(title, { y: progress * 50, opacity: 1 - progress * 0.5 });
                    if (subtitle) gsap.set(subtitle, { y: progress * 30, opacity: 1 - progress * 0.3 });
                }
            });
        },
        
        animateSections() {
            const sections = document.querySelectorAll('section');
            
            sections.forEach((section, index) => {
                const title = section.querySelector('h2');
                const content = section.querySelector('p');
                const animation = section.querySelector('.neural-network-animation, .data-flow-animation, .closing-animation-container');
                
                // Configuración inicial
                gsap.set([title, content, animation], { y: 50, opacity: 0 });
                
                // Timeline de entrada
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        end: "top 20%",
                        toggleActions: "play none none reverse"
                    }
                });
                
                if (title) tl.to(title, { y: 0, opacity: 1, duration: 0.6 });
                if (animation) tl.to(animation, { y: 0, opacity: 1, duration: 0.8 }, "-=0.4");
                if (content) tl.to(content, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3");
            });
        },
        
        animateElements() {
            // Nodos neuronales
            const nnNodes = document.querySelectorAll('.nn-node');
            nnNodes.forEach((node, index) => {
                gsap.to(node, {
                    scale: 1.2,
                    duration: 1.5 + index * 0.2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: index * 0.1
                });
            });
            
            // Partículas de flujo optimizadas
            this.animateFlowParticles();
            
            // Fragmentos de cierre
            this.animateClosingFragments();
        },
        
        animateFlowParticles() {
            const particles = document.querySelectorAll('.flow-particle');
            const colors = ['#00f6ff', '#ff00e0', '#00ff88', '#ff4400'];
            
            particles.forEach((particle, index) => {
                const size = Utils.map(Math.random(), 0, 1, 6, 14);
                
                gsap.set(particle, {
                    width: size,
                    height: size,
                    backgroundColor: colors[index % colors.length],
                    x: Math.random() * 200,
                    y: Math.random() * 100,
                    borderRadius: '50%',
                    boxShadow: `0 0 10px ${colors[index % colors.length]}`
                });
                
                // Movimiento fluido
                gsap.to(particle, {
                    x: `+=${Utils.map(Math.random(), 0, 1, -100, 100)}`,
                    y: `+=${Utils.map(Math.random(), 0, 1, -50, 50)}`,
                    scale: Utils.map(Math.random(), 0, 1, 0.8, 1.4),
                    duration: Utils.map(Math.random(), 0, 1, 3, 6),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: Math.random() * 2
                });
            });
        },
        
        animateClosingFragments() {
            const fragments = document.querySelectorAll('.closing-fragment');
            const colors = ['#00f6ff', '#ff00e0', '#ffffff', '#00ff88'];
            
            fragments.forEach((fragment, index) => {
                const angle = (index / fragments.length) * Math.PI * 2;
                const radius = 80;
                const centerX = Math.cos(angle) * radius;
                const centerY = Math.sin(angle) * radius;
                
                gsap.set(fragment, {
                    width: 12,
                    height: 12,
                    backgroundColor: colors[index % colors.length],
                    borderRadius: '50%',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    x: centerX,
                    y: centerY,
                    boxShadow: `0 0 15px ${colors[index % colors.length]}`
                });
                
                // Rotación orbital
                gsap.to(fragment, {
                    rotation: 360,
                    transformOrigin: `${-centerX}px ${-centerY}px`,
                    duration: 8 + index,
                    repeat: -1,
                    ease: "none"
                });
                
                // Pulsación
                gsap.to(fragment, {
                    scale: 1.5,
                    duration: 1 + index * 0.2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            });
        },
        
        initFallbackAnimations() {
            // Animaciones CSS puras como fallback
            const style = document.createElement('style');
            style.textContent = `
                .hero-orb { animation: rotate 20s linear infinite; }
                .nn-node { animation: pulse 2s ease-in-out infinite; }
                .flow-particle { animation: float 4s ease-in-out infinite; }
                
                @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
            `;
            document.head.appendChild(style);
        }
    };

    // ========================================
    // MAIN INITIALIZATION
    // ========================================
    
    const initApp = () => {
        if (APP.state.isInitialized) return;
        
        console.log('🚀 IA Deslumbrante - Ultra Optimized System Starting...');
        
        // Optimizar el rendering inicial
        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';
        
        // Inicializar sistemas
        CursorSystem.init();
        ScrollSystem.init();
        AnimationSystem.init();
        
        // Performance monitoring
        if (APP.config.debug) {
            const stats = new Stats();
            document.body.appendChild(stats.dom);
        }
        
        APP.state.isInitialized = true;
        console.log('✅ Sistema ultra optimizado activado');
    };
    
    // Inicializar cuando esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
    
    // Refresh en resize
    window.addEventListener('resize', Utils.throttle(() => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 250));
    
})();