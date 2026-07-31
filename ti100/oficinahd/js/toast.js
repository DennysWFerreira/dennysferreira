// Toast simples e moderna para uso em páginas do checkout/card

(function(){
  const DEFAULTS = {
    timeoutMs: 2600,
    position: 'bottom-right'
  };

  function ensureContainer(){
    let el = document.querySelector('[data-toast-container]');
    if(el) return el;

    el = document.createElement('div');
    el.setAttribute('data-toast-container','');
    el.style.position = 'fixed';
    el.style.zIndex = '10000';
    el.style.display = 'flex';
    el.style.flexDirection = 'column';
    el.style.gap = '12px';
    el.style.pointerEvents = 'none';
    el.style.right = '18px';
    el.style.bottom = '18px';
    document.body.appendChild(el);
    return el;
  }

  function toast(message, {variant='success', timeoutMs=DEFAULTS.timeoutMs} = {}){
    const container = ensureContainer();

    const t = document.createElement('div');
    t.setAttribute('data-toast','');
    t.style.pointerEvents = 'none';
    t.style.minWidth = '260px';
    t.style.maxWidth = '420px';
    t.style.padding = '14px 16px';
    t.style.borderRadius = '16px';
    t.style.background = variant === 'error'
      ? 'rgba(220,38,38,.98)'
      : 'rgba(22,163,74,.98)';
    t.style.color = '#fff';
    t.style.boxShadow = '0 18px 45px rgba(0,0,0,.18)';
    t.style.border = '1px solid rgba(255,255,255,.14)';
    t.style.opacity = '0';
    t.style.transform = 'translateY(10px)';
    t.style.transition = 'opacity .25s ease, transform .25s ease';

    const title = variant === 'error' ? 'Atenção' : 'Pronto';
    t.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:10px;">
        <div style="font-size:18px;line-height:1.2;">${variant === 'error' ? '⚠️' : '✅'}</div>
        <div style="display:flex;flex-direction:column;gap:2px;">
          <div style="font-weight:900;letter-spacing:-.2px;">${title}</div>
          <div style="font-weight:700;opacity:.95;line-height:1.35;font-size:13px;">${escapeHtml(message)}</div>
        </div>
      </div>
    `;

    container.appendChild(t);

    requestAnimationFrame(()=>{
      t.style.opacity = '1';
      t.style.transform = 'translateY(0)';
    });

    setTimeout(()=>{
      t.style.opacity = '0';
      t.style.transform = 'translateY(10px)';
      setTimeout(()=> t.remove(), 260);
    }, timeoutMs);
  }

  function escapeHtml(str){
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'<')
      .replace(/>/g,'>')
      .replace(/\"/g,'"')
      .replace(/'/g,'&#039;');
  }

  window.toast = toast;
})();

