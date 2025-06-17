/**
 * IA DESLUMBRANTE - SISTEMA ULTRA OPTIMIZADO
 * Performance-first approach con animaciones fluidas
 */

'use strict';

// Objeto principal de la aplicación
const APP = (() => {
    'use strict';
    
    // Configuración global
    const config = {
        isMobile: window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent),
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        debug: false
    };
    
    // Estado de la aplicación
    const state = {
        isInitialized: false,
        scrollY: 0,
        mouseX: 0,
        mouseY: 0,
        cursorVisible: true
    };
    
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
        animations: [],
        
        init() {
            // Check for reduced motion preference
            if (APP.config.reducedMotion) {
                this.initReducedMotion();
                return;
            }
            
            // Check if GSAP is available
            if (typeof gsap === 'undefined') {
                console.warn('GSAP not loaded, using fallback animations');
                this.initFallbackAnimations();
                return;
            }
            
            try {
                gsap.registerPlugin(ScrollTrigger);
                this.setupGSAPAnimations();
                this.setupPerformanceMonitoring();
            } catch (error) {
                console.error('Error initializing GSAP:', error);
                this.initFallbackAnimations();
            }
        },
        
        setupGSAPAnimations() {
            // Optimized global configuration
            gsap.config({
                nullTargetWarn: false,
                autoSleep: 60, // Better performance for inactive animations
                force3D: 'auto', // Let GSAP decide when to use 3D transforms
                autoKernelSize: 10 // Optimize for performance
            });
            
            // Set default animation properties for better performance
            gsap.defaults({
                ease: "power2.out",
                duration: 0.8,
                overwrite: 'auto',
                force3D: true // Use 3D transforms for better performance
            });
            
            // Setup animations with priority
            this.animateHero();
            
            // Defer less critical animations
            requestIdleCallback(() => {
                this.animateSections();
                this.animateElements();
                this.animateFlowParticles();
            });
        },
        
        animateHero() {
            const hero = document.getElementById('hero');
            if (!hero) return;
            
            const orb = hero.querySelector('.hero-orb');
            const title = hero.querySelector('h1');
            const subtitle = hero.querySelector('p');
            
            // Optimize hero animations with will-change
            if (orb) {
                orb.style.willChange = 'transform, opacity';
                
                // Use a single timeline for better performance
                const heroTimeline = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
                
                // Continuous rotation with better performance
                heroTimeline.to(orb, {
                    rotation: 360,
                    duration: 40, // Slower rotation is more performant
                    repeat: -1,
                    ease: 'none',
                    transformOrigin: 'center',
                    force3D: true
                }, 0);
                
                // Pulsation effect with better performance
                heroTimeline.to(orb, {
                    scale: 1.05, // Smaller scale difference is more performant
                    duration: 3, // Slower animation is more performant
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    force3D: true
                }, 0);
                
                // Store the timeline for later cleanup
                this.timelines.hero = heroTimeline;
                this.animations.push(heroTimeline);
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
        
        // Initialize reduced motion mode
        initReducedMotion() {
            console.log('Reduced motion mode activated');
            document.documentElement.classList.add('reduced-motion');
            this.initFallbackAnimations();
        },
        
        // Setup performance monitoring
        setupPerformanceMonitoring() {
            if (window.performance) {
                // Monitor frame rate
                let lastTime = performance.now();
                let frameCount = 0;
                
                const checkFPS = () => {
                    frameCount++;
                    const now = performance.now();
                    const delta = now - lastTime;
                    
                    if (delta >= 1000) { // Log FPS every second
                        const fps = Math.round((frameCount * 1000) / delta);
                        if (fps < 45) {
                            console.warn(`Low FPS: ${fps}. Consider reducing animation load.`);
                        }
                        frameCount = 0;
                        lastTime = now;
                    }
                    
                    requestAnimationFrame(checkFPS);
                };
                
                requestAnimationFrame(checkFPS);
            }
        },
        
        // Fallback animations for when GSAP is not available
        initFallbackAnimations() {
            console.log('Initializing fallback animations');
            
            // Simple fade-in for sections
            const sections = document.querySelectorAll('section, header');
            sections.forEach(section => {
                section.style.opacity = '1';
                section.style.transition = 'opacity 0.5s ease-in-out';
            });
            
            // Simple pulse animation for interactive elements
            const interactiveElements = document.querySelectorAll('.interactive');
            interactiveElements.forEach(el => {
                el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                el.addEventListener('mouseenter', () => {
                    el.style.transform = 'scale(1.05)';
                });
                el.addEventListener('mouseleave', () => {
                    el.style.transform = 'scale(1)';
                });
            });
        },
        
        // Animate neural network nodes and other interactive elements
        // Animate flow particles with optimized performance
        animateFlowParticles() {
            const containers = document.querySelectorAll('.data-flow-animation');
            if (!containers.length) return;
            
            // Create a master timeline for flow particles
            const flowTl = gsap.timeline({
                defaults: {
                    ease: 'none',
                    force3D: true
                },
                onComplete: () => {
                    // Clean up will-change after animations complete
                    containers.forEach(container => {
                        container.style.willChange = 'auto';
                    });
                }
            });
            
            containers.forEach((container, containerIndex) => {
                // Optimize container
                container.style.willChange = 'transform, opacity';
                container.style.transform = 'translateZ(0)';
                
                // Clear existing particles to avoid duplicates
                container.innerHTML = '';
                
                // Create new particles with optimized count based on container size
                const rect = container.getBoundingClientRect();
                const area = rect.width * rect.height;
                const particleCount = Math.min(20, Math.max(5, Math.floor(area / 5000))); // 1 particle per 5000px², min 5, max 20
                
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'flow-particle gpu-accelerated';
                    
                    // Random properties with better distribution
                    const size = 1 + Math.random() * 3; // Smaller particles for better performance
                    const posX = Math.random() * 100;
                    const posY = Math.random() * 100;
                    const duration = 4 + Math.random() * 3; // Slower movement
                    const delay = Math.random() * -5;
                    const distance = 20 + Math.random() * 30; // Reduced travel distance
                    
                    // Apply styles with hardware acceleration
                    Object.assign(particle.style, {
                        position: 'absolute',
                        width: `${size}px`,
                        height: `${size}px`,
                        background: `hsl(${180 + Math.random() * 60}, 80%, 60%)`,
                        borderRadius: '50%',
                        left: `${posX}%`,
                        top: `${posY}%`,
                        willChange: 'transform, opacity',
                        pointerEvents: 'none',
                        opacity: 0.6,
                        filter: 'blur(0.5px)',
                        transform: 'translateZ(0)',
                        zIndex: 1
                    });
                    
                    container.appendChild(particle);
                    
                    // Animate particle with optimized properties
                    const angle = Math.random() * Math.PI * 2;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    
                    flowTl.to(particle, {
                        x: `+=${x}%`,
                        y: `+=${y}%`,
                        opacity: 0.3,
                        duration: duration,
                        delay: delay,
                        ease: 'sine.inOut',
                        repeat: -1,
                        yoyo: true,
                        force3D: true
                    }, containerIndex * 0.1);
                }
            });
            
            // Store the timeline for cleanup
            this.timelines.flowParticles = flowTl;
            this.animations.push(flowTl);
            
            return flowTl;
        },
        
        // Initialize all animations
        init() {
            try {
                // Check for reduced motion preference
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    this.initReducedMotion();
                    return;
                }
                
                // Check if GSAP is available
                if (typeof gsap === 'undefined') {
                    console.warn('GSAP not loaded, using fallback animations');
                    this.initFallbackAnimations();
                    return;
                }
                
                try {
                    gsap.registerPlugin(ScrollTrigger);
                    this.setupGSAPAnimations();
                    this.setupPerformanceMonitoring();
                } catch (error) {
                    console.error('Error initializing GSAP:', error);
                    this.initFallbackAnimations();
                }
                
                console.log('AnimationSystem initialized successfully');
                
            } catch (error) {
                console.error('Error initializing AnimationSystem:', error);
                // Fallback to reduced motion on error
                this.initFallbackAnimations();
            }
        },
        
        // Setup GSAP with performance optimizations
        setupGSAP() {
            // Configure GSAP for better performance
            gsap.config({
                autoSleep: 60, // Auto-sleep after 60fps
                force3D: true, // Force 3D transforms
                nullTargetWarn: false, // Disable null target warnings
                autoKernelSize: 1000, // Optimize animation batching
                autoRevert: false // Better performance for non-reversing animations
            });
            
            // Register plugins if needed
            if (typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
                
                // Configure ScrollTrigger for better performance
                ScrollTrigger.config({
                    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
                    ignoreMobileResize: true,
                    syncCallbacks: true
                });
            }
        },
        
        // Animate neural network nodes and connections
        animateElements() {
            try {
                // Neural network nodes with optimized animations
                const nnContainers = document.querySelectorAll('.neural-network-animation');
                if (!nnContainers.length) return;
                
                // Create a master timeline for better control
                const masterTl = gsap.timeline({
                    defaults: { 
                        ease: 'power2.inOut',
                        force3D: true
                    },
                    onComplete: () => {
                        // Clean up will-change after animations complete
                        nnContainers.forEach(container => {
                            container.style.willChange = 'auto';
                        });
                    }
                });
                
                nnContainers.forEach((container, containerIndex) => {
                    // Optimize container
                    container.style.willChange = 'transform, opacity';
                    container.style.transform = 'translateZ(0)';
                    
                    // Animate nodes with staggered delay
                    const nodes = container.querySelectorAll('.nn-node');
                    nodes.forEach((node, nodeIndex) => {
                        // Optimize with will-change and transform
                        node.style.willChange = 'transform, opacity';
                        node.style.transform = 'translateZ(0)';
                        
                        // Add to master timeline with staggered start
                        masterTl.to(node, {
                            scale: 1.15,
                            duration: 2,
                            repeat: -1,
                            yoyo: true,
                            ease: 'sine.inOut',
                            delay: nodeIndex * 0.1
                        }, containerIndex * 0.1);
                    });
                    
                    // Animate connections
                    const connections = container.querySelectorAll('.nn-connections-1, .nn-connections-2');
                    connections.forEach((conn, connIndex) => {
                        conn.style.willChange = 'opacity';
                        masterTl.to(conn, {
                            opacity: 0.7,
                            duration: 2,
                            repeat: -1,
                            yoyo: true,
                            ease: 'sine.inOut',
                            delay: connIndex * 0.05
                        }, containerIndex * 0.1);
                    });
                });
                
                // Store the master timeline for potential cleanup
                this.timelines.neuralNetwork = masterTl;
                this.animations.push(masterTl);
                
                // Setup hover effects for interactive elements
                this.setupHoverEffects();
                
                return masterTl;
                
            } catch (error) {
                console.error('Error in animateElements:', error);
                // Fallback to simple animations on error
                this.initFallbackAnimations();
            }
        },
        
        // Setup hover effects for interactive elements
        setupHoverEffects() {
            const interactiveElements = document.querySelectorAll('.interactive');
            
            interactiveElements.forEach(el => {
                // Only set up if not already done
                if (el.dataset.hoverInitialized) return;
                el.dataset.hoverInitialized = 'true';
                
                el.style.willChange = 'transform, opacity';
                el.style.transform = 'translateZ(0)';
                
                // Store the animation for cleanup
                const hoverTl = gsap.timeline({ paused: true });
                hoverTl.to(el, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                // Store for cleanup
                this.hoverAnimations.set(el, hoverTl);
                
                // Add event listeners
                el.addEventListener('mouseenter', () => hoverTl.play());
                el.addEventListener('mouseleave', () => hoverTl.reverse());
                el.addEventListener('touchstart', () => hoverTl.play());
                el.addEventListener('touchend', () => hoverTl.reverse());
            });
        },
        
        // Clean up all animations
        cleanup() {
            // Kill all GSAP animations
            this.animations.forEach(anim => {
                if (anim && anim.kill) anim.kill();
            });
            
            // Clear all timelines
            Object.values(this.timelines).forEach(tl => {
                if (tl && tl.kill) tl.kill();
            });
            
            // Clean up hover animations and event listeners
            this.hoverAnimations.forEach((tl, el) => {
                if (tl && tl.kill) tl.kill();
                el.removeEventListener('mouseenter', el._mouseEnterHandler);
                el.removeEventListener('mouseleave', el._mouseLeaveHandler);
                el.removeEventListener('touchstart', el._touchStartHandler);
                el.removeEventListener('touchend', el._touchEndHandler);
                delete el.dataset.hoverInitialized;
            });
            
            this.hoverAnimations.clear();
            this.animations = [];
            this.timelines = {};
            
            // Reset will-change properties
            document.querySelectorAll('[style*="will-change"]').forEach(el => {
                el.style.willChange = 'auto';
            });
            
            // Inicializar partículas de flujo
            this.animateFlowParticles();
            this.animateClosingFragments();
        },
        
        animateFlowParticles: function() {
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
                /* Fallback animations */
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                
                .fallback-animate {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                
                .fallback-float {
                    animation: float 3s ease-in-out infinite;
                }
            `;
            
            document.head.appendChild(style);
            
            // Aplicar animaciones de fallback a los elementos
            document.querySelectorAll('section, header, .interactive').forEach(el => {
                el.classList.add('fallback-animate');
            });
            
            console.log('Fallback animations initialized');
        }
    };
    
    // ========================================
    // INICIALIZACIÓN DE LA APLICACIÓN
    // ========================================
    
    const init = () => {
        if (state.isInitialized) return;
        
        console.log('🚀 Iniciando aplicación...');
        
        try {
            // Inicializar sistemas
            CursorSystem.init();
            ScrollSystem.init();
            
            // Inicializar animaciones si GSAP está disponible
            if (typeof gsap !== 'undefined') {
                try {
                    gsap.registerPlugin(ScrollTrigger);
                    AnimationSystem.init();
                } catch (error) {
                    console.error('Error al inicializar GSAP:', error);
                    AnimationSystem.initFallbackAnimations();
                }
            } else {
                console.warn('GSAP no está disponible, usando animaciones alternativas');
                AnimationSystem.initFallbackAnimations();
            }
            
            state.isInitialized = true;
            console.log('✅ Aplicación inicializada');
            
            // Optimización de rendimiento
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    console.log('Optimizaciones de rendimiento aplicadas');
                });
            }
            
            // Inicializar service worker en producción
            if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(registration => {
                        console.log('ServiceWorker registrado correctamente');
                    })
                    .catch(error => {
                        console.error('Error al registrar ServiceWorker:', error);
                    });
            }
            
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
        }
    };
    
    // Limpiar al cerrar la página
    window.addEventListener('beforeunload', () => {
        if (AnimationSystem && typeof AnimationSystem.cleanup === 'function') {
            AnimationSystem.cleanup();
        }
    });
    
    // Exponer API pública
    const publicAPI = {
        init,
        config,
        state,
        utils: Utils,
        CursorSystem,
        ScrollSystem,
        AnimationSystem
    };
    
    // Hacer que la API esté disponible globalmente
    window.APP = publicAPI;
    
    // Inicializar cuando el DOM esté listo
    const startApp = () => {
        // Cargar GSAP dinámicamente si es necesario
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.log('Cargando GSAP dinámicamente...');
            const gsapScript = document.createElement('script');
            gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
            
            gsapScript.onload = () => {
                const stScript = document.createElement('script');
                stScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
                stScript.onload = () => {
                    gsap.registerPlugin(ScrollTrigger);
                    init();
                };
                document.head.appendChild(stScript);
            };
            
            document.head.appendChild(gsapScript);
        } else {
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
            }
            init();
        }
    };
    
    // Iniciar la aplicación cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApp);
    } else {
        // Si el DOM ya está listo, inicializar en el siguiente ciclo de eventos
        setTimeout(startApp, 0);
    }
    
    // Manejar el evento de redimensionamiento
    const handleResize = Utils.throttle(() => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 250);

    window.addEventListener('resize', handleResize);
    
    // Retornar la API pública
    return publicAPI;
})();