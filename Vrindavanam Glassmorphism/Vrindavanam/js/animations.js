// COUNTER ANIMATION
function animateCount(el, target, suffix = '') {
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString('en-IN') + suffix;
        if (current >= target) clearInterval(timer);
    }, 25);
}

// PARALLAX on hero
function initParallax() {
    window.addEventListener('scroll', () => {
        const heroContent = document.querySelector('.hero-content');
        const heroBg = document.querySelector('.hero-bg');
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
                heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
            }
            if (heroBg) {
                heroBg.style.transform = `translateY(${scrolled * 0.4}px) scale(1.1)`;
            }
        }
    });
}

// INITIALIZE ANIMATIONS
document.addEventListener('DOMContentLoaded', () => {
    initParallax();

    const metricsBar = document.querySelector('.metrics-bar');
    if (metricsBar) {
        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const metrics = [
                        { id: 'm1', val: 78, suffix: '+' },
                        { id: 'm2', val: 140, suffix: '+' },
                        { id: 'm3', val: 24, suffix: '' },
                        { id: 'm4', val: 48000, suffix: '+' }
                    ];
                    metrics.forEach(m => {
                        const el = document.getElementById(m.id);
                        if (el) animateCount(el, m.val, m.suffix);
                    });
                    counterObserver.disconnect();
                }
            });
        });
        counterObserver.observe(metricsBar);
    }
});
