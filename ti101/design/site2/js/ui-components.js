// js/ui-components.js
// Componentes de interface (botão topo, WhatsApp, etc)

function adicionarBotaoTopo() {
    const btnTopo = document.createElement('button');
    btnTopo.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btnTopo.id = 'btn-topo';
    btnTopo.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #2C4A2E;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 9999;
        display: none;
        transition: all 0.3s;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        font-size: 20px;
    `;
    
    btnTopo.onmouseover = () => btnTopo.style.transform = 'scale(1.1)';
    btnTopo.onmouseout = () => btnTopo.style.transform = 'scale(1)';
    btnTopo.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.body.appendChild(btnTopo);
    
    window.addEventListener('scroll', () => {
        btnTopo.style.display = window.scrollY > 500 ? 'block' : 'none';
    });
}

function adicionarWhatsApp() {
    const numeroWhatsApp = '5511999998888';
    const mensagem = 'Olá! Vi o site da Aura Interiores e gostaria de mais informações.';
    
    const btnWhats = document.createElement('a');
    btnWhats.href = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    btnWhats.target = '_blank';
    btnWhats.innerHTML = '<i class="fab fa-whatsapp"></i>';
    btnWhats.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 60px;
        height: 60px;
        background: #25D366;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        z-index: 9999;
        font-size: 32px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transition: all 0.3s;
    `;
    
    btnWhats.onmouseover = () => btnWhats.style.transform = 'scale(1.1)';
    btnWhats.onmouseout = () => btnWhats.style.transform = 'scale(1)';
    
    document.body.appendChild(btnWhats);
}

function adicionarBarraProgresso() {
    const barra = document.createElement('div');
    barra.id = 'progress-bar';
    barra.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #2C4A2E, #5B7B5A);
        z-index: 10001;
        transition: width 0.3s;
    `;
    document.body.appendChild(barra);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        barra.style.width = scrolled + '%';
    });
}

function adicionarLazyLoad() {
    const imagens = document.querySelectorAll('img');
    imagens.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.loading = 'lazy';
        }
    });
}

function melhorarFormulario() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    form.action = 'https://formsubmit.co/seu-email@dominio.com';
    form.method = 'POST';
    
    const inputs = `
        <input type="hidden" name="_subject" value="Novo orçamento - Aura Interiores">
        <input type="hidden" name="_captcha" value="false">
        <input type="hidden" name="_template" value="table">
    `;
    form.insertAdjacentHTML('beforeend', inputs);
}