'use strict';

// Sistema de animaciones optimizado y limpio
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
        
        // Asegurar que las secciones sean visibles
        gsap.set('section', { opacity: 1 });
        
        this.animateHero();
        
        requestIdleCallback(() => {
            this.animateSections();
            this.animateElements();
            this.setupDataFlowAnimation();
            this.setupNeuralNetworkAnimation();
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
        sections.forEach((section, index) => {
            const title = section.querySelector('h2');
            const content = section.querySelector('p');
            const animation = section.querySelector('.neural-network-animation, .data-flow-animation, .closing-animation-container');
            const elementsToAnimate = [title, content, animation].filter(el => el);

            // Solo ocultar elementos si hay contenido que animar
            if (elementsToAnimate.length > 0) {
                gsap.set(elementsToAnimate, { y: 30, opacity: 0 });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        end: "bottom 20%", 
                        toggleActions: "play none none reverse"
                    }
                });

                tl.to(elementsToAnimate, {
                    y: 0,
                    opacity: 1,
                    stagger: 0.2,
                    duration: 0.8,
                    ease: "power2.out"
                });
            }
        });
    },
    setupDataFlowAnimation() {
        console.log('Setting up data flow animation...');
        const container = document.querySelector('.data-flow-animation');
        if (!container) {
            console.warn('Data flow animation container not found.');
            return;
        }

        container.innerHTML = '';
        
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 800 400');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        container.appendChild(svg);

        // Crear gradientes
        this.createGradients(svg);
        
        // Crear canales de datos
        const channels = [
            { 
                path: 'M 50 100 Q 200 50 400 120 Q 600 190 750 150',
                color: '#00f6ff'
            },
            { 
                path: 'M 50 200 Q 150 180 300 220 Q 500 260 750 230',
                color: '#ff00e0'
            },
            { 
                path: 'M 50 300 Q 250 250 450 300 Q 650 350 750 310',
                color: '#00ff88'
            }
        ];

        // Dibujar canales
        channels.forEach((channel, index) => {
            this.createDataChannel(svg, channel, index);
            this.createDataPackets(svg, channel, index);
        });

        console.log('Data flow animation setup complete.');
    },

    setupNeuralNetworkAnimation() {
        console.log('Setting up neural network animation...');
        const container = document.querySelector('.neural-network-animation');
        if (!container) {
            console.warn('Neural network animation container not found.');
            return;
        }

        container.innerHTML = '';
        
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 800 400');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        container.appendChild(svg);

        // Crear red neuronal
        const layers = [
            { x: 100, nodeCount: 4, color: '#00f6ff' },
            { x: 300, nodeCount: 6, color: '#ff00e0' },
            { x: 500, nodeCount: 5, color: '#00ff88' },
            { x: 700, nodeCount: 3, color: '#ff4400' }
        ];

        const allNodes = [];
        
        // Crear nodos
        layers.forEach((layer, layerIndex) => {
            const nodes = [];
            for (let i = 0; i < layer.nodeCount; i++) {
                const y = 50 + (i * (300 / (layer.nodeCount - 1)));
                const node = this.createNeuralNode(svg, layer.x, y, layer.color, layerIndex, i);
                nodes.push({ x: layer.x, y, element: node });
                allNodes.push({ x: layer.x, y, layerIndex, nodeIndex: i });
            }
            layer.nodes = nodes;
        });

        // Crear conexiones entre capas
        for (let i = 0; i < layers.length - 1; i++) {
            const currentLayer = layers[i];
            const nextLayer = layers[i + 1];
            
            currentLayer.nodes.forEach(currentNode => {
                nextLayer.nodes.forEach(nextNode => {
                    this.createNeuralConnection(svg, currentNode, nextNode);
                });
            });
        }

        // Animar pulsos de activación
        this.animateNeuralPulses(svg, layers);
        
        console.log('Neural network animation setup complete.');
    },
    createGradients(svg) {
        const svgNS = 'http://www.w3.org/2000/svg';
        const defs = document.createElementNS(svgNS, 'defs');
        svg.appendChild(defs);

        const gradient = document.createElementNS(svgNS, 'linearGradient');
        gradient.setAttribute('id', 'dataGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '0%');

        const stop1 = document.createElementNS(svgNS, 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#00f6ff');
        stop1.setAttribute('stop-opacity', '0');

        const stop2 = document.createElementNS(svgNS, 'stop');
        stop2.setAttribute('offset', '50%');
        stop2.setAttribute('stop-color', '#00f6ff');
        stop2.setAttribute('stop-opacity', '1');

        const stop3 = document.createElementNS(svgNS, 'stop');
        stop3.setAttribute('offset', '100%');
        stop3.setAttribute('stop-color', '#00f6ff');
        stop3.setAttribute('stop-opacity', '0');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        gradient.appendChild(stop3);
        defs.appendChild(gradient);
    },

    createDataChannel(svg, channel, index) {
        const svgNS = 'http://www.w3.org/2000/svg';
        
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', channel.path);
        path.setAttribute('stroke', channel.color);
        path.setAttribute('stroke-width', '3');
        path.setAttribute('fill', 'none');
        path.setAttribute('opacity', '0.6');
        path.setAttribute('stroke-linecap', 'round');
        svg.appendChild(path);

        // Animar brillo del canal
        gsap.to(path, {
            opacity: 0.9,
            duration: 2 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    },

    createDataPackets(svg, channel, channelIndex) {
        const svgNS = 'http://www.w3.org/2000/svg';
        
        const createPacket = () => {
            const packet = document.createElementNS(svgNS, 'circle');
            packet.setAttribute('r', '4');
            packet.setAttribute('fill', channel.color);
            packet.setAttribute('opacity', '0.8');
            svg.appendChild(packet);

            const path = svg.children[channelIndex * 2 + 1]; // Skip gradients
            const pathLength = path.getTotalLength();

            gsap.set(packet, { 
                motionPath: { path: channel.path, autoRotate: false },
                transformOrigin: 'center'
            });

            const tl = gsap.timeline({
                onComplete: () => {
                    packet.remove();
                    setTimeout(createPacket, Math.random() * 2000 + 1000);
                }
            });

            tl.fromTo(packet, 
                { motionPath: { path: channel.path, start: 0 }, opacity: 0 },
                { 
                    motionPath: { path: channel.path, start: 1 }, 
                    opacity: 0.8,
                    duration: 3 + Math.random() * 2,
                    ease: 'none'
                }
            );
        };

        // Iniciar generación de paquetes
        setTimeout(createPacket, channelIndex * 800 + Math.random() * 1000);
    },
    createNeuralNode(svg, x, y, color, layerIndex, nodeIndex) {
        const svgNS = 'http://www.w3.org/2000/svg';
        
        const node = document.createElementNS(svgNS, 'circle');
        node.setAttribute('cx', x);
        node.setAttribute('cy', y);
        node.setAttribute('r', '8');
        node.setAttribute('fill', 'rgba(255, 255, 255, 0.1)');
        node.setAttribute('stroke', color);
        node.setAttribute('stroke-width', '2');
        node.setAttribute('class', `neural-node layer-${layerIndex} node-${nodeIndex}`);
        svg.appendChild(node);

        // Animación de pulso base
        gsap.to(node, {
            r: 12,
            opacity: 0.3,
            duration: 2 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2
        });

        return node;
    },

    createNeuralConnection(svg, fromNode, toNode) {
        const svgNS = 'http://www.w3.org/2000/svg';
        
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', fromNode.x);
        line.setAttribute('y1', fromNode.y);
        line.setAttribute('x2', toNode.x);
        line.setAttribute('y2', toNode.y);
        line.setAttribute('stroke', 'rgba(255, 255, 255, 0.1)');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('class', 'neural-connection');
        svg.appendChild(line);

        return line;
    },

    animateNeuralPulses(svg, layers) {
        const createPulse = () => {
            // Seleccionar nodo aleatorio de la primera capa
            const startLayer = layers[0];
            const startNode = startLayer.nodes[Math.floor(Math.random() * startLayer.nodes.length)];
            
            this.sendNeuralSignal(svg, layers, 0, startNode);
            
            // Programar próximo pulso
            setTimeout(createPulse, 2000 + Math.random() * 3000);
        };

        // Iniciar pulsos
        setTimeout(createPulse, 1000);
    },

    sendNeuralSignal(svg, layers, currentLayerIndex, currentNode) {
        if (currentLayerIndex >= layers.length - 1) return;

        const svgNS = 'http://www.w3.org/2000/svg';
        const nextLayer = layers[currentLayerIndex + 1];
        
        // Activar nodo actual
        gsap.to(currentNode.element, {
            fill: '#ffff00',
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });

        // Enviar señales a nodos de la siguiente capa
        nextLayer.nodes.forEach((nextNode, index) => {
            setTimeout(() => {
                // Crear señal visual
                const signal = document.createElementNS(svgNS, 'circle');
                signal.setAttribute('r', '3');
                signal.setAttribute('fill', '#ffff00');
                signal.setAttribute('opacity', '0.8');
                svg.appendChild(signal);

                // Animar señal desde nodo actual al siguiente
                gsap.fromTo(signal,
                    { x: currentNode.x, y: currentNode.y },
                    {
                        x: nextNode.x,
                        y: nextNode.y,
                        duration: 0.5,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            signal.remove();
                            // Continuar propagación
                            this.sendNeuralSignal(svg, layers, currentLayerIndex + 1, nextNode);
                        }
                    }
                );
            }, index * 100);
        });
    },
    animateElements() {
        const interactiveElements = document.querySelectorAll('.interactive, .hover-effect');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (this.hoverAnimations.has(element)) return;
                
                const hoverTl = gsap.timeline();
                hoverTl.to(element, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                this.hoverAnimations.set(element, hoverTl);
            });
            
            element.addEventListener('mouseleave', () => {
                const hoverTl = this.hoverAnimations.get(element);
                if (hoverTl) {
                    hoverTl.reverse();
                }
            });
        });
    },

    animateClosingFragments() {
        const container = document.querySelector('.closing-animation-container');
        if (!container) return;

        container.innerHTML = '';
        
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 800 400');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        container.appendChild(svg);

        // Crear fragmentos que se ensamblan
        for (let i = 0; i < 20; i++) {
            const fragment = document.createElementNS(svgNS, 'rect');
            fragment.setAttribute('width', 8 + Math.random() * 12);
            fragment.setAttribute('height', 8 + Math.random() * 12);
            fragment.setAttribute('fill', `hsl(${180 + Math.random() * 60}, 70%, 60%)`);
            fragment.setAttribute('opacity', '0.8');
            svg.appendChild(fragment);

            // Posición inicial aleatoria
            const startX = Math.random() * 800;
            const startY = Math.random() * 400;
            
            // Posición final en el centro
            const endX = 380 + (Math.random() - 0.5) * 40;
            const endY = 180 + (Math.random() - 0.5) * 40;

            gsap.set(fragment, { x: startX, y: startY, rotation: Math.random() * 360 });

            // Animar hacia el centro
            gsap.to(fragment, {
                x: endX,
                y: endY,
                rotation: 0,
                duration: 2 + Math.random() * 2,
                delay: i * 0.1,
                ease: 'power2.inOut'
            });
        }
    },

    cleanup() {
        Object.values(this.timelines).forEach(timeline => {
            if (timeline && timeline.kill) {
                timeline.kill();
            }
        });
        
        this.animations.forEach(animation => {
            if (animation && animation.kill) {
                animation.kill();
            }
        });
        
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
        
        this.timelines = {};
        this.animations = [];
        this.hoverAnimations.clear();
        
        console.log('Animations cleaned up');
    },

    initFallbackAnimations() {
        console.log('Initializing fallback CSS animations...');
        
        // Asegurar que las secciones sean visibles
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '1';
        });
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn { 
                from { opacity: 0; transform: translateY(20px); } 
                to { opacity: 1; transform: translateY(0); } 
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
        
        document.querySelectorAll('section, header, .interactive').forEach(el => {
            el.classList.add('fallback-animate');
        });
        
        console.log('Fallback animations initialized');
    }
};

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AnimationSystem.init());
} else {
    AnimationSystem.init();
}
