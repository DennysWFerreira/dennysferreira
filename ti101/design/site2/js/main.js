// js/main.js
// Inicializa todos os componentes do site

function iniciarSite() {
    console.log('🚀 Inicializando Aura Interiores...');
    
    // Inicializar componentes
    if (typeof adicionarAnimacoesCSS !== 'undefined') {
        adicionarAnimacoesCSS();
        iniciarAnimacoesScroll();
    }
    
    if (typeof adicionarLightboxImagens !== 'undefined') {
        setTimeout(adicionarLightboxImagens, 500);
    }
    
    if (typeof adicionarBotaoTopo !== 'undefined') {
        adicionarBotaoTopo();
    }
    
    if (typeof adicionarWhatsApp !== 'undefined') {
        adicionarWhatsApp();
    }
    
    if (typeof adicionarBarraProgresso !== 'undefined') {
        adicionarBarraProgresso();
    }
    
    if (typeof adicionarLazyLoad !== 'undefined') {
        adicionarLazyLoad();
    }
    
    if (typeof melhorarFormulario !== 'undefined') {
        melhorarFormulario();
    }
}

// Aguardar o DOM carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarSite);
} else {
    iniciarSite();
}