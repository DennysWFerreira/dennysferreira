// ==================== SUAS IMAGENS AQUI ====================
// BASTA EDITAR OS CAMINHOS DAS IMAGENS NESTE ARRAY

const produtos = [
    { 
        id: 1, 
        name: "Bolo Vulcão Ninho &amp; Nutella", 
        price: 25.00, 
        category: "bolos", 
        image: "imagen/bolo1.jpg"
    },
    { 
        id: 2, 
        name: "Bolo Caseiro de Cenoura", 
        price: 25.00, 
        category: "bolos", 
        image: "imagen/cenoura.jpg"
    },
    { 
        id: 3, 
        name: "cento de salgados", 
        price: 100.00, 
        category: "salgados", 
        image: "imagen/cento.jpg"
    },
    { 
        id: 4, 
        name: "salgados de centos", 
        price: 100.00, 
        category: "salgados", 
        image: "imagen/salgados100.jpg"
    },
    { 
        id: 5, 
        name: "Pão de Mel", 
        price: 9.00, 
        category: "doces", 
        image: "imagen/doce3.jpg"
    },
    { 
        id: 6, 
        name: " Cento de Mini Torta", 
        price: 220.00, 
        category: "tortas", 
        image: "imagen/doces1.jpg"
    },
    { 
        id: 8, 
        name: "Torta De Frango", 
        price: 15.00, 
        category: "salgados", 
        image: "imagen/empada.jpg"
    },
    { 
        id: 9, 
        name: " Cento de Beijinho E Brigadeiro", 
        price: 100.00, 
        category: "doces", 
        image: "imagen/minidoces.jpg"
    },
    { 
        id: 10, 
        name: "Torta de Morango", 
        price: 90.00, 
        category: "tortas", 
        image: "imagen/torta1_ajustada.jpg"
    }
];


// ==================== GALERIA ====================
// COLOQUE AQUI OS CAMINHOS DAS SUAS FOTOS DA GALERIA

const galeria = [
    "imagen/anuncio.jpg",
    "imagen/bolo1.jpg",
    "imagen/bolos2.jpg",
    "imagen/cenoura.jpg",
    "imagen/cento.jpg",
    "imagen/centodoce.jpg",
    "imagen/doce de leite.jpg",
    "imagen/doces1.jpg",
    "imagen/doce3.jpg",
    "imagen/empada.jpg",
    "imagen/lemon.jpg",
    "imagen/minidoces.jpg",
    "imagen/paçoca.jpg",
    "imagen/salgados.jpg",
    "imagen/salgados100.jpg",
    "imagen/torta1.jpg",
    "imagen/torta2.jpg"
];


// ==================== CARRINHO ====================
let carrinho = JSON.parse(localStorage.getItem('carrinho_migs')) || [];

// Renderizar Cardápio
function renderMenu() {
    const grid = document.getElementById('menuGrid');
    if (!grid) return;

    grid.innerHTML = produtos.map(prod => {
        let categoryLabel = '';
        if (prod.category === 'bolos') categoryLabel = '🍰 Bolo';
        else if (prod.category === 'salgados') categoryLabel = '🥐 Salgado';
        else if (prod.category === 'doces') categoryLabel = '🍬 Doce';
        else categoryLabel = '🥧 Tortas e Minis';

        return `
            <div class="menu-card" data-category="${prod.category}" data-id="${prod.id}">
                <div class="menu-card-image">
                    <img src="${prod.image}" alt="${prod.name}" onerror="this.src='images/placeholder.jpg'">
                </div>
                <div class="menu-card-content">
                    <span class="menu-card-category">${categoryLabel}</span>
                    <h3>${prod.name}</h3>
                 
                    <div class="menu-card-footer">
                        <span class="price">R$ ${prod.price.toFixed(2)}</span>
                        <button class="add-to-cart" onclick="adicionarAoCarrinho(${prod.id}, this)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Renderizar Galeria
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    if (!galeria || galeria.length === 0) {
        grid.innerHTML = '<p style="text-align:center;">Em breve mais fotos!</p>';
        return;
    }

    grid.innerHTML = galeria.map(img => `
        <div class="gallery-item">
            <img src="${img}" alt="Delícia Migs" onerror="this.src='images/placeholder.jpg'">
            <div class="gallery-overlay">
                <span>Delícia Migs</span>
            </div>
        </div>
    `).join('');
}

// Adicionar ao Carrinho
window.adicionarAoCarrinho = function (id, buttonElement) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;
    
    const existente = carrinho.find(item => item.id === id);

    if (existente) {
        existente.quantidade += 1;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    localStorage.setItem('carrinho_migs', JSON.stringify(carrinho));
    atualizarCarrinhoUI();
    atualizarBadge();
    
    if (buttonElement) {
        buttonElement.style.transform = 'scale(0.9)';
        setTimeout(() => {
            buttonElement.style.transform = 'scale(1)';
        }, 200);
    }
}

// Remover item
window.removerItem = function (id) {
    carrinho = carrinho.filter(item => item.id !== id);
    localStorage.setItem('carrinho_migs', JSON.stringify(carrinho));
    atualizarCarrinhoUI();
    atualizarBadge();
}

// Alterar quantidade
window.alterarQuantidade = function (id, incremento) {
    const item = carrinho.find(item => item.id === id);

    if (item) {
        const novaQuantidade = item.quantidade + incremento;

        if (novaQuantidade <= 0) {
            carrinho = carrinho.filter(i => i.id !== id);
        } else {
            item.quantidade = novaQuantidade;
        }

        localStorage.setItem('carrinho_migs', JSON.stringify(carrinho));
        atualizarCarrinhoUI();
        atualizarBadge();
    }
}

// Atualizar badge do carrinho
function atualizarBadge() {
    const total = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = total;
}

// Atualizar UI do carrinho
function atualizarCarrinhoUI() {
    const container = document.getElementById('cartItemsList');
    const footer = document.getElementById('cartFooter');

    if (carrinho.length === 0) {
        if (container) {
            container.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Seu carrinho está vazio</p>
                    <span>Adicione produtos deliciosos!</span>
                </div>
            `;
        }
        if (footer) {
            footer.innerHTML = `
                <div class="cart-total">
                    <span>Total:</span>
                    <strong id="cartTotalPrice">R$ 0,00</strong>
                </div>
                <button class="btn btn-primary btn-checkout" id="checkoutBtn" disabled style="opacity:0.5; cursor:not-allowed;">
                    <i class="fab fa-whatsapp"></i> Finalizar Pedido
                </button>
            `;
        }
        return;
    }

    const total = carrinho.reduce((sum, item) => sum + (item.price * item.quantidade), 0);

    if (container) {
        container.innerHTML = carrinho.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="alterarQuantidade(${item.id}, -1)">-</button>
                        <span style="font-weight: 600;">${item.quantidade}</span>
                        <button class="quantity-btn" onclick="alterarQuantidade(${item.id}, 1)">+</button>
                        <button class="remove-item" onclick="removerItem(${item.id})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    if (footer) {
        footer.innerHTML = `
            <div class="cart-total">
                <span>Total:</span>
                <strong id="cartTotalPrice">R$ ${total.toFixed(2)}</strong>
            </div>
            <button class="btn btn-primary btn-checkout" id="checkoutBtn" onclick="finalizarPedido()">
                <i class="fab fa-whatsapp"></i> Finalizar Pedido
            </button>
        `;
    }
}

// Finalizar pedido
window.finalizarPedido = function () {
    if (carrinho.length === 0) return;

    let mensagem = "🍰 *MIGS DELÍCIAS - MEU PEDIDO* 🍰\n\n";
    let total = 0;

    carrinho.forEach(item => {
        const subtotal = item.price * item.quantidade;
        total += subtotal;
        mensagem += `• ${item.quantidade}x ${item.name} - R$ ${subtotal.toFixed(2)}\n`;
    });

    mensagem += `\n💰 *TOTAL: R$ ${total.toFixed(2)}*\n\n`;
    mensagem += "Gostaria de confirmar meu pedido! Aguardo retorno.";

    window.open(`https://wa.me/5511991072583?text=${encodeURIComponent(mensagem)}`, '_blank');
}

// Filtros do cardápio
function initFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            const filterValue = filter.dataset.filter;
            const cards = document.querySelectorAll('.menu-card');
            cards.forEach(card => {
                if (filterValue === 'all' || card.dataset.category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Menu Mobile
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('navMenu');

    if (btn && nav) {
        btn.addEventListener('click', () => {
            nav.classList.toggle('active');
            btn.innerHTML = nav.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                if (btn) btn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// Carrinho Toggle
function initCart() {
    const cartBtn = document.getElementById('cartBtn');
    const closeBtn = document.getElementById('closeCartBtn');
    const overlay = document.getElementById('cartOverlay');
    const sidebar = document.getElementById('cartSidebar');

    if (cartBtn && closeBtn && overlay && sidebar) {
        cartBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
            overlay.classList.add('active');
        });

        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }
}

// Formulário de Contato
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const msg = document.getElementById('contactMessage').value;
            const whatsMsg = `Olá! Meu nome é ${nome} (${email}).\n\nMensagem: ${msg}`;
            window.open(`https://wa.me/5511991072583?text=${encodeURIComponent(whatsMsg)}`, '_blank');
            form.reset();
            alert('Mensagem enviada! Entraremos em contato pelo WhatsApp.');
        });
    }
}

// Scroll Suave e Active Link
function initScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Header Shadow
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
        }
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    renderGallery();
    initFilters();
    initMobileMenu();
    initCart();
    initContactForm();
    initScroll();
    initHeaderScroll();
    atualizarBadge();
    atualizarCarrinhoUI();
});