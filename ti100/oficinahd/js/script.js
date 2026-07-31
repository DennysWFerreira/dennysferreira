// ── BANNER ──────────────────────────────────────────────────
const banners = document.querySelectorAll('.banner');
let bannerIndex = 0;

function trocarBanner(direcao = 1) {
    banners[bannerIndex].classList.remove('ativo');
    bannerIndex = (bannerIndex + direcao + banners.length) % banners.length;
    banners[bannerIndex].classList.add('ativo');
}

setInterval(() => trocarBanner(1), 4000);
document.querySelector('.seta.esquerda')?.addEventListener('click', () => trocarBanner(-1));
document.querySelector('.seta.direita')?.addEventListener('click',  () => trocarBanner(1));


// ── CARRINHO ─────────────────────────────────────────────────
const CART_KEY = 'oficina_hd_carrinho_v1';

const formatBRL = (v) =>
    Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const loadCart  = () => JSON.parse(localStorage.getItem(CART_KEY)) || [];
const saveCart  = (c) => localStorage.setItem(CART_KEY, JSON.stringify(c));

function renderCart() {
    const cart       = loadCart();
    const itemsWrap  = document.querySelector('[data-cart-items]');
    const subtotalEl = document.querySelector('[data-cart-subtotal]');
    const badges     = document.querySelectorAll('[data-cart-count]');
    const badgeLegacy = document.getElementById('badge-carrinho');

    if (!itemsWrap) return;

    let total = 0, totalQty = 0;

    if (!cart.length) {
        itemsWrap.innerHTML = '<div class="cart-empty">Seu carrinho está vazio</div>';
        subtotalEl && (subtotalEl.textContent = 'R$ 0,00');
        badges.forEach(b => b.textContent = '0');
        if (badgeLegacy) badgeLegacy.textContent = '0';
        return;
    }

    itemsWrap.innerHTML = cart.map(item => {
        total    += item.price * item.qty;
        totalQty += item.qty;
        return `
        <div class="cart-item" data-product-id="${item.id}">
            <img class="cart-item-img" src="${item.image}" alt="${item.name}">
            <div class="cart-item-main">
                <div class="cart-item-top">
                    <div>
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${formatBRL(item.price)}</div>
                    </div>
                    <button class="cart-remove" data-remove>✕</button>
                </div>
                <div class="cart-item-bottom">
                    <div class="cart-qty">
                        <button class="cart-qty-btn" data-qty="dec">−</button>
                        <span>${item.qty}</span>
                        <button class="cart-qty-btn" data-qty="inc">+</button>
                    </div>
                    <strong>${formatBRL(item.price * item.qty)}</strong>
                </div>
            </div>
        </div>`;
    }).join('');

    subtotalEl && (subtotalEl.textContent = formatBRL(total));
    badges.forEach(b => b.textContent = totalQty);
    if (badgeLegacy) badgeLegacy.textContent = String(totalQty);
}

function openCart() {
    document.querySelector('[data-cart-overlay]')?.classList.add('open');
    document.querySelector('[data-cart-panel]')?.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.querySelector('[data-cart-overlay]')?.classList.remove('open');
    document.querySelector('[data-cart-panel]')?.classList.remove('open');
    document.body.style.overflow = '';
}

function addToCart(product) {
    const cart     = loadCart();
    const existing = cart.find(i => i.id === product.id);
    existing ? existing.qty++ : cart.push({ ...product, qty: 1 });
    saveCart(cart);
    renderCart();
    openCart();
}

document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add-to-cart]');
    if (addBtn) {
        addToCart({
            id:    addBtn.dataset.id,
            name:  addBtn.dataset.name,
            price: Number(addBtn.dataset.price),
            image: addBtn.dataset.image
        });
        return;
    }

    const item = e.target.closest('.cart-item');
    if (item) {
        const id   = item.dataset.productId;
        const cart = loadCart();
        const prod = cart.find(i => i.id === id);

        if (e.target.closest('[data-qty="inc"]')) {
            prod.qty++;
            saveCart(cart); renderCart(); return;
        }
        if (e.target.closest('[data-qty="dec"]')) {
            prod.qty--;
            if (prod.qty <= 0) saveCart(cart.filter(i => i.id !== id));
            else saveCart(cart);
            renderCart(); return;
        }
        if (e.target.closest('[data-remove]')) {
            saveCart(cart.filter(i => i.id !== id));
            renderCart(); return;
        }
    }

    if (e.target.closest('[data-cart-toggle]'))  { openCart();  return; }
    if (e.target.closest('[data-cart-close]'))   { closeCart(); return; }
    if (e.target.closest('[data-cart-overlay]')) { closeCart(); return; }

    if (e.target.closest('.cart-checkout')) {
        if (loadCart().length) {
            if (window.__LOGADO__) {
                location.href = './checkout.php';
            } else {
                // Salva destino para redirecionar após login
                location.href = './login.html?next=checkout';
            }
        }
    }
});

renderCart();
