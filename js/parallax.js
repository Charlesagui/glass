// Debug: Verificar si el script se carga
console.log('✅ parallax.js cargado correctamente');

// Función principal
function initParallax() {
    console.log('🔍 Inicializando efecto parallax...');
    
    // Elementos del DOM
    const fixedBackground = document.querySelector('.fixed-background');
    const particles = document.querySelector('.particles');
    const contentWrapper = document.querySelector('.content-wrapper');
    
    if (!fixedBackground) console.error('❌ No se encontró .fixed-background');
    if (!particles) console.error('❌ No se encontró .particles');
    if (!contentWrapper) console.error('❌ No se encontró .content-wrapper');
    
    // Mostrar el contenido después de cargar
    document.body.classList.add('loaded');
    
    // Efecto de parallax suave
    const handleScroll = () => {
        const scrollY = window.scrollY;
        
        // Aplicar efecto de desplazamiento al fondo
        if (fixedBackground) {
            fixedBackground.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        
        // Efecto sutil en las partículas
        if (particles) {
            particles.style.transform = `translateY(${scrollY * 0.1}px)`;
        }
    };
    
    // Configurar el evento de scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Forzar una actualización inicial
    handleScroll();
    
    console.log('✨ Efecto parallax inicializado correctamente');
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
} else {
    initParallax();
}
