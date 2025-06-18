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

        ScrollTrigger.create({
            trigger: container,
            start: "top 80%",
            once: true,
            onEnter: () => {
                console.log('Data flow animation container entered viewport, creating animation.');
                container.innerHTML = '';
        
                const svgNS = 'http://www.w3.org/2000/svg';
                const svg = document.createElementNS(svgNS, 'svg');
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                svg.setAttribute('viewBox', '0 0 800 400');
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                container.appendChild(svg);

                this.createGradients(svg);
                
                const channels = [
                    { path: 'M 50 100 Q 200 50 400 120 Q 600 190 750 150', color: '#00f6ff' },
                    { path: 'M 50 200 Q 150 180 300 220 Q 500 260 750 230', color: '#ff00e0' },
                    { path: 'M 50 300 Q 250 250 450 300 Q 650 350 750 310', color: '#00ff88' }
                ];

                channels.forEach((channel, index) => {
                    const createdPath = this.createDataChannel(svg, channel, index);
                    this.createDataPackets(svg, channel, createdPath, index);
                });

                console.log('Data flow animation setup complete.');
            }
        });
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
            { offset: '15%', color: '#1a1a1a', opacity: '1' },
            { offset: '30%', color: '#2a2a2a', opacity: '0.95' },
            { offset: '50%', color: '#3a3a3a', opacity: '0.8' },
            { offset: '80%', color: '#4a4a4a', opacity: '0.4' },
            { offset: '100%', color: '#5a5a5a', opacity: '0.1' }
        ];
        
        stops.forEach(stop => {
            const stopEl = document.createElementNS(svgNS, 'stop');
            stopEl.setAttribute('offset', stop.offset);
            stopEl.setAttribute('stop-color', stop.color);
            stopEl.setAttribute('stop-opacity', stop.opacity);
            blackHoleGradient.appendChild(stopEl);
        });
        defs.appendChild(blackHoleGradient);
        
        // Portal principal (singularidad) - más oscuro
        const portal = document.createElementNS(svgNS, 'circle');
        portal.setAttribute('cx', '200');
        portal.setAttribute('cy', '200');
        portal.setAttribute('r', '70');
        portal.setAttribute('fill', 'url(#blackHoleGradient)');
        portal.setAttribute('opacity', '0.95');
        svg.appendChild(portal);
        
        // Horizonte de eventos - más sutil
        const eventHorizon = document.createElementNS(svgNS, 'circle');
        eventHorizon.setAttribute('cx', '200');
        eventHorizon.setAttribute('cy', '200');
        eventHorizon.setAttribute('r', '90');
        eventHorizon.setAttribute('fill', 'none');
        eventHorizon.setAttribute('stroke', '#4a4a4a');
        eventHorizon.setAttribute('stroke-width', '2');
        eventHorizon.setAttribute('opacity', '0.7');
        eventHorizon.setAttribute('stroke-dasharray', '8,4');
        svg.appendChild(eventHorizon);
        
        // Eliminar el disco de acreción exterior que causaba el segundo círculo
        
        // Animaciones del agujero negro - más lentas y sutiles
        gsap.to(portal, {
            rotation: 360,
            duration: 25,
            repeat: -1,
            ease: 'none',
            transformOrigin: 'center'
        });
        
        gsap.to(eventHorizon, {
            rotation: -360,
            duration: 35,
            repeat: -1,
            ease: 'none',
            transformOrigin: 'center'
        });
        
        // Pulso gravitacional más sutil
        gsap.to(portal, {
            r: 75,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
        
        // Distorsión del horizonte de eventos más sutil
        gsap.to(eventHorizon, {
            r: 95,
            opacity: 0.4,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
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
        // Colores más visibles para el agujero negro
        const visibleDarkColors = ['#2a2a2a', '#3a3a3a', '#4a4a4a', '#5a5a5a', '#404040'];
        return visibleDarkColors[Math.floor(Math.random() * visibleDarkColors.length)];
    },

    createAccretionDisk(svg) {
        const svgNS = 'http://www.w3.org/2000/svg';
        
        // Crear múltiples anillos del disco de acreción
        for (let i = 0; i < 5; i++) {
            const ring = document.createElementNS(svgNS, 'circle');
            const radius = 130 + (i * 15);
            
            ring.setAttribute('cx', '200');
            ring.setAttribute('cy', '200');
            ring.setAttribute('r', radius);
            ring.setAttribute('fill', 'none');
            ring.setAttribute('stroke', `rgba(${30 + i * 10}, ${30 + i * 10}, ${30 + i * 10}, ${0.3 - i * 0.05})`);
            ring.setAttribute('stroke-width', '1');
            ring.setAttribute('opacity', '0.4');
            ring.setAttribute('stroke-dasharray', `${8 + i * 2},${4 + i}`);
            svg.appendChild(ring);
            
            // Rotación diferencial (más rápido cerca del agujero negro)
            gsap.to(ring, {
                rotation: 360,
                duration: 15 + (i * 5),
                repeat: -1,
                ease: 'none',
                transformOrigin: 'center'
            });
            
            // Fluctuaciones de brillo
            gsap.to(ring, {
                opacity: 0.6 - (i * 0.1),
                duration: 2 + Math.random() * 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: Math.random() * 2
            });
        }
    },

    createGravitationalLensing(svg) {
        const svgNS = 'http://www.w3.org/2000/svg';
        
        // Crear efectos de lente gravitacional
        for (let i = 0; i < 8; i++) {
            const lens = document.createElementNS(svgNS, 'ellipse');
            const angle = (i / 8) * Math.PI * 2;
            const distance = 180 + Math.random() * 40;
            
            const x = 200 + Math.cos(angle) * distance;
            const y = 200 + Math.sin(angle) * distance;
            
            lens.setAttribute('cx', x);
            lens.setAttribute('cy', y);
            lens.setAttribute('rx', 8 + Math.random() * 6);
            lens.setAttribute('ry', 3 + Math.random() * 3);
            lens.setAttribute('fill', '#2a2a2a');
            lens.setAttribute('opacity', '0.2');
            svg.appendChild(lens);
            
            // Rotación orbital y distorsión
            gsap.to(lens, {
                rotation: 360,
                duration: 8 + Math.random() * 6,
                repeat: -1,
                ease: 'none',
                transformOrigin: '200px 200px'
            });
            
            // Efecto de distorsión
            gsap.to(lens, {
                scaleY: 0.5,
                duration: 1.5 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: Math.random() * 2
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
