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
    },

    setupGSAPAnimations() {
        gsap.config({
            nullTargetWarn: false,
            autoSleep: 60,
            autoKernelSize: 10
        });
        
        gsap.defaults({
            ease: "power2.out",
            duration: 0.8,
            overwrite: 'auto'
        });
        
        this.animateHero();
        
        requestIdleCallback(() => {
            this.animateSections();
            this.animateElements();
            this.animateFlowParticles_setup();
            this.animateClosingFragments();
        });
    },

    animateHero() {
        const hero = document.getElementById('hero');
        if (!hero) return;
        
        const orb = hero.querySelector('.hero-orb');
        const title = hero.querySelector('h1');
        const subtitle = hero.querySelector('p');
        
        if (orb) {
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
        sections.forEach((section) => {
            const title = section.querySelector('h2');
            const content = section.querySelector('p');
            const animation = section.querySelector('.neural-network-animation, .data-flow-animation, .closing-animation-container');
            const elementsToAnimate = [title, content, animation].filter(el => el);

            gsap.set(elementsToAnimate, { y: 30, opacity: 0 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "bottom 20%", 
                    scrub: 1,
                }
            });

            tl.to(elementsToAnimate, {
                y: 0,
                opacity: 1,
                stagger: 0.2,
                ease: "power2.out"
            })
            .to(elementsToAnimate, { // Hold state
                opacity: 1
            })
            .to(elementsToAnimate, {
                y: -30,
                opacity: 0,
                stagger: 0.2,
                ease: "power2.in"
            });
        });
    },

    animateFlowParticles_setup() {
        const containers = document.querySelectorAll('.data-flow-animation');
        if (!containers.length) return;
        
        const flowTl = gsap.timeline({
            defaults: { ease: 'none' },
            onComplete: () => {
                containers.forEach(container => { container.style.willChange = 'auto'; });
            }
        });
        
        containers.forEach((container, containerIndex) => {
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
                    pointerEvents: 'none',
                    opacity: 0.6, filter: 'blur(0.5px)', zIndex: 1
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
                const nodes = container.querySelectorAll('.nn-node');
                nodes.forEach((node, nodeIndex) => {
                    masterTl.to(node, {
                        scale: 1.15, duration: 2, repeat: -1, yoyo: true,
                        ease: 'sine.inOut', delay: nodeIndex * 0.1
                    }, containerIndex * 0.1);
                });
                
                const connections = container.querySelectorAll('.nn-connections');
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
            return masterTl;
        } catch (error) {
            console.error('Error in animateElements:', error);
            this.initFallbackAnimations();
        }
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
