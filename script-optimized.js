document.addEventListener('DOMContentLoaded', () => {
    console.log('IA Deslumbrante - Sistema de animaciones optimizado');

    // Registrar plugins de GSAP
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
    
    // Configuración de animaciones
    const config = {
        isMobile: window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        speed: 0.5, // Velocidad base para móviles
        desktopSpeed: 0.3, // Velocidad para desktop
        rotationIntensity: 180, // Reducida para mejor rendimiento
        scaleIntensity: 1.3 // Reducida para mejor rendimiento
    };
    
    // Prevenir scroll horizontal
    document.body.style.overflowX = 'hidden';

    // Optimización: Usar requestAnimationFrame para el cursor
    let lastTime = 0;
    const throttle = (callback, limit) => {
        return function() {
            const now = Date.now();
            if (now - lastTime >= limit) {
                callback.apply(this, arguments);
                lastTime = now;
            }
        };
    };

    // Inicializar el cursor personalizado
    initCustomCursor();
    
    // Forzar recálculo de estilos para evitar parpadeo
    document.body.style.opacity = '1';

    // Inicializar animaciones de secciones
    initSectionAnimations();

    // Inicializar animaciones de elementos
    initElementAnimations();

    /**
     * Inicializa el cursor personalizado
     */
    function initCustomCursor() {
        // Solo en desktop
        if (config.isMobile) {
            document.body.style.cursor = 'auto';
            return;
        }
        
        // Crear elementos del cursor
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        const cursorTrail = document.createElement('div');
        cursorTrail.className = 'cursor-trail';
        document.body.appendChild(cursorTrail);

        // Variables de posición
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let trailX = 0, trailY = 0;
        let isVisible = true;
        
        // Ocultar cursor estándar
        document.body.style.cursor = 'none';
        
        // Actualizar posición del mouse
        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Mostrar cursor si estaba oculto
            if (!isVisible) {
                cursor.style.opacity = '0.8';
                cursorTrail.style.opacity = '0.3';
                isVisible = true;
            }
        };
        
        // Ocultar cursor cuando salga de la ventana
        const handleTrailMouseLeave = () => {
            cursor.style.opacity = '0';
            cursorTrail.style.opacity = '0';
            isVisible = false;
        };
        
        // Event listeners
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleTrailMouseLeave);
        document.addEventListener('mouseenter', handleMouseMove);
        
        // Animación suave del cursor
        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            
            trailX += (mouseX - trailX) * 0.05;
            trailY += (mouseY - trailY) * 0.05;
            
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
            cursorTrail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;
            
            requestAnimationFrame(animateCursor);
        };
        
        // Iniciar animación
        requestAnimationFrame(animateCursor);

        // Efectos de interacción
        const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover]');
        
        const handleMouseEnter = () => {
            gsap.to(cursor, { scale: 2, duration: 0.2 });
            gsap.to(cursor, { backgroundColor: 'var(--color-accent2)' });
        };
        
        const handleMouseLeave = () => {
            gsap.to(cursor, { scale: 1, duration: 0.2 });
            gsap.to(cursor, { backgroundColor: 'radial-gradient(circle, var(--color-accent1), var(--color-accent2))' });
        };
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
            el.style.cursor = 'none';
        });
        
        // Limpiar event listeners al desmontar
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleTrailMouseLeave);
            document.removeEventListener('mouseenter', handleMouseMove);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
            if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
            if (cursorTrail.parentNode) cursorTrail.parentNode.removeChild(cursorTrail);
        };
    }

    /**
     * Inicializa las animaciones de las secciones
     */
    function initSectionAnimations() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            const title = section.querySelector('h2');
            const content = section.querySelector('p');
            const animation = section.querySelector('.neural-network-animation, .data-flow-animation, .closing-animation-container');
            
            // Configuración inicial
            gsap.set(section, { autoAlpha: 0, scale: 0.8 });
            gsap.set([title, content], { y: 50, opacity: 0 });
            if (animation) gsap.set(animation, { scale: 0.8, opacity: 0 });
            
            // Animación al hacer scroll
            ScrollTrigger.create({
                trigger: section,
                start: 'top 80%',
                end: 'top 20%',
                onEnter: () => {
                    const tl = gsap.timeline();
                    tl.to(section, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out' })
                      .to(title, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
                      .to(content, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4');
                    
                    if (animation) {
                        tl.to(animation, { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }, '-=0.4');
                    }
                },
                once: true // Solo animar una vez
            });
        });
    }

    /**
     * Inicializa animaciones de elementos específicos
     */
    function initElementAnimations() {
        // Animación del orbe hero
        const heroOrb = document.querySelector('.hero-orb');
        if (heroOrb) {
            gsap.to(heroOrb, {
                rotation: 360,
                duration: 20,
                repeat: -1,
                ease: 'none',
                transformOrigin: 'center center'
            });
        }

        // Animación de nodos neuronales
        const nnNodes = document.querySelectorAll('.nn-node');
        nnNodes.forEach((node, index) => {
            gsap.to(node, {
                scale: 1.3,
                duration: 2 + index * 0.3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: index * 0.1
            });
        });

        // Animación de partículas de flujo
        const flowParticles = document.querySelectorAll('.flow-particle');
        flowParticles.forEach((particle, index) => {
            const colors = ['#00f6ff', '#ff00e0', '#00ff88', '#ff4400'];
            
            gsap.set(particle, {
                width: Math.random() * 10 + 8,
                height: Math.random() * 10 + 8,
                backgroundColor: colors[index % colors.length]
            });
            
            gsap.to(particle, {
                x: `+=${Math.random() * 200 - 100}`,
                y: `+=${Math.random() * 100 - 50}`,
                scale: 0.5 + Math.random() * 1.5,
                rotation: 180,
                duration: 4 + Math.random() * 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: Math.random() * 2
            });
        });
    }

    console.log('🚀 Sistema de animaciones optimizado completamente activado');
});
