'use strict';

// GSAP and ScrollTrigger are expected to be globally available.
// We need Utils for one of the particle animations.
import { Utils } from './utils.js';

export const AnimationSystem = {
    timelines: {},
    animations: [],
    hoverAnimations: new Map(),

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
                // this.setupPerformanceMonitoring(); // This was in the original, but definition not provided
            } catch (error) {
                console.error('Error initializing GSAP:', error);
                this.initFallbackAnimations();
            }
            
            console.log('AnimationSystem initialized successfully');
            
        } catch (error) {
            console.error('Error initializing AnimationSystem:', error);
            this.initFallbackAnimations();
        }
    },

    initReducedMotion() {
        console.log('Reduced motion enabled, animations will be minimal.');
        document.body.classList.add('reduced-motion');
        // Add any specific logic for reduced motion state
    },

    setupGSAPAnimations() {
        // Optimized global configuration
        gsap.config({
            nullTargetWarn: false,
            autoSleep: 60,
            autoKernelSize: 10
        });
        
        // Set default animation properties
        gsap.defaults({
            ease: "power2.out",
            duration: 0.8,
            overwrite: 'auto'
        });
        
        this.animateHero();
        
        requestIdleCallback(() => {
            this.animateSections();
            this.animateElements();
            this.animateFlowParticles_setup(); // Renamed function call
        });
    },

    animateHero() {
        const hero = document.getElementById('hero');
        if (!hero) return;
        
        const orb = hero.querySelector('.hero-orb');
        const title = hero.querySelector('h1');
        const subtitle = hero.querySelector('p');
        
        if (orb) {
            orb.style.willChange = 'transform, opacity';
            const heroTimeline = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
            heroTimeline.to(orb, {
                rotation: 360,
                duration: 40,
                repeat: -1,
                ease: 'none',
                transformOrigin: 'center'
            }, 0);
            heroTimeline.to(orb, {
                scale: 1.05,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            }, 0);
            this.timelines.hero = heroTimeline;
            this.animations.push(heroTimeline);
        }
        
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
            
            gsap.set([title, content, animation], { y: 50, opacity: 0 });
            
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

    animateFlowParticles_setup() { // Renamed function (from lines 477-563)
        const containers = document.querySelectorAll('.data-flow-animation');
        if (!containers.length) return;
        
        const flowTl = gsap.timeline({
            defaults: { ease: 'none' },
            onComplete: () => {
                containers.forEach(container => { container.style.willChange = 'auto'; });
            }
        });
        
        containers.forEach((container, containerIndex) => {
            container.style.willChange = 'transform, opacity';
            container.style.transform = 'translateZ(0)';
            container.innerHTML = '';
            
            const rect = container.getBoundingClientRect();
            const area = rect.width * rect.height;
            const particleCount = Math.min(20, Math.max(5, Math.floor(area / 5000)));
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'flow-particle gpu-accelerated';
                
                const size = 1 + Math.random() * 3;
                const posX = Math.random() * 100;
                const posY = Math.random() * 100;
                const duration = 4 + Math.random() * 3;
                const delay = Math.random() * -5;
                const distance = 20 + Math.random() * 30;
                
                Object.assign(particle.style, {
                    position: 'absolute',
                    width: `${size}px`, height: `${size}px`,
                    background: `hsl(${180 + Math.random() * 60}, 80%, 60%)`,
                    borderRadius: '50%', left: `${posX}%`, top: `${posY}%`,
                    willChange: 'transform, opacity', pointerEvents: 'none',
                    opacity: 0.6, filter: 'blur(0.5px)', transform: 'translateZ(0)', zIndex: 1
                });
                container.appendChild(particle);
                
                const angle = Math.random() * Math.PI * 2;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                flowTl.to(particle, {
                    x: `+=${x}%`, y: `+=${y}%`, opacity: 0.3,
                    duration: duration, delay: delay, ease: 'sine.inOut',
                    repeat: -1, yoyo: true
                }, containerIndex * 0.1);
            }
        });
        this.timelines.flowParticles_setup = flowTl;
        this.animations.push(flowTl);
        return flowTl;
    },

    animateElements() {
        try {
            const nnContainers = document.querySelectorAll('.neural-network-animation');
            if (!nnContainers.length) return;
            
            const masterTl = gsap.timeline({
                defaults: { ease: 'power2.inOut' },
                onComplete: () => {
                    nnContainers.forEach(container => { container.style.willChange = 'auto'; });
                }
            });
            
            nnContainers.forEach((container, containerIndex) => {
                container.style.willChange = 'transform, opacity';
                container.style.transform = 'translateZ(0)';
                
                const nodes = container.querySelectorAll('.nn-node');
                nodes.forEach((node, nodeIndex) => {
                    node.style.willChange = 'transform, opacity';
                    node.style.transform = 'translateZ(0)';
                    masterTl.to(node, {
                        scale: 1.15, duration: 2, repeat: -1, yoyo: true,
                        ease: 'sine.inOut', delay: nodeIndex * 0.1
                    }, containerIndex * 0.1);
                });
                
                const connections = container.querySelectorAll('.nn-connections-1, .nn-connections-2');
                connections.forEach((conn, connIndex) => {
                    conn.style.willChange = 'opacity';
                    masterTl.to(conn, {
                        opacity: 0.7, duration: 2, repeat: -1, yoyo: true,
                        ease: 'sine.inOut', delay: connIndex * 0.05
                    }, containerIndex * 0.1);
                });
            });
            this.timelines.neuralNetwork = masterTl;
            this.animations.push(masterTl);
            this.setupHoverEffects();
            return masterTl;
        } catch (error) {
            console.error('Error in animateElements:', error);
            this.initFallbackAnimations();
        }
    },

    setupHoverEffects() {
        const interactiveElements = document.querySelectorAll('.interactive');
        interactiveElements.forEach(el => {
            if (el.dataset.hoverInitialized) return;
            el.dataset.hoverInitialized = 'true';
            el.style.willChange = 'transform, opacity';
            el.style.transform = 'translateZ(0)';
            
            const hoverTl = gsap.timeline({ paused: true });
            hoverTl.to(el, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
            
            this.hoverAnimations.set(el, hoverTl);
            
            // Store handlers for removal in cleanup
            el._mouseEnterHandler = () => hoverTl.play();
            el._mouseLeaveHandler = () => hoverTl.reverse();
            el._touchStartHandler = () => hoverTl.play();
            el._touchEndHandler = () => hoverTl.reverse();

            el.addEventListener('mouseenter', el._mouseEnterHandler);
            el.addEventListener('mouseleave', el._mouseLeaveHandler);
            el.addEventListener('touchstart', el._touchStartHandler);
            el.addEventListener('touchend', el._touchEndHandler);
        });
    },

    cleanup() {
        this.animations.forEach(anim => {
            if (anim && anim.kill) anim.kill();
        });
        Object.values(this.timelines).forEach(tl => {
            if (tl && tl.kill) tl.kill();
        });
        this.hoverAnimations.forEach((tl, el) => {
            if (tl && tl.kill) tl.kill();
            if (el._mouseEnterHandler) el.removeEventListener('mouseenter', el._mouseEnterHandler);
            if (el._mouseLeaveHandler) el.removeEventListener('mouseleave', el._mouseLeaveHandler);
            if (el._touchStartHandler) el.removeEventListener('touchstart', el._touchStartHandler);
            if (el._touchEndHandler) el.removeEventListener('touchend', el._touchEndHandler);
            delete el.dataset.hoverInitialized;
            delete el._mouseEnterHandler;
            delete el._mouseLeaveHandler;
            delete el._touchStartHandler;
            delete el._touchEndHandler;
        });
        this.hoverAnimations.clear();
        this.animations = [];
        this.timelines = {};
        
        document.querySelectorAll('[style*="will-change"]').forEach(el => {
            el.style.willChange = 'auto';
        });

        // These calls were at the end of the original cleanup. 
        // It's unusual to start animations in cleanup, but preserving behavior.
        this.animateFlowParticles_dynamic(); // Renamed function call
        this.animateClosingFragments();
    },

    animateFlowParticles_dynamic() { // Renamed function (from lines 758-789)
        const particles = document.querySelectorAll('.flow-particle'); // This might conflict if previous particles aren't cleared
        const colors = ['#00f6ff', '#ff00e0', '#00ff88', '#ff4400'];
        
        particles.forEach((particle, index) => {
            const size = Utils.map(Math.random(), 0, 1, 6, 14);
            gsap.set(particle, {
                width: size, height: size,
                backgroundColor: colors[index % colors.length],
                x: Math.random() * 200, y: Math.random() * 100,
                borderRadius: '50%',
                boxShadow: `0 0 10px ${colors[index % colors.length]}`
            });
            gsap.to(particle, {
                x: `+=${Utils.map(Math.random(), 0, 1, -100, 100)}`,
                y: `+=${Utils.map(Math.random(), 0, 1, -50, 50)}`,
                scale: Utils.map(Math.random(), 0, 1, 0.8, 1.4),
                duration: Utils.map(Math.random(), 0, 1, 3, 6),
                repeat: -1, yoyo: true, ease: "sine.inOut",
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
                width: 12, height: 12,
                backgroundColor: colors[index % colors.length],
                borderRadius: '50%', position: 'absolute',
                left: '50%', top: '50%',
                x: centerX, y: centerY,
                boxShadow: `0 0 15px ${colors[index % colors.length]}`
            });
            gsap.to(fragment, {
                rotation: 360,
                transformOrigin: `${-centerX}px ${-centerY}px`,
                duration: 8 + index, repeat: -1, ease: "none"
            });
            gsap.to(fragment, {
                scale: 1.5, duration: 1 + index * 0.2,
                repeat: -1, yoyo: true, ease: "sine.inOut"
            });
        });
    },

    initFallbackAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            .fallback-animate { animation: fadeIn 0.8s ease-out forwards; }
            .fallback-float { animation: float 3s ease-in-out infinite; }
        `;
        document.head.appendChild(style);
        document.querySelectorAll('section, header, .interactive').forEach(el => {
            el.classList.add('fallback-animate');
        });
        console.log('Fallback animations initialized');
    }
};
