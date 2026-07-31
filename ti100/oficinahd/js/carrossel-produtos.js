/* Carrossel simples e funcional (cards fixos, 1 card por clique, loop infinito)
   Exemplo: [1][2][3][4] -> next => [2][3][4][5] -> next => [3][4][5][1] ...
*/
(function initProdutosCarousel(){
  const root = document.querySelector('.carrossel-produtos');
  if(!root) return;

  const track = root.querySelector('[data-carousel-track]');
  const viewport = root.querySelector('[data-carousel-viewport]');
  const btnPrev = root.querySelector('.seta-produto-prev');
  const btnNext = root.querySelector('.seta-produto-next');
  if(!track || !viewport) return;

  const originals = Array.from(track.children);
  if(originals.length === 0) return;

  // Requisito do usuário: 5 produtos e mostrar 4 por vez (no desktop)
  // Vamos calcular por viewport, mas mantendo “4” como prioridade quando couber.
  function getPerView(){
    const w = viewport.getBoundingClientRect().width || 1;
    if(w < 520) return 1;
    if(w < 900) return 2;
    return 4;
  }

  let perView = getPerView();
  let step = 1; // 1 produto por clique
  let itemW = 0;
  let itemGap = 0;
  let slideSize = 0;

  // Loop infinito sem reset visual: usar uma lista duplicada (2x)
  // e quando passar do fim, reposicionar sem transição.
  let index = 0; // índice lógico do card inicial no “original”

  function measure(){
    // pega largura real do primeiro card
    const first = originals[0];
    if(!first) return;

    itemW = first.getBoundingClientRect().width || 260;

    // gap (via style de track)
    const cs = window.getComputedStyle(track);
    const gapStr = cs.columnGap || cs.gap || '0px';
    itemGap = parseFloat(gapStr) || 0;

    slideSize = itemW + itemGap;
  }

  function setTranslate(px, animate){
    if(animate){
      track.style.transition = 'transform 520ms cubic-bezier(.22,.61,.36,1)';
    } else {
      track.style.transition = 'none';
    }
    track.style.transform = `translateX(${px}px)`;
  }

  function build(){
    // reconstroi track: [originais][originais]
    track.innerHTML = '';
    measure();

    perView = getPerView();
    const clones = originals.map(el => el.cloneNode(true));

    originals.forEach(el => track.appendChild(el));
    clones.forEach(el => track.appendChild(el));

    index = 0;
    apply(false);
  }

  function apply(animate=true){
    // Mostra sempre o bloco [index .. index+perView-1]
    // no track duplicado, usamos o mesmo index no primeiro “bloco”
    // e quando index ultrapassar, reposiciona sem transição para manter a continuidade.

    const total = originals.length;

    // normaliza index para 0..total-1 (sem inverter direção)
    index = ((index % total) + total) % total;

    // posição visual: começando no “bloco original” dentro do track duplicado
    const visualIndex = index;
    const x = -(visualIndex * slideSize);

    setTranslate(x, animate);

    // reset silencioso: quando o usuário chega no final do trecho visível,
    // reposiciona para um x equivalente sem transição.
    // (Isso evita “loop bugado” em carrosséis simples com lista duplicada.)
  }

  function next(){
    index += step;

    // Se aproximar do fim do primeiro bloco, reposiciona sem transição depois do movimento.
    // Assim a próxima animação continua suave.
    setTranslate(-(index * slideSize), true);

    // Ao final da transição, reposiciona silenciosamente para o índice normalizado.
    // Mantém a continuidade visual.
    window.setTimeout(() => {
      const total = originals.length;
      const normalized = ((index % total) + total) % total;
      index = normalized;
      setTranslate(-(index * slideSize), false);
    }, 540);
  }

  function prev(){
    index -= step;
    setTranslate(-(index * slideSize), true);

    window.setTimeout(() => {
      const total = originals.length;
      const normalized = ((index % total) + total) % total;
      index = normalized;
      setTranslate(-(index * slideSize), false);
    }, 540);
  }

  btnNext && btnNext.addEventListener('click', () => next());
  btnPrev && btnPrev.addEventListener('click', () => prev());

  // Responsivo: recalcular tamanhos e rebuild do track duplicado
  let t = null;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => build(), 150);
  });

  build();
})();



