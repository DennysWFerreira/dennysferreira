const STORAGE_KEY = 'oficina_hd_pedidos_v1';

function safeParse(json, fallback){
  try{
    const v = JSON.parse(json);
    return v == null ? fallback : v;
  }catch{
    return fallback;
  }
}

function formatBRL(value){
  const n = Number(value) || 0;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDateBR(iso){
  if(!iso) return '—';
  const d = new Date(iso);
  if(Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('pt-BR');
}

function loadPedidos(){
  const raw = localStorage.getItem(STORAGE_KEY);
  const list = safeParse(raw, []);
  if(!Array.isArray(list)) return [];
  return list;
}

function savePedidos(pedidos){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos));
}

function getOrderTotalText(order){
  return formatBRL(order?.total ?? order?.valor_total ?? order?.amount ?? 0);
}

function getItemsCount(order){
  const items = order?.items || [];
  if(!Array.isArray(items)) return 0;
  return items.reduce((acc,it)=>acc + Number(it.qty ?? it.qtd ?? 0), 0);
}

function render(){
  const listEl = document.getElementById('orders-list');
  const emptyEl = document.getElementById('empty-state');
  if(!listEl || !emptyEl) return;

  const pedidos = loadPedidos();
  listEl.innerHTML = '';

  if(!pedidos.length){
    emptyEl.style.display = '';
    return;
  }

  emptyEl.style.display = 'none';

  // mostrar do mais recente
  pedidos
    .slice()
    .sort((a,b)=> (b.created_at || '').localeCompare(a.created_at || ''))
    .forEach((order)=>{
      const id = order?.id || '—';
      const createdAt = order?.created_at || '';
      const status = order?.status || '—';
      const payment = order?.payment_method || order?.payment || '—';

      const statusBadge = (() => {
        const s = String(status).toLowerCase();
        if (s.includes('process')) return '#eff6ff';
        if (s.includes('colet')) return '#f0fdf4';
        if (s.includes('entreg')) return '#ecfeff';
        if (s.includes('conclu')) return '#f3f4f6';
        if (s.includes('cancel')) return '#fee2e2';
        return '#f3f4f6';
      })();
      const totalText = getOrderTotalText(order);
      const itemsCount = getItemsCount(order);

      const card = document.createElement('div');
      card.style.border = '1px solid #e5e7eb';
      card.style.borderRadius = '16px';
      card.style.background = '#fff';
      card.style.padding = '16px 16px';

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; gap:14px; align-items:flex-start; flex-wrap:wrap;">
          <div>
            <div style="font-weight:1000; font-size:16px; margin-bottom:6px;">Pedido #${id}</div>
            <div style="color:#666; font-weight:700; font-size:13px; margin-bottom:6px;">${formatDateBR(createdAt)}</div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <span style="background:${statusBadge}; padding:6px 10px; border-radius:999px; font-weight:900; font-size:12px; color:#111;">${status}</span>
              <span style="background:#eff6ff; padding:6px 10px; border-radius:999px; font-weight:900; font-size:12px; color:#0b4aa2;">${payment}</span>
              <span style="background:#fefce8; padding:6px 10px; border-radius:999px; font-weight:900; font-size:12px; color:#854d0e;">${itemsCount} itens</span>
            </div>
          </div>

          <div style="text-align:right;">
            <div style="color:#666; font-weight:800; font-size:13px; margin-bottom:6px;">Total</div>
            <div style="font-weight:1000; font-size:18px;">${totalText}</div>
            <div style="margin-top:10px; display:flex; justify-content:flex-end;">
              <button type="button" class="btn-secundario" data-order-view="${id}" style="border:1px solid #d1d5db; background:#fff; padding:8px 12px; border-radius:12px; cursor:pointer; font-weight:900;">
                Ver status do pedido
              </button>
            </div>
          </div>
        </div>

        <div style="margin-top:12px; border-top:1px solid #f1f5f9; padding-top:12px;">
          <div style="color:#666; font-weight:800; font-size:13px; margin-bottom:8px;">Itens</div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${Array.isArray(order.items) && order.items.length ? order.items.map(it=>{
              const name = it.name ?? it.nome ?? 'Produto';
              const qty = Number(it.qty ?? it.qtd ?? 0);
              const price = it.price ?? it.preco ?? 0;
              const lineTotal = Number(price) * qty;
              const img = it.image ?? it.img ?? '';
              return `
                <div style="display:flex; gap:10px; align-items:center;">
                  ${img ? `<img src="${img}" alt="${name}" style="width:38px; height:38px; object-fit:cover; border-radius:10px; border:1px solid #e5e7eb;"/>` : ''}
                  <div style="flex:1;">
                    <div style="font-weight:900; font-size:13px;">${name}</div>
                    <div style="color:#666; font-weight:700; font-size:12px;">Qtd: ${qty} • ${formatBRL(price)} un.</div>
                  </div>
                  <div style="font-weight:1000; font-size:13px;">${formatBRL(lineTotal)}</div>
                </div>
              `;
            }).join('') : '<div style="color:#666; font-weight:700;">Nenhum item</div>'}
          </div>
        </div>
      `;

      listEl.appendChild(card);
    });
}

function showOrderDetails(order){
  const wrap = document.getElementById('order-details');
  if(!wrap) return;

  const titleEl = document.getElementById('order-details-title');
  const metaEl = document.getElementById('order-details-meta');
  const statusEl = document.getElementById('order-details-status');
  const paymentEl = document.getElementById('order-details-payment');
  const totalEl = document.getElementById('order-details-total');
  const itemsEl = document.getElementById('order-details-items');

  const id = order?.id || '—';
  const createdAt = order?.created_at || '';
  const status = order?.status || '—';
  const payment = order?.payment_method || order?.payment || '—';
  const totalText = getOrderTotalText(order);

  const s = String(status).toLowerCase();
  let statusBg = '#f3f4f6';
  if (s.includes('process')) statusBg = '#eff6ff';
  else if (s.includes('colet')) statusBg = '#f0fdf4';
  else if (s.includes('entreg')) statusBg = '#ecfeff';
  else if (s.includes('conclu')) statusBg = '#f3f4f6';
  else if (s.includes('cancel')) statusBg = '#fee2e2';

  if(titleEl) titleEl.textContent = `Pedido #${id}`;
  if(metaEl) metaEl.textContent = formatDateBR(createdAt);
  if(statusEl){
    statusEl.textContent = status;
    statusEl.style.background = statusBg;
  }
  if(paymentEl) paymentEl.textContent = String(payment);
  if(totalEl) totalEl.textContent = `Total: ${totalText}`;

  // Linha do tempo premium (Amazon/KaBuM/Pichau)
  const etapasWrap = document.getElementById('order-details-etapas');
  if(etapasWrap){
    const s = String(status).toLowerCase();

    // Mapeamento do status salvo no localStorage para um índice 0..6
    let idx = 0;
    if(s.includes('cancel')) idx = 0;
    else if(s.includes('process')) idx = 1;
    // etapa “Em coleta” foi removida da visualização; quando vier esse status, tratamos como separação
    else if(s.includes('colet')) idx = 2;
    else if(s.includes('despach')) idx = 3;
    else if(s.includes('rota') || s.includes('entreg')) idx = 4;
    else if(s.includes('conclu')) idx = 6;

    // campos disponíveis apenas em modo demo: preenchidos aqui com fallback realistas
    const previsao = order?.forecast_delivery || order?.previsao || (()=>{
      try{
        // se existir criado_at, soma ~7 dias
        const iso = order?.created_at;
        const d = iso ? new Date(iso) : null;
        if(d && !Number.isNaN(d.getTime())){
          d.setDate(d.getDate() + 7);
          return d.toLocaleDateString('pt-BR');
        }
      }catch{}
      return '—';
    })();
    const transportadora = order?.carrier || order?.transportadora || 'Correios/Transportadora';
    const rastreio = order?.tracking_code || order?.codigo_rastreio || order?.tracking || (()=>{
      try{
        return order?.id ? `OF-${String(order.id).slice(0,8)}` : '—';
      }catch{ return '—'; }
    })();

    const now = new Date();
    const mkTime = (offsetMin) =>{
      const d = new Date(now.getTime() - offsetMin*60*1000);
      return d.toLocaleString('pt-BR');
    };

    // Timeline: 7 etapas (sem “Em coleta” — status de coleta é mapeado para “Em separação”)
    const steps = [
      { icon:'fa-clipboard-list', title:'Pedido realizado', desc:'Seu pedido foi registrado com sucesso.', time: mkTime(180) },
      { icon:'fa-circle-check', title:'Pagamento aprovado', desc:'Pagamento confirmado pelo sistema.', time: mkTime(150) },
      { icon:'fa-boxes-stacked', title:'Em separação', desc:'Itens estão sendo preparados no estoque.', time: mkTime(120) },
      { icon:'fa-truck-fast', title:'Em transporte', desc:'Pedido em rota de transporte.', time: mkTime(75) },
      { icon:'fa-location-dot', title:'Saiu para entrega', desc:'Pedido saiu para a rota de entrega.', time: mkTime(25) },
      { icon:'fa-gift', title:'Pedido entregue', desc:'Entrega concluída com sucesso.', time: mkTime(5) },
    ];

    const statusLabels = ['Pedido realizado','Pagamento aprovado','Em separação','Em coleta','Em transporte','Saiu para entrega','Pedido entregue'];
    const currentTitle = statusLabels[Math.min(Math.max(idx,0),6)];

    const progressPct = (idx/6)*100;

    const cardHTML = `
      <div class="order-tracking">
        <div class="order-tracking-card">
          <div class="order-tracking-inner">
            <div class="order-tracking-header">
              <div class="order-tracking-title">
                <div class="badge"><i class="fa-solid fa-receipt" style="color:var(--ot-primary);"></i></div>
                <div>
                  <h3>Acompanhamento do pedido</h3>
                  <p>Nº do pedido: <b>#${order?.id || '—'}</b> • Atual: <b>${currentTitle}</b></p>
                </div>
              </div>
            </div>

            <div class="order-tracking-meta">
              <div class="order-tracking-chip">
                <div class="label">Previsão de entrega</div>
                <div class="value">${previsao}</div>
              </div>
              <div class="order-tracking-chip">
                <div class="label">Transportadora</div>
                <div class="value">${transportadora}</div>
              </div>
              <div class="order-tracking-chip">
                <div class="label">Código de rastreio</div>
                <div class="value">${rastreio}</div>
              </div>
            </div>

            <div class="order-timeline">
              <div class="order-timeline-rail">
                <div class="order-timeline-progress" style="width:${progressPct}%;"></div>
                ${steps.map((st,i)=>{
                  const done = i < idx;
                  const active = i === idx;
                  const cls = done ? 'done' : (active ? 'active' : 'upcoming');
                  const time = done || active ? st.time : '—';
                  const desc = done || active ? st.desc : 'Aguardando atualização do sistema.';
                  const badge = active ? `<div class="status-atual-badge">Status atual</div>` : '';
                  return `
                    <div class="order-step ${cls}">
                      <div class="order-step-dot">
                        <i class="fa-solid ${st.icon}" style="font-size:16px;"></i>
                      </div>
                      <div class="order-step-card">
                        ${badge}
                        <div class="step-title">${st.title}</div>
                        <div class="step-time">${time}</div>
                        <div class="step-desc">${desc}</div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    etapasWrap.innerHTML = cardHTML;
  }

  if(itemsEl){
    const items = order?.items || [];
    itemsEl.innerHTML = Array.isArray(items) && items.length ? items.map(it=>{
      const name = it.name ?? it.nome ?? 'Produto';
      const qty = Number(it.qty ?? it.qtd ?? 0);
      const price = it.price ?? it.preco ?? 0;
      const lineTotal = Number(price) * qty;
      const img = it.image ?? it.img ?? '';
      return `
        <div style="display:flex; gap:10px; align-items:center; border:1px solid #f1f5f9; border-radius:14px; padding:10px;">
          ${img ? `<img src="${img}" alt="${name}" style="width:44px; height:44px; object-fit:cover; border-radius:12px; border:1px solid #e5e7eb;"/>` : ''}
          <div style="flex:1;">
            <div style="font-weight:1000; font-size:13px; margin-bottom:2px;">${name}</div>
            <div style="color:#666; font-weight:700; font-size:12px;">Qtd: ${qty} • ${formatBRL(price)} un.</div>
          </div>
          <div style="font-weight:1000; font-size:13px; white-space:nowrap;">${formatBRL(lineTotal)}</div>
        </div>
      `;
    }).join('') : '<div style="color:#666; font-weight:700;">Nenhum item</div>';
  }

  wrap.style.display = '';
}

// Busca pedidos + itens do banco e mescla com localStorage
async function sincronizarPedidos(){
  try {
    const resp = await fetch('./php/listar_pedidos.php');
    if (!resp.ok) return;
    const pedidosBanco = await resp.json();
    if (!Array.isArray(pedidosBanco) || !pedidosBanco.length) return;

    // Busca itens de cada pedido em paralelo
    const normalizados = await Promise.all(pedidosBanco.map(async (p) => {
      let items = [];
      try {
        const r = await fetch(`./php/detalhes_pedido.php?id=${p.id}`);
        const d = await r.json();
        if (Array.isArray(d.items)) {
          items = d.items.map(i => ({
            nome:  i.nome_produto || '',
            name:  i.nome_produto || '',
            qty:   Number(i.quantidade) || 1,
            qtd:   Number(i.quantidade) || 1,
            preco: parseFloat(i.preco)  || 0,
            price: parseFloat(i.preco)  || 0,
          }));
        }
      } catch {}

      return {
        id:             p.id,
        created_at:     p.data_pedido      || '',
        status:         p.status           || 'Pendente',
        payment_method: p.forma_pagamento  || '',
        total:          parseFloat(p.valor_total) || 0,
        items,
        _from_db: true,
      };
    }));

    // Mescla: prioriza banco, mantém pedidos só locais
    const locais = loadPedidos().filter(p => !p._from_db);
    const idsNoBanco = new Set(normalizados.map(p => String(p.id)));
    const soLocal = locais.filter(p => !idsNoBanco.has(String(p.id)));

    savePedidos([...normalizados, ...soLocal]);
    render();
  } catch (err) {
    console.error('Erro ao sincronizar pedidos:', err);
  }
}

function init(){
  render();
  sincronizarPedidos(); // busca do banco em background

  const btn = document.getElementById('btn-limpar-pedidos');
  btn?.addEventListener('click', ()=>{
    if(!confirm('Tem certeza que deseja limpar os pedidos deste navegador?')) return;
    localStorage.removeItem(STORAGE_KEY);
    render();
  });

  const close = document.getElementById('order-details-close');
  close?.addEventListener('click', ()=>{
    const wrap = document.getElementById('order-details');
    if(wrap) wrap.style.display = 'none';
  });

  document.addEventListener('click', async (e)=>{
    const btn = e.target.closest('[data-order-view]');
    if(!btn) return;

    const id = btn.getAttribute('data-order-view');
    const pedidos = loadPedidos();
    const order = pedidos.find(p=>String(p?.id) === String(id));
    if(!order) return;

    // Se pedido veio do banco e sem itens, busca os itens agora
    if(order._from_db && (!order.items || !order.items.length)){
      try {
        const resp = await fetch(`./php/detalhes_pedido.php?id=${encodeURIComponent(id)}`);
        const data = await resp.json();
        if(data.items && data.items.length){
          // Normaliza itens do banco para o formato local
          order.items = data.items.map(i => ({
            nome:  i.nome_produto || '',
            name:  i.nome_produto || '',
            qty:   i.quantidade   || 1,
            qtd:   i.quantidade   || 1,
            preco: parseFloat(i.preco) || 0,
            price: parseFloat(i.preco) || 0,
          }));
          savePedidos(pedidos);
        }
      } catch(err){ console.error('Erro ao buscar itens:', err); }
    }

    showOrderDetails(order);
  });
}

document.addEventListener('DOMContentLoaded', init);

