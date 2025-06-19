'use strict';

// Sistema de animaciones optimizado y limpio - v1.1
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
        
        // DESHABILITADO: ScrollTrigger del hero que causa saltos durante scroll
        /*
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
        */
    },

    animateSections() {
        // DESHABILITADO: Animaciones de secciones con ScrollTrigger que causan saltos
        console.log('Animaciones de secciones deshabilitadas para scroll fluido.');
        
        // Las secciones aparecen instantáneamente sin animaciones que interfieran con el scroll
        /*
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
        */
    },
    setupDataFlowAnimation() {
        console.log('Setting up data flow animation...');
        const container = document.querySelector('.data-flow-animation');
        if (!container) {
            console.warn('Data flow animation container not found.');
            return;
        }

        // EJECUTAR INMEDIATAMENTE - Sin ScrollTrigger que cause saltos
        console.log('Data flow animation iniciada inmediatamente - sin ScrollTrigger.');
        container.innerHTML = '';

        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        // Ajustar viewBox para móviles (más grande) o escritorio
        const isMobile = window.innerWidth <= 768;
        svg.setAttribute('viewBox', isMobile ? '0 0 800 800' : '0 0 800 600');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        container.appendChild(svg);

        this.createGradients(svg);
        
        // CONTINUAR con las animaciones internas inmediatamente
        this.createDataChannels(svg); // Ya incluye los paquetes móviles
        this.createNetworkNodes(svg);
        this.createNodeConnections(svg); // Nueva función para conectar nodos
        this.createBandwidthMonitors(svg);
        this.createNetworkGrid(svg);
        this.animateStatusIndicators(svg);
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
        path.setAttribute('stroke', 'rgba(255, 255, 255, 0.1)');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('class', 'data-channel');
        svg.appendChild(path);

        // Obtener la longitud del path para la animación
        const pathLength = path.getTotalLength();
        
        // Configuración inicial - path invisible
        gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength
        });
        
        // Animación de dibujado del canal usando propiedades estándar SVG
        gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: 'power2.inOut',
            delay: index * 0.2
        });
        return path; // Devolver el path creado
    },

    createDataPackets(svg, channel, path, channelIndex) {
        const svgNS = 'http://www.w3.org/2000/svg';
        
        const createPacket = () => {
            const packet = document.createElementNS(svgNS, 'circle');
            packet.setAttribute('r', '14'); // Aumentado de 4 a 7 para mayor visibilidad
            packet.setAttribute('fill', channel.color);
            packet.setAttribute('opacity', '0.9'); // Aumentado a 0.9 para mayor brillo
            svg.appendChild(packet);

            gsap.set(packet, { 
                motionPath: { path: path, autoRotate: false },
                transformOrigin: 'center'
            });

            const tl = gsap.timeline({
                onComplete: () => {
                    packet.remove();
                    setTimeout(createPacket, Math.random() * 2000 + 1000);
                }
            });

            tl.fromTo(packet, 
                { motionPath: { path: path, start: 0 }, opacity: 0 },
                { 
                    motionPath: { path: path, end: 1, start: 0 }, 
                    opacity: 0.8,
                    duration: 0.2 + Math.random() * 2,
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
        svg.setAttribute('viewBox', '0 0 400 400');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.filter = 'drop-shadow(0 0 20px rgba(0, 246, 255, 0.5))';
        container.appendChild(svg);

        this.createQuantumPortal(svg);
        this.createQuantumParticles(svg);
        this.createEnergyWaves(svg);
        this.createDimensionalRift(svg);
        this.createAccretionDisk(svg);
        this.createGravitationalLensing(svg);
        this.createJets(svg);
    },

    createQuantumPortal(svg) {
        const svgNS = 'http://www.w3.org/2000/svg';
        
        // Portal central con gradiente de agujero negro ultra oscuro
        const defs = document.createElementNS(svgNS, 'defs');
        svg.appendChild(defs);
        
        // Gradiente radial para el agujero negro más oscuro
        const blackHoleGradient = document.createElementNS(svgNS, 'radialGradient');
        blackHoleGradient.setAttribute('id', 'blackHoleGradient');
        blackHoleGradient.setAttribute('cx', '50%');
        blackHoleGradient.setAttribute('cy', '50%');
        
        const stops = [
            { offset: '0%', color: '#000000', opacity: '1' },
            { offset: '10%', color: '#0a0a1a', opacity: '1' },
            { offset: '25%', color: '#1a1a3a', opacity: '0.95' },
            { offset: '45%', color: '#2a2a5a', opacity: '0.85' },
            { offset: '65%', color: '#3a3a7a', opacity: '0.6' },
            { offset: '85%', color: '#4a4a9a', opacity: '0.3' },
            { offset: '100%', color: '#5a5aba', opacity: '0.1' }
        ];
        
        stops.forEach(stop => {
            const stopEl = document.createElementNS(svgNS, 'stop');
            stopEl.setAttribute('offset', stop.offset);
            stopEl.setAttribute('stop-color', stop.color);
            stopEl.setAttribute('stop-opacity', stop.opacity);
            blackHoleGradient.appendChild(stopEl);
        });
        defs.appendChild(blackHoleGradient);
        
        // Portal principal (singularidad) - más brillante y dinámico
        const portal = document.createElementNS(svgNS, 'circle');
        portal.setAttribute('cx', '200');
        portal.setAttribute('cy', '200');
        portal.setAttribute('r', '70');
        portal.setAttribute('fill', 'url(#blackHoleGradient)');
        portal.setAttribute('opacity', '0.98');
        portal.setAttribute('filter', 'url(#glow)');
        svg.appendChild(portal);
        
        // Añadir filtro de brillo
        const filter = document.createElementNS(svgNS, 'filter');
        filter.setAttribute('id', 'glow');
        const feGaussianBlur = document.createElementNS(svgNS, 'feGaussianBlur');
        feGaussianBlur.setAttribute('stdDeviation', '5');
        feGaussianBlur.setAttribute('result', 'coloredBlur');
        const feMerge = document.createElementNS(svgNS, 'feMerge');
        const feMergeNode1 = document.createElementNS(svgNS, 'feMergeNode');
        feMergeNode1.setAttribute('in', 'coloredBlur');
        const feMergeNode2 = document.createElementNS(svgNS, 'feMergeNode');
        feMergeNode2.setAttribute('in', 'SourceGraphic');
        feMerge.appendChild(feMergeNode1);
        feMerge.appendChild(feMergeNode2);
        filter.appendChild(feGaussianBlur);
        filter.appendChild(feMerge);
        defs.appendChild(filter);
        
        // Horizonte de eventos - más visible y dinámico
        const eventHorizon = document.createElementNS(svgNS, 'circle');
        eventHorizon.setAttribute('cx', '200');
        eventHorizon.setAttribute('cy', '200');
        eventHorizon.setAttribute('r', '90');
        eventHorizon.setAttribute('fill', 'none');
        eventHorizon.setAttribute('stroke', '#5a5aff');
        eventHorizon.setAttribute('stroke-width', '1.5');
        eventHorizon.setAttribute('opacity', '0.8');
        eventHorizon.setAttribute('stroke-dasharray', '6,3');
        eventHorizon.setAttribute('filter', 'url(#glow)');
        svg.appendChild(eventHorizon);
        
        // Añadir anillo exterior de energía
        const energyRing = document.createElementNS(svgNS, 'circle');
        energyRing.setAttribute('cx', '200');
        energyRing.setAttribute('cy', '200');
        energyRing.setAttribute('r', '120');
        energyRing.setAttribute('fill', 'none');
        energyRing.setAttribute('stroke', '#00ffff');
        energyRing.setAttribute('stroke-width', '0.5');
        energyRing.setAttribute('opacity', '0.5');
        energyRing.setAttribute('stroke-dasharray', '3,2');
        svg.appendChild(energyRing);
        
        // Animaciones del agujero negro - más dinámicas y visibles
        gsap.to(portal, {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: 'none',
            transformOrigin: 'center'
        });
        
        gsap.to(eventHorizon, {
            rotation: -360,
            duration: 30,
            repeat: -1,
            ease: 'none',
            transformOrigin: 'center'
        });
        
        // Animación del anillo de energía
        gsap.to(energyRing, {
            rotation: 180,
            duration: 15,
            repeat: -1,
            ease: 'none',
            transformOrigin: 'center',
            opacity: 0.7,
            scale: 1.1,
            yoyo: true,
            repeatDelay: 0.5
        });
        
        // Pulsos gravitacionales más dinámicos
        gsap.to(portal, {
            r: 75,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
        
        // Distorsión del horizonte de eventos más dinámica
        gsap.to(eventHorizon, {
            r: 100,
            opacity: 0.6,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            strokeWidth: '2.5',
            stroke: '#7a7aff'
        });
        
        // Efecto de parpadeo para el anillo de energía
        gsap.to(energyRing, {
            opacity: 0.8,
            duration: 2 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2
        });
    },

    createQuantumParticles(svg) {
        const svgNS = 'http://www.w3.org/2000/svg';
        const particleCount = 80; // Más partículas
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElementNS(svgNS, 'circle');
            const size = 1 + Math.random() * 3;
            
            particle.setAttribute('r', size);
            particle.setAttribute('fill', this.getBlackHoleColor());
            particle.setAttribute('opacity', '0.6');
            svg.appendChild(particle);
            
            // Posición inicial en órbitas distantes más variadas
            const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.5;
            const distance = 150 + Math.random() * 100;
            const startX = 200 + Math.cos(angle) * distance;
            const startY = 200 + Math.sin(angle) * distance;
            
            gsap.set(particle, { x: startX, y: startY });
            
            // Crear espiral gravitacional más compleja
            const tl = gsap.timeline({ repeat: -1, delay: Math.random() * 5 });
            
            // Múltiples puntos para crear una espiral más realista y caótica
            const spiralPoints = [];
            const spiralTurns = 2 + Math.random() * 2;
            const totalPoints = spiralTurns * 12;
            
            for (let j = 0; j <= totalPoints; j++) {
                const progress = j / totalPoints;
                const spiralAngle = angle + progress * spiralTurns * Math.PI * 2;
                const spiralDistance = distance * (1 - progress * 0.95);
                
                // Agregar turbulencia y perturbaciones
                const turbulence = (Math.sin(progress * Math.PI * 8) * 10) * (1 - progress);
                const spiralX = 200 + Math.cos(spiralAngle) * (spiralDistance + turbulence);
                const spiralY = 200 + Math.sin(spiralAngle) * (spiralDistance + turbulence);
                spiralPoints.push(`${spiralX} ${spiralY}`);
            }
            
            const pathString = `M ${startX} ${startY} Q ` + spiralPoints.join(' Q ');
            
            tl.to(particle, {
                motionPath: {
                    path: pathString,
                    autoRotate: false
                },
                scale: 0.1,
                opacity: 0,
                duration: 3 + Math.random() * 4,
                ease: 'power2.in',
                onUpdate: function() {
                    // Efecto de aceleración cerca del horizonte de eventos
                    const currentX = parseFloat(particle.getAttribute('cx') || gsap.getProperty(particle, 'x'));
                    const currentY = parseFloat(particle.getAttribute('cy') || gsap.getProperty(particle, 'y'));
                    const distanceToCenter = Math.sqrt((currentX - 200) ** 2 + (currentY - 200) ** 2);
                    
                    if (distanceToCenter < 100) {
                        gsap.set(particle, { filter: `blur(${(100 - distanceToCenter) * 0.05}px)` });
                    }
                },
                onComplete: () => {
                    // Regenerar partícula con variaciones
                    gsap.set(particle, { 
                        x: startX + (Math.random() - 0.5) * 20, 
                        y: startY + (Math.random() - 0.5) * 20, 
                        scale: 1, 
                        opacity: 0.6,
                        filter: 'none',
                        fill: this.getBlackHoleColor()
                    });
                }
            });
            
            // Efecto de spaghettification más dramático
            tl.to(particle, {
                scaleY: 0.1,
                scaleX: 3,
                rotation: Math.random() * 360,
                duration: 0.8,
                ease: 'power3.in'
            }, '-=0.8');
            
            // Parpadeo antes de desaparecer
            tl.to(particle, {
                opacity: 0.9,
                duration: 0.1,
                repeat: 3,
                yoyo: true,
                ease: 'power2.inOut'
            }, '-=0.3');
        }
    },

    createEnergyWaves(svg) {
        const svgNS = 'http://www.w3.org/2000/svg';
        
        // Ondas gravitacionales ultra oscuras y sutiles
        for (let i = 0; i < 3; i++) {
            const wave = document.createElementNS(svgNS, 'circle');
            wave.setAttribute('cx', '200');
            wave.setAttribute('cy', '200');
            wave.setAttribute('r', '0');
            wave.setAttribute('fill', 'none');
            wave.setAttribute('stroke', '#1a1a1a');
            wave.setAttribute('stroke-width', '0.5');
            wave.setAttribute('opacity', '0');
            svg.appendChild(wave);
            
            const tl = gsap.timeline({ repeat: -1, delay: i * 3 });
            
            tl.to(wave, {
                r: 120,
                opacity: 0.2,
                strokeWidth: 0.3,
                duration: 1.5,
                ease: 'power1.out'
            })
            .to(wave, {
                r: 180,
                opacity: 0,
                strokeWidth: 0.1,
                duration: 2.5,
                ease: 'power1.in'
            }, '-=0.8');
        }
    },

    createDimensionalRift(svg) {
        const svgNS = 'http://www.w3.org/2000/svg';
        
        // Crear distorsiones del espacio-tiempo más sutiles
        for (let i = 0; i < 4; i++) {
            const rift = document.createElementNS(svgNS, 'path');
            const angle = (i / 4) * Math.PI * 2;
            const length = 20 + Math.random() * 15;
            
            const startX = 200 + Math.cos(angle) * 110;
            const startY = 200 + Math.sin(angle) * 110;
            const endX = 200 + Math.cos(angle) * (110 + length);
            const endY = 200 + Math.sin(angle) * (110 + length);
            
            // Crear curva distorsionada más sutil
            const controlX = startX + Math.cos(angle + Math.PI/2) * 8;
            const controlY = startY + Math.sin(angle + Math.PI/2) * 8;
            
            const pathData = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
            rift.setAttribute('d', pathData);
            rift.setAttribute('stroke', '#0f0f0f');
            rift.setAttribute('stroke-width', '0.8');
            rift.setAttribute('opacity', '0');
            rift.setAttribute('fill', 'none');
            svg.appendChild(rift);
            
            // Animación de distorsión espacial más sutil
            gsap.to(rift, {
                opacity: 0.15,
                duration: 2,
                delay: i * 0.5,
                yoyo: true,
                repeat: -1,
                repeatDelay: 4,
                ease: 'power1.inOut'
            });
        }
    },

    getBlackHoleColor() {
        // Colores más vibrantes para las partículas
        const particleColors = [
            '#5a5aff', '#7a7aff', '#9a9aff', // Azules
            '#00ffff', '#40e0d0', '#20b2aa', // Cian
            '#9370db', '#8a2be2', // Púrpuras
            '#ff69b4' // Rosa
        ];
        return particleColors[Math.floor(Math.random() * particleColors.length)];
    },

    createAccretionDisk(svg) {
        const svgNS = 'http://www.w3.org/2000/svg';
        
        // Crear gradiente para el disco de acreción
        const diskGradient = document.createElementNS(svgNS, 'radialGradient');
        diskGradient.setAttribute('id', 'accretionGradient');
        diskGradient.setAttribute('cx', '0');
        diskGradient.setAttribute('cy', '0');
        diskGradient.setAttribute('r', '1');
        diskGradient.setAttribute('gradientTransform', 'rotate(90)');
        
        const gradientStops = [
            { offset: '0%', color: '#5a5aff', opacity: '0.8' },
            { offset: '30%', color: '#00ffff', opacity: '0.6' },
            { offset: '70%', color: '#ff69b4', opacity: '0.4' },
            { offset: '100%', color: '#9370db', opacity: '0.1' }
        ];
        
        gradientStops.forEach(stop => {
            const stopEl = document.createElementNS(svgNS, 'stop');
            stopEl.setAttribute('offset', stop.offset);
            stopEl.setAttribute('stop-color', stop.color);
            stopEl.setAttribute('stop-opacity', stop.opacity);
            diskGradient.appendChild(stopEl);
        });
        
        const defs = svg.querySelector('defs') || svg.insertBefore(document.createElementNS(svgNS, 'defs'), svg.firstChild);
        defs.appendChild(diskGradient);
        
        // Crear múltiples anillos del disco de acreción con colores más vibrantes
        for (let i = 0; i < 8; i++) {
            const ring = document.createElementNS(svgNS, 'ellipse');
            const radius = 120 + (i * 10);
            const rotation = i * 15;
            
            ring.setAttribute('cx', '200');
            ring.setAttribute('cy', '200');
            ring.setAttribute('rx', radius);
            ring.setAttribute('ry', radius * 0.3);
            ring.setAttribute('fill', 'none');
            ring.setAttribute('stroke', `url(#accretionGradient)`);
            ring.setAttribute('stroke-width', '1.5');
            ring.setAttribute('opacity', '0.6');
            ring.setAttribute('stroke-dasharray', `${10 + i * 2},${5 + i}`);
            ring.setAttribute('transform', `rotate(${rotation} 200 200)`);
            svg.appendChild(ring);
            
            // Rotación diferencial con diferentes velocidades
            gsap.to(ring, {
                rotation: 360 + rotation,
                duration: 20 + (i * 3),
                repeat: -1,
                ease: 'none',
                transformOrigin: 'center',
                transformBox: 'fill-box'
            });
            
            // Fluctuaciones de brillo y tamaño más dinámicas
            gsap.to(ring, {
                attr: { rx: radius * 1.1, ry: radius * 0.35 },
                opacity: 0.8 - (i * 0.08),
                duration: 3 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: Math.random() * 3
            });
        }
    },

    createGravitationalLensing(svg) {
        const svgNS = 'http://www.w3.org/2000/svg';
        
        // Crear efectos de lente gravitacional más visibles
        for (let i = 0; i < 12; i++) {
            const lens = document.createElementNS(svgNS, 'ellipse');
            const angle = (i / 12) * Math.PI * 2;
            const distance = 150 + Math.random() * 80;
            const size = 5 + Math.random() * 10;
            
            const x = 200 + Math.cos(angle) * distance;
            const y = 200 + Math.sin(angle) * distance;
            
            // Colores más vibrantes para las lentes
            const colors = ['#5a5aff', '#00ffff', '#ff69b4', '#9370db'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            lens.setAttribute('cx', x);
            lens.setAttribute('cy', y);
            lens.setAttribute('rx', size);
            lens.setAttribute('ry', size * 0.4);
            lens.setAttribute('fill', color);
            lens.setAttribute('opacity', '0.4');
            lens.setAttribute('filter', 'url(#glow)');
            svg.appendChild(lens);
            
            // Rotación orbital más dinámica
            gsap.to(lens, {
                rotation: 360 * (Math.random() > 0.5 ? 1 : -1),
                duration: 20 + Math.random() * 15,
                repeat: -1,
                ease: 'linear',
                transformOrigin: '200px 200px'
            });
            
            // Efecto de distorsión y brillo más dinámico
            gsap.to(lens, {
                attr: { rx: size * 1.5, ry: size * 0.8 },
                opacity: 0.7,
                duration: 2 + Math.random() * 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: Math.random() * 2
            });
            
            // Movimiento radial para simular órbitas excéntricas
            gsap.to(lens, {
                x: `+=${(Math.random() - 0.5) * 40}`,
                y: `+=${(Math.random() - 0.5) * 40}`,
                duration: 5 + Math.random() * 5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    },

    createJets(svg) {
        const svgNS = 'http://www.w3.org/2000/svg';
        
        // Jets polares del agujero negro
        for (let jetIndex = 0; jetIndex < 2; jetIndex++) {
            const jetDirection = jetIndex === 0 ? -1 : 1; // Arriba y abajo
            
            // Crear múltiples segmentos para cada jet
            for (let i = 0; i < 6; i++) {
                const jetSegment = document.createElementNS(svgNS, 'ellipse');
                const yOffset = jetDirection * (80 + i * 20);
                
                jetSegment.setAttribute('cx', '200');
                jetSegment.setAttribute('cy', 200 + yOffset);
                jetSegment.setAttribute('rx', 8 - i);
                jetSegment.setAttribute('ry', 15 + i * 3);
                jetSegment.setAttribute('fill', `rgba(${20 + i * 5}, ${20 + i * 5}, ${20 + i * 5}, ${0.4 - i * 0.05})`);
                jetSegment.setAttribute('opacity', '0.3');
                svg.appendChild(jetSegment);
                
                // Animación de pulso del jet
                gsap.to(jetSegment, {
                    scaleY: 1.3,
                    opacity: 0.5,
                    duration: 0.8 + Math.random() * 0.4,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power2.inOut',
                    delay: i * 0.1
                });
                
                // Movimiento ondulatorio
                gsap.to(jetSegment, {
                    x: 5,
                    duration: 2 + Math.random(),
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: Math.random()
                });
            }
        }
    },

    // Funciones para las animaciones de data flow - MEJORADAS
    createDataChannels(svg) {
        const channels = [
            { 
                path: 'M 50 150 Q 200 100 400 180 Q 600 250 750 200', 
                color: '#00f6ff',
                strokeWidth: '4',
                dashArray: '15,5'
            },
            { 
                path: 'M 50 250 Q 150 220 300 280 Q 500 340 750 300', 
                color: '#ff00e0',
                strokeWidth: '3',
                dashArray: '10,8'
            },
            { 
                path: 'M 50 350 Q 250 300 450 380 Q 650 440 750 400', 
                color: '#00ff88',
                strokeWidth: '3',
                dashArray: '12,6'
            },
            { 
                path: 'M 50 450 Q 200 420 400 480 Q 600 520 750 500', 
                color: '#ffaa00',
                strokeWidth: '2',
                dashArray: '8,4'
            }
        ];

        channels.forEach((channel, index) => {
            // Crear el path principal
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', channel.path);
            path.setAttribute('stroke', channel.color);
            path.setAttribute('stroke-width', channel.strokeWidth);
            path.setAttribute('fill', 'none');
            path.setAttribute('opacity', '0.7');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-dasharray', channel.dashArray);
            path.classList.add('data-channel');
            svg.appendChild(path);

            // Animar el dash pattern para efecto de flujo
            if (typeof gsap !== 'undefined') {
                gsap.to(path, {
                    strokeDashoffset: -100,
                    duration: 5 + index,
                    repeat: -1,
                    ease: 'none'
                });

                // Pulso de intensidad
                gsap.to(path, {
                    opacity: 1,
                    strokeWidth: parseInt(channel.strokeWidth) + 1,
                    duration: 2 + index * 0.5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            }

            // Crear paquetes que se mueven por el canal
            this.createMovingPackets(svg, channel, index);
        });
    },

    createMovingPackets(svg, channel, channelIndex) {
        // Crear múltiples paquetes por canal con mejor distribución y más actividad
        const packetCount = 6; // Más paquetes por canal
        
        for (let i = 0; i < packetCount; i++) {
            const createPacketAnimation = () => {
                const packet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                packet.setAttribute('r', '12'); // Paquetes más grandes
                packet.setAttribute('fill', channel.color);
                packet.setAttribute('stroke', '#ffffff');
                packet.setAttribute('stroke-width', '2');
                packet.setAttribute('opacity', '0');
                packet.setAttribute('filter', `drop-shadow(0 0 15px ${channel.color})`);
                svg.appendChild(packet);

                // Crear path invisible para seguimiento
                const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                pathElement.setAttribute('d', channel.path);
                pathElement.setAttribute('opacity', '0');
                svg.appendChild(pathElement);

                // Animar a lo largo del path
                if (typeof gsap !== 'undefined') {
                    const tl = gsap.timeline({ 
                        onComplete: () => {
                            packet.remove();
                            pathElement.remove();
                            // Crear nuevo paquete con delay aleatorio
                            setTimeout(createPacketAnimation, Math.random() * 2000 + 500);
                        }
                    });
                    
                    // Verificar si MotionPathPlugin está disponible
                    if (typeof MotionPathPlugin !== 'undefined') {
                        tl.fromTo(packet, 
                            { 
                                motionPath: { path: channel.path, start: 0 },
                                opacity: 0,
                                scale: 0.2
                            },
                            {
                                motionPath: { path: channel.path, end: 1 },
                                opacity: 1,
                                scale: 1,
                                duration: 4 + Math.random() * 2, // Velocidad consistente
                                ease: 'power1.inOut'
                            }
                        )
                        .to(packet, {
                            opacity: 0,
                            scale: 0.2,
                            duration: 0.5,
                            ease: 'power2.in'
                        }, '-=0.5');
                    } else {
                        // Fallback mejorado con mejor flujo
                        const pathLength = pathElement.getTotalLength();
                        
                        tl.to({}, {
                            duration: 4 + Math.random() * 2,
                            ease: 'power1.inOut',
                            onUpdate: function() {
                                const progress = this.progress();
                                const point = pathElement.getPointAtLength(progress * pathLength);
                                packet.setAttribute('cx', point.x);
                                packet.setAttribute('cy', point.y);
                                
                                // Suavizado de opacidad y escala
                                let opacity, scale;
                                if (progress < 0.2) {
                                    opacity = progress * 5; // Fade in
                                    scale = 0.2 + (progress * 4);
                                } else if (progress > 0.8) {
                                    opacity = (1 - progress) * 5; // Fade out
                                    scale = 0.2 + ((1 - progress) * 4);
                                } else {
                                    opacity = 1;
                                    scale = 1;
                                }
                                packet.setAttribute('opacity', opacity);
                                packet.setAttribute('transform', `scale(${scale})`);
                            }
                        });
                    }
                } else {
                    // Fallback sin GSAP - CSS animation
                    packet.style.animation = `packetFlow${channelIndex} ${4 + Math.random() * 2}s linear infinite`;
                    setTimeout(() => {
                        packet.remove();
                        pathElement.remove();
                        setTimeout(createPacketAnimation, Math.random() * 2000 + 500);
                    }, 6000);
                }
            };

            // Iniciar cada paquete con delay progresivo
            setTimeout(createPacketAnimation, (i * 800) + (channelIndex * 200) + Math.random() * 1000);
        }
    },

    createNetworkNodes(svg) {
        const nodes = [
            { x: 80, y: 180, type: 'input', color: '#00f6ff', size: 18 },
            { x: 200, y: 140, type: 'router', color: '#ff00e0', size: 15 },
            { x: 320, y: 220, type: 'switch', color: '#00ff88', size: 15 },
            { x: 450, y: 280, type: 'server', color: '#ffaa00', size: 18 },
            { x: 580, y: 200, type: 'gateway', color: '#ff4400', size: 15 },
            { x: 720, y: 240, type: 'output', color: '#aa00ff', size: 18 }
        ];

        nodes.forEach((node, index) => {
            // Nodo principal más grande
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', node.x);
            circle.setAttribute('cy', node.y);
            circle.setAttribute('r', node.size);
            circle.setAttribute('fill', 'rgba(0, 0, 0, 0.4)');
            circle.setAttribute('stroke', node.color);
            circle.setAttribute('stroke-width', '3');
            circle.setAttribute('opacity', '0.9');
            circle.setAttribute('filter', `drop-shadow(0 0 20px ${node.color})`);
            svg.appendChild(circle);

            // Múltiples anillos pulsantes
            for (let ring = 1; ring <= 3; ring++) {
                const outerRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                outerRing.setAttribute('cx', node.x);
                outerRing.setAttribute('cy', node.y);
                outerRing.setAttribute('r', node.size + (ring * 8));
                outerRing.setAttribute('fill', 'none');
                outerRing.setAttribute('stroke', node.color);
                outerRing.setAttribute('stroke-width', '1');
                outerRing.setAttribute('opacity', '0');
                svg.appendChild(outerRing);

                // Animación de ondas expansivas
                if (typeof gsap !== 'undefined') {
                    gsap.to(outerRing, {
                        scale: 1.5,
                        opacity: 0.3,
                        duration: 2,
                        repeat: -1,
                        ease: 'power2.out',
                        delay: (index * 0.3) + (ring * 0.5)
                    });
                }
            }

            // Etiqueta del tipo de nodo
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', node.x);
            text.setAttribute('y', node.y - 35);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#ffffff');
            text.setAttribute('font-size', '12');
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('opacity', '0.8');
            text.textContent = node.type.toUpperCase();
            svg.appendChild(text);

            // Indicador de actividad
            const indicator = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            indicator.setAttribute('cx', node.x + node.size - 5);
            indicator.setAttribute('cy', node.y - node.size + 5);
            indicator.setAttribute('r', '4');
            indicator.setAttribute('fill', '#00ff00');
            indicator.setAttribute('opacity', '0.7');
            svg.appendChild(indicator);

            // Agregar animaciones mejoradas
            if (typeof gsap !== 'undefined') {
                // Pulso del nodo principal
                gsap.to(circle, {
                    scale: 1.2,
                    duration: 1.5 + index * 0.2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: Math.random() * 2
                });

                // Parpadeo del indicador de actividad
                gsap.to(indicator, {
                    opacity: 1,
                    scale: 1.3,
                    duration: 0.5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power2.inOut',
                    delay: Math.random() * 1
                });
            }
        });
    },

    createBandwidthMonitors(svg) {
        // Crear monitores de ancho de banda mejorados
        const monitors = [
            { x: 20, y: 50, color: '#00f6ff', label: 'INCOMING', value: 'TCP' },
            { x: 20, y: 150, color: '#ff00e0', label: 'PROCESSING', value: 'UDP' },
            { x: 20, y: 250, color: '#00ff88', label: 'OUTGOING', value: 'HTTP' },
            { x: 20, y: 350, color: '#ffaa00', label: 'LATENCY', value: 'ICMP' }
        ];

        monitors.forEach((monitor, index) => {
            // Contenedor del monitor más grande
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', monitor.x);
            rect.setAttribute('y', monitor.y);
            rect.setAttribute('width', '120'); // Más ancho
            rect.setAttribute('height', '70'); // Más alto
            rect.setAttribute('fill', 'rgba(0, 0, 0, 0.6)');
            rect.setAttribute('stroke', monitor.color);
            rect.setAttribute('stroke-width', '2');
            rect.setAttribute('rx', '8');
            rect.setAttribute('filter', `drop-shadow(0 0 10px ${monitor.color})`);
            svg.appendChild(rect);

            // Etiqueta del monitor
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', monitor.x + 60);
            label.setAttribute('y', monitor.y + 20);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('fill', monitor.color);
            label.setAttribute('font-size', '11');
            label.setAttribute('font-weight', 'bold');
            label.textContent = monitor.label;
            svg.appendChild(label);

            // Valor del protocolo
            const value = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            value.setAttribute('x', monitor.x + 60);
            value.setAttribute('y', monitor.y + 35);
            value.setAttribute('text-anchor', 'middle');
            value.setAttribute('fill', '#ffffff');
            value.setAttribute('font-size', '9');
            value.setAttribute('opacity', '0.8');
            value.textContent = monitor.value;
            svg.appendChild(value);

            // Barra de progreso más grande
            const progressBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            progressBg.setAttribute('x', monitor.x + 10);
            progressBg.setAttribute('y', monitor.y + 45);
            progressBg.setAttribute('width', '100');
            progressBg.setAttribute('height', '12');
            progressBg.setAttribute('fill', 'rgba(255, 255, 255, 0.1)');
            progressBg.setAttribute('rx', '6');
            svg.appendChild(progressBg);

            const progressBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            progressBar.setAttribute('x', monitor.x + 10);
            progressBar.setAttribute('y', monitor.y + 45);
            progressBar.setAttribute('width', '0');
            progressBar.setAttribute('height', '12');
            progressBar.setAttribute('fill', monitor.color);
            progressBar.setAttribute('opacity', '0.8');
            progressBar.setAttribute('rx', '6');
            svg.appendChild(progressBar);

            // Animación de la barra de progreso
            if (typeof gsap !== 'undefined') {
                gsap.to(progressBar, {
                    width: 80 + Math.random() * 20,
                    duration: 2 + Math.random() * 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power2.inOut',
                    delay: index * 0.5
                });

                // Pulso del contenedor
                gsap.to(rect, {
                    strokeWidth: 3,
                    duration: 1.5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: Math.random() * 2
                });
            }
        });
    },
    
    animateProgressBar(progressBar, index) {
        if (typeof gsap !== 'undefined') {
            gsap.to(progressBar, {
                width: 70,
                duration: 2 + index * 0.5,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut',
                delay: index * 0.3
            });
        }
    },

    createNetworkGrid(svg) {
        // Crear grilla de conexiones de red para dar más contexto visual
        const gridLines = [];
        
        // Líneas horizontales
        for (let y = 100; y <= 500; y += 100) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', '150');
            line.setAttribute('y1', y);
            line.setAttribute('x2', '650');
            line.setAttribute('y2', y);
            line.setAttribute('stroke', 'rgba(255, 255, 255, 0.05)');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('stroke-dasharray', '5,10');
            svg.appendChild(line);
            gridLines.push(line);
        }

        // Líneas verticales
        for (let x = 200; x <= 600; x += 100) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x);
            line.setAttribute('y1', '100');
            line.setAttribute('x2', x);
            line.setAttribute('y2', '500');
            line.setAttribute('stroke', 'rgba(255, 255, 255, 0.05)');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('stroke-dasharray', '5,10');
            svg.appendChild(line);
            gridLines.push(line);
        }

        // Animar el dash offset para crear efecto de movimiento
        if (typeof gsap !== 'undefined') {
            gridLines.forEach((line, index) => {
                gsap.to(line, {
                    strokeDashoffset: -20,
                    duration: 8 + (index % 3) * 2,
                    repeat: -1,
                    ease: 'none'
                });
            });
        }
        
        // Agregar líneas de fondo adicionales para mejor efecto visual
        for (let i = 0; i < 800; i += 80) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', i);
            line.setAttribute('y1', '0');
            line.setAttribute('x2', i);
            line.setAttribute('y2', '400');
            line.setAttribute('stroke', 'rgba(255, 255, 255, 0.03)');
            line.setAttribute('stroke-width', '1');
            svg.appendChild(line);
        }
        
        for (let i = 0; i < 400; i += 80) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', '0');
            line.setAttribute('y1', i);
            line.setAttribute('x2', '800');
            line.setAttribute('y2', i);
            line.setAttribute('stroke', 'rgba(255, 255, 255, 0.03)');
            line.setAttribute('stroke-width', '1');
            svg.appendChild(line);
        }
    },

    createNodeConnections(svg) {
        // Definir conexiones entre nodos específicos
        const connections = [
            { from: { x: 80, y: 180 }, to: { x: 200, y: 140 }, color: '#00f6ff' },
            { from: { x: 200, y: 140 }, to: { x: 320, y: 220 }, color: '#ff00e0' },
            { from: { x: 320, y: 220 }, to: { x: 450, y: 280 }, color: '#00ff88' },
            { from: { x: 450, y: 280 }, to: { x: 580, y: 200 }, color: '#ffaa00' },
            { from: { x: 580, y: 200 }, to: { x: 720, y: 240 }, color: '#aa00ff' },
            // Conexiones adicionales
            { from: { x: 200, y: 140 }, to: { x: 450, y: 280 }, color: '#ffffff' },
            { from: { x: 320, y: 220 }, to: { x: 720, y: 240 }, color: '#ffffff' }
        ];

        connections.forEach((conn, index) => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', conn.from.x);
            line.setAttribute('y1', conn.from.y);
            line.setAttribute('x2', conn.to.x);
            line.setAttribute('y2', conn.to.y);
            line.setAttribute('stroke', conn.color);
            line.setAttribute('stroke-width', index < 5 ? '2' : '1');
            line.setAttribute('opacity', index < 5 ? '0.6' : '0.3');
            line.setAttribute('stroke-dasharray', index < 5 ? '8,4' : '4,8');
            svg.appendChild(line);

            // Animar las conexiones
            if (typeof gsap !== 'undefined') {
                gsap.to(line, {
                    strokeDashoffset: -20,
                    duration: 3 + (index % 3),
                    repeat: -1,
                    ease: 'none'
                });

                // Pulso ocasional de intensidad
                gsap.to(line, {
                    opacity: (index < 5 ? 0.9 : 0.6),
                    strokeWidth: (index < 5 ? 3 : 2),
                    duration: 1.5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: Math.random() * 3
                });
            }
        });
    },

    animateStatusIndicators(svg) {
        // Crear indicadores de estado en diferentes puntos
        const statusPoints = [
            { x: 750, y: 50, color: '#00ff00', status: 'ONLINE' },
            { x: 750, y: 100, color: '#ffff00', status: 'SYNC' },
            { x: 750, y: 150, color: '#ff4400', status: 'LOAD' },
            { x: 750, y: 200, color: '#ff00e0', status: 'PROC' }
        ];

        statusPoints.forEach((point, index) => {
            // Círculo indicador
            const indicator = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            indicator.setAttribute('cx', point.x);
            indicator.setAttribute('cy', point.y);
            indicator.setAttribute('r', '8');
            indicator.setAttribute('fill', point.color);
            indicator.setAttribute('opacity', '0.7');
            indicator.setAttribute('filter', `drop-shadow(0 0 10px ${point.color})`);
            svg.appendChild(indicator);

            // Etiqueta del estado
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', point.x - 35);
            label.setAttribute('y', point.y + 5);
            label.setAttribute('text-anchor', 'end');
            label.setAttribute('fill', point.color);
            label.setAttribute('font-size', '10');
            label.setAttribute('font-weight', 'bold');
            label.textContent = point.status;
            svg.appendChild(label);

            // Animación de parpadeo
            if (typeof gsap !== 'undefined') {
                gsap.to(indicator, {
                    opacity: 1,
                    scale: 1.2,
                    duration: 0.8 + (index * 0.2),
                    repeat: -1,
                    yoyo: true,
                    ease: 'power2.inOut'
                });
            }
        });
        
        // Crear indicadores de estado
        const indicator = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        indicator.setAttribute('cx', '750');
        indicator.setAttribute('cy', '50');
        indicator.setAttribute('r', '6');
        indicator.setAttribute('fill', '#00ff88');
        indicator.setAttribute('opacity', '1'); // Inicializar opacity
        svg.appendChild(indicator);

        // Animar parpadeo de forma segura
        if (typeof gsap !== 'undefined') {
            gsap.to(indicator, {
                opacity: 0.3,
                duration: 1,
                repeat: -1,
                yoyo: true,
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
