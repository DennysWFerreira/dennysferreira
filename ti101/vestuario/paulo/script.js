const products = [
    { id: 1, name: 'SUPER SAIYAJIN 4', price: 299, img: 'img/super4.png', badge: 'SUPER SAIYAN 4' },
    { id: 2, name: 'HOLLOW ICHIGO', price: 349, img: 'img/hollow.png', badge: 'ARRANCAR' },
    { id: 3, name: 'BRONZE BOYS', price: 399, img: 'img/bronzeboys.png', badge: 'CAVALEIROS' }
];

let cart = [], favorites = [], currentUser = null;
let salesCount = 0;
let startTime = null;
let timerInterval = null;

function formatPrice(p) { return 'R$ ' + p.toLocaleString('pt-BR'); }

function saveCart() { localStorage.setItem('artexCart', JSON.stringify(cart)); updateCartUI(); updateCartCount(); }
function saveFav() { localStorage.setItem('artexFav', JSON.stringify(favorites)); updateFavUI(); updateFavButtons(); }

// TIMER
function initTimer() {
    const savedStartTime = sessionStorage.getItem('siteStartTime');
    if (savedStartTime) {
        startTime = parseInt(savedStartTime);
    } else {
        startTime = Date.now();
        sessionStorage.setItem('siteStartTime', startTime);
    }
    updateTimerDisplay();
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

function updateTimerDisplay() {
    if (!startTime) return;
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;
    const timerText = document.getElementById('timerText');
    if (timerText) {
        timerText.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

// USER COUNTER
function initUserCounter() {
    let userCount = localStorage.getItem('artexUserCount');
    const hasVisited = sessionStorage.getItem('artexVisited');
    if (userCount === null) {
        userCount = 0;
    } else {
        userCount = parseInt(userCount);
    }
    if (!hasVisited) {
        userCount++;
        localStorage.setItem('artexUserCount', userCount);
        sessionStorage.setItem('artexVisited', 'true');
    }
    const userCounterEl = document.getElementById('userCounter');
    if (userCounterEl) {
        userCounterEl.classList.remove('counting');
        void userCounterEl.offsetWidth;
        userCounterEl.textContent = userCount.toLocaleString('pt-BR');
        userCounterEl.classList.add('counting');
    }
}

// SALES COUNTER
function initSalesCounter() {
    let storedSales = localStorage.getItem('artexSalesCount');
    if (storedSales === null) {
        salesCount = 0;
        localStorage.setItem('artexSalesCount', '0');
    } else {
        salesCount = parseInt(storedSales);
    }
    const salesCounterEl = document.getElementById('salesCounter');
    if (salesCounterEl) {
        salesCounterEl.classList.remove('counting');
        void salesCounterEl.offsetWidth;
        salesCounterEl.textContent = salesCount.toLocaleString('pt-BR');
        salesCounterEl.classList.add('counting');
    }
}

function incrementSalesCount() {
    salesCount++;
    localStorage.setItem('artexSalesCount', salesCount);
    const salesCounterEl = document.getElementById('salesCounter');
    if (salesCounterEl) {
        salesCounterEl.classList.remove('counting');
        void salesCounterEl.offsetWidth;
        salesCounterEl.textContent = salesCount.toLocaleString('pt-BR');
        salesCounterEl.classList.add('counting');
    }
}

function loadData() {
    cart = JSON.parse(localStorage.getItem('artexCart') || '[]');
    favorites = JSON.parse(localStorage.getItem('artexFav') || '[]');
    currentUser = JSON.parse(localStorage.getItem('artexUser'));
    renderProducts();
    updateCartUI();
    updateCartCount();
    updateFavUI();
    updateFavButtons();
    if (currentUser && document.getElementById('profileName')) {
        document.getElementById('profileName').value = currentUser.name || '';
    }
    initUserCounter();
    initSalesCounter();
    initTimer();
}

function renderProducts() {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    container.innerHTML = products.map(p => `
    <div class="product-card" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-img="${p.img}">
        <div class="product-img"><img src="${p.img}" loading="lazy"><div class="badge">${p.badge}</div></div>
        <div class="product-title">${p.name}</div><div class="product-price">${formatPrice(p.price)}</div>
        <div class="product-actions"><button class="add-to-cart-btn">COMPRAR</button><button class="fav-btn"><i class="far fa-heart"></i></button></div>
    </div>`).join('');
    attachProductEvents();
}

function attachProductEvents() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.product-card');
        addToCart(parseInt(card.dataset.id), card.dataset.name, parseInt(card.dataset.price), card.dataset.img);
    }));
    document.querySelectorAll('.fav-btn').forEach(btn => btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.product-card');
        toggleFavorite(parseInt(card.dataset.id), card.dataset.name, parseInt(card.dataset.price), card.dataset.img);
    }));
}

function addToCart(id, n, p, i) {
    let existing = cart.find(x => x.id === id);
    existing ? existing.quantity++ : cart.push({ id, name: n, price: p, img: i, quantity: 1 });
    saveCart();
    openCart();
}

function toggleFavorite(id, n, p, i) {
    favorites.some(f => f.id === id) ? favorites = favorites.filter(f => f.id !== id) : favorites.push({ id, name: n, price: p, img: i });
    saveFav();
}

function updateCartUI() {
    let container = document.getElementById('cartItems');
    let totalSpan = document.getElementById('cartTotal');
    if (!container) return;
    if (!cart.length) {
        container.innerHTML = '<div class="empty-cart">Vazio.</div>';
        if (totalSpan) totalSpan.innerText = 'R$ 0';
        return;
    }
    let html = '', total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        html += `<div class="cart-item"><img class="cart-item-img" src="${item.img}"><div class="cart-item-info"><div class="cart-item-title">${item.name}</div><div class="cart-item-price">${formatPrice(item.price)}</div><div class="cart-item-quantity"><button onclick="updateQty(${item.id},-1)">-</button><span>${item.quantity}</span><button onclick="updateQty(${item.id},1)">+</button></div><button class="remove-item" onclick="removeFromCart(${item.id})">Remover</button></div></div>`;
    });
    container.innerHTML = html;
    if (totalSpan) totalSpan.innerText = formatPrice(total);
}

window.updateQty = function(id, d) {
    let idx = cart.findIndex(i => i.id === id);
    if (idx !== -1) {
        cart[idx].quantity += d;
        if (cart[idx].quantity <= 0) cart.splice(idx, 1);
        saveCart();
    }
};

window.removeFromCart = function(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
};

function updateCartCount() {
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) cartCountEl.innerText = cart.reduce((s, i) => s + i.quantity, 0);
}

function updateFavUI() {
    let container = document.getElementById('favoritesItems');
    if (!container) return;
    if (!favorites.length) {
        container.innerHTML = '<div class="empty-cart">Nenhum favorito.</div>';
        return;
    }
    container.innerHTML = favorites.map(f => `<div class="favorite-item"><img src="${f.img}"><div class="favorite-info"><h4>${f.name}</h4><p>${formatPrice(f.price)}</p><button class="add-to-cart-fav" onclick="addToCart(${f.id},'${f.name}',${f.price},'${f.img}');closeFavorites();">COMPRAR</button><button class="remove-favorite" onclick="removeFavorite(${f.id})">Remover</button></div></div>`).join('');
}

window.removeFavorite = function(id) {
    favorites = favorites.filter(f => f.id !== id);
    saveFav();
};

function updateFavButtons() {
    document.querySelectorAll('.product-card').forEach(card => {
        let id = parseInt(card.dataset.id), btn = card.querySelector('.fav-btn');
        if (btn) {
            let isFav = favorites.some(f => f.id === id);
            btn.innerHTML = isFav ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
            isFav ? btn.classList.add('active') : btn.classList.remove('active');
        }
    });
}

function showHome() {
    const elementsToShow = document.querySelectorAll('.hero, .section, .atelier-bg, .newsletter, .counters-section');
    elementsToShow.forEach(el => {
        if (el) el.classList.remove('hidden');
    });
    const pageContainer = document.getElementById('pageContainer');
    if (pageContainer) pageContainer.innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPage(page) {
    const elementsToHide = document.querySelectorAll('.hero, .section, .atelier-bg, .newsletter, .counters-section');
    elementsToHide.forEach(el => {
        if (el) el.classList.add('hidden');
    });

    const pages = {
        atelier: {
            title: 'ATELIÊ',
            desc: 'Onde a arte têxtil encontra o silêncio. Conheça nosso processo artesanal e a filosofia por trás de cada peça.',
            items: [
                { img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=400&fit=crop', title: 'Alta Costura Manual', desc: 'Acabamentos feitos à mão por mestres alfaiates.' },
                { img: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=400&h=400&fit=crop', title: 'Matéria-Prima Nobre', desc: 'Algodão Giza egípcio e tingimentos naturais.' },
                { img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop', title: 'Ateliê em Milão', desc: 'Produção limitada com certificado de autenticidade.' }
            ]
        },
        archive: {
            title: 'ARQUIVO',
            desc: '📁 O arquivo está vazio. Volte em breve para conferir nossas coleções passadas.',
            items: []
        },
        editorial: {
            title: 'EDITORIAL',
            desc: 'Campanhas e estrutura de produção de camisetas',
            items: [
                { img: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=400&h=400&fit=crop', title: 'SS25 Campaign', desc: 'A forma encontra o vazio' },
                { img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop', title: 'FW24 Editorial', desc: 'Silêncio e estrutura' },
                { img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop', title: 'Artisan Stories', desc: 'Por trás das costuras' }
            ]
        },
        concept: {
            title: 'CONCEITO',
            desc: 'Luxo silencioso, sustentabilidade e a busca pelo essencial. Nossa filosofia.',
            items: [
                { img: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=400&fit=crop', title: 'Slow Fashion', desc: 'Produção consciente e atemporal.' },
                { img: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&h=400&fit=crop', title: 'Economia Circular', desc: 'Programa de reutilização e upcycling.' },
                { img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=400&fit=crop', title: 'Transparência Total', desc: 'Rastreabilidade da matéria-prima.' }
            ]
        }
    };

    const data = pages[page];
    let itemsHtml = '';
    if (data.items.length === 0) {
        itemsHtml = '<div style="text-align:center; padding:60px 20px; color:#666;"><i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 20px; display: block;"></i><p style="font-size: 1.2rem;">Nenhuma coleção disponível no momento.</p><p style="margin-top: 10px;">Volte em breve para novidades!</p></div>';
    } else {
        itemsHtml = `<div class="${page}-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:40px;justify-items:center;">${data.items.map(i => `<div style="max-width:350px;text-align:center;"><img src="${i.img}" style="width:100%;aspect-ratio:1/1;object-fit:cover;margin-bottom:20px;" loading="lazy"><h3 style="margin-bottom:10px;">${i.title}</h3><p style="color:#666;font-size:0.85rem;">${i.desc}</p></div>`).join('')}</div>`;
    }

    const pageContainer = document.getElementById('pageContainer');
    if (pageContainer) {
        pageContainer.innerHTML = `<div class="container page-content active" style="padding:80px 0;"><div class="page-header"><h1>${data.title}</h1><p>${data.desc}</p></div>${itemsHtml}</div>`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// MODALS
function openCart() { 
    const modal = document.getElementById('cartModal');
    const overlay = document.getElementById('cartOverlay');
    if (modal) modal.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeCart() { 
    const modal = document.getElementById('cartModal');
    const overlay = document.getElementById('cartOverlay');
    if (modal) modal.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
}
function openProfile() { 
    const modal = document.getElementById('profileModal');
    const overlay = document.getElementById('modalOverlay');
    if (modal) modal.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeProfile() { 
    const modal = document.getElementById('profileModal');
    const overlay = document.getElementById('modalOverlay');
    if (modal) modal.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
}
function openFavorites() { 
    const modal = document.getElementById('favoritesModal');
    const overlay = document.getElementById('modalOverlay');
    if (modal) modal.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateFavUI();
}
function closeFavorites() { 
    const modal = document.getElementById('favoritesModal');
    const overlay = document.getElementById('modalOverlay');
    if (modal) modal.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
}
function openSearch() { 
    const modal = document.getElementById('searchModal');
    if (modal) modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeSearch() { 
    const modal = document.getElementById('searchModal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
}

// CHECKOUT
function openCheckout() {
    updateSummaryItems();
    const modal = document.getElementById('checkoutModal');
    const overlay = document.getElementById('checkoutOverlay');
    if (modal) modal.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCheckout() {
    const modal = document.getElementById('checkoutModal');
    const overlay = document.getElementById('checkoutOverlay');
    if (modal) modal.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
}

function updateSummaryItems() {
    const container = document.getElementById('summaryItems');
    const subtotalSpan = document.getElementById('summarySubtotal');
    const totalSpan = document.getElementById('summaryTotal');
    if (!container) return;
    let subtotal = 0;
    let html = '';
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        html += `
            <div class="summary-item">
                <img class="summary-item-img" src="${item.img}">
                <div class="summary-item-info">
                    <div class="summary-item-title">${item.name}</div>
                    <div class="summary-item-price">${formatPrice(item.price)}</div>
                    <div class="summary-item-quantity">Qtd: ${item.quantity}</div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html || '<div style="text-align:center; padding:20px;">Carrinho vazio</div>';
    const frete = 15;
    const total = subtotal + frete;
    if (subtotalSpan) subtotalSpan.innerText = formatPrice(subtotal);
    if (totalSpan) totalSpan.innerText = formatPrice(total);
    document.getElementById('summaryFrete').innerText = formatPrice(frete);
}

function mascaraCpf(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        input.value = value;
    }
}

function mascaraTelefone(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        input.value = value;
    }
}

function mascaraCep(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length <= 8) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        input.value = value;
    }
}

function mascaraCartao(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    input.value = value;
}

function mascaraValidade(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.replace(/(\d{2})(\d)/, '$1/$2');
    }
    input.value = value;
}

function checkoutFinalizar() {
    const nome = document.getElementById('checkoutNome')?.value;
    const cpf = document.getElementById('checkoutCpf')?.value;
    const endereco = document.getElementById('checkoutEndereco')?.value;
    const cidade = document.getElementById('checkoutCidade')?.value;
    if (!nome || !cpf || !endereco || !cidade) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0) + 15;
    alert(`✅ PEDIDO CONFIRMADO!\n\nCliente: ${nome}\nMétodo: ${paymentMethod === 'cartao' ? 'Cartão de Crédito' : paymentMethod === 'pix' ? 'PIX' : 'Boleto'}\nTotal: ${formatPrice(total)}\n\nObrigado pela compra!`);
    incrementSalesCount();
    cart = [];
    saveCart();
    closeCheckout();
    closeCart();
}

// DARK MODE
function initDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        const toggleIcon = document.querySelector('#darkModeToggle i');
        if (toggleIcon) toggleIcon.classList.replace('fa-moon', 'fa-sun');
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    const toggleIcon = document.querySelector('#darkModeToggle i');
    if (toggleIcon) {
        if (isDark) {
            toggleIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            toggleIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }
}

// EVENT LISTENERS
document.querySelectorAll('.nav-item').forEach(el => el.addEventListener('click', () => {
    if (el.dataset.page === 'home') showHome();
    else showPage(el.dataset.page);
}));
document.querySelectorAll('.footer-nav').forEach(el => el.addEventListener('click', () => showPage(el.dataset.page)));

const homeLogo = document.getElementById('homeLogo');
if (homeLogo) homeLogo.addEventListener('click', showHome);
const footerLogo = document.getElementById('footerLogo');
if (footerLogo) footerLogo.addEventListener('click', showHome);

const exploreBtn = document.getElementById('exploreBtn');
if (exploreBtn) exploreBtn.addEventListener('click', () => document.getElementById('productsSection')?.scrollIntoView({ behavior: 'smooth' }));

const atelierBtn = document.querySelector('.atelier-btn');
if (atelierBtn) atelierBtn.addEventListener('click', () => showPage('atelier'));

const cartIcon = document.getElementById('cartIcon');
if (cartIcon) cartIcon.addEventListener('click', openCart);
const closeCartBtn = document.getElementById('closeCartBtn');
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
const cartOverlay = document.getElementById('cartOverlay');
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

const profileIcon = document.getElementById('profileIcon');
if (profileIcon) profileIcon.addEventListener('click', openProfile);
const closeProfileBtn = document.getElementById('closeProfileBtn');
if (closeProfileBtn) closeProfileBtn.addEventListener('click', closeProfile);

const favoritesIcon = document.getElementById('favoritesIcon');
if (favoritesIcon) favoritesIcon.addEventListener('click', openFavorites);
const closeFavBtn = document.getElementById('closeFavBtn');
if (closeFavBtn) closeFavBtn.addEventListener('click', closeFavorites);

const searchIcon = document.getElementById('searchIcon');
if (searchIcon) searchIcon.addEventListener('click', openSearch);
const closeSearchBtn = document.getElementById('closeSearchBtn');
if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);

const modalOverlay = document.getElementById('modalOverlay');
if (modalOverlay) modalOverlay.addEventListener('click', () => { closeProfile(); closeFavorites(); });

const saveProfileBtn = document.getElementById('saveProfileBtn');
if (saveProfileBtn) saveProfileBtn.addEventListener('click', () => {
    const nameInput = document.getElementById('profileName');
    const emailInput = document.getElementById('profileEmail');
    currentUser = { 
        name: nameInput ? nameInput.value : '', 
        email: emailInput ? emailInput.value : '' 
    };
    localStorage.setItem('artexUser', JSON.stringify(currentUser));
    alert('Perfil salvo!');
    closeProfile();
});

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('artexUser');
    alert('Deslogado');
    closeProfile();
});

const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
    if (!cart.length) { alert('Carrinho vazio'); return; }
    openCheckout();
    closeCart();
});

const newsBtn = document.getElementById('newsBtn');
if (newsBtn) newsBtn.addEventListener('click', () => {
    let email = document.getElementById('newsEmail')?.value;
    if (email && email.trim()) alert(`Obrigado ${email}! Você receberá nossas novidades.`);
    else alert('Insira um e-mail válido.');
});

const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        let term = e.target.value.toLowerCase();
        let results = products.filter(p => p.name.toLowerCase().includes(term));
        let resultsDiv = document.getElementById('searchResults');
        if (!resultsDiv) return;
        if (!results.length) {
            resultsDiv.innerHTML = '<div style="text-align:center;padding:20px;">Nenhum resultado.</div>';
            return;
        }
        resultsDiv.innerHTML = results.map(p => `<div class="search-result-item" onclick="addToCart(${p.id},'${p.name}',${p.price},'${p.img}'); closeSearch(); alert('Adicionado ao carrinho!');"><img src="${p.img}"><div><h4>${p.name}</h4><p>${formatPrice(p.price)}</p></div></div>`).join('');
    });
}

window.addToCart = addToCart;
window.closeSearch = closeSearch;

const editorialGrid = document.getElementById('editorialHomeGrid');
if (editorialGrid) {
    editorialGrid.innerHTML = ['img/anime1.jpg', 'img/anime2.jpg', 'img/anime3.jpg'].map(src => `
        <div class="editorial-item" onclick="showPage('editorial')">
            <img src="${src}" loading="lazy">
            <div class="editorial-overlay">
                <span>VER EDITORIAL</span>
            </div>
        </div>
    `).join('');
}

// CHECKOUT EVENT LISTENERS
document.getElementById('checkoutCpf')?.addEventListener('input', (e) => mascaraCpf(e.target));
document.getElementById('checkoutTelefone')?.addEventListener('input', (e) => mascaraTelefone(e.target));
document.getElementById('checkoutCep')?.addEventListener('input', (e) => mascaraCep(e.target));
document.getElementById('cartaoNumero')?.addEventListener('input', (e) => mascaraCartao(e.target));
document.getElementById('cartaoValidade')?.addEventListener('input', (e) => mascaraValidade(e.target));

document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        document.getElementById('cartaoFields').style.display = e.target.value === 'cartao' ? 'block' : 'none';
        document.getElementById('pixFields').style.display = e.target.value === 'pix' ? 'block' : 'none';
        document.getElementById('boletoFields').style.display = e.target.value === 'boleto' ? 'block' : 'none';
    });
});

document.getElementById('copyPixBtn')?.addEventListener('click', () => {
    const pixCode = document.querySelector('.pix-code')?.innerText;
    if (pixCode) {
        navigator.clipboard.writeText(pixCode);
        alert('Código PIX copiado!');
    }
});

const confirmOrderBtn = document.getElementById('confirmOrderBtn');
if (confirmOrderBtn) confirmOrderBtn.addEventListener('click', checkoutFinalizar);

const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckout);
const checkoutOverlay = document.getElementById('checkoutOverlay');
if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeCheckout);

const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDarkMode);

initDarkMode();
loadData();