const STORAGE_KEY = 'oficina_hd_carrinho_v1';
const STORAGE_KEY_FALLBACK = 'oficina_hd_cart_v1';

function formatBRL(value){
  return Number(value).toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
}

function loadCart(){
  try{
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (raw) {
      // se for formato legado objeto, converte para array
      if (!Array.isArray(raw)) {
        return Object.entries(raw).map(([id, v]) => ({ id, ...v }));
      }
      return raw;
    }

    // fallback: carrinho salvo com chave antiga
    const rawFallback = JSON.parse(localStorage.getItem(STORAGE_KEY_FALLBACK));
    if (rawFallback) {
      if (!Array.isArray(rawFallback)) {
        return Object.entries(rawFallback).map(([id, v]) => ({ id, ...v }));
      }
      return rawFallback;
    }

    return [];
  }catch{
    return [];
  }
}


function saveCart(cart){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function calcSubtotal(cart){
  return cart.reduce((acc, item) => {
    const price = item.price ?? item.preco ?? 0;
    const qty = Number(item.qty ?? item.qtd ?? 0);
    return acc + Number(price) * qty;
  }, 0);
}

function countQty(cart){
  return cart.reduce((acc, item) => acc + Number(item.qty ?? item.qtd ?? 0), 0);
}


function render(){
  const items = loadCart();

  const itemsWrap = document.getElementById('cart-items-page');
  const subtotalEl = document.getElementById('cart-subtotal-page');
  const freteEl = document.getElementById('cart-frete-page');
  const totalEl = document.getElementById('cart-total-page');

  const badge = document.getElementById('badge-carrinho-page');
  const btnCheckout = document.getElementById('btn-checkout');
  const note = document.getElementById('cart-note-page');

  if(!itemsWrap || !subtotalEl || !freteEl || !totalEl) return;

  if(badge) badge.textContent = String(countQty(items));

  const subtotal = calcSubtotal(items);
  const frete = 0;
  const total = subtotal + frete;

  subtotalEl.textContent = formatBRL(subtotal);
  freteEl.textContent = formatBRL(frete);
  totalEl.textContent = formatBRL(total);

  if(items.length === 0){
    itemsWrap.innerHTML = `
      <div class="cart-empty-page">
        Seu carrinho está vazio.
      </div>
    `;
    if(btnCheckout){
      btnCheckout.classList.add('disabled');
      btnCheckout.setAttribute('aria-disabled','true');
      btnCheckout.style.pointerEvents = 'none';
      btnCheckout.style.opacity = '0.6';
    }
    if(note) note.textContent = '* Frete e impostos serão calculados no checkout.';
    return;
  }

  if(btnCheckout){
    btnCheckout.style.pointerEvents = '';
    btnCheckout.style.opacity = '';
    btnCheckout.removeAttribute('aria-disabled');
  }

  itemsWrap.innerHTML = items.map((item) => {
    // suporta tanto array do site ({name, price, image, qty}) quanto formato legado (se existir)
    const id = item.id;
    const name = item.name ?? item.nome ?? '';
    const price = item.price ?? item.preco ?? 0;
    const image = item.image ?? item.img ?? '';
    const qty = Number(item.qty ?? item.qtd ?? 0);
    const subtotalItem = Number(price) * qty;

    return `
      <div class="cart-item-page" data-product-id="${id}">
        <img src="${image}" alt="${name}" />

        <div class="cart-item-main-page">
          <div class="cart-item-name-page">${name}</div>
          <div class="cart-item-price-page">${formatBRL(price)} cada</div>
        </div>

        <div class="cart-item-controls-page">
          <div class="cart-qty-page">
            <button class="cart-qty-btn-page" type="button" data-qty="dec" aria-label="Diminuir quantidade">−</button>
            <div class="cart-qty-value-page">${qty}</div>
            <button class="cart-qty-btn-page" type="button" data-qty="inc" aria-label="Aumentar quantidade">+</button>
          </div>

          <div class="cart-item-subtotal-page">${formatBRL(subtotalItem)}</div>

          <button class="cart-remove-page" type="button" data-remove aria-label="Remover item">✕</button>
        </div>
      </div>
    `;
  }).join('');
}

function updateQty(productId, delta){
  let cart = loadCart();
  const idx = cart.findIndex(i => i.id === productId);
  if(idx < 0) return;

  const current = Number(cart[idx].qty || 0);
  const next = current + delta;

  if(next <= 0){
    cart = cart.filter(i => i.id !== productId);
  } else {
    cart[idx].qty = next;
  }

  saveCart(cart);
  render();
}

function removeItem(productId){
  const cart = loadCart().filter(i => i.id !== productId);
  saveCart(cart);
  render();
}

document.addEventListener('click', (e) => {
  const itemEl = e.target.closest('[data-product-id]');
  if(!itemEl) return;

  const productId = itemEl.dataset.productId;

  const incBtn = e.target.closest('[data-qty="inc"]');
  if(incBtn){
    updateQty(productId, +1);
    return;
  }

  const decBtn = e.target.closest('[data-qty="dec"]');
  if(decBtn){
    updateQty(productId, -1);
    return;
  }

  const rmBtn = e.target.closest('[data-remove]');
  if(rmBtn){
    removeItem(productId);
    return;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const btnLimpar = document.getElementById('btn-limpar');
  if(btnLimpar){
    btnLimpar.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY_FALLBACK);
      render();
    });
  }

  render();
});

