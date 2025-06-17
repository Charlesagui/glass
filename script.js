document.addEventListener('DOMContentLoaded', () => {
    console.log('IA Deslumbrante - Sistema de animaciones extremas activado');

    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    // Detectar si es móvil para optimizar animaciones
    // --- CONFIGURACIÓN DE VELOCIDAD Y EFECTOS EXTREMOS ---
    const EXTREME_SPEED = 0.3;
    const ROTATION_INTENSITY = 360;
    const SCALE_INTENSITY = 2;

    // Detectar si es móvil para optimizar animaciones
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const speed = isMobile ? 0.5 : EXTREME_SPEED;

    // CURSOR PERSONALIZADO PARA DESKTOP
    if (!isMobile) {
        // Crear cursor principal
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        // Crear trail del cursor
        const cursorTrail = document.createElement('div');
        cursorTrail.className = 'cursor-trail';
        document.body.appendChild(cursorTrail);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let trailX = 0, trailY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Animación suave del cursor
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            
            trailX += (mouseX - trailX) * 0.05;
            trailY += (mouseY - trailY) * 0.05;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            cursorTrail.style.left = trailX + 'px';
            cursorTrail.style.top = trailY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Efectos al hacer clic
        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.background = 'radial-gradient(circle, var(--color-accent2), var(--color-accent3))';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = '';
        });

        // Efectos al pasar sobre elementos interactivos
        const interactiveElements = document.querySelectorAll('h1, h2, p, .hero-orb, .nn-node, .flow-particle');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(2)';
                cursor.style.opacity = '1';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.opacity = '0.8';
            });
        });
    }


    
    // --- ELEMENTOS PRINCIPALES ---
    const heroSection = document.getElementById('hero');
    const concept1Section = document.getElementById('concept1');
    const concept2Section = document.getElementById('concept2');
    const closingSection = document.getElementById('closing');

    // Hero elements
    let heroOrb, heroTitle, heroParagraph;
    if (heroSection) {
        heroOrb = heroSection.querySelector('.hero-orb');
        heroTitle = heroSection.querySelector('h1');
        heroParagraph = heroSection.querySelector('p');
    }

    // Concept1 elements
    let concept1Title, concept1Animation, concept1Paragraph, nnNodes;
    if (concept1Section) {
        concept1Title = concept1Section.querySelector('h2');
        concept1Animation = concept1Section.querySelector('.neural-network-animation');
        concept1Paragraph = concept1Section.querySelector('p');
        nnNodes = concept1Section.querySelectorAll('.nn-node');
    }

    // Concept2 elements
    let concept2Title, dataFlowContainer, flowParticles, concept2Paragraph;
    if (concept2Section) {
        concept2Title = concept2Section.querySelector('h2');
        dataFlowContainer = concept2Section.querySelector('.data-flow-animation');
        flowParticles = concept2Section.querySelectorAll('.flow-particle');
        concept2Paragraph = concept2Section.querySelector('p');
    }

    // Closing elements
    let closingTitle, closingContainer, closingFragments, closingParagraph;
    if (closingSection) {
        closingTitle = closingSection.querySelector('h2');
        closingContainer = closingSection.querySelector('.closing-animation-container');
        closingFragments = closingSection.querySelectorAll('.closing-fragment');
        closingParagraph = closingSection.querySelector('p');
    }

    // --- ESTADOS INICIALES EXTREMOS ---
    gsap.set([concept1Section, concept2Section, closingSection], { 
        autoAlpha: 0, 
        scale: 0.5, 
        rotationY: 45,
        transformOrigin: "center center"
    });

    gsap.set([concept1Title, concept2Title, closingTitle], { 
        opacity: 0, 
        y: 100, 
        rotationX: 90,
        scale: 0.5
    });

    gsap.set([concept1Paragraph, concept2Paragraph, closingParagraph], { 
        opacity: 0, 
        y: 80, 
        x: -200,
        rotation: -45
    });

    gsap.set(concept1Animation, { 
        opacity: 0, 
        scale: 0.3, 
        rotation: 180,
        y: 100
    });

    gsap.set(dataFlowContainer, { 
        opacity: 0, 
        scale: 0.2, 
        rotation: -180,
        skewX: 45
    });

    gsap.set(closingContainer, { 
        opacity: 0, 
        scale: 0.1, 
        rotation: 270,
        transformOrigin: "center center"
    });

    // --- ANIMACIONES CONTINUAS DURANTE SCROLL ---
    
    // HERO ORBE - Efectos extremos mientras haces scroll
    if (heroOrb) {
        gsap.to(heroOrb, {
        rotation: 360,
        scale: 1.5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
        });
    }

    // HERO SALIDA - Mientras haces scroll hacia abajo
    if (heroSection && heroOrb && heroTitle && heroParagraph) {
        gsap.timeline({
        scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: EXTREME_SPEED,
            onUpdate: (self) => {
                const progress = self.progress;
                // Efectos extremos basados en progreso del scroll
                gsap.set(heroOrb, {
                    scale: 1 + progress * 2,
                    rotation: progress * 720,
                    opacity: 1 - progress,
                    filter: `hue-rotate(${progress * 360}deg) saturate(${1 + progress * 3})`
                });
                
                gsap.set(heroTitle, {
                    x: -progress * 800,
                    rotation: -progress * 180,
                    scale: 1 - progress * 0.5,
                    opacity: 1 - progress
                });
                
                gsap.set(heroParagraph, {
                    x: progress * 800,
                    rotation: progress * 180,
                    scale: 1 - progress * 0.5,
                    opacity: 1 - progress
                });
            }
        }
    });
    }

    // CONCEPTO 1 ENTRADA - Animación extrema al hacer scroll
    gsap.timeline({
        scrollTrigger: {
            trigger: concept1Section,
            start: "top bottom",
            end: "center center",
            scrub: EXTREME_SPEED,
            onUpdate: (self) => {
                const progress = self.progress;
                
                gsap.set(concept1Section, {
                    autoAlpha: progress,
                    scale: 0.5 + progress * 0.5,
                    rotationY: 45 - progress * 45,
                    rotationX: progress * 360
                });
                
                gsap.set(concept1Title, {
                    opacity: progress,
                    y: 100 - progress * 100,
                    rotationX: 90 - progress * 90,
                    scale: 0.5 + progress * 0.5,
                    filter: `brightness(${1 + progress * 2})`
                });
                
                gsap.set(concept1Animation, {
                    opacity: progress,
                    scale: 0.3 + progress * 0.7,
                    rotation: 180 - progress * 180,
                    y: 100 - progress * 100
                });
                
                gsap.set(concept1Paragraph, {
                    opacity: progress,
                    y: 80 - progress * 80,
                    x: -200 + progress * 200,
                    rotation: -45 + progress * 45
                });
            }
        }
    });

    // NODOS NEURONALES - Animación continua extrema
    nnNodes.forEach((node, index) => {
        gsap.to(node, {
            scale: 1.5,
            rotation: 360,
            backgroundColor: "hsl(" + (index * 60) + ", 100%, 50%)",
            duration: 1 + index * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "elastic.inOut(1, 0.5)",
            delay: index * 0.2
        });
        
        // Pulso continuo
        gsap.to(node, {
            boxShadow: "0 0 30px currentColor, 0 0 60px currentColor",
            duration: 0.8,
            repeat: -1,
            yoyo: true
        });
    });

    // CONCEPTO 1 SALIDA Y CONCEPTO 2 ENTRADA
    gsap.timeline({
        scrollTrigger: {
            trigger: concept1Section,
            start: "center top",
            end: "bottom top",
            scrub: EXTREME_SPEED,
            onUpdate: (self) => {
                const progress = self.progress;
                
                // Salida extrema de Concepto 1
                gsap.set(concept1Section, {
                    scale: 1 - progress * 0.5,
                    rotationY: progress * -90,
                    rotationZ: progress * 180,
                    opacity: 1 - progress,
                    filter: `blur(${progress * 10}px)`
                });
                
                // Entrada extrema de Concepto 2
                gsap.set(concept2Section, {
                    autoAlpha: progress,
                    scale: 0.5 + progress * 0.5,
                    rotationY: 45 - progress * 45,
                    rotationX: progress * -360
                });
                
                gsap.set(concept2Title, {
                    opacity: progress,
                    y: 100 - progress * 100,
                    rotationX: 90 - progress * 90,
                    scale: 0.5 + progress * 0.5,
                    textShadow: `0 0 ${progress * 20}px currentColor`
                });
                
                gsap.set(dataFlowContainer, {
                    opacity: progress,
                    scale: 0.2 + progress * 0.8,
                    rotation: -180 + progress * 180,
                    skewX: 45 - progress * 45
                });
                
                gsap.set(concept2Paragraph, {
                    opacity: progress,
                    y: 80 - progress * 80,
                    x: -200 + progress * 200,
                    rotation: -45 + progress * 45
                });
            }
        }
    });

    // PARTÍCULAS DE FLUJO - Animación mejorada
    flowParticles.forEach((particle, index) => {
        const colors = ['#00f6ff', '#ff00e0', '#00ff88', '#ff4400'];
        
        gsap.set(particle, {
            width: Math.random() * 10 + 8,
            height: Math.random() * 10 + 8,
            backgroundColor: colors[index % colors.length],
            x: Math.random() * 300,
            y: Math.random() * 150
        });
        
        // Movimiento más suave y orgánico
        gsap.to(particle, {
            x: `+=${Math.random() * 200 - 100}`,
            y: `+=${Math.random() * 100 - 50}`,
            scale: () => 0.5 + Math.random() * 1.5,
            rotation: 180,
            backgroundColor: () => colors[Math.floor(Math.random() * colors.length)],
            duration: 2 + Math.random() * 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * 2
        });
        
        // Brillo sutil
        gsap.to(particle, {
            boxShadow: "0 0 15px currentColor",
            duration: 1 + Math.random(),
            repeat: -1,
            yoyo: true,
            delay: Math.random()
        });
    });

    // CONCEPTO 2 SALIDA Y CIERRE ENTRADA
    gsap.timeline({
        scrollTrigger: {
            trigger: concept2Section,
            start: "center top",
            end: "bottom top",
            scrub: EXTREME_SPEED,
            onUpdate: (self) => {
                const progress = self.progress;
                
                // Salida extrema de Concepto 2
                gsap.set(concept2Section, {
                    scale: 1 - progress * 0.8,
                    rotationX: progress * 180,
                    rotationZ: progress * -270,
                    opacity: 1 - progress,
                    filter: `blur(${progress * 15}px) hue-rotate(${progress * 180}deg)`
                });
                
                // Entrada extrema de Cierre
                gsap.set(closingSection, {
                    autoAlpha: progress,
                    scale: 0.5 + progress * 0.5,
                    rotationY: 45 - progress * 45
                });
                
                gsap.set(closingTitle, {
                    opacity: progress,
                    y: 100 - progress * 100,
                    rotationX: 90 - progress * 90,
                    scale: 0.5 + progress * 0.5,
                    background: `linear-gradient(45deg, hsl(${progress * 360}, 100%, 50%), hsl(${progress * 360 + 180}, 100%, 50%))`,
                    backgroundClip: "text",
                    webkitBackgroundClip: "text",
                    color: "transparent"
                });
                
                gsap.set(closingContainer, {
                    opacity: progress,
                    scale: 0.1 + progress * 0.9,
                    rotation: 270 - progress * 270
                });
                
                gsap.set(closingParagraph, {
                    opacity: progress,
                    y: 80 - progress * 80,
                    x: -200 + progress * 200,
                    rotation: -45 + progress * 45
                });
            }
        }
    });

    // FRAGMENTOS DE CIERRE - Animación extrema
    closingFragments.forEach((fragment, index) => {

        
        gsap.set(fragment, {
            width: 15 + Math.random() * 10,
            height: 15 + Math.random() * 10,
            backgroundColor: ['#00f6ff', '#ff00e0', '#ffffff', '#00ff88'][index % 4]
        });
        
        // Animación orbital extrema
        gsap.to(fragment, {
            rotation: 360,
            scale: 2,
            duration: 2 + index * 0.5,
            repeat: -1,
            ease: "power2.inOut"
        });
        
        // Movimiento circular simple sin MotionPath
        const radius = 100;
        const centerX = 50; // Porcentaje del contenedor
        const centerY = 50;
        const angle = (index / closingFragments.length) * Math.PI * 2;
        
        gsap.to(fragment, {
            rotation: 360,
            scale: 2,
            duration: 2 + index * 0.5,
            repeat: -1,
            ease: "power2.inOut"
        });
        
        // Animación circular manual
        gsap.to(fragment, {
            rotation: 360,
            transformOrigin: `${centerX}px ${centerY}px`,
            duration: 3 + index * 0.3,
            repeat: -1,
            ease: "none"
        });
        
        gsap.to(fragment, {
            boxShadow: "0 0 25px currentColor, 0 0 50px currentColor",
            backgroundColor: () => ['#00f6ff', '#ff00e0', '#ffffff', '#00ff88'][Math.floor(Math.random() * 4)],
            duration: 1,
            repeat: -1,
            yoyo: true
        });
    });

    // EFECTOS DE PARTÍCULAS GLOBALES EN EL SCROLL - Optimizado para móvil
    if (!isMobile) {
        ScrollTrigger.create({
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                const progress = self.progress;
                document.body.style.filter = `hue-rotate(${progress * 180}deg) saturate(${1 + progress * 0.3})`;
            }
        });
    }

    console.log('🚀 Sistema de animaciones extremas completamente activado');
});
