/*
  NOTE:
  - Removido fluxo de boleto.
  - Mantidos fluxos existentes de PIX e Cartão.
*/

const STORAGE_KEY = 'oficina_hd_carrinho_v1';
const STORAGE_KEY_FALLBACK = 'oficina_hd_cart_v1';

function lerCarrinho(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw){
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return data;
      return data || {};
    }

    const rawFallback = localStorage.getItem(STORAGE_KEY_FALLBACK);
    if (rawFallback){
      const data = JSON.parse(rawFallback);
      return data || {};
    }

    return {};
  }catch{
    return {};
  }
}

function formatarMoedaBRL(numero) {
  const n = Number(numero) || 0;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcularSubtotal(carrinho){
  if (Array.isArray(carrinho)) {
    return carrinho.reduce((acc, item) => acc + Number(item.price) * Number(item.qty || 0), 0);
  }
  return Object.values(carrinho).reduce((acc, item) => acc + Number(item.preco) * Number(item.qtd), 0);
}

function renderizarResumo(){
  const itensEl = document.getElementById('checkout-itens');
  const subtotalEl = document.getElementById('checkout-subtotal');
  const freteEl = document.getElementById('checkout-frete');
  const totalEl = document.getElementById('checkout-total');

  const carrinho = lerCarrinho();
  const itens = Array.isArray(carrinho) ? carrinho : Object.values(carrinho);

  const subtotal = calcularSubtotal(carrinho);
  const frete = 0;
  const total = subtotal + frete;

  if (subtotalEl) subtotalEl.textContent = formatarMoedaBRL(subtotal);
  if (freteEl) freteEl.textContent = formatarMoedaBRL(frete);
  if (totalEl) totalEl.textContent = formatarMoedaBRL(total);

  if (!itensEl) return;

  if (!itens.length) {
    itensEl.innerHTML = '<div class="review-card" style="width:100%; text-align:center;">Seu carrinho está vazio.</div>';
    return;
  }

  itensEl.innerHTML = itens.map((item) => {
    const nome = item.nome ?? item.name ?? '';
    const preco = item.preco ?? item.price ?? 0;
    const qtd = item.qtd ?? item.qty ?? 0;
    const imagem = item.image ?? item.img ?? './img/41kYqZoclCL._AC_SX679_.jpg';

    return `
      <div class="co-item">
        <div class="co-thumb">
          <img src="${imagem}" alt="Produto" />
        </div>
        <div class="co-meta">
          <b>${nome}</b>
          <span>Qtd: ${qtd}</span>
          <span>${formatarMoedaBRL(preco)} un.</span>
        </div>
        <div class="co-price">${formatarMoedaBRL(Number(preco) * Number(qtd))}</div>
      </div>
    `;
  }).join('');
}

function atualizarBadgeCarrinho(){
  const badge = document.getElementById('badge-carrinho');
  if(!badge) return;

  const carrinho = lerCarrinho();

  let qtdTotal = 0;
  if (Array.isArray(carrinho)) {
    qtdTotal = carrinho.reduce((acc, item) => acc + Number(item.qty || 0), 0);
  } else {
    qtdTotal = Object.values(carrinho).reduce((acc, item) => acc + Number(item.qtd || 0), 0);
  }

  badge.textContent = String(qtdTotal);
}

function limparCarrinhoCheckout(){
  try{
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_FALLBACK);
  }catch{}
}

document.addEventListener('DOMContentLoaded', () => {
  const msg = document.getElementById('checkout-msg');
  if (msg) msg.textContent = '';

  renderizarResumo();
  atualizarBadgeCarrinho();

  const pmWrap = document.getElementById('payment-methods');
  let metodo = 'pix';

  const cartaoPanel = document.getElementById('cartao-panel');

  const isMetodoPermitido = (m) => m === 'pix' || m === 'cartao';

  function esconderParcelamento(){
    const parcelamentoSection = document.getElementById('parcelamento-section');
    const parcelResumoLinha = document.getElementById('parcelamento-resumo-linha');
    if(parcelamentoSection) parcelamentoSection.style.display = 'none';
    if(parcelResumoLinha) parcelResumoLinha.style.display = 'none';
  }

  // Parcelamento (Cartão)
  const parcelamentoSection = document.getElementById('parcelamento-section');
  const parcelSelect = document.getElementById('parcelamento-select');
  const parcelSummary = document.getElementById('parcelamento-summary');
  const parcelCountInput = document.getElementById('parcelamento-count');
  const parcelValueInput = document.getElementById('parcelamento-value');
  const parcelResumoLinha = document.getElementById('parcelamento-resumo-linha');
  const parcelResumoValor = document.getElementById('parcelamento-resumo-valor');

  const modalParcelamentoSelect = document.getElementById('modal-parcelamento-select');
  const modalParcelamentoSummary = document.getElementById('modal-parcelamento-summary');
  const modalParcelamentoCountInput = document.getElementById('parcelamento-count');
  const modalParcelamentoValueInput = document.getElementById('parcelamento-value');

  const confirmOverlay = document.getElementById('confirm-overlay');
  const confirmModal = document.getElementById('confirm-modal');

  const btnModalFechar = document.getElementById('btn-modal-fechar');
  const btnModalNao = document.getElementById('btn-modal-nao');
  const btnModalConfirmar = document.getElementById('btn-modal-confirmar');

  const processOverlay = document.getElementById('process-overlay');
  const processModal = document.getElementById('process-modal');
  const processText = document.getElementById('process-text');

  const STORAGE_KEY_SELECTED_PARCELAMENTO = 'oficina_hd_checkout_selected_parcelamento_v1';
  let estadoParcelamentoAtual = null;

  function parseMoedaBRL(text){
    const m = String(text || '').match(/([0-9.,]+)/);
    if(!m) return 0;
    return Number(m[1].replace('.', '').replace(',', '.'));
  }

  function mostrarParcelamento(){
    if(!parcelamentoSection) return;
    parcelamentoSection.style.display = '';
    parcelamentoSection.classList.remove('fade-slide');
    void parcelamentoSection.offsetHeight;
    parcelamentoSection.classList.add('fade-slide');
  }

  function calcularOpcoesParcelamento(total){
    const opcoes = [];
    const max = 12;
    const totalNum = Number(total) || 0;

    for(let n = 1; n <= max; n++){
      const valorParcela = totalNum / n;
      if(valorParcela < 20) continue;
      opcoes.push({ n, valorParcela });
    }

    return opcoes;
  }

  function obterTotalPedido(){
    const totalEl = document.getElementById('checkout-total');
    return parseMoedaBRL(totalEl?.textContent || '0');
  }

  function obterTextoParcelamento({n, valorParcela}){
    return `Pagamento em ${n}x de ${formatarMoedaBRL(valorParcela)} sem juros`;
  }

  function salvarEscolhaParcelamento({n, valorParcela}){
    try{
      const payload = { n: Number(n), valorParcela: Number(valorParcela) };
      localStorage.setItem(STORAGE_KEY_SELECTED_PARCELAMENTO, JSON.stringify(payload));
      estadoParcelamentoAtual = payload;
    }catch{}
  }

  function carregarEscolhaParcelamento(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY_SELECTED_PARCELAMENTO);
      if(!raw) return null;
      const parsed = JSON.parse(raw);
      if(!parsed || !parsed.n || !parsed.valorParcela) return null;
      return { n: Number(parsed.n), valorParcela: Number(parsed.valorParcela) };
    }catch{ return null; }
  }

  function aplicarParcelamentoNoForm({n, valorParcela}){
    if(!parcelSelect) return;
    parcelSelect.value = String(n);
    if(parcelCountInput) parcelCountInput.value = String(n);
    if(parcelValueInput) parcelValueInput.value = String(valorParcela);

    if(parcelSummary) parcelSummary.textContent = obterTextoParcelamento({n, valorParcela});
    if(parcelResumoLinha && parcelResumoValor){
      parcelResumoLinha.style.display = '';
      parcelResumoValor.textContent = `${n}x de ${formatarMoedaBRL(valorParcela)}`;
    }
  }

  function aplicarParcelamentoNoModal({n, valorParcela}){
    if(modalParcelamentoSelect) modalParcelamentoSelect.value = String(n);
    if(modalParcelamentoCountInput) modalParcelamentoCountInput.value = String(n);
    if(modalParcelamentoValueInput) modalParcelamentoValueInput.value = String(valorParcela);
    if(modalParcelamentoSummary) modalParcelamentoSummary.textContent = obterTextoParcelamento({n, valorParcela});
  }

  function aplicarParcelamento({n, valorParcela}){
    if(!n || !valorParcela) return;
    salvarEscolhaParcelamento({n, valorParcela});
    aplicarParcelamentoNoForm({n, valorParcela});
    aplicarParcelamentoNoModal({n, valorParcela});
  }

  function renderizarOpcoesParcelamento(){
    if(!parcelSelect) return;
    const totalNum = parseMoedaBRL(document.getElementById('checkout-total')?.textContent || '0');
    const opcoes = calcularOpcoesParcelamento(totalNum);
    const atual = carregarEscolhaParcelamento();

    parcelSelect.innerHTML = '';
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = 'Selecione';
    parcelSelect.appendChild(defaultOpt);

    opcoes.forEach(({n, valorParcela}) => {
      const opt = document.createElement('option');
      opt.value = String(n);
      opt.textContent = `${n}x de ${formatarMoedaBRL(valorParcela)} sem juros`;
      parcelSelect.appendChild(opt);
    });

    if(atual && opcoes.some(o => String(o.n) === String(atual.n))){
      const match = opcoes.find(o => String(o.n) === String(atual.n));
      if(match) {
        if(parcelResumoLinha && parcelResumoValor){
          parcelResumoLinha.style.display = '';
          parcelResumoValor.textContent = `${match.n}x de ${formatarMoedaBRL(match.valorParcela)}`;
        }
      }
    } else {
      if(parcelSummary) parcelSummary.textContent = 'Selecione uma parcela para ver o valor.';
      if(parcelCountInput) parcelCountInput.value = '';
      if(parcelValueInput) parcelValueInput.value = '';
      if(parcelResumoLinha) parcelResumoLinha.style.display = 'none';
    }
  }

  function renderizarOpcoesParcelamentoModal(){
    if(!modalParcelamentoSelect) return;

    const totalNum = parseMoedaBRL(document.getElementById('checkout-total')?.textContent || '0');
    const opcoes = calcularOpcoesParcelamento(totalNum);

    modalParcelamentoSelect.innerHTML = '';
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = 'Selecione';
    modalParcelamentoSelect.appendChild(defaultOpt);

    opcoes.forEach(({n, valorParcela}) => {
      const opt = document.createElement('option');
      opt.value = String(n);
      opt.textContent = `${n}x de ${formatarMoedaBRL(valorParcela)} sem juros`;
      modalParcelamentoSelect.appendChild(opt);
    });

    if(opcoes.length === 0){
      if(modalParcelamentoSummary) modalParcelamentoSummary.textContent = 'Parcelamento indisponível (mínimo R$20 por parcela).';
      if(modalParcelamentoCountInput) modalParcelamentoCountInput.value = '';
      if(modalParcelamentoValueInput) modalParcelamentoValueInput.value = '';
      return;
    }

    if(modalParcelamentoSummary) modalParcelamentoSummary.textContent = 'Selecione uma parcela para ver o valor.';
    if(modalParcelamentoCountInput) modalParcelamentoCountInput.value = '';
    if(modalParcelamentoValueInput) modalParcelamentoValueInput.value = '';
  }

  function atualizarPainelPagamento(){
    if (!cartaoPanel) return;
    cartaoPanel.style.display = (metodo === 'cartao') ? '' : 'none';

    if(metodo === 'cartao'){
      mostrarParcelamento();
      renderizarOpcoesParcelamento();
    } else {
      esconderParcelamento();
    }
  }

  atualizarPainelPagamento();

  pmWrap?.addEventListener('click', (e) => {
    const btn = e.target.closest('.pm-btn');
    if (!btn) return;

    pmWrap.querySelectorAll('.pm-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    metodo = btn.dataset.method || 'pix';
    if (!isMetodoPermitido(metodo)) metodo = 'pix';

    atualizarPainelPagamento();
  });

  parcelSelect?.addEventListener('change', () => {
    const n = Number(parcelSelect.value);
    const totalNum = parseMoedaBRL(document.getElementById('checkout-total')?.textContent || '0');
    if(!n || !totalNum){
      if(parcelSummary) parcelSummary.textContent = 'Selecione uma parcela para ver o valor.';
      if(parcelCountInput) parcelCountInput.value = '';
      if(parcelValueInput) parcelValueInput.value = '';
      if(parcelResumoLinha) parcelResumoLinha.style.display = 'none';
      return;
    }

    const valorParcela = totalNum / n;
    if(valorParcela < 20){
      if(parcelSelect) parcelSelect.value = '';
      if(parcelSummary) parcelSummary.textContent = 'Selecione uma parcela válida.';
      if(parcelCountInput) parcelCountInput.value = '';
      if(parcelValueInput) parcelValueInput.value = '';
      if(parcelResumoLinha) parcelResumoLinha.style.display = 'none';
      return;
    }

    salvarEscolhaParcelamento({n, valorParcela});
    if(parcelSummary) parcelSummary.textContent = obterTextoParcelamento({n, valorParcela});
    if(parcelResumoLinha && parcelResumoValor){
      parcelResumoLinha.style.display = '';
      parcelResumoValor.textContent = `${n}x de ${formatarMoedaBRL(valorParcela)}`;
    }
  });

  // Modal
  function setAriaHidden(el, hidden){
    if(!el) return;
    el.setAttribute('aria-hidden', hidden ? 'true' : 'false');
  }

  function abrirConfirmacaoModal(){
    if(!confirmOverlay || !confirmModal) return;

    if (confirmOverlay) confirmOverlay.style.display = 'block';
    if (confirmModal) confirmModal.style.display = 'block';

    setAriaHidden(confirmOverlay, false);
    setAriaHidden(confirmModal, false);

    document.body.style.overflow = 'hidden';

    renderizarOpcoesParcelamentoModal();

    setTimeout(() => {
      const focusTarget = btnModalConfirmar || confirmModal;
      try { focusTarget?.focus?.(); } catch {}
    }, 0);
  }

  function fecharConfirmacaoModal(){
    if(!confirmOverlay || !confirmModal) return;
    confirmOverlay.style.display = 'none';
    confirmModal.style.display = 'none';
    setAriaHidden(confirmOverlay, true);
    setAriaHidden(confirmModal, true);
    document.body.style.overflow = '';
  }

  btnModalFechar?.addEventListener('click', () => fecharConfirmacaoModal());
  btnModalNao?.addEventListener('click', () => fecharConfirmacaoModal());

  modalParcelamentoSelect?.addEventListener('change', () => {
    const n = Number(modalParcelamentoSelect.value);
    const totalNum = parseMoedaBRL(document.getElementById('checkout-total')?.textContent || '0');

    if(!n || !totalNum){
      if(modalParcelamentoSummary) modalParcelamentoSummary.textContent = 'Selecione uma parcela para ver o valor.';
      if(modalParcelamentoCountInput) modalParcelamentoCountInput.value = '';
      if(modalParcelamentoValueInput) modalParcelamentoValueInput.value = '';
      return;
    }

    const valorParcela = totalNum / n;
    if(valorParcela < 20){
      if(modalParcelamentoSummary) modalParcelamentoSummary.textContent = 'Selecione uma parcela válida.';
      if(modalParcelamentoCountInput) modalParcelamentoCountInput.value = '';
      if(modalParcelamentoValueInput) modalParcelamentoValueInput.value = '';
      modalParcelamentoSelect.value = '';
      return;
    }

    if(modalParcelamentoCountInput) modalParcelamentoCountInput.value = String(n);
    if(modalParcelamentoValueInput) modalParcelamentoValueInput.value = String(valorParcela);

    if(modalParcelamentoSummary) modalParcelamentoSummary.textContent = obterTextoParcelamento({n, valorParcela});
  });

  const btnUsarEsteCartao = document.getElementById('btn-usar-este-cartao');
  btnUsarEsteCartao?.addEventListener('click', (e) => {
    e.preventDefault();
    abrirConfirmacaoModal();
  });

  function iniciarProcessamentoPagamento(){
    if(!processOverlay || !processModal) return;

    processOverlay.style.display = 'block';
    processModal.style.display = 'flex';

    setAriaHidden(processOverlay, false);
    setAriaHidden(processModal, false);

    const msgs = [
      'Processando pagamento...',
      'Validando cartão...',
      'Autorizando compra...',
      'Confirmando pedido...'
    ];

    if(processText) processText.textContent = msgs[0];

    if(confirmOverlay) confirmOverlay.style.display = 'none';
    if(confirmModal) confirmModal.style.display = 'none';
    document.body.style.overflow = '';

    const totalMs = 5000;
    const stepMs = totalMs / msgs.length;
    let i = 0;

    const interval = setInterval(() => {
      i++;
      if(i >= msgs.length){
        clearInterval(interval);
      } else {
        if(processText) processText.textContent = msgs[i];
      }
    }, stepMs);

    setTimeout(async () => {
      clearInterval(interval);

      const carrinho = lerCarrinho();
      const itensSnapshot = Array.isArray(carrinho) ? carrinho : Object.values(carrinho);

      const totalText = document.getElementById('checkout-total')?.textContent || '';
      const totalNum  = (totalText.match(/([0-9.,]+)/)?.[1] || '0').replace('.', '').replace(',', '.');

      const n           = Number(modalParcelamentoCountInput?.value || '');
      const valorParcela = Number(modalParcelamentoValueInput?.value || '');

      let cartaoAtivo = null;
      try {
        const rawActive = localStorage.getItem('oficina_hd_cart_active_v1');
        if (rawActive) cartaoAtivo = JSON.parse(rawActive);
      } catch {}

      // Monta payload com campos do banco real
      const payload = {
        forma_pagamento: 'cartao',
        valor_total:     Number(totalNum) || 0,
        status:          'Processando',
        items: itensSnapshot.map(i => ({
          id:          i.id       || i.produto_id || '',
          nome:        i.name     || i.nome       || '',
          preco:       i.price    || i.preco      || 0,
          qtd:         i.qty      || i.qtd        || 1,
        }))
      };

      let pedidoId = null;
      try {
        const resp = await fetch('./php/criar_pedido.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await resp.json();
        if (data.success) pedidoId = data.pedido_id;
      } catch (err) {
        console.error('Erro ao salvar pedido no banco:', err);
      }

      // Salva também no localStorage para a tela meus-pedidos funcionar offline
      const STORAGE_PEDIDOS_KEY = 'oficina_hd_pedidos_v1';
      const pedidos = (() => {
        try { const p = JSON.parse(localStorage.getItem(STORAGE_PEDIDOS_KEY) || '[]'); return Array.isArray(p) ? p : []; } catch { return []; }
      })();
      const pedidoLocal = {
        id:             pedidoId || Math.random().toString(36).slice(2,10).toUpperCase(),
        created_at:     new Date().toISOString(),
        status:         'Processando',
        payment_method: 'cartao',
        total:          Number(totalNum) || 0,
        items:          itensSnapshot,
        installments:   (n && valorParcela >= 20) ? { count: n, value: valorParcela, text: `${n}x de ${formatarMoedaBRL(valorParcela)}` } : null,
        card_used:      cartaoAtivo ? { brand: cartaoAtivo.brand || 'Cartão', last4: cartaoAtivo.last4 || '', display: `${cartaoAtivo.brand || 'Cartão'} •••• ${cartaoAtivo.last4 || ''}` } : null,
      };
      pedidos.push(pedidoLocal);
      localStorage.setItem(STORAGE_PEDIDOS_KEY, JSON.stringify(pedidos));
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY_FALLBACK);

      location.href = `./pedido-aprovado.html?pedido=${encodeURIComponent(pedidoLocal.id)}&payment=Cartão&amount=${encodeURIComponent(String(pedidoLocal.total))}`;
    }, totalMs);
  }

  btnModalConfirmar?.addEventListener('click', () => {
    const carrinho = lerCarrinho();
    const vazio = Array.isArray(carrinho) ? carrinho.length === 0 : Object.values(carrinho).length === 0;
    if(vazio){
      fecharConfirmacaoModal();
      const msg = document.getElementById('checkout-msg');
      if(msg) msg.textContent = 'Seu carrinho está vazio.';
      return;
    }

    // valida cartão
    const panel = document.getElementById('cartao-panel');
    if(panel){
      const requiredIds = ['card-number','card-exp','card-cvv','card-name'];
      for (const id of requiredIds) {
        const el = document.getElementById(id);
        if (el && !String(el.value || '').trim()) {
          fecharConfirmacaoModal();
          const msg = document.getElementById('checkout-msg');
          if(msg) msg.textContent = 'Preencha os dados do cartão para confirmar.';
          return;
        }
      }
    }

    iniciarProcessamentoPagamento();
  });

  // Botão principal
  document.getElementById('btn-confirmar')?.addEventListener('click', (e) => {
    if (metodo === 'cartao') {
      e.preventDefault();
      abrirConfirmacaoModal();
      return;
    }

    const form = document.getElementById('checkout-form');
    if (form && !form.checkValidity()) {
      form.reportValidity();
      e.preventDefault();
      return;
    }

    const carrinho = lerCarrinho();
    const vazio = Array.isArray(carrinho) ? carrinho.length === 0 : Object.values(carrinho).length === 0;
    if (vazio) {
      const msg = document.getElementById('checkout-msg');
      if(msg) msg.textContent = 'Seu carrinho está vazio.';
      return;
    }

    if (metodo === 'pix') {
      const total = document.getElementById('checkout-total')?.textContent || '';
      const amountNum = (total.match(/([0-9.,]+)/)?.[1] || '0').replace('.', '').replace(',', '.');
      const placeholderCode = 'PIX-OFICINA-' + Math.random().toString(36).slice(2, 10).toUpperCase();

      const itensSnapshot = (() => {
        const data = lerCarrinho();
        return Array.isArray(data) ? data : Object.values(data);
      })();

      location.href = `./pix.html?amount=${encodeURIComponent(amountNum)}&pixCode=${encodeURIComponent(placeholderCode)}&items=${encodeURIComponent(JSON.stringify(itensSnapshot))}`;
    }
  });

  document.getElementById('btn-cancelar-compra')?.addEventListener('click', () => {
    const msg = document.getElementById('checkout-msg');
    if (msg) msg.textContent = '';
    location.href = './index.php';
  });

  document.getElementById('btn-limpar-produtos')?.addEventListener('click', () => {
    limparCarrinhoCheckout();

    const msg = document.getElementById('checkout-msg');
    if (msg) msg.textContent = 'Produtos do checkout limpos.';

    renderizarResumo();
    atualizarBadgeCarrinho();

    if(metodo === 'cartao'){
      renderizarOpcoesParcelamento();
    }
  });

});

