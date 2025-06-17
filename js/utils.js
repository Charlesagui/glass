'use strict';

export const Utils = {
    // Throttle optimizado para animaciones
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // RAF throttle para scroll y mouse
    rafThrottle(func) {
        let isScheduled = false;
        return function(...args) {
            if (!isScheduled) {
                isScheduled = true;
                requestAnimationFrame(() => {
                    func.apply(this, args);
                    isScheduled = false;
                });
            }
        };
    },
    
    // Interpolación suave
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },
    
    // Mapear valores
    map(value, start1, stop1, start2, stop2) {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    },
    
    // Clamp valores
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
};
