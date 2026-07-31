// js/animations.js
// Animações de scroll e efeitos visuais

function adicionarAnimacoesCSS() {
    if (document.getElementById('animations-style')) return;
    
    const style = document.createElement('style');
    style.id = 'animations-style';
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                        transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-on-scroll.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .project-card:nth-child(1) { transition-delay: 0.1s; }
        .project-card:nth-child(2) { transition-delay: 0.2s; }
        .project-card:nth-child(3) { transition-delay: 0.3s; }
        
        .service-card:nth-child(1) { transition-delay: 0.05s; }
        .service-card:nth-child(2) { transition-delay: 0.1s; }
        .service-card:nth-child(3) { transition-delay: 0.15s; }
        .service-card:nth-child(4) { transition-delay: 0.2s; }
        .service-card:nth-child(5) { transition-delay: 0.25s; }
        .service-card:nth-child(6) { transition-delay: 0.3s; }
        
        .testimonial-card:nth-child(1) { transition-delay: 0.1s; }
        .testimonial-card:nth-child(2) { transition-delay: 0.2s; }
        .testimonial-card:nth-child(3) { transition-delay: 0.3s; }
        
        .step:nth-child(1) { transition-delay: 0.05s; }
        .step:nth-child(2) { transition-delay: 0.1s; }
        .step:nth-child(3) { transition-delay: 0.15s; }
        .step:nth-child(4) { transition-delay: 0.2s; }
        
        .project-card, .service-card, .testimonial-card, .step, .ba-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .project-card:hover, .service-card:hover, .testimonial-card:hover, .step:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 35px rgba(0,0,0,0.1);
        }
        
        .hero-content {
            animation: fadeInUp 1s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

function iniciarAnimacoesScroll() {
    const elementos = document.querySelectorAll('.project-card, .service-card, .testimonial-card, .step, .ba-card, .about-grid > div, .contact-wrapper > div, .portfolio-masonry img');
    
    elementos.forEach(el => {
        if (!el.classList.contains('animate-on-scroll')) {
            el.classList.add('animate-on-scroll');
        }
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}