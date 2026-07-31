// main.js - ARTEX STUDIO - Versão Completa com Login, Cadastro e Pedidos por Usuário
let currentFilter = "todos";
let searchTerm = "";
let wishlist = [];
let reviews = {};
let orders = [];
let trackingOrders = {};
let currentUser = null;
let users = [];

const MAX_REVIEW_LENGTH = 500;

// ===== SISTEMA DE USUÁRIOS =====
function loadUsers() {
    const stored = localStorage.getItem('artexUsers');
    if (stored) {
        try {
            users = JSON.parse(stored);
        } catch(e) {
            users = [];
        }
    }
    
    // Criar usuário admin/demo se não existir
    if (users.length === 0) {
        users.push({
            id: 1,
            name: "Cliente Demo",
            email: "demo@artexstudio.com",
            phone: "(11) 99999-9999",
            password: btoa("123456"),
            createdAt: new Date().toISOString()
        });
        saveUsers();
    }
}

function saveUsers() {
    localStorage.setItem('artexUsers', JSON.stringify(users));
}

function loginUser(email, password) {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && atob(user.password) === password) {
        currentUser = { ...user };
        delete currentUser.password;
        localStorage.setItem('artexCurrentUser', JSON.stringify(currentUser));
        updateUserInterface();
        showToast(`✅ Bem-vindo(a), ${user.name}!`);
        return true;
    }
    showToast("❌ E-mail ou senha inválidos!", true);
    return false;
}

function registerUser(name, email, phone, password, confirmPassword) {
    if (password !== confirmPassword) {
        showToast("❌ As senhas não coincidem!", true);
        return false;
    }
    if (password.length < 4) {
        showToast("❌ A senha deve ter pelo menos 4 caracteres!", true);
        return false;
    }
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        showToast("❌ Este e-mail já está cadastrado!", true);
        return false;
    }
    
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone || "",
        password: btoa(password),
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers();
    
    // Fazer login automático
    currentUser = { ...newUser };
    delete currentUser.password;
    localStorage.setItem('artexCurrentUser', JSON.stringify(currentUser));
    updateUserInterface();
    showToast(`🎉 Conta criada com sucesso! Bem-vindo(a), ${name}!`);
    return true;
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('artexCurrentUser');
    updateUserInterface();
    showToast("👋 Você saiu da sua conta");
    navigateTo('home');
}

function loadCurrentUser() {
    const stored = localStorage.getItem('artexCurrentUser');
    if (stored) {
        try {
            currentUser = JSON.parse(stored);
        } catch(e) {
            currentUser = null;
        }
    }
    updateUserInterface();
}

function updateUserInterface() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const footerOrdersLink = document.getElementById('footerOrdersLink');
    const footerLoginLink = document.getElementById('footerLoginLink');
    const userInfoHeader = document.getElementById('userInfoHeader');
    
    if (currentUser) {
        if (userMenuBtn) {
            userMenuBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${currentUser.name.split(' ')[0]}`;
        }
        if (footerOrdersLink) footerOrdersLink.style.display = 'block';
        if (footerLoginLink) footerLoginLink.style.display = 'none';
        if (userInfoHeader) {
            userInfoHeader.innerHTML = `
                <strong>${escapeHtml(currentUser.name)}</strong>
                <small>${escapeHtml(currentUser.email)}</small>
            `;
        }
    } else {
        if (userMenuBtn) userMenuBtn.innerHTML = `<i class="fas fa-user-circle"></i> MINHA CONTA`;
        if (footerOrdersLink) footerOrdersLink.style.display = 'none';
        if (footerLoginLink) footerLoginLink.style.display = 'block';
        if (userInfoHeader) {
            userInfoHeader.innerHTML = `<small>Faça login para ver seus dados</small>`;
        }
    }
    
    // Atualizar visualização de pedidos se estiver na página
    const activePage = document.querySelector('.page-view.active-page')?.id;
    if (activePage === 'page-orders') {
        renderOrdersPage();
    }
}

function isLoggedIn() {
    return currentUser !== null;
}

function requireLogin(callback) {
    if (isLoggedIn()) {
        if (callback) callback();
        return true;
    } else {
        showToast("🔒 Faça login para continuar!", true);
        navigateTo('login');
        return false;
    }
}

// ===== LOADING =====
function showLoading(show) {
    let overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(overlay);
    }
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

// ===== SISTEMA DE RASTREAMENTO =====
function generateTrackingCode(orderId) {
    const prefix = "ARTEX";
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${year}${orderId}${random}`;
}

function initializeTrackingCodes() {
    const stored = localStorage.getItem('artexTracking');
    if (stored) {
        try {
            trackingOrders = JSON.parse(stored);
        } catch(e) {
            trackingOrders = {};
        }
    }
}

function saveTrackingCodes() {
    localStorage.setItem('artexTracking', JSON.stringify(trackingOrders));
}

function addTrackingCode(orderId, trackingCode, orderData) {
    const statusHistory = [{
        status: "✅ Pedido confirmado",
        date: new Date().toLocaleString('pt-BR'),
        description: "Seu pedido foi recebido e está sendo processado"
    }];
    
    trackingOrders[trackingCode] = {
        orderId: orderId,
        trackingCode: trackingCode,
        currentStatus: "confirmed",
        statusHistory: statusHistory,
        customer: orderData.customer,
        items: orderData.items,
        total: orderData.total,
        estimatedDelivery: calculateEstimatedDelivery(),
        userId: currentUser?.id || null
    };
    saveTrackingCodes();
}

function calculateEstimatedDelivery() {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    return date.toLocaleDateString('pt-BR');
}

function updateTrackingStatus(trackingCode, newStatus, description) {
    if (trackingOrders[trackingCode]) {
        const order = trackingOrders[trackingCode];
        const statusMap = {
            'confirmed': { name: "✅ Pedido confirmado", icon: "fa-check-circle" },
            'production': { name: "🎨 Em produção", icon: "fa-palette" },
            'shipped': { name: "🚚 Enviado", icon: "fa-truck" },
            'in_transit': { name: "📦 Em trânsito", icon: "fa-box" },
            'delivered': { name: "🏠 Entregue", icon: "fa-home" }
        };
        
        order.currentStatus = newStatus;
        order.statusHistory.unshift({
            status: statusMap[newStatus]?.name || newStatus,
            date: new Date().toLocaleString('pt-BR'),
            description: description
        });
        saveTrackingCodes();
    }
}

function renderTrackingResult(trackingCode) {
    const container = document.getElementById('trackingResult');
    const order = trackingOrders[trackingCode];
    
    if (!order) {
        container.style.display = 'block';
        container.innerHTML = `
            <div class="tracking-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Código não encontrado</h3>
                <p>Verifique o código digitado. O código de rastreamento foi enviado para seu e-mail após a confirmação do pedido.</p>
            </div>
        `;
        return;
    }
    
    // Verificar se o pedido pertence ao usuário logado
    if (currentUser && order.userId && order.userId !== currentUser.id) {
        container.style.display = 'block';
        container.innerHTML = `
            <div class="tracking-error">
                <i class="fas fa-lock"></i>
                <h3>Acesso negado</h3>
                <p>Este pedido pertence a outro usuário. Faça login com a conta correta para visualizar.</p>
                <button class="btn-primary" onclick="navigateTo('login')">Fazer login</button>
            </div>
        `;
        return;
    }
    
    const statusMap = {
        'confirmed': { name: "✅ Pedido confirmado", icon: "fa-check-circle", color: "#10b981", step: 1 },
        'production': { name: "🎨 Em produção", icon: "fa-palette", color: "#ffcc33", step: 2 },
        'shipped': { name: "🚚 Enviado", icon: "fa-truck", color: "#ff3366", step: 3 },
        'in_transit': { name: "📦 Em trânsito", icon: "fa-box", color: "#ff3366", step: 4 },
        'delivered': { name: "🏠 Entregue", icon: "fa-home", color: "#10b981", step: 5 }
    };
    
    const currentStep = statusMap[order.currentStatus]?.step || 1;
    
    container.style.display = 'block';
    container.innerHTML = `
        <div class="tracking-card">
            <div class="tracking-header-info">
                <div>
                    <span class="tracking-label">Código de rastreio</span>
                    <h3>${order.trackingCode}</h3>
                </div>
                <div class="tracking-status-badge" style="background: ${statusMap[order.currentStatus]?.color || '#666'}20; color: ${statusMap[order.currentStatus]?.color || '#666'}">
                    <i class="fas ${statusMap[order.currentStatus]?.icon}"></i>
                    ${statusMap[order.currentStatus]?.name}
                </div>
            </div>
            
            <div class="tracking-progress">
                <div class="progress-steps">
                    <div class="step ${currentStep >= 1 ? 'active' : ''}">
                        <div class="step-icon"><i class="fas fa-check-circle"></i></div>
                        <div class="step-label">Confirmado</div>
                    </div>
                    <div class="step ${currentStep >= 2 ? 'active' : ''}">
                        <div class="step-icon"><i class="fas fa-palette"></i></div>
                        <div class="step-label">Produção</div>
                    </div>
                    <div class="step ${currentStep >= 3 ? 'active' : ''}">
                        <div class="step-icon"><i class="fas fa-truck"></i></div>
                        <div class="step-label">Enviado</div>
                    </div>
                    <div class="step ${currentStep >= 4 ? 'active' : ''}">
                        <div class="step-icon"><i class="fas fa-box"></i></div>
                        <div class="step-label">Trânsito</div>
                    </div>
                    <div class="step ${currentStep >= 5 ? 'active' : ''}">
                        <div class="step-icon"><i class="fas fa-home"></i></div>
                        <div class="step-label">Entregue</div>
                    </div>
                </div>
            </div>
            
            <div class="tracking-details">
                <div class="tracking-info-box">
                    <h4><i class="fas fa-shopping-bag"></i> Resumo do Pedido</h4>
                    <p><strong>Pedido #:</strong> ${order.orderId}</p>
                    <p><strong>Total:</strong> R$ ${order.total.toFixed(2)}</p>
                    <p><strong>Previsão de entrega:</strong> ${order.estimatedDelivery}</p>
                </div>
                
                <div class="tracking-timeline">
                    <h4><i class="fas fa-history"></i> Linha do tempo</h4>
                    ${order.statusHistory.map(event => `
                        <div class="timeline-event">
                            <div class="event-date">${event.date}</div>
                            <div class="event-status">${event.status}</div>
                            <div class="event-description">${event.description}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="tracking-support">
                <i class="fas fa-headset"></i>
                <div>
                    <strong>Precisa de ajuda?</strong>
                    <p>Entre em contato com nosso atendimento pelo WhatsApp (11) 99999-9999</p>
                </div>
            </div>
        </div>
    `;
}

// ===== AVALIAÇÕES INICIAIS =====
function initializeSampleReviews() {
    const stored = localStorage.getItem('artexReviews');
    if (stored && JSON.parse(stored) && Object.keys(JSON.parse(stored)).length > 0) {
        return;
    }
    
    const sampleReviews = {
        1: [
            { id: 1001, author: "Carlos Mendes", rating: 5, text: "Camiseta incrível! O tecido é super confortável e a estampa ficou perfeita.", date: "15/03/2025" },
            { id: 1002, author: "Marina Silva", rating: 4, text: "Muito bonita, a estampa é vibrante. Recomendo pedir um número menor.", date: "28/02/2025" }
        ],
        2: [
            { id: 1004, author: "Fernanda Lima", rating: 5, text: "Perfeita para quem é fã de matemática! Estampa super criativa.", date: "20/03/2025" }
        ],
        3: [
            { id: 1006, author: "Lucas Andrade", rating: 5, text: "Linda demais! Estampa com detalhes perfeitos, material de qualidade.", date: "18/03/2025" }
        ],
        4: [
            { id: 1008, author: "Gustavo Henrique", rating: 5, text: "Arte insana! A qualidade da estampa é surreal.", date: "12/03/2025" }
        ]
    };
    
    for (const [productId, productReviews] of Object.entries(sampleReviews)) {
        const pid = parseInt(productId);
        if (!reviews[pid] || reviews[pid].length === 0) {
            reviews[pid] = productReviews;
        }
    }
    
    saveReviews();
}

// ===== VALIDAÇÕES =====
function validarEmail(email) {
    const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return re.test(email);
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    const invalidos = ['00000000000', '11111111111', '22222222222', '33333333333', '44444444444', '55555555555', '66666666666', '77777777777', '88888888888', '99999999999'];
    if (invalidos.includes(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = 11 - (soma % 11);
    let digito1 = resto >= 10 ? 0 : resto;
    if (digito1 !== parseInt(cpf.charAt(9))) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = 11 - (soma % 11);
    let digito2 = resto >= 10 ? 0 : resto;
    return digito2 === parseInt(cpf.charAt(10));
}

function validarCartaoLuhn(numero) {
    const num = numero.replace(/\s/g, '').replace(/\D/g, '');
    if (num.length < 13 || num.length > 19) return false;
    let sum = 0;
    let isEven = false;
    for (let i = num.length - 1; i >= 0; i--) {
        let digit = parseInt(num.charAt(i));
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
    }
    return (sum % 10) === 0;
}

function identificarBandeiraCartao(numero) {
    const num = numero.replace(/\s/g, '');
    if (/^4/.test(num)) return 'Visa';
    if (/^5[1-5]/.test(num)) return 'Mastercard';
    if (/^3[47]/.test(num)) return 'American Express';
    return '';
}

// ===== TEMA =====
function initTheme() {
    const savedTheme = localStorage.getItem('artexTheme') || 'light';
    if (savedTheme === 'dark') document.body.classList.add('dark');
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('artexTheme', newTheme);
    updateThemeIcon(newTheme);
    showToast(newTheme === 'dark' ? '🌙 Modo escuro ativado' : '☀️ Modo claro ativado');
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.innerHTML = theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }
}

// ===== FAVORITOS =====
function loadWishlist() {
    const key = currentUser ? `artexWishlist_${currentUser.id}` : 'artexWishlist';
    const stored = localStorage.getItem(key);
    if (stored) {
        try {
            wishlist = JSON.parse(stored);
        } catch(e) {
            wishlist = [];
        }
    } else {
        wishlist = [];
    }
    updateWishlistCount();
}

function saveWishlist() {
    const key = currentUser ? `artexWishlist_${currentUser.id}` : 'artexWishlist';
    localStorage.setItem(key, JSON.stringify(wishlist));
    updateWishlistCount();
}

function updateWishlistCount() {
    const countEl = document.getElementById('wishlistCount');
    if (countEl) countEl.innerText = wishlist.length;
}

function isInWishlist(productId) {
    return wishlist.includes(productId);
}

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index === -1) {
        wishlist.push(productId);
        showToast('❤️ Adicionado aos favoritos!');
    } else {
        wishlist.splice(index, 1);
        showToast('💔 Removido dos favoritos');
    }
    saveWishlist();
    
    updateAllWishlistButtons();
    renderWishlistPage();
    const activePage = document.querySelector('.page-view.active-page')?.id;
    if (activePage === 'page-shop') renderProducts();
    else if (activePage === 'page-home') renderFeatured();
    else if (activePage === 'page-product-detail') {
        const productId = window.currentProductDetailId;
        if (productId) goToDetail(productId);
    }
}

function updateAllWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const id = parseInt(btn.dataset.id);
        if (id) {
            const isActive = isInWishlist(id);
            btn.classList.toggle('active', isActive);
            btn.innerHTML = isActive ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
        }
    });
}

function renderWishlistPage() {
    const container = document.getElementById('wishlistContainer');
    if (!container) return;
    const wishlistProducts = products.filter(p => wishlist.includes(p.id));
    if (wishlistProducts.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:60px;">
            <i class="far fa-heart" style="font-size:3rem; color:#ccc;"></i>
            <p style="margin-top:20px;">Sua lista de desejos está vazia</p>
            <button class="filter-btn" data-page="shop" style="margin-top:20px; background:#ff3366; color:white;">Explorar produtos →</button>
        </div>`;
        const exploreBtn = container.querySelector('[data-page="shop"]');
        if (exploreBtn) exploreBtn.addEventListener('click', () => navigateTo('shop'));
        return;
    }
    container.innerHTML = wishlistProducts.map(p => renderProductCard(p)).join('');
    attachProductEvents();
}

// ===== SISTEMA DE AVALIAÇÕES =====
function loadReviews() {
    const stored = localStorage.getItem('artexReviews');
    if (stored) {
        try {
            reviews = JSON.parse(stored);
        } catch(e) {
            reviews = {};
        }
    }
}

function saveReviews() {
    localStorage.setItem('artexReviews', JSON.stringify(reviews));
}

function addReview(productId, author, rating, text) {
    if (text.length > MAX_REVIEW_LENGTH) {
        showToast(`❌ A avaliação deve ter no máximo ${MAX_REVIEW_LENGTH} caracteres!`, true);
        return false;
    }
    if (!reviews[productId]) reviews[productId] = [];
    reviews[productId].push({
        id: Date.now(),
        author: author,
        rating: rating,
        text: text,
        date: new Date().toLocaleDateString('pt-BR')
    });
    saveReviews();
    showToast('⭐ Avaliação enviada! Obrigado!');
    return true;
}

function deleteReview(productId, reviewId) {
    if (reviews[productId]) {
        reviews[productId] = reviews[productId].filter(r => r.id !== reviewId);
        saveReviews();
        showToast('🗑️ Avaliação removida');
        return true;
    }
    return false;
}

function editReview(productId, reviewId, newText) {
    if (newText.length > MAX_REVIEW_LENGTH) {
        showToast(`❌ A avaliação deve ter no máximo ${MAX_REVIEW_LENGTH} caracteres!`, true);
        return false;
    }
    if (reviews[productId]) {
        const review = reviews[productId].find(r => r.id === reviewId);
        if (review) {
            review.text = newText;
            saveReviews();
            showToast('✏️ Avaliação editada');
            return true;
        }
    }
    return false;
}

function getProductReviews(productId) {
    return reviews[productId] || [];
}

function getAverageRating(productId) {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / productReviews.length;
}

function renderStars(rating, interactive = false) {
    let stars = '';
    const roundedRating = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
        if (interactive) {
            stars += `<i class="fas fa-star rating-star" data-rating="${i}" style="cursor:pointer; color:${i <= rating ? '#ffcc33' : '#d4c9bc'}"></i>`;
        } else {
            stars += `<i class="fas fa-star" style="color:${i <= roundedRating ? '#ffcc33' : '#d4c9bc'}"></i>`;
        }
    }
    return stars;
}

function updateCharCounter(textarea, counterElement) {
    const length = textarea.value.length;
    const remaining = MAX_REVIEW_LENGTH - length;
    counterElement.textContent = `${length}/${MAX_REVIEW_LENGTH}`;
    if (remaining < 0) {
        counterElement.classList.add('danger');
        counterElement.classList.remove('warning');
    } else if (remaining < 50) {
        counterElement.classList.add('warning');
        counterElement.classList.remove('danger');
    } else {
        counterElement.classList.remove('warning', 'danger');
    }
}

// ===== PEDIDOS =====
function loadOrders() {
    const key = currentUser ? `artexOrders_${currentUser.id}` : 'artexOrders';
    const stored = localStorage.getItem(key);
    if (stored) {
        try {
            orders = JSON.parse(stored);
        } catch(e) {
            orders = [];
        }
    } else {
        orders = [];
    }
}

function saveOrder(orderData) {
    const newOrder = { 
        id: Date.now(), 
        date: new Date().toLocaleDateString('pt-BR'), 
        status: '✅ Confirmado',
        trackingCode: null,
        userId: currentUser?.id || null,
        customerEmail: orderData.customer?.email || '',
        ...orderData 
    };
    
    const trackingCode = generateTrackingCode(newOrder.id);
    newOrder.trackingCode = trackingCode;
    
    addTrackingCode(newOrder.id, trackingCode, {
        customer: orderData.customer,
        items: orderData.items,
        total: orderData.total
    });
    
    const key = currentUser ? `artexOrders_${currentUser.id}` : 'artexOrders';
    orders.unshift(newOrder);
    localStorage.setItem(key, JSON.stringify(orders));
    
    showToast(`📦 Pedido #${newOrder.id} confirmado! Código de rastreio: ${trackingCode}`);
    
    return newOrder;
}

function renderOrdersPage() {
    const container = document.getElementById('ordersContainer');
    if (!container) return;
    
    if (!isLoggedIn()) {
        container.innerHTML = `
            <div style="text-align:center; padding:60px;">
                <i class="fas fa-lock" style="font-size:3rem; color:#ff3366;"></i>
                <p style="margin-top:20px;">Faça login para visualizar seus pedidos</p>
                <button class="btn-primary" onclick="navigateTo('login')" style="margin-top:20px;">Fazer login →</button>
            </div>
        `;
        return;
    }
    
    if (orders.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:60px;">
            <i class="fas fa-box-open" style="font-size:3rem; color:#ccc;"></i>
            <p style="margin-top:20px;">Você ainda não fez nenhum pedido</p>
            <button class="filter-btn" data-page="shop" style="margin-top:20px;">Começar a comprar →</button>
        </div>`;
        const shopBtn = container.querySelector('[data-page="shop"]');
        if (shopBtn) shopBtn.addEventListener('click', () => navigateTo('shop'));
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-number">Pedido #${order.id}</span>
                <span class="order-status">${order.status}</span>
                <span>${order.date}</span>
            </div>
            <div class="order-tracking-info">
                <i class="fas fa-map-marked-alt"></i> Código de rastreio: 
                <strong>${order.trackingCode}</strong>
                <button class="tracking-link-btn" data-code="${order.trackingCode}">Rastrear →</button>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <div class="order-item-img" style="background-image:url('${item.imageUrl}')"></div>
                        <div style="flex:1">
                            <strong>${escapeHtml(item.name)}</strong><br>
                            Qtd: ${item.quantity} x R$ ${item.price.toFixed(2)}
                        </div>
                        <div>R$ ${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                Total: R$ ${order.total.toFixed(2)}<br>
                ${order.paymentMethod ? `<small>Pagamento: ${order.paymentMethod}</small>` : ''}
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.tracking-link-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.dataset.code;
            document.getElementById('trackingCode').value = code;
            navigateTo('tracking');
            setTimeout(() => {
                if (typeof renderTrackingResult === 'function') {
                    renderTrackingResult(code);
                }
            }, 100);
        });
    });
}

// ===== PAGAMENTOS =====
const PIX_KEY = "contato@artexstudio.com";

function generatePixPayload(amount) {
    const merchantName = "ARTEX STUDIO";
    const merchantCity = "SAO PAULO";
    const pixKey = PIX_KEY;
    const amountValue = amount.toFixed(2).replace('.', '');
    const payload = [
        "000201",
        "26580014BR.GOV.BCB.PIX",
        `0136${pixKey}`,
        "52040000",
        "5303986",
        `5405${amountValue}`,
        "5802BR",
        `5909${merchantName}`,
        `6009${merchantCity}`,
        "62070503***",
        "6304"
    ].join("");
    function crc16(str) {
        let crc = 0xFFFF;
        for (let i = 0; i < str.length; i++) {
            crc ^= str.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) {
                crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
            }
        }
        return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    }
    const crc = crc16(payload);
    return payload + crc;
}

function generatePixQRCode(amount) {
    const container = document.getElementById('pixQRCode');
    if (!container) return;
    container.innerHTML = '<div class="loading-spinner" style="margin:20px auto;"></div><p style="text-align:center;">Gerando QR Code...</p>';
    try {
        const payload = generatePixPayload(amount);
        const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(payload)}&size=200&margin=2`;
        container.innerHTML = `
            <div style="text-align:center;">
                <img src="${qrCodeUrl}" alt="QR Code PIX" style="max-width:180px; margin:10px auto; border-radius:12px; background:white; padding:10px;">
                <p style="margin:10px 0;"><strong>Valor: R$ ${amount.toFixed(2)}</strong></p>
                <div style="background:rgba(0,0,0,0.05); padding:10px; border-radius:8px;">
                    <p style="font-size:0.7rem;">Chave PIX: ${PIX_KEY}</p>
                </div>
                <button class="btn-primary" onclick="navigator.clipboard.writeText('${PIX_KEY}')" style="padding:6px 12px; font-size:0.7rem; margin-top:10px;">
                    <i class="fas fa-copy"></i> Copiar Chave
                </button>
                <p style="margin-top:10px; font-size:0.65rem;">Escaneie o QR Code com seu banco</p>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<div style="text-align:center;"><i class="fas fa-exclamation-triangle" style="font-size:2rem; color:#ff3366;"></i><p>Erro ao gerar QR Code</p><button class="btn-primary" onclick="generatePixQRCode(${amount})">Tentar novamente</button></div>`;
    }
}

function generateBoleto(amount) {
    const container = document.getElementById('boletoInfo');
    if (!container) return;
    container.innerHTML = '<div class="loading-spinner" style="margin:20px auto;"></div><p style="text-align:center;">Gerando boleto...</p>';
    try {
        const nossoNumero = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
        const dataVencimento = new Date();
        dataVencimento.setDate(dataVencimento.getDate() + 3);
        const dataFormatada = dataVencimento.toLocaleDateString('pt-BR');
        const valorSemVirgula = Math.round(amount * 100).toString();
        const valorFormatado = valorSemVirgula.padStart(10, '0');
        const dataBase = new Date(1997, 9, 7);
        const diffTime = Math.abs(dataVencimento - dataBase);
        const fatorVencimento = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const codigoBanco = "341";
        const campoLivre = `9${nossoNumero}${fatorVencimento}${valorFormatado}`;
        const codigoBarras = `${codigoBanco}${fatorVencimento}${campoLivre}`;
        function calculaDigitoVerificadorModulo11(numero) {
            let soma = 0;
            let multiplicador = 2;
            for (let i = numero.length - 1; i >= 0; i--) {
                soma += parseInt(numero.charAt(i)) * multiplicador;
                multiplicador++;
                if (multiplicador > 9) multiplicador = 2;
            }
            const resto = soma % 11;
            const digito = 11 - resto;
            if (digito === 0 || digito === 10 || digito === 11) return 1;
            return digito;
        }
        const dvCodigoBarras = calculaDigitoVerificadorModulo11(codigoBarras);
        const codigoBarrasCompleto = codigoBarras.slice(0, 4) + dvCodigoBarras + codigoBarras.slice(4);
        const campo1 = codigoBarrasCompleto.substring(0, 9);
        const campo2 = codigoBarrasCompleto.substring(9, 19);
        const campo3 = codigoBarrasCompleto.substring(19, 29);
        const campo4 = codigoBarrasCompleto.substring(29, 33);
        const campo5 = codigoBarrasCompleto.substring(33, 44);
        const linhaDigitavel = `${campo1}.${campo2}.${campo3} ${campo4}.${campo5}`;
        container.innerHTML = `
            <div style="text-align:center;">
                <i class="fas fa-barcode" style="font-size:2.5rem; color:#ffcc33;"></i>
                <p style="margin:10px 0;"><strong>Valor: R$ ${amount.toFixed(2)}</strong></p>
                <p><strong>Vencimento:</strong> ${dataFormatada}</p>
                <p><strong>Nosso Número:</strong> ${nossoNumero}</p>
                <div style="background:rgba(0,0,0,0.05); padding:10px; border-radius:8px; margin:10px 0;">
                    <code style="font-size:0.65rem; word-break:break-all;">${linhaDigitavel}</code>
                </div>
                <div style="display:flex; gap:10px; justify-content:center;">
                    <button class="btn-primary" onclick="navigator.clipboard.writeText('${codigoBarrasCompleto}')" style="padding:6px 12px; font-size:0.7rem;">
                        <i class="fas fa-copy"></i> Copiar
                    </button>
                    <button class="btn-primary" onclick="window.print()" style="padding:6px 12px; font-size:0.7rem;">
                        <i class="fas fa-print"></i> Imprimir
                    </button>
                </div>
                <p style="margin-top:10px; font-size:0.65rem;">O boleto será enviado para seu e-mail</p>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<div style="text-align:center;"><i class="fas fa-exclamation-triangle" style="font-size:2rem; color:#ff3366;"></i><p>Erro ao gerar boleto</p><button class="btn-primary" onclick="generateBoleto(${amount})">Tentar novamente</button></div>`;
    }
}

// ===== RENDERIZAÇÃO DE PRODUTOS =====
function renderProductCard(p) {
    const stock = window.getStockStatus ? window.getStockStatus(p.stock) : { text: `${p.stock} em estoque`, class: "stock-in" };
    const inWishlist = isInWishlist(p.id);
    const avgRating = getAverageRating(p.id);
    const discountPercent = p.discount ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
    return `<div class="product-card" data-id="${p.id}">
        ${p.discount ? `<div class="discount-badge">-${discountPercent}%</div>` : ''}
        ${p.stock <= 0 ? `<div class="soldout-badge">ESGOTADO</div>` : ''}
        <button class="wishlist-btn ${inWishlist ? 'active' : ''}" data-id="${p.id}"><i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i></button>
        <div class="product-img" style="background-image:url('${p.imageUrl}');"></div>
        <div class="product-info">
            <div class="product-title">${escapeHtml(p.name)}</div>
            <div class="average-rating" style="margin:5px 0;">
                ${renderStars(avgRating)}
                <span style="font-size:0.7rem; margin-left:5px;">(${getProductReviews(p.id).length})</span>
            </div>
            <div class="price-row">
                ${p.originalPrice ? `<span class="original-price">R$ ${p.originalPrice.toFixed(2)}</span>` : ''}
                <span class="product-price">R$ ${p.price.toFixed(2)}</span>
            </div>
            <div class="stock-status ${stock.class}">${stock.text}</div>
            <button class="add-to-cart ${p.stock <= 0 ? 'disabled' : ''}" data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>
                <i class="fas fa-shopping-bag"></i> ${p.stock <= 0 ? 'ESGOTADO' : 'ADICIONAR'}
            </button>
        </div>
    </div>`;
}

function renderProducts() {
    const grid = document.getElementById('productsContainer');
    if (!grid) return;
    let filtered = products.filter(p => currentFilter === "todos" || p.category === currentFilter);
    if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    grid.innerHTML = filtered.map(p => renderProductCard(p)).join('');
    attachProductEvents();
}

function renderFeatured() {
    const grid = document.getElementById('featuredProducts');
    if (grid) {
        grid.innerHTML = products.slice(0, 6).map(p => renderProductCard(p)).join('');
        attachProductEvents();
    }
}

async function addToCartWithLoading(id) {
    const btn = document.querySelector(`.add-to-cart[data-id="${id}"]`);
    if (btn && !btn.classList.contains('disabled')) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> ADICIONANDO...';
        btn.disabled = true;
        await new Promise(resolve => setTimeout(resolve, 300));
        if (typeof window.addToCart === 'function') window.addToCart(id);
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    } else if (typeof window.addToCart === 'function') {
        window.addToCart(id);
    }
}

function attachProductEvents() {
    document.querySelectorAll('.add-to-cart:not(.disabled)').forEach(btn => {
        btn.removeEventListener('click', addToCartHandler);
        btn.addEventListener('click', addToCartHandler);
    });
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.removeEventListener('click', wishlistHandler);
        btn.addEventListener('click', wishlistHandler);
    });
    document.querySelectorAll('.product-card').forEach(card => {
        card.removeEventListener('click', productCardHandler);
        card.addEventListener('click', productCardHandler);
    });
}

function addToCartHandler(e) {
    e.stopPropagation();
    addToCartWithLoading(parseInt(e.currentTarget.dataset.id));
}

function wishlistHandler(e) {
    e.stopPropagation();
    toggleWishlist(parseInt(e.currentTarget.dataset.id));
}

function productCardHandler(e) {
    if (e.target.closest('.add-to-cart') || e.target.closest('.wishlist-btn')) return;
    goToDetail(parseInt(e.currentTarget.dataset.id));
}

function goToDetail(id) {
    window.currentProductDetailId = id;
    const p = products.find(prod => prod.id === id);
    if (!p) return;
    const stock = window.getStockStatus ? window.getStockStatus(p.stock) : { text: `${p.stock} em estoque`, class: "stock-in" };
    const avgRating = getAverageRating(p.id);
    const productReviews = getProductReviews(p.id);
    const inWishlistFlag = isInWishlist(p.id);
    const container = document.getElementById('productDetailContainer');
    if (container) {
        container.innerHTML = `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; margin:40px 0;">
                <div class="product-img" style="width:100%; aspect-ratio:1; background-image:url('${p.imageUrl}'); background-size:cover; border-radius:16px;"></div>
                <div>
                    <h1 style="font-size:1.8rem;">${escapeHtml(p.name)}</h1>
                    <button class="wishlist-btn ${inWishlistFlag ? 'active' : ''}" data-id="${p.id}" style="position:relative; top:0; right:0; margin:15px 0; width:auto; padding:8px 16px; border-radius:40px; background:${inWishlistFlag ? '#ff3366' : 'rgba(255,51,102,0.1)'}">
                        <i class="${inWishlistFlag ? 'fas' : 'far'} fa-heart"></i> ${inWishlistFlag ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    </button>
                    <div class="average-rating" style="margin:10px 0;">
                        ${renderStars(avgRating)}
                        <span style="margin-left:8px;">${productReviews.length} avaliações</span>
                    </div>
                    <div class="price-row">
                        ${p.originalPrice ? `<span class="original-price">R$ ${p.originalPrice.toFixed(2)}</span>` : ''}
                        <span class="product-price" style="font-size:1.6rem;">R$ ${p.price.toFixed(2)}</span>
                    </div>
                    <div class="stock-status ${stock.class}" style="display:inline-block;">${stock.text}</div>
                    <p style="margin:20px 0;">${p.description}</p>
                    <p style="font-style:italic; color:#ffcc33;">"${p.quote}"</p>
                    <button class="add-to-cart ${p.stock <= 0 ? 'disabled' : ''}" data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-bag"></i> ${p.stock <= 0 ? 'ESGOTADO' : 'ADICIONAR AO CARRINHO'}
                    </button>
                    <button id="backToShopBtn" style="margin-top:20px; background:none; border:none; color:#ffcc33; cursor:pointer;">← Voltar à Loja</button>
                </div>
            </div>
            <div class="reviews-section">
                <h3>⭐ Avaliações dos clientes</h3>
                <div id="reviewsList">
                    ${productReviews.map(review => `
                        <div class="review-item" data-review-id="${review.id}">
                            <div class="review-author">${escapeHtml(review.author)}</div>
                            <div class="review-stars">${renderStars(review.rating)}</div>
                            <div class="review-date">${review.date}</div>
                            <div class="review-text">${escapeHtml(review.text)}</div>
                            <div class="review-actions" style="margin-top:8px;">
                                <button class="edit-review" data-id="${review.id}" style="background:none; border:none; color:#ff3366; cursor:pointer;">✏️ Editar</button>
                                <button class="delete-review" data-id="${review.id}" style="background:none; border:none; color:#ff6666; cursor:pointer; margin-left:10px;">🗑️ Excluir</button>
                            </div>
                        </div>
                    `).join('')}
                    ${productReviews.length === 0 ? '<p style="text-align:center; padding:20px;">Seja o primeiro a avaliar este produto!</p>' : ''}
                </div>
                <div class="add-review">
                    <h4>Deixe sua avaliação</h4>
                    <div class="rating-container">
                        <div class="rating-stars" id="ratingStars">
                            ${[1,2,3,4,5].map(i => `<i class="fas fa-star rating-star" data-rating="${i}" style="cursor:pointer; color:#d4c9bc; font-size:1.5rem;"></i>`).join('')}
                        </div>
                    </div>
                    <textarea id="reviewText" placeholder="Conte sua experiência com este produto... (máx. ${MAX_REVIEW_LENGTH} caracteres)" rows="3"></textarea>
                    <div class="char-counter" id="reviewCharCounter">0/${MAX_REVIEW_LENGTH}</div>
                    <input type="text" id="reviewAuthor" placeholder="Seu nome" style="width:100%; padding:10px; margin-top:10px; border-radius:8px; border:1px solid #d4c9bc;">
                    <button id="submitReviewBtn" class="btn-primary" style="margin-top:15px;">Enviar avaliação</button>
                </div>
            </div>
        `;
        
        let selectedRating = 0;
        document.querySelectorAll('#ratingStars .rating-star').forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.dataset.rating);
                document.querySelectorAll('#ratingStars .rating-star').forEach(s => {
                    s.style.color = parseInt(s.dataset.rating) <= selectedRating ? '#ffcc33' : '#d4c9bc';
                });
            });
        });
        
        const reviewTextarea = document.getElementById('reviewText');
        const charCounter = document.getElementById('reviewCharCounter');
        if (reviewTextarea && charCounter) {
            reviewTextarea.addEventListener('input', () => updateCharCounter(reviewTextarea, charCounter));
            updateCharCounter(reviewTextarea, charCounter);
        }
        
        document.querySelectorAll('.edit-review').forEach(btn => {
            btn.addEventListener('click', () => {
                const reviewId = parseInt(btn.dataset.id);
                const reviewItem = btn.closest('.review-item');
                const reviewTextDiv = reviewItem.querySelector('.review-text');
                const currentText = reviewTextDiv.innerText;
                const newText = prompt('Edite sua avaliação (máx. 500 caracteres):', currentText);
                if (newText && newText.trim() && newText.length <= MAX_REVIEW_LENGTH) {
                    if (editReview(p.id, reviewId, newText)) goToDetail(p.id);
                } else if (newText && newText.length > MAX_REVIEW_LENGTH) {
                    showToast(`❌ A avaliação deve ter no máximo ${MAX_REVIEW_LENGTH} caracteres!`, true);
                }
            });
        });
        
        document.querySelectorAll('.delete-review').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja excluir esta avaliação?')) {
                    deleteReview(p.id, parseInt(btn.dataset.id));
                    goToDetail(p.id);
                }
            });
        });
        
        document.getElementById('submitReviewBtn')?.addEventListener('click', () => {
            const text = document.getElementById('reviewText').value;
            const author = document.getElementById('reviewAuthor').value;
            if (selectedRating === 0) { showToast('⭐ Selecione uma classificação!', true); return; }
            if (!text.trim()) { showToast('📝 Escreva sua avaliação!', true); return; }
            if (text.length > MAX_REVIEW_LENGTH) { showToast(`❌ Máximo ${MAX_REVIEW_LENGTH} caracteres!`, true); return; }
            if (!author.trim()) { showToast('👤 Digite seu nome!', true); return; }
            addReview(p.id, author, selectedRating, text);
            goToDetail(p.id);
        });
        
        const detailWishlistBtn = container.querySelector('.wishlist-btn');
        if (detailWishlistBtn) {
            detailWishlistBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleWishlist(p.id);
                const isActive = isInWishlist(p.id);
                detailWishlistBtn.classList.toggle('active', isActive);
                detailWishlistBtn.innerHTML = isActive ? '<i class="fas fa-heart"></i> Remover dos favoritos' : '<i class="far fa-heart"></i> Adicionar aos favoritos';
                detailWishlistBtn.style.background = isActive ? '#ff3366' : 'rgba(255,51,102,0.1)';
            });
        }
        
        const detailAddBtn = container.querySelector('.add-to-cart');
        if (detailAddBtn && p.stock > 0) {
            detailAddBtn.addEventListener('click', () => addToCartWithLoading(p.id));
        }
        
        document.getElementById('backToShopBtn')?.addEventListener('click', () => navigateTo('shop'));
    }
    navigateTo('product-detail');
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ===== ANIMAÇÕES =====
function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    elements.forEach(el => observer.observe(el));
}

function animateNumbers() {
    const numberElements = document.querySelectorAll('.stat-number[data-count]');
    
    numberElements.forEach(el => {
        const target = parseFloat(el.getAttribute('data-count'));
        const isDecimal = target % 1 !== 0;
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = isDecimal ? target.toFixed(1) : Math.floor(target);
                clearInterval(timer);
            } else {
                el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
            }
        }, 40);
    });
}

// ===== PÁGINAS =====
function renderAboutPage() {
    setTimeout(() => {
        animateNumbers();
        initAOS();
        
        const ctaButtons = document.querySelectorAll('.cta-buttons .btn-primary, .cta-buttons .btn-secondary');
        ctaButtons.forEach(btn => {
            btn.removeEventListener('click', ctaHandler);
            btn.addEventListener('click', ctaHandler);
        });
    }, 100);
}

function ctaHandler(e) {
    const page = e.currentTarget.getAttribute('data-page');
    if (page && typeof navigateTo === 'function') {
        navigateTo(page);
    }
}

function renderContactPage() {
    setTimeout(() => {
        document.querySelectorAll('.faq-question-premium').forEach(question => {
            question.removeEventListener('click', window.faqHandler);
            window.faqHandler = function() {
                this.parentElement.classList.toggle('active');
            };
            question.addEventListener('click', window.faqHandler);
        });
        
        initAOS();
        
        const contactPhone = document.getElementById('contactPhone');
        if (contactPhone) {
            contactPhone.removeEventListener('input', window.phoneMaskHandler);
            window.phoneMaskHandler = (e) => {
                e.target.value = maskPhone(e.target.value);
            };
            contactPhone.addEventListener('input', window.phoneMaskHandler);
        }
        
        const newsletterForm = document.getElementById('contactNewsletterForm');
        if (newsletterForm) {
            newsletterForm.removeEventListener('submit', window.newsletterHandler);
            window.newsletterHandler = (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input')?.value;
                if (email && validarEmail(email)) {
                    showToast(`📧 Cadastro realizado! 10% OFF enviado para ${email}`);
                    newsletterForm.reset();
                } else {
                    showToast('📧 Digite um e-mail válido!', true);
                }
            };
            newsletterForm.addEventListener('submit', window.newsletterHandler);
        }
        
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.removeEventListener('submit', window.contactFormHandler);
            window.contactFormHandler = (e) => {
                e.preventDefault();
                showToast("📨 Mensagem enviada! Entraremos em contato em breve.");
                contactForm.reset();
            };
            contactForm.addEventListener('submit', window.contactFormHandler);
        }
    }, 100);
}

// ===== NAVEGAÇÃO =====
function navigateTo(page) {
    document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active-page'));
    const target = document.getElementById(`page-${page}`);
    if (target) target.classList.add('active-page');
    
    if (page === 'shop') renderProducts();
    if (page === 'wishlist') {
        if (isLoggedIn()) {
            renderWishlistPage();
        } else {
            showToast("🔒 Faça login para ver seus favoritos!", true);
            navigateTo('login');
        }
    }
    if (page === 'orders') {
        loadOrders();
        renderOrdersPage();
    }
    if (page === 'checkout' && typeof window.updateCheckout === 'function') window.updateCheckout();
    if (page === 'about') renderAboutPage();
    if (page === 'contact') renderContactPage();
    
    if (page !== 'tracking') {
        const trackingResult = document.getElementById('trackingResult');
        if (trackingResult) trackingResult.style.display = 'none';
    }
    
    window.scrollTo(0, 0);
}

// ===== FORMULÁRIO DE CHECKOUT =====
function validarFormularioCheckout() {
    let isValid = true;
    const name = document.getElementById('fullName')?.value;
    const cpf = document.getElementById('cpf')?.value;
    const email = document.getElementById('email')?.value;
    const phone = document.getElementById('phone')?.value;
    const cep = document.getElementById('cep')?.value;
    const street = document.getElementById('street')?.value;
    const number = document.getElementById('number')?.value;
    const activePayment = document.querySelector('.payment-tab.active')?.dataset.payment;
    
    if (!name) { showToast('Nome completo é obrigatório', true); isValid = false; }
    if (!validarCPF(cpf)) { showToast('CPF inválido', true); isValid = false; }
    if (!validarEmail(email)) { showToast('E-mail inválido', true); isValid = false; }
    if (!phone || phone.replace(/\D/g, '').length < 10) { showToast('Telefone inválido', true); isValid = false; }
    if (!cep || cep.replace(/\D/g, '').length !== 8) { showToast('CEP inválido', true); isValid = false; }
    if (!street) { showToast('Rua é obrigatória', true); isValid = false; }
    if (!number) { showToast('Número é obrigatório', true); isValid = false; }
    
    if (activePayment === 'credit') {
        const cardNumber = document.getElementById('cardNumber')?.value;
        const cardName = document.getElementById('cardName')?.value;
        const cardExpiry = document.getElementById('cardExpiry')?.value;
        const cardCvv = document.getElementById('cardCvv')?.value;
        if (!cardNumber) { showToast('Número do cartão é obrigatório', true); isValid = false; }
        else if (!validarCartaoLuhn(cardNumber)) { showToast('Cartão inválido', true); isValid = false; }
        if (!cardName) { showToast('Nome no cartão é obrigatório', true); isValid = false; }
        if (!cardExpiry) { showToast('Validade é obrigatória', true); isValid = false; }
        if (!cardCvv || cardCvv.replace(/\D/g, '').length < 3) { showToast('CVV inválido', true); isValid = false; }
    }
    return isValid;
}

// ===== MÁSCARAS =====
function maskCPF(cpf) {
    let v = cpf.replace(/\D/g, '');
    if (v.length <= 11) return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').slice(0, 14);
    return cpf;
}

function maskPhone(phone) {
    let v = phone.replace(/\D/g, '');
    if (v.length <= 10) return v.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3').slice(0, 14);
    else return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').slice(0, 15);
}

function maskCEP(cep) {
    let v = cep.replace(/\D/g, '');
    if (v.length <= 8) return v.replace(/(\d{5})(\d{3})/, '$1-$2').slice(0, 9);
    return cep;
}

function maskCardNumber(card) {
    let v = card.replace(/\s/g, '').replace(/\D/g, '');
    return v.replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
}

function maskCardExpiry(expiry) {
    let v = expiry.replace(/\D/g, '');
    if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2, 4);
    return v;
}

// ===== INICIALIZAÇÃO DE EVENTOS =====
function initEventListeners() {
    document.querySelectorAll('[data-page]').forEach(el => {
        el.addEventListener('click', () => navigateTo(el.getAttribute('data-page')));
    });
    
    // User menu dropdown
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = userDropdown.style.display === 'block';
            userDropdown.style.display = isVisible ? 'none' : 'block';
        });
        
        document.addEventListener('click', (e) => {
            if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.style.display = 'none';
            }
        });
    }
    
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        logoutUser();
        userDropdown.style.display = 'none';
    });
    
    // Login Tabs
    document.querySelectorAll('.login-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.login-form-content').forEach(f => f.classList.remove('active'));
            tab.classList.add('active');
            if (tabName === 'login') {
                document.getElementById('loginForm').classList.add('active');
            } else {
                document.getElementById('registerForm').classList.add('active');
            }
        });
    });
    
    // Login Form
    document.getElementById('loginUserForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        if (loginUser(email, password)) {
            loadWishlist();
            loadOrders();
            navigateTo('home');
        }
    });
    
    // Register Form
    document.getElementById('registerUserForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const phone = document.getElementById('regPhone').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        if (registerUser(name, email, phone, password, confirmPassword)) {
            loadWishlist();
            loadOrders();
            navigateTo('home');
        }
    });
    
    // Forgot Password
    document.getElementById('forgotPasswordLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.remove('active');
        document.getElementById('forgotPasswordForm').style.display = 'block';
    });
    
    document.getElementById('backToLoginLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('forgotPasswordForm').style.display = 'none';
        document.getElementById('loginForm').classList.add('active');
    });
    
    document.getElementById('forgotPasswordUserForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value;
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
            showToast(`📧 Instruções de recuperação enviadas para ${email}`);
        } else {
            showToast("❌ E-mail não encontrado!", true);
        }
    });
    
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const input = document.getElementById(targetId);
            if (input) {
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                btn.querySelector('i').classList.toggle('fa-eye');
                btn.querySelector('i').classList.toggle('fa-eye-slash');
            }
        });
    });
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', (e) => { searchTerm = e.target.value; renderProducts(); });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter) {
            btn.addEventListener('click', () => {
                currentFilter = btn.dataset.filter;
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderProducts();
            });
        }
    });
    
    const applyBtn = document.getElementById('applyCouponBtn');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const code = document.getElementById('couponCode').value.toUpperCase();
            if (typeof window.applyCoupon === 'function' && window.applyCoupon(code)) {
                showToast(`🎉 Cupom ${code} aplicado!`);
            } else {
                showToast('❌ Cupom inválido! Use: BEMVINDO10, ARTEX20, ARTEX5 ou FRETEGRATIS', true);
            }
        });
    }
    
    const finalizeBtn = document.getElementById('finalizeOrderBtn');
    if (finalizeBtn) {
        finalizeBtn.addEventListener('click', async () => {
            if (!isLoggedIn()) {
                showToast("🔒 Faça login para finalizar a compra!", true);
                navigateTo('login');
                return;
            }
            if (typeof window.cart !== 'undefined' && window.cart.length === 0) { showToast("Carrinho vazio!", true); return; }
            if (!window.shippingCalculated && window.appliedCoupon !== 'FRETEGRATIS' && (typeof window.cart !== 'undefined' ? window.cart.reduce((a,i)=>a+(i.price*i.quantity),0) : 0) < 299) {
                showToast("⚠️ Calcule o frete primeiro!", true); return;
            }
            if (!validarFormularioCheckout()) { showToast("⚠️ Preencha todos os campos!", true); return; }
            
            const name = document.getElementById('fullName')?.value;
            const email = document.getElementById('email')?.value;
            const cartItems = window.cart || [];
            const subtotal = cartItems.reduce((a, i) => a + (i.price * i.quantity), 0);
            const shipping = window.calculateShipping ? window.calculateShipping() : 0;
            const discount = window.calculateDiscount ? window.calculateDiscount(subtotal) : 0;
            const total = subtotal + shipping - discount;
            const activePayment = document.querySelector('.payment-tab.active')?.dataset.payment;
            const paymentMethod = activePayment === 'credit' ? 'Cartão' : activePayment === 'pix' ? 'PIX' : 'Boleto';
            
            const newOrder = saveOrder({ 
                items: cartItems, 
                total, 
                paymentMethod, 
                customer: { name, email } 
            });
            
            window.cart = [];
            window.appliedCoupon = null;
            window.calculatedCep = null;
            window.shippingCalculated = false;
            window.currentShipping = 0;
            if (typeof window.saveCart === 'function') window.saveCart();
            if (typeof window.updateAll === 'function') window.updateAll();
            
            const modalMsg = document.getElementById('modalMessage');
            if (modalMsg) modalMsg.innerHTML = `✅ Pedido confirmado!<br><br>Total: <strong>R$ ${total.toFixed(2)}</strong><br>Pagamento: ${paymentMethod}<br><br>📧 Confirmação enviada para ${email}<br><br>📦 Código de rastreio: <strong>${newOrder.trackingCode}</strong>`;
            document.getElementById('successModal')?.classList.add('active');
            navigateTo('orders');
        });
    }
    
    const calcBtn = document.getElementById('calcShippingBtn');
    if (calcBtn) calcBtn.addEventListener('click', () => { if (typeof window.calculateAndUpdateShipping === 'function') window.calculateAndUpdateShipping(); });
    
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        let debounceTimer;
        cepInput.addEventListener('input', () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(() => buscarEnderecoPorCep(), 800); });
    }
    
    const phoneInput = document.getElementById('phone');
    if (phoneInput) phoneInput.addEventListener('input', (e) => { e.target.value = maskPhone(e.target.value); });
    
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            e.target.value = maskCardNumber(e.target.value);
            const bandeira = identificarBandeiraCartao(e.target.value);
            const brandSpan = document.getElementById('cardBrand');
            if (brandSpan && bandeira) brandSpan.innerHTML = ` ${bandeira}`;
        });
    }
    
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) cardExpiryInput.addEventListener('input', (e) => { e.target.value = maskCardExpiry(e.target.value); });
    
    const cardCvvInput = document.getElementById('cardCvv');
    if (cardCvvInput) cardCvvInput.addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); });
    
    document.querySelectorAll('.payment-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.payment-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.payment-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`payment-${tab.dataset.payment}`)?.classList.add('active');
            const total = parseFloat(document.getElementById('checkoutTotal')?.innerText.replace('R$', '').replace(',', '.')) || 0;
            if (tab.dataset.payment === 'pix' && total > 0) generatePixQRCode(total);
            if (tab.dataset.payment === 'boleto' && total > 0) generateBoleto(total);
        });
    });
    
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    if (mobileBtn && navLinks) mobileBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
    
    document.getElementById('cartIcon')?.addEventListener('click', () => { if (typeof window.openCartSidebar === 'function') window.openCartSidebar(); });
    document.getElementById('closeCartBtn')?.addEventListener('click', () => { if (typeof window.closeCartSidebar === 'function') window.closeCartSidebar(); });
    document.getElementById('backdrop')?.addEventListener('click', () => { if (typeof window.closeCartSidebar === 'function') window.closeCartSidebar(); });
    document.getElementById('sidebarCheckoutBtn')?.addEventListener('click', () => { if (typeof window.goToCheckoutFromCart === 'function') window.goToCheckoutFromCart(); });
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
    
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) cpfInput.addEventListener('input', (e) => { e.target.value = maskCPF(e.target.value); });
    
    const newsletterHomeForm = document.getElementById('newsletterForm');
    if (newsletterHomeForm) {
        newsletterHomeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletterEmail')?.value;
            if (email && validarEmail(email)) {
                showToast(`📧 Cadastro realizado! 10% OFF enviado para ${email}`);
                newsletterHomeForm.reset();
            } else {
                showToast('📧 E-mail inválido!', true);
            }
        });
    }
    
    const trackingBtn = document.getElementById('trackingBtn');
    if (trackingBtn) {
        trackingBtn.addEventListener('click', () => {
            const code = document.getElementById('trackingCode')?.value.trim().toUpperCase();
            if (!code) {
                showToast('Digite um código de rastreamento', true);
                return;
            }
            renderTrackingResult(code);
        });
    }
    
    const trackingInput = document.getElementById('trackingCode');
    if (trackingInput) {
        trackingInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const code = trackingInput.value.trim().toUpperCase();
                if (code) renderTrackingResult(code);
            }
        });
    }
}

async function buscarEnderecoPorCep() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput ? cepInput.value : '';
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    
    const streetInput = document.getElementById('street');
    const neighborhoodInput = document.getElementById('neighborhood');
    const cityInput = document.getElementById('city');
    if (streetInput?.value && neighborhoodInput?.value && cityInput?.value) return;
    
    showLoading(true);
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (!data.erro) {
            if (streetInput && data.logradouro && !streetInput.value) streetInput.value = data.logradouro;
            if (neighborhoodInput && data.bairro && !neighborhoodInput.value) neighborhoodInput.value = data.bairro;
            if (cityInput && data.localidade && !cityInput.value) cityInput.value = `${data.localidade} - ${data.uf}`;
            showToast(`✅ Endereço preenchido automaticamente!`);
        }
    } catch (error) { console.error("Erro ao buscar CEP:", error); }
    finally { showLoading(false); }
}

function closeModal() { document.getElementById('successModal')?.classList.remove('active'); }
window.copyEmail = (email) => { navigator.clipboard.writeText(email); showToast(`📧 E-mail ${email} copiado!`); };

// ===== INICIALIZAÇÃO PRINCIPAL =====
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.loadCart === 'function') window.loadCart();
    loadUsers();
    loadCurrentUser();
    loadWishlist();
    loadReviews();
    initializeSampleReviews();
    loadOrders();
    initializeTrackingCodes();
    renderFeatured();
    initEventListeners();
    initTheme();
    navigateTo('home');
    
    setTimeout(() => {
        initAOS();
        if (typeof window.fixImageUrls === 'function') window.fixImageUrls();
    }, 100);
});

window.navigateTo = navigateTo;
window.closeModal = closeModal;
window.generatePixQRCode = generatePixQRCode;
window.generateBoleto = generateBoleto;
window.renderStars = renderStars;
window.getAverageRating = getAverageRating;
window.getProductReviews = getProductReviews;
window.copyEmail = copyEmail;
window.renderContactPage = renderContactPage;
window.renderAboutPage = renderAboutPage;
window.initAOS = initAOS;
window.maskPhone = maskPhone;
window.animateNumbers = animateNumbers;
window.renderTrackingResult = renderTrackingResult;
window.requireLogin = requireLogin;
window.isLoggedIn = isLoggedIn;
window.currentUser = () => currentUser;