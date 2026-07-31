// cart.js - ARTEX STUDIO (Versão Corrigida e Integrada)
let cart = [];
let appliedCoupon = null;
let currentShipping = 0;
let calculatedCep = null;
let shippingCalculated = false;

const availableCoupons = {
    'BEMVINDO10': { type: 'percent', value: 10, message: '10% de desconto!' },
    'ARTEX20': { type: 'percent', value: 20, message: '20% de desconto!' },
    'FRETEGRATIS': { type: 'free_shipping', value: 0, message: 'Frete grátis!' },
    'ARTEX5': { type: 'percent', value: 5, message: '5% de desconto!' }
};

function saveCart() {
    localStorage.setItem("artexCart", JSON.stringify(cart));
}

function loadCart() {
    const stored = localStorage.getItem("artexCart");
    if (stored) {
        try {
            cart = JSON.parse(stored);
        } catch (e) {
            cart = [];
        }
    }
    window.cart = cart;
    if (typeof updateAll === 'function') updateAll();
}

function updateCartCounter() {
    const countEl = document.getElementById('cartCount');
    if (countEl) {
        countEl.innerText = cart.reduce((a, i) => a + i.quantity, 0);
    }
}

function showToast(msg, isError = false) {
    const t = document.getElementById('toastMsg');
    if (t) {
        t.innerText = msg;
        t.style.opacity = '1';
        t.style.background = isError ? 'linear-gradient(135deg, #ff3366, #ff6666)' : 'linear-gradient(135deg, #ff3366, #ffcc33)';
        setTimeout(() => {
            t.style.opacity = '0';
        }, 3000);
    }
}

function getStockStatus(stock) {
    if (stock <= 0) return { text: "ESGOTADO", class: "stock-out" };
    if (stock <= 5) return { text: `ÚLTIMAS ${stock}!`, class: "stock-low" };
    return { text: `${stock} em estoque`, class: "stock-in" };
}

async function buscaCepReal(cep) {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
        return { error: true, message: "CEP deve ter 8 dígitos" };
    }
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (data.erro) {
            return { error: true, message: "CEP não encontrado" };
        }
        return {
            error: false,
            cep: data.cep,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf
        };
    } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        return { error: true, message: "Erro ao consultar CEP" };
    }
}

function calcularFretePorUF(uf, subtotal) {
    if (appliedCoupon === 'FRETEGRATIS' || subtotal >= 299) {
        return { valor: 0, prazo: 5, mensagem: "FRETE GRÁTIS" };
    }
    const tabelaFrete = {
        'SP': 12.90, 'RJ': 15.90, 'MG': 16.90, 'ES': 17.90,
        'PR': 18.90, 'SC': 19.90, 'RS': 20.90, 'DF': 18.90,
        'GO': 19.90, 'MT': 22.90, 'MS': 21.90, 'BA': 24.90,
        'SE': 24.90, 'AL': 25.90, 'PE': 25.90, 'PB': 26.90,
        'RN': 26.90, 'CE': 27.90, 'PI': 27.90, 'MA': 28.90,
        'PA': 29.90, 'AM': 32.90, 'RR': 33.90, 'RO': 31.90,
        'AC': 34.90, 'TO': 29.90, 'AP': 35.90
    };
    const valor = tabelaFrete[uf] || 29.90;
    return { valor, prazo: 8, mensagem: `PAC - R$ ${valor.toFixed(2)}` };
}

function resetShipping() {
    if (shippingCalculated) {
        shippingCalculated = false;
        calculatedCep = null;
        currentShipping = 0;
        if (typeof updateCheckout === 'function') updateCheckout();
        const shippingResultDiv = document.getElementById('shippingResult');
        if (shippingResultDiv) {
            shippingResultDiv.style.display = 'none';
            shippingResultDiv.innerHTML = '';
        }
        const streetInput = document.getElementById('street');
        const neighborhoodInput = document.getElementById('neighborhood');
        const cityInput = document.getElementById('city');
        if (streetInput && streetInput.value && streetInput.getAttribute('data-auto') === 'true') {
            streetInput.value = '';
            streetInput.removeAttribute('data-auto');
        }
        if (neighborhoodInput && neighborhoodInput.value && neighborhoodInput.getAttribute('data-auto') === 'true') {
            neighborhoodInput.value = '';
            neighborhoodInput.removeAttribute('data-auto');
        }
        if (cityInput && cityInput.value && cityInput.getAttribute('data-auto') === 'true') {
            cityInput.value = '';
            cityInput.removeAttribute('data-auto');
        }
        showToast("🔄 Frete resetado. Calcule novamente com seu CEP.");
    }
}

async function calculateAndUpdateShipping() {
    const calcBtn = document.getElementById('calcShippingBtn');
    const cepInput = document.getElementById('cep');
    const cep = cepInput ? cepInput.value : '';
    const subtotal = cart.reduce((a, i) => a + (i.price * i.quantity), 0);
    const shippingResultDiv = document.getElementById('shippingResult');
    const streetInput = document.getElementById('street');
    const neighborhoodInput = document.getElementById('neighborhood');
    const cityInput = document.getElementById('city');
    
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
        if (shippingResultDiv) {
            shippingResultDiv.style.display = 'block';
            shippingResultDiv.style.color = '#ff6666';
            shippingResultDiv.innerHTML = '⚠️ Digite um CEP válido com 8 dígitos';
        }
        showToast("⚠️ Digite um CEP válido com 8 dígitos", true);
        return false;
    }
    
    if (calcBtn) {
        const originalText = calcBtn.innerHTML;
        calcBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Buscando...';
        calcBtn.disabled = true;
        if (shippingResultDiv) {
            shippingResultDiv.style.display = 'block';
            shippingResultDiv.style.color = '#ffcc33';
            shippingResultDiv.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Buscando CEP...';
        }
        const endereco = await buscaCepReal(cep);
        calcBtn.innerHTML = originalText;
        calcBtn.disabled = false;
        if (endereco.error) {
            if (shippingResultDiv) {
                shippingResultDiv.style.color = '#ff6666';
                shippingResultDiv.innerHTML = `❌ ${endereco.message}`;
            }
            showToast(`❌ ${endereco.message}`, true);
            currentShipping = 0;
            calculatedCep = null;
            shippingCalculated = false;
            if (typeof updateCheckout === 'function') updateCheckout();
            return false;
        }
        if (streetInput && endereco.logradouro) {
            streetInput.value = endereco.logradouro;
            streetInput.setAttribute('data-auto', 'true');
        }
        if (neighborhoodInput && endereco.bairro) {
            neighborhoodInput.value = endereco.bairro;
            neighborhoodInput.setAttribute('data-auto', 'true');
        }
        if (cityInput && endereco.cidade) {
            cityInput.value = `${endereco.cidade} - ${endereco.uf}`;
            cityInput.setAttribute('data-auto', 'true');
        }
        const freteInfo = calcularFretePorUF(endereco.uf, subtotal);
        currentShipping = freteInfo.valor;
        calculatedCep = cep;
        shippingCalculated = true;
        if (shippingResultDiv) {
            if (currentShipping === 0) {
                shippingResultDiv.style.color = '#10b981';
                shippingResultDiv.innerHTML = `✅ FRETE GRÁTIS!<br>📍 ${endereco.logradouro || ''}, ${endereco.bairro || ''} - ${endereco.cidade}/${endereco.uf}`;
            } else {
                shippingResultDiv.style.color = '#10b981';
                shippingResultDiv.innerHTML = `✅ Frete: R$ ${currentShipping.toFixed(2)}<br>📍 ${endereco.logradouro || ''}, ${endereco.bairro || ''} - ${endereco.cidade}/${endereco.uf}`;
            }
        }
        showToast(`🎉 Frete calculado: ${currentShipping === 0 ? 'FRETE GRÁTIS' : 'R$ ' + currentShipping.toFixed(2)}`);
        if (typeof updateCheckout === 'function') updateCheckout();
        return true;
    }
    return false;
}

function calculateShipping() {
    if (appliedCoupon === 'FRETEGRATIS') return 0;
    const subtotal = cart.reduce((a, i) => a + (i.price * i.quantity), 0);
    if (subtotal >= 299) return 0;
    if (!shippingCalculated || calculatedCep === null) return 0;
    return currentShipping;
}

function calculateDiscount(subtotal) {
    if (!appliedCoupon) return 0;
    const coupon = availableCoupons[appliedCoupon];
    if (!coupon) return 0;
    if (coupon.type === 'percent') {
        return subtotal * (coupon.value / 100);
    }
    return 0;
}

function applyCoupon(code) {
    const coupon = availableCoupons[code];
    if (coupon) {
        appliedCoupon = code;
        if (code === 'FRETEGRATIS') {
            currentShipping = 0;
            shippingCalculated = true;
            calculatedCep = calculatedCep || '00000000';
        }
        if (typeof updateCheckout === 'function') updateCheckout();
        return true;
    }
    return false;
}

function updateCartSidebar() {
    const container = document.getElementById('cartItemsList');
    const totalSpan = document.getElementById('sidebarTotal');
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-bag" style="font-size: 2rem; opacity: 0.5; margin-bottom: 15px; display: block;"></i>🛍️ SEU CARRINHO ESTÁ VAZIO</div>`;
        if (totalSpan) totalSpan.innerText = "R$ 0,00";
        return;
    }
    let subtotal = 0;
    let html = '';
    cart.forEach(item => {
        const s = item.price * item.quantity;
        subtotal += s;
        html += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-img" style="background-image:url('${item.imageUrl}');"></div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <button class="cart-qty-btn minus" data-id="${item.id}" data-delta="-1"><i class="fas fa-minus"></i></button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="cart-qty-btn plus" data-id="${item.id}" data-delta="1"><i class="fas fa-plus"></i></button>
                        <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
                <div class="cart-item-subtotal">R$ ${s.toFixed(2)}</div>
            </div>
        `;
    });
    container.innerHTML = html;
    if (totalSpan) totalSpan.innerText = `R$ ${subtotal.toFixed(2)}`;
    document.querySelectorAll('.cart-qty-btn.minus, .cart-qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const delta = parseInt(btn.dataset.delta);
            const item = cart.find(i => i.id === id);
            if (item) {
                const newQty = item.quantity + delta;
                if (newQty >= 1) {
                    updateQty(id, newQty);
                } else {
                    removeItem(id);
                }
            }
        });
    });
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeItem(parseInt(btn.dataset.id));
        });
    });
}

function updateCheckout() {
    const subtotal = cart.reduce((a, i) => a + (i.price * i.quantity), 0);
    const shipping = calculateShipping();
    const discount = calculateDiscount(subtotal);
    const total = subtotal + shipping - discount;
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const shippingEl = document.getElementById('checkoutShipping');
    const discountEl = document.getElementById('checkoutDiscount');
    const totalEl = document.getElementById('checkoutTotal');
    if (subtotalEl) subtotalEl.innerText = `R$ ${subtotal.toFixed(2)}`;
    if (shippingEl) {
        if (appliedCoupon === 'FRETEGRATIS') {
            shippingEl.innerHTML = 'FRETE GRÁTIS (CUPOM)';
        } else if (subtotal >= 299) {
            shippingEl.innerHTML = 'FRETE GRÁTIS (COMPRA MÍNIMA)';
        } else if (shippingCalculated && calculatedCep) {
            if (shipping === 0) {
                shippingEl.innerHTML = 'FRETE GRÁTIS';
            } else {
                shippingEl.innerHTML = `R$ ${shipping.toFixed(2)}`;
            }
        } else {
            shippingEl.innerHTML = 'R$ 0,00 (calcular frete)';
        }
    }
    if (discountEl) {
        if (discount > 0) {
            discountEl.innerHTML = `- R$ ${discount.toFixed(2)} (${appliedCoupon})`;
        } else {
            discountEl.innerText = `R$ 0,00`;
        }
    }
    if (totalEl) totalEl.innerText = `R$ ${total.toFixed(2)}`;
    if (total > 0 && (shippingCalculated || appliedCoupon === 'FRETEGRATIS' || subtotal >= 299)) {
        if (typeof window.generatePixQRCode === 'function') {
            window.generatePixQRCode(total);
        }
        if (typeof window.generateBoleto === 'function') {
            window.generateBoleto(total);
        }
    }
    const container = document.getElementById('cartItemsCheckout');
    if (container) {
        if (cart.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:30px;">🛒 Carrinho vazio</div>`;
            return;
        }
        let html = '';
        cart.forEach(item => {
            html += `
                <div class="cart-item-checkout">
                    <div class="cart-item-img" style="background-image:url('${item.imageUrl}');"></div>
                    <div style="flex:1">
                        <div><strong>${item.name}</strong></div>
                        <div>R$ ${item.price.toFixed(2)}</div>
                        <div>Qtd: ${item.quantity}</div>
                    </div>
                    <div>R$ ${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    }
    const installmentsSelect = document.getElementById('installments');
    if (installmentsSelect && total > 0) {
        installmentsSelect.innerHTML = '';
        for (let i = 1; i <= 12; i++) {
            installmentsSelect.innerHTML += `<option value="${i}">${i}x de R$ ${(total / i).toFixed(2)}</option>`;
        }
    }
}

function updateQty(id, newQty) {
    if (newQty <= 0) {
        removeItem(id);
        return;
    }
    const item = cart.find(i => i.id === id);
    if (item) {
        const oldQty = item.quantity;
        item.quantity = newQty;
        saveCart();
        if (oldQty !== newQty && shippingCalculated) {
            resetShipping();
        }
        if (typeof updateAll === 'function') updateAll();
    }
}

function removeItem(id) {
    const item = cart.find(i => i.id === id);
    cart = cart.filter(i => i.id !== id);
    saveCart();
    if (shippingCalculated) {
        resetShipping();
    }
    if (typeof updateAll === 'function') updateAll();
    showToast(`🗑️ ${item?.name || 'Item'} removido do carrinho`);
}

function addToCart(id) {
    if (typeof products === 'undefined') {
        showToast("❌ Erro: Produtos não carregados!", true);
        return;
    }
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    if (prod.stock <= 0) {
        showToast(`❌ ${prod.name} esgotado!`, true);
        return;
    }
    const existing = cart.find(i => i.id === id);
    if (existing) {
        if (existing.quantity >= prod.stock) {
            showToast(`❌ Estoque máximo: ${prod.stock} unidades`, true);
            return;
        }
        existing.quantity++;
    } else {
        cart.push({ 
            id: prod.id,
            name: prod.name,
            price: prod.price,
            imageUrl: prod.imageUrl,
            quantity: 1
        });
    }
    saveCart();
    if (shippingCalculated) {
        resetShipping();
    }
    if (typeof updateAll === 'function') updateAll();
    showToast(`✨ ${prod.name} adicionado ao carrinho! ✨`);
}

function updateAll() {
    updateCartSidebar();
    updateCheckout();
    updateCartCounter();
    window.cart = cart;
    window.appliedCoupon = appliedCoupon;
    window.currentShipping = currentShipping;
    window.calculatedCep = calculatedCep;
    window.shippingCalculated = shippingCalculated;
}

function openCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    const backdrop = document.getElementById('backdrop');
    if (cartSidebar && backdrop) {
        cartSidebar.classList.add('open');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    const backdrop = document.getElementById('backdrop');
    if (cartSidebar && backdrop) {
        cartSidebar.classList.remove('open');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function goToCheckoutFromCart() {
    if (cart.length === 0) {
        showToast("🛒 Seu carrinho está vazio!", true);
        return;
    }
    closeCartSidebar();
    if (typeof navigateTo === 'function') {
        navigateTo('checkout');
    }
}

window.addToCart = addToCart;
window.saveCart = saveCart;
window.loadCart = loadCart;
window.updateAll = updateAll;
window.updateCheckout = updateCheckout;
window.getStockStatus = getStockStatus;
window.showToast = showToast;
window.closeCartSidebar = closeCartSidebar;
window.goToCheckoutFromCart = goToCheckoutFromCart;
window.openCartSidebar = openCartSidebar;
window.calculateAndUpdateShipping = calculateAndUpdateShipping;
window.buscaCepReal = buscaCepReal;
window.resetShipping = resetShipping;
window.applyCoupon = applyCoupon;
window.availableCoupons = availableCoupons;
window.calculateShipping = calculateShipping;
window.calculateDiscount = calculateDiscount;
window.cart = cart;
window.appliedCoupon = appliedCoupon;
window.currentShipping = currentShipping;
window.calculatedCep = calculatedCep;
window.shippingCalculated = shippingCalculated;