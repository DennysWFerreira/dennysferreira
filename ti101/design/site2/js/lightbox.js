// js/lightbox.js
// Funcionalidade de ampliar imagens ao clicar

let lightboxCriado = false;

function criarLightbox() {
    if (lightboxCriado) return document.getElementById('lightbox');
    
    const lightboxHTML = `
    <div id="lightbox" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.95);
        z-index: 999999;
        display: none;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        backdrop-filter: blur(5px);
    ">
        <div style="position: relative; max-width: 90%; max-height: 90%;">
            <img id="lightbox-img" src="" alt="Imagem ampliada" style="
                max-width: 100%;
                max-height: 90vh;
                object-fit: contain;
                border-radius: 10px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            ">
            <button id="close-lightbox" style="
                position: absolute;
                top: -40px;
                right: -40px;
                background: #2C4A2E;
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 24px;
                cursor: pointer;
                transition: all 0.3s;
            ">✕</button>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    lightboxCriado = true;
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('close-lightbox');
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === closeBtn) {
            lightbox.style.display = 'none';
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            lightbox.style.display = 'none';
        }
    });
    
    return lightbox;
}

function adicionarLightboxImagens() {
    criarLightbox();
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    const imagens = document.querySelectorAll('.about-image img, .project-card img, .ba-img img, .portfolio-masonry img');
    
    imagens.forEach(img => {
        if (!img.hasAttribute('data-lightbox')) {
            img.style.cursor = 'pointer';
            img.setAttribute('data-lightbox', 'true');
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                lightboxImg.src = img.src;
                lightbox.style.display = 'flex';
            });
        }
    });
}