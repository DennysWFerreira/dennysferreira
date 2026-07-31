const STORAGE_KEY_SAVED_CARDS = 'oficina_hd_cart_saved_cards_v1';
const STORAGE_KEY_ACTIVE_CARD = 'oficina_hd_cart_active_v1';

function lerSavedCards(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_CARDS);
    if(!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  }catch{
    return [];
  }
}

function salvarSavedCards(cards){
  localStorage.setItem(STORAGE_KEY_SAVED_CARDS, JSON.stringify(cards));
}

function lerCartaoAtivo(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_CARD);
    if(!raw) return null;
    return JSON.parse(raw);
  }catch{
    return null;
  }
}

function salvarCartaoAtivo(card){
  localStorage.setItem(STORAGE_KEY_ACTIVE_CARD, JSON.stringify(card));
}

function limparCartao(){
  // Mantém compat: limpa “estado ativo” e remove a lista inteira.
  try{
    localStorage.removeItem(STORAGE_KEY_ACTIVE_CARD);
    localStorage.removeItem(STORAGE_KEY_SAVED_CARDS);
  }catch{}
}


function setMsg(id, text){
  const el = document.getElementById(id);
  if(el) el.textContent = text;
}

function preencherForm(dados){
  if(!dados) return;
  const map = {
    'card-number': 'card-number',
    'card-exp': 'card-exp',
    'card-cvv': 'card-cvv',
    'card-name': 'card-name',
    'card-holder-cpf': 'card-holder-cpf',
    'card-holder-phone': 'card-holder-phone',
    'billing-address': 'billing-address',
    'billing-neighborhood': 'billing-neighborhood',
    'billing-number-extra': 'billing-number-extra',
  };

  for(const [inputId, key] of Object.entries(map)){
    const input = document.getElementById(inputId);
    if(input && dados[key] != null) input.value = dados[key];
  }
}

function apenasDigitos(str){
  return String(str || '').replace(/\D/g, '');
}

function cryptoRandomId(){
  try{
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
  }catch{}
  return 'id_' + Math.random().toString(36).slice(2) + '_' + Date.now();
}


function mascaraCartao(value){
  const d = apenasDigitos(value).slice(0, 16);
  const p1 = d.slice(0,4);
  const p2 = d.slice(4,8);
  const p3 = d.slice(8,12);
  const p4 = d.slice(12,16);
  const partes = [p1,p2,p3,p4].filter(Boolean);
  return partes.join(' ');
}

function mascaraMesAno(value){
  const d = apenasDigitos(value).slice(0, 4);
  const mm = d.slice(0,2);
  const aa = d.slice(2,4);
  if (aa.length === 0) return mm;
  return `${mm}/${aa}`;
}

function mascaraCPF(value){
  const d = apenasDigitos(value).slice(0, 11);
  const p1 = d.slice(0,3);
  const p2 = d.slice(3,6);
  const p3 = d.slice(6,9);
  const p4 = d.slice(9,11);
  let out = '';
  if(p1) out += p1;
  if(p2) out += '.' + p2;
  if(p3) out += '.' + p3;
  if(p4) out += '-' + p4;
  return out;
}

function mascaraTelefone(value){
  const d = apenasDigitos(value).slice(0, 11);
  const ddd = d.slice(0,2);
  const p1 = d.slice(2,7);
  const p2 = d.slice(7,11);
  if(d.length <= 2) return d;
  if(d.length <= 7) return `(${ddd}) ${p1}`;
  return `(${ddd}) ${p1}-${p2}`;
}

function bindMask(inputId, maskFn, applyMaxLen){
  const input = document.getElementById(inputId);
  if(!input) return;

  const onInput = () => {
    const before = input.value;
    let after = maskFn(before);
    if (typeof applyMaxLen === 'number') after = after.slice(0, applyMaxLen);
    input.value = after;
  };

  input.addEventListener('input', onInput);
  input.addEventListener('blur', onInput);

  // garante formato se houver valor pré-carregado
  onInput();
}

function obterIconeBandeira(brand){
  const map = {
    'Visa': 'fa-cc-visa',
    'Mastercard': 'fa-cc-mastercard',
    'Elo': 'fa-credit-card',
    'Hipercard': 'fa-credit-card',
    'Amex': 'fa-cc-amex'
  };
  return map[brand] || 'fa-credit-card';
}

function formatarUltimos4(last4){
  return `•••• ${last4}`;
}

function mascaraParaBusca(n){
  return String(n || '').replace(/\D/g,'');
}

function renderSavedCards(){
  const listEl = document.getElementById('saved-cards-list');
  const emptyEl = document.getElementById('saved-cards-empty');
  if(!listEl) return;

  const cards = lerSavedCards();
  listEl.innerHTML = '';

  if(!cards.length){
    if(emptyEl) emptyEl.style.display = '';
    return;
  }
  if(emptyEl) emptyEl.style.display = 'none';

  const html = cards.map((card) => {
    const brand = card.brand || 'Cartão';
    const last4 = card.last4 || '';
    const holderName = card.holderName || card.holder_name || '';
    const iconClass = obterIconeBandeira(brand);

    const isActive = (() => {
      try{
        const active = lerCartaoAtivo();
        return active && active.id === card.id;
      }catch{ return false; }
    })();

    return `
      <div class="saved-card" data-card-id="${escapeHtml(card.id)}" data-active="${isActive ? '1' : '0'}">
        <div class="saved-card-bg" aria-hidden="true"></div>

        <div class="saved-card-left">
          <div class="saved-card-brand">
            <i class="fa-brands ${iconClass}"></i>
            <span>${escapeHtml(brand)}</span>
          </div>
          <div class="saved-card-number">${escapeHtml(brand)} •••• ${escapeHtml(last4)}</div>
          <div class="saved-card-holder">Titular: <b>${escapeHtml(holderName)}</b></div>
        </div>

        <div class="saved-card-actions">
          <button class="btn-use-card" type="button" data-action="use">Usar este cartão</button>
          <button class="btn-delete-card" type="button" data-action="delete">Excluir</button>
        </div>
      </div>
    `;
  }).join('');

  listEl.innerHTML = html;

  listEl.querySelectorAll('.saved-card').forEach((cardEl) => {
    const id = cardEl.getAttribute('data-card-id');
    const useBtn = cardEl.querySelector('[data-action="use"]');
    const delBtn = cardEl.querySelector('[data-action="delete"]');

    useBtn?.addEventListener('click', () => {
      const active = lerSavedCards().find(c => c.id === id);
      if(!active) return;

      // BLOQUEIA clique múltiplo no fluxo de confirmação/processamento
      if (window.__oficina_processing_lock) return;

      // Modal premium (centro da tela)
      const modalId = 'oficina-confirm-use-card-modal';
      const overlayId = 'oficina-confirm-use-card-overlay';

      if (document.getElementById(modalId)) {
        // já existe (evita duplicar)
        return;
      }

      const overlay = document.createElement('div');
      overlay.id = overlayId;
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.background = 'rgba(15,23,42,.55)';
      overlay.style.backdropFilter = 'blur(6px)';
      overlay.style.zIndex = '10001';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.padding = '18px';

      const modal = document.createElement('div');
      modal.id = modalId;
      modal.style.width = '100%';
      modal.style.maxWidth = '560px';
      modal.style.background = 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)';
      modal.style.borderRadius = '18px';
      modal.style.boxShadow = '0 30px 80px rgba(0,0,0,.25)';
      modal.style.border = '1px solid rgba(0,76,130,.18)';
      modal.style.padding = '18px';
      modal.style.transform = 'translateY(6px) scale(.99)';
      modal.style.opacity = '0';
      modal.style.transition = 'opacity .18s ease, transform .18s ease';

      modal.innerHTML = `
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <div style="width:42px;height:42px;border-radius:14px;background:rgba(0,76,130,.10);display:flex;align-items:center;justify-content:center;border:1px solid rgba(0,76,130,.18);color:#004c82;flex:0 0 auto;">
            <i class="fa-solid fa-circle-question" style="font-size:18px;"></i>
          </div>
          <div style="flex:1;">
            <div style="font-weight:900;letter-spacing:-.2px;color:#0f172a;font-size:16px;margin-top:2px;">
              Confirmação de pagamento
            </div>
            <div style="margin-top:10px;color:#0f172a;font-weight:800;font-size:14px;line-height:1.45;">
              Tem certeza que deseja usar este cartão para concluir a compra?
            </div>
          </div>
        </div>

        <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:16px;">
          <button id="${modalId}-no" type="button" style="height:46px;padding:0 18px;border-radius:14px;border:1px solid rgba(0,76,130,.22);background:rgba(0,76,130,.06);color:#004c82;font-weight:900;cursor:pointer;transition:.2s;">
            Não
          </button>
          <button id="${modalId}-yes" type="button" style="height:46px;padding:0 18px;border-radius:14px;border:none;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;font-weight:900;cursor:pointer;transition:.2s;box-shadow:0 14px 28px rgba(34,197,94,.25);">
            Sim
          </button>
        </div>
      `;

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      requestAnimationFrame(()=>{
        modal.style.opacity = '1';
        modal.style.transform = 'translateY(0) scale(1)';
      });

      const cleanupModal = () => {
        try{ overlay.remove(); }catch{}
      };

      const btnNo = document.getElementById(`${modalId}-no`);
      const btnYes = document.getElementById(`${modalId}-yes`);

      btnNo?.addEventListener('click', () => {
        cleanupModal();
      });

      btnYes?.addEventListener('click', () => {
        // fecha modal
        cleanupModal();

        // bloqueia clique múltiplo
        window.__oficina_processing_lock = true;

        // Preenche formulário com dados permitidos (sem número completo)
        salvarCartaoAtivo(active);
        preencherForm({
          'card-number': '',
          'card-exp': active.exp || '',
          'card-name': active.holderName || '',
          'card-holder-cpf': active.cardHolderCpf || '',
          'card-holder-phone': active.cardHolderPhone || '',
          'billing-address': active.billingAddress || '',
          'billing-neighborhood': active.billingNeighborhood || '',
          'billing-number-extra': active.billingNumberExtra || '',
        });

        renderSavedCards();

        // overlay de processamento premium
        const processingOverlay = document.createElement('div');
        processingOverlay.id = 'oficina-processing-overlay';
        processingOverlay.style.position = 'fixed';
        processingOverlay.style.inset = '0';
        processingOverlay.style.background = 'rgba(15,23,42,.65)';
        processingOverlay.style.backdropFilter = 'blur(8px)';
        processingOverlay.style.zIndex = '10002';
        processingOverlay.style.display = 'flex';
        processingOverlay.style.alignItems = 'center';
        processingOverlay.style.justifyContent = 'center';
        processingOverlay.style.padding = '18px';
        processingOverlay.style.opacity = '0';
        processingOverlay.style.transition = 'opacity .25s ease';

        processingOverlay.innerHTML = `
          <div style="width:100%;max-width:520px; background:rgba(255,255,255,.10); border:1px solid rgba(255,255,255,.18); border-radius:20px; padding:20px 18px; box-shadow:0 40px 120px rgba(0,0,0,.35);">
            <div style="display:flex;align-items:flex-start;gap:14px;">
              <div style="width:56px;height:56px;border-radius:18px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.20);display:flex;align-items:center;justify-content:center;">
                <div class="oficina-spinner" aria-hidden="true" style="width:28px;height:28px;border-radius:999px;border:3px solid rgba(255,255,255,.35);border-top-color:#22c55e;animation:oficinaSpin 1s linear infinite;"></div>
              </div>
              <div style="flex:1;">
                <div id="oficina-processing-title" style="color:#fff;font-weight:900;letter-spacing:-.2px;font-size:16px;">
                  Processando pagamento...
                </div>
                <div style="margin-top:10px;color:rgba(255,255,255,.85);font-weight:700;font-size:13px;line-height:1.35;">
                  Aguarde um instante.
                </div>
                <div style="margin-top:12px;height:10px;border-radius:999px;background:rgba(255,255,255,.12);overflow:hidden;">
                  <div style="height:100%;width:40%;border-radius:999px;background:linear-gradient(90deg, rgba(34,197,94,.2), rgba(34,197,94,.9));animation:oficinaBar 1.2s ease-in-out infinite;"></div>
                </div>
              </div>
            </div>
          </div>
        `;

        // adiciona keyframes inline (sem mexer em css global)
        const styleEl = document.createElement('style');
        styleEl.textContent = `
          @keyframes oficinaSpin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
          @keyframes oficinaBar { 0%{width:18%;} 50%{width:78%;} 100%{width:18%;} }
        `;
        processingOverlay.appendChild(styleEl);

        document.body.appendChild(processingOverlay);
        requestAnimationFrame(()=>{ processingOverlay.style.opacity = '1'; });

        const steps = [
          'Processando pagamento...',
          'Validando cartão...',
          'Autorizando compra...',
          'Confirmando pedido...'
        ];

        const stepTimers = [
          [0, steps[0]],
          [900, steps[1]],
          [1800, steps[2]],
          [2800, steps[3]]
        ];

        const titleEl = processingOverlay.querySelector('#oficina-processing-title');
        stepTimers.forEach(([t, text]) => {
          setTimeout(()=>{ if(titleEl) titleEl.textContent = text; }, t);
        });

        setTimeout(() => {
          // cria pedido em localStorage (mesmo formato do checkout)
          const STORAGE_PEDIDOS_KEY = 'oficina_hd_pedidos_v1';
          const totalText = document.getElementById('checkout-total')?.textContent || '';
          const totalNum = (totalText.match(/([0-9.,]+)/)?.[1] || '0').replace('.', '').replace(',', '.');

          const itensSnapshot = (() => {
            const data = (() => {
              const STORAGE_KEY = 'oficina_hd_carrinho_v1';
              const STORAGE_KEY_FALLBACK = 'oficina_hd_cart_v1';
              try{
                const raw = localStorage.getItem(STORAGE_KEY);
                if(raw){
                  const parsed = JSON.parse(raw);
                  if(Array.isArray(parsed)) return parsed;
                  if(parsed && typeof parsed === 'object') return Object.values(parsed);
                }
                const rawFallback = localStorage.getItem(STORAGE_KEY_FALLBACK);
                if(rawFallback){
                  const parsed = JSON.parse(rawFallback);
                  if(Array.isArray(parsed)) return parsed;
                  if(parsed && typeof parsed === 'object') return Object.values(parsed);
                }
              }catch{}
              return [];
            })();
            return Array.isArray(data) ? data : [];
          })();

          const nowIso = new Date().toISOString();
          const pedidoId = Math.random().toString(36).slice(2, 10).toUpperCase();

          try{
            const rawPedidos = localStorage.getItem(STORAGE_PEDIDOS_KEY);
            const pedidos = (() => {
              try {
                const parsed = JSON.parse(rawPedidos || '[]');
                return Array.isArray(parsed) ? parsed : [];
              } catch {
                return [];
              }
            })();

            const STORAGE_KEY_SELECTED_PARCELAMENTO = 'oficina_hd_checkout_selected_parcelamento_v1';
            let installments = null;
            try{
              const raw = localStorage.getItem(STORAGE_KEY_SELECTED_PARCELAMENTO);
              if(raw){
                const parsed = JSON.parse(raw);
                if(parsed && parsed.n && parsed.valorParcela){
                  installments = {
                    count: Number(parsed.n),
                    value: Number(parsed.valorParcela),
                    text: `Pagamento em ${parsed.n}x de ${Number(parsed.valorParcela).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} sem juros`
                  };
                }
              }
            }catch{}

            const pedido = {
              id: pedidoId,
              created_at: nowIso,
              status: 'Concluído',
              payment_method: 'cartao',
              total: Number(totalNum) || 0,
              items: itensSnapshot,
              installments,
            };

            pedidos.push(pedido);
            localStorage.setItem(STORAGE_PEDIDOS_KEY, JSON.stringify(pedidos));
          }catch{}

          // limpa carrinho após criar pedido
          try{
            localStorage.removeItem('oficina_hd_carrinho_v1');
            localStorage.removeItem('oficina_hd_cart_v1');
          }catch{}

          try{ processingOverlay.remove(); }catch{}

          // redireciona para sucesso
          const paymentMethod = 'Cartão';
          const amountStr = String(Number(totalNum) || 0);
          const href = `./pedido-aprovado.html?pedido=${encodeURIComponent(pedidoId)}&payment=${encodeURIComponent(paymentMethod)}&amount=${encodeURIComponent(amountStr)}`;
          window.location.href = href;
        }, 5000);

        // garante desbloqueio caso algo falhe antes de redirecionar (timeout extra)
        setTimeout(()=>{ window.__oficina_processing_lock = false; }, 8000);
      });
    });

    delBtn?.addEventListener('click', () => {
      const cards = lerSavedCards().filter(c => c.id !== id);
      salvarSavedCards(cards);
      // Se deletou o ativo, limpar ativo
      const active = lerCartaoAtivo();
      if(active && active.id === id){
        localStorage.removeItem('oficina_hd_cart_active_v1');
      }
      renderSavedCards();
      if(typeof window.toast === 'function') window.toast('Cartão excluído.', {variant:'error'});
    });
  });
}

function escapeHtml(str){
  return String(str ?? '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'<')
    .replace(/>/g,'>')
    .replace(/"/g,'"')
    .replace(/'/g,'&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('card-form');
  renderSavedCards();


  const btnSalvar = document.getElementById('btn-salvar-cartao');
  const btnLimpar = document.getElementById('btn-limpar-cartao');

  // Neste projeto, card-page.js pode ser carregado também na página checkout.html.
  // Se o formulário completo do cadastro de cartão não existir, ainda assim aplicamos as máscaras.
  // (as máscaras abaixo só funcionam se os inputs existirem)
  // Portanto, não retornamos cedo aqui.
  

  // Máscaras automáticas
  // maxlength por formato final (para não permitir mais caracteres visualmente)
  bindMask('card-number', mascaraCartao, 19); // "0000 0000 0000 0000"
  bindMask('card-exp', mascaraMesAno, 5);     // "MM/AA"
  bindMask('card-holder-cpf', mascaraCPF, 14); // "000.000.000-00"
  bindMask('card-holder-phone', mascaraTelefone, 18); // "(11) 99999-9999"

  // maxlength (evita digitar além do necessário)
  const cvv = document.getElementById('card-cvv');
  if (cvv) cvv.maxLength = 3;

  const cardNumber = document.getElementById('card-number');
  if (cardNumber) cardNumber.maxLength = 19; // "0000 0000 0000 0000"

  const cardExp = document.getElementById('card-exp');
  if (cardExp) cardExp.maxLength = 5; // "MM/AA"

  const cpfEl = document.getElementById('card-holder-cpf');
  if (cpfEl) cpfEl.maxLength = 14; // "000.000.000-00"

  const phoneEl = document.getElementById('card-holder-phone');
  if (phoneEl) phoneEl.maxLength = 18; // "(11) 99999-9999"

  preencherForm(lerCartaoAtivo());

  btnLimpar?.addEventListener('click', () => {
    limparCartao();


    const idsDoCartao = [
      'card-number',
      'card-exp',
      'card-cvv',
      'card-name',
      'card-holder-cpf',
      'card-holder-phone',
      'billing-address',
      'billing-neighborhood',
      'billing-number-extra',
    ];

    if (form) form.reset();
    for (const id of idsDoCartao) {
      const el = document.getElementById(id);
      if (el) el.value = '';
    }

    setMsg('card-msg', 'Cartão limpo.');
  });

  // Botão "Salvar e concluir" existe apenas em cart-card.html.
  // No checkout.html a ação de finalizar é o #btn-confirmar no js/checkout.js.
  // Toast e UI de cartões salvos vão ser acionadas também via renderização.

  btnSalvar?.addEventListener('click', (e) => {

    // Importante: remove qualquer chance do submit “sumir” a navegação.
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // aplica máscaras finais antes de salvar (caso o usuário não tenha deixado o input perder o foco)
    const cn = document.getElementById('card-number');
    const exp = document.getElementById('card-exp');
    const cpf = document.getElementById('card-holder-cpf');
    const tel = document.getElementById('card-holder-phone');
    if (cn) cn.value = mascaraCartao(cn.value);
    if (exp) exp.value = mascaraMesAno(exp.value);
    if (cpf) cpf.value = mascaraCPF(cpf.value);
    if (tel) tel.value = mascaraTelefone(tel.value);

    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }

    // Sanitização: nunca salvar CVV nem número completo.
    const cardNumberRaw = document.getElementById('card-number')?.value || '';
    const cardNumberDigits = apenasDigitos(cardNumberRaw);
    const last4 = cardNumberDigits.slice(-4);

    // Detectar bandeira de forma simples por prefixos (para demo)
    const first6 = cardNumberDigits.slice(0,6);
    let brand = 'Cartão';
    if (/^4/.test(cardNumberDigits)) brand = 'Visa';
    else if (/^(5[1-5]|2[2-7])/.test(cardNumberDigits)) brand = 'Mastercard';
    else if (/^34|^37/.test(cardNumberDigits)) brand = 'Amex';
    else if (/^4011|^4312|^4389|^4514|^4576|^5041|^5066|^5090|^6504|^6522/.test(cardNumberDigits)) brand = 'Elo';
    else if (/^606282|^650|^636368|^438935/.test(first6)) brand = 'Hipercard';

    const dados = {
      id: cryptoRandomId(),
      brand,
      last4,
      holderName: document.getElementById('card-name')?.value || '',
      exp: document.getElementById('card-exp')?.value || '',
      cardMask: `•••• •••• •••• ${last4}`,
      // dados de cobrança permitidos (não sensíveis)
      billingAddress: document.getElementById('billing-address')?.value || '',
      billingNeighborhood: document.getElementById('billing-neighborhood')?.value || '',
      billingNumberExtra: document.getElementById('billing-number-extra')?.value || '',
      cardHolderCpf: document.getElementById('card-holder-cpf')?.value || '',
      cardHolderPhone: document.getElementById('card-holder-phone')?.value || '',
      createdAt: new Date().toISOString()
    };

    // Deduplicar (mesma bandeira + últimos 4)
    const cards = lerSavedCards();
    const existsIndex = cards.findIndex(c => c.brand === dados.brand && c.last4 === dados.last4 && c.holderName === dados.holderName);
    if (existsIndex >= 0) {
      cards[existsIndex] = dados;
    } else {
      cards.unshift(dados);
    }
    salvarSavedCards(cards);

    // Selecionar automaticamente o cartão salvo como ativo
    salvarCartaoAtivo(dados);

    if (typeof window.toast === 'function') window.toast('Cartão salvo com sucesso', {variant:'success'});
    setMsg('card-msg', 'Cartão salvo! Indo para o pedido aprovado...');


    // Sem delay para garantir que o navegador navegue imediatamente após o clique.
    window.location.href = './pedido-aprovado.html?from=card-saved';
  });
});


