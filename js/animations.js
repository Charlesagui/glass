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

        const padding = { top: 30, right: 30, bottom: 30, left: 30 }; // Increased padding to prevent overflow
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

        const nodeRadius = 5; // Reduced node size for better centering
        const conceptualLayers = []; // This will group nodes by their conceptual layer
        const placedNodePositions = []; // Store {x, y} of nodes already placed for collision detection
        const minDistance = nodeRadius * 3; // Increased min distance between node centers
        const maxAttempts = 300; // Increased max attempts to find a non-colliding position

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

        // Helper function to check if a line intersects with a circle (node)
        function lineIntersectsCircle(lineStart, lineEnd, circleCenter, radius) {
            const A = lineStart.x;
            const B = lineStart.y;
            const C = lineEnd.x;
            const D = lineEnd.y;
            const E = circleCenter.x;
            const F = circleCenter.y;
            
            const LAB = Math.sqrt(Math.pow(C - A, 2) + Math.pow(D - B, 2));
            const Dx = (C - A) / LAB;
            const Dy = (D - B) / LAB;
            const t = Dx * (E - A) + Dy * (F - B);
            const Ex = t * Dx + A;
            const Ey = t * Dy + B;
            const LEC = Math.sqrt(Math.pow(Ex - E, 2) + Math.pow(Ey - F, 2));
            
            return LEC <= radius && t >= 0 && t <= LAB;
        }

        // Helper function to find path around obstacles
        function findPathAroundNodes(startNode, endNode, allNodes, nodeRadius) {
            const start = {x: startNode.x, y: startNode.y};
            const end = {x: endNode.x, y: endNode.y};
            
            // Check if direct path is clear
            let pathClear = true;
            for (const node of allNodes) {
                if (node === startNode || node === endNode) continue;
                if (lineIntersectsCircle(start, end, {x: node.x, y: node.y}, nodeRadius + 3)) {
                    pathClear = false;
                    break;
                }
            }
            
            if (pathClear) {
                return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
            }
            
            // Find path around obstacles using control points
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            
            // Try different curve approaches
            const attempts = [
                {x: midX, y: midY - 40}, // Curve above
                {x: midX, y: midY + 40}, // Curve below
                {x: midX - 40, y: midY}, // Curve left
                {x: midX + 40, y: midY}, // Curve right
                {x: midX - 30, y: midY - 30}, // Diagonal curves
                {x: midX + 30, y: midY - 30},
                {x: midX - 30, y: midY + 30},
                {x: midX + 30, y: midY + 30}
            ];
            
            for (const controlPoint of attempts) {
                // Check if this curved path avoids all nodes
                let curveClear = true;
                const segments = 20; // Check curve in segments
                
                for (let i = 0; i <= segments; i++) {
                    const t = i / segments;
                    const curveX = (1-t)*(1-t)*start.x + 2*(1-t)*t*controlPoint.x + t*t*end.x;
                    const curveY = (1-t)*(1-t)*start.y + 2*(1-t)*t*controlPoint.y + t*t*end.y;
                    
                    for (const node of allNodes) {
                        if (node === startNode || node === endNode) continue;
                        const distance = Math.sqrt(Math.pow(curveX - node.x, 2) + Math.pow(curveY - node.y, 2));
                        if (distance <= nodeRadius + 2) {
                            curveClear = false;
                            break;
                        }
                    }
                    if (!curveClear) break;
                }
                
                if (curveClear) {
                    return `M ${start.x} ${start.y} Q ${controlPoint.x} ${controlPoint.y} ${end.x} ${end.y}`;
                }
            }
            
            // Fallback to direct line if no clear curve found
            return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
        }

        // Collect all nodes for collision detection
        const allNodes = [];
        conceptualLayers.forEach(layer => {
            layer.forEach(node => allNodes.push(node));
        });

        const allPaths = [];
        if (conceptualLayers.length > 1) {
            // Create connections based on conceptual layers, avoiding node intersections
            for (let i = 0; i < conceptualLayers.length - 1; i++) {
                const currentLayerNodes = conceptualLayers[i];
                const nextLayerNodes = conceptualLayers[i+1];
                currentLayerNodes.forEach(startNode => {
                    nextLayerNodes.forEach(endNode => {
                        const path = document.createElementNS(svgNS, 'path');
                        path.setAttribute('class', 'nn-thread');
                        
                        const pathData = findPathAroundNodes(startNode, endNode, allNodes, nodeRadius);
                        path.setAttribute('d', pathData);
                        
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
                        pathRL.setAttribute('class', 'nn-thread nn-thread-rl');
                        
                        const pathDataRL = findPathAroundNodes(startNodeRL, endNodeRL, allNodes, nodeRadius);
                        pathRL.setAttribute('d', pathDataRL);
                        
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
                    endNode.element.classList.remove('active');
                }
            });

            // Adjust timing based on path length for consistent speed
            const baseSpeed = 300; // pixels per second
            const duration = Math.max(0.1, Math.min(0.4, length / baseSpeed));
            
            tl.to(path, { strokeDashoffset: 0, duration: duration * 0.6, ease: 'power1.in' })
              .call(() => endNode.element.classList.add('active'), [], ">-0.02")
              .to(path, { strokeDashoffset: -length, duration: duration * 0.4, ease: 'power1.out' });
        }

        // Function to pick and fire a random thread
        function fireRandomThread() {
            if (allPaths.length === 0) return;
            const randomIndex = Math.floor(Math.random() * allPaths.length);
            fireThread(allPaths[randomIndex]);
        }

        // Start a few initial animations and then set an interval for more
        if (allPaths.length > 0) {
            const initialFirings = Math.min(8, allPaths.length); // More initial firings for better effect
            for(let i=0; i < initialFirings; i++) {
                 setTimeout(() => fireRandomThread(), Math.random() * 300); // Much faster initial timeout
            }
            // Periodically fire more threads
            setInterval(fireRandomThread, 200 + Math.random() * 300); // Much faster interval for rapid connections
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
