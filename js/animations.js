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
            this.setupDynamicNeuralNetworkAnimation(); // New call
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

    setupDynamicNeuralNetworkAnimation() {
        console.log('Setting up dynamic neural network animation...');
        const container = document.querySelector('.neural-network-animation');
        if (!container) {
            console.warn('Neural network animation container not found.');
            return;
        }

        // Ensure container is visible and has dimensions
        if (container.offsetWidth === 0 || container.offsetHeight === 0) {
            console.warn('Neural network animation container has no dimensions. Ensure it is visible.');
            // Optionally, use IntersectionObserver or wait for visibility if this is a common issue
            // For now, we'll return if not visible/sized.
            return;
        }

        container.innerHTML = ''; // Clear previous content

        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'dynamic-neural-network-svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.overflow = 'visible'; // Allow elements like glows to exceed SVG bounds if needed
        container.appendChild(svg);

        const padding = { top: 20, right: 20, bottom: 20, left: 20 }; // Padding inside SVG
        const svgWidth = container.offsetWidth;
        const svgHeight = container.offsetHeight;
        const usableWidth = svgWidth - padding.left - padding.right;
        const usableHeight = svgHeight - padding.top - padding.bottom;

        console.log('[NN Animation Debug] Container WxH:', container.offsetWidth, 'x', container.offsetHeight);
        console.log('[NN Animation Debug] SVG WxH:', svgWidth, 'x', svgHeight);
        console.log('[NN Animation Debug] Usable WxH:', usableWidth, 'x', usableHeight);

        const layers = [
            { count: 16, type: 'input', color: 'var(--color-accent1)' }, 
            { count: 18, type: 'hidden', color: 'var(--color-accent2)' }, 
            { count: 16, type: 'output', color: 'var(--color-accent3, var(--color-accent1))' } 
        ];

        const nodeRadius = 6;
        const conceptualLayers = []; // This will group nodes by their conceptual layer
        const placedNodePositions = []; // Store {x, y} of nodes already placed for collision detection
        const minDistance = nodeRadius * 2.5; // Min distance between node centers (radius * 2 + spacing)
        const maxAttempts = 200; // Max attempts to find a non-colliding position

        // Create nodes with random positions, ensuring no overlap
        layers.forEach((layer, layerIndex) => {
            const layerNodes = [];
            for (let i = 0; i < layer.count; i++) {
                let x, y, validPosition = false;
                let attempts = 0;

                while (!validPosition && attempts < maxAttempts) {
                    // Generate coordinates that account for node radius to stay within bounds
                    x = padding.left + nodeRadius + Math.random() * (usableWidth - nodeRadius * 2);
                    y = padding.top + nodeRadius + Math.random() * (usableHeight - nodeRadius * 2);

                    // Check for collision with already placed nodes
                    let hasCollision = false;
                    for (const pos of placedNodePositions) {
                        const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
                        if (distance < minDistance) {
                            hasCollision = true;
                            break;
                        }
                    }

                    if (!hasCollision) {
                        validPosition = true;
                    }
                    attempts++;
                }

                if (!validPosition) {
                    console.warn(`Could not find a valid position for node L${layerIndex}, N${i} after ${maxAttempts} attempts. It may overlap.`);
                }

                placedNodePositions.push({ x, y });

                const node = document.createElementNS(svgNS, 'circle');
                node.setAttribute('class', `nn-node-dynamic nn-node-${layer.type}`);
                node.setAttribute('cx', x);
                node.setAttribute('cy', y);
                node.setAttribute('r', nodeRadius);
                svg.appendChild(node);

                const nodeData = { element: node, x, y, layerIndex, indexInLayer: i };
                layerNodes.push(nodeData);
                console.log(`[NN Animation Debug] Node: L${layerIndex}, N${i} at x=${x.toFixed(2)}, y=${y.toFixed(2)} (attempts: ${attempts})`);
            }
            conceptualLayers.push(layerNodes);
        });

        const allPaths = [];
        if (conceptualLayers.length > 1) {
            // Create connections based on conceptual layers, not visual position
            for (let i = 0; i < conceptualLayers.length - 1; i++) {
                const currentLayerNodes = conceptualLayers[i];
                const nextLayerNodes = conceptualLayers[i+1];
                currentLayerNodes.forEach(startNode => {
                    nextLayerNodes.forEach(endNode => {
                        const path = document.createElementNS(svgNS, 'path');
                        path.setAttribute('class', 'nn-thread');
                        path.setAttribute('d', `M ${startNode.x} ${startNode.y} L ${endNode.x} ${endNode.y}`);
                        svg.insertBefore(path, svg.firstChild); // Draw paths behind nodes
                        allPaths.push({path, startNode, endNode, direction: 'L-R'});
                    });
                });

                // Create R-L paths (from nextLayer to currentLayer)
                const currentLayerNodesRL = conceptualLayers[i+1]; // These are 'start' for R-L
                const nextLayerNodesRL = conceptualLayers[i];    // These are 'end' for R-L
                currentLayerNodesRL.forEach(startNodeRL => {
                    nextLayerNodesRL.forEach(endNodeRL => {
                        const pathRL = document.createElementNS(svgNS, 'path');
                        pathRL.setAttribute('class', 'nn-thread nn-thread-rl'); // Added a class for R-L if specific styling needed
                        pathRL.setAttribute('d', `M ${startNodeRL.x} ${startNodeRL.y} L ${endNodeRL.x} ${endNodeRL.y}`);
                        svg.insertBefore(pathRL, svg.firstChild);
                        allPaths.push({path: pathRL, startNode: startNodeRL, endNode: endNodeRL, direction: 'R-L'});
                    });
                });
            }
        }

        // Animation function for a single thread firing
        function fireThread(pathObj) {
            const { path, startNode, endNode } = pathObj;
            const length = path.getTotalLength();
            if (length === 0) return; // Skip if path has no length (e.g., overlapping nodes)

            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
            
            const tl = gsap.timeline({
                onStart: () => {
                    path.classList.add('firing');
                    startNode.element.classList.add('active');
                },
                onComplete: () => {
                    path.classList.remove('firing');
                    startNode.element.classList.remove('active');
                    endNode.element.classList.remove('active'); // Remove active from end node too
                    // Schedule next firing for this path or another one
                    // setTimeout(() => fireRandomThread(), 1000 + Math.random() * 2000);
                }
            });

            tl.to(path, { strokeDashoffset: 0, duration: 0.25 + Math.random() * 0.25, ease: 'power1.in' }) // Faster duration
              .call(() => endNode.element.classList.add('active'), [], ">-0.05") // Adjust timing if needed
              .to(path, { strokeDashoffset: -length, duration: 0.25 + Math.random() * 0.25, ease: 'power1.out' }); // Faster duration
        }

        // Function to pick and fire a random thread
        function fireRandomThread() {
            if (allPaths.length === 0) return;
            const randomIndex = Math.floor(Math.random() * allPaths.length);
            fireThread(allPaths[randomIndex]);
        }

        // Start a few initial animations and then set an interval for more
        if (allPaths.length > 0) {
            const initialFirings = Math.min(5, allPaths.length); // Increase initial firings
            for(let i=0; i < initialFirings; i++) {
                 setTimeout(() => fireRandomThread(), Math.random() * 500); // Faster initial timeout
            }
            // Periodically fire more threads
            setInterval(fireRandomThread, 500 + Math.random() * 750); // Faster interval
        }

        console.log('Dynamic neural network animation setup complete.');
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
