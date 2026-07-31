// ==================== IA SUPER INTELIGENTE COM SUGESTÕES ATIVAS ====================

let memoriaConversa = {
  etapa: "inicio",
  nome: null,
  tipoProjeto: null,
  metragem: null
};

// Respostas com sugestões embutidas
const respostasIA = {
  boasVindas: `👋 Olá! Sou a assistente virtual da **Espaço Essência**.
  
Vou te ajudar com tudo sobre design de interiores! 😊

**O que você gostaria de fazer?**`,
  
  sugestoesIniciais: [
    { texto: "💰 Quero um orçamento", acao: "orcamento" },
    { texto: "🏠 Conhecer os serviços", acao: "servicos" },
    { texto: "📞 Falar com um humano", acao: "contato" },
    { texto: "💡 Dicas de decoração", acao: "dicas" }
  ],
  
  servicos: `✨ **NOSSOS SERVIÇOS** ✨

🏡 **Residencial** - Projetos completos para casas e apartamentos
🏢 **Comercial** - Lojas, escritórios, clínicas, restaurantes
🎨 **Consultoria** - Orientação sem obra, apenas decoração
💡 **Projeto de Iluminação** - Luz que valoriza cada ambiente

**Qual te interessa mais?**`,
  
  sugestaoServicos: [
    { texto: "🏡 Projeto Residencial", acao: "residencial" },
    { texto: "🏢 Projeto Comercial", acao: "comercial" },
    { texto: "🎨 Consultoria", acao: "consultoria" },
    { texto: "💰 Voltar ao orçamento", acao: "orcamento" }
  ],
  
  iniciarOrcamento: `💰 **Vamos simular um orçamento rápido?**

Primeiro, me diga: qual tipo de projeto você busca?`,
  
  sugestaoOrcamento: [
    { texto: "🏡 Residencial", acao: "orcamento_residencial" },
    { texto: "🏢 Comercial", acao: "orcamento_comercial" },
    { texto: "🎨 Consultoria", acao: "consultoria" }
  ],
  
  pedirMetragem: (tipo) => `📏 **Ótimo!** Agora me informe a metragem aproximada do ${tipo === "residencial" ? "ambiente" : "espaço comercial"}.

Digite algo como: "45 metros" ou "60 m2"

💡 *Dica: Se não souber, me diga quantos cômodos tem (ex: "2 quartos, sala e cozinha")*`,
  
  // ========== FUNÇÃO CORRIGIDA ==========
  calcularOrcamento: (tipo, m2) => {
    // Validação
    if (!tipo || !m2) {
      return `❌ **Não consegui calcular porque faltam informações.**

Por favor, me diga novamente:
1. Tipo (residencial ou comercial)
2. Metragem (ex: "50 m2")`;
    }
    
    // Cálculo dos valores
    let valorBase, valorMin, valorMax;
    
    if (tipo === "residencial") {
      valorBase = 180 * m2;
      valorMin = valorBase * 0.85;
      valorMax = valorBase * 1.3;
    } else if (tipo === "comercial") {
      valorBase = 280 * m2;
      valorMin = valorBase * 0.9;
      valorMax = valorBase * 1.4;
    } else {
      return `📊 **Consultoria**: de R$ 800 a R$ 1.500 (dependendo da complexidade)
      
Inclui: visita técnica, moodboard, paleta de cores e lista de compras.

Quer agendar uma conversa gratuita com nossa equipe?`;
    }
    
    // Retorno formatado CORRETAMENTE
    return `📊 **ORÇAMENTO ESTIMADO** 📊

Tipo: ${tipo === "residencial" ? "🏡 Residencial" : "🏢 Comercial"}
Metragem: ${m2}m²
💰 Faixa de investimento: **R$ ${Math.round(valorMin).toLocaleString()} - R$ ${Math.round(valorMax).toLocaleString()}**

✅ Inclui:
• Planta humanizada
• Renderização 3D realista
• Projeto de iluminação
• Lista de compras com links
• 2 revisões gratuitas

📅 Prazo médio: ${tipo === "residencial" ? "30 a 45" : "35 a 50"} dias

**Quer agendar uma reunião sem compromisso para detalharmos seu projeto?**`;
  },
  // ========== FIM DA FUNÇÃO CORRIGIDA ==========
  
  sugestaoFinal: [
    { texto: "📞 Quero agendar reunião", acao: "contato" },
    { texto: "🔄 Simular outro orçamento", acao: "orcamento" },
    { texto: "📸 Ver projetos prontos", acao: "projetos" },
    { texto: "💡 Mais dicas", acao: "dicas" }
  ],
  
  dicas: `💡 **DICAS DE DESIGN DE INTERIORES** 💡

🎨 **CORES**: Ambientes claros (bege, verde suave) ampliam espaços em até 30%!

💡 **ILUMINAÇÃO**: Use 3 camadas - geral (teto) + tarefa (mesa) + destaque (quadros/plantas)

🌿 **PLANTAS**: Espada-de-São-Jorge e Zamioculca são fáceis e purificam o ar

🪞 **ESPELHOS**: Coloque oposto à janela para dobrar a luz natural

**Quer mais dicas para um tipo específico de ambiente?**`,
  
  sugestaoDicas: [
    { texto: "🛋️ Sala de estar", acao: "dica_sala" },
    { texto: "🍳 Cozinha", acao: "dica_cozinha" },
    { texto: "🛏️ Quarto", acao: "dica_quarto" },
    { texto: "💰 Voltar ao orçamento", acao: "orcamento" }
  ],
  
  dicaSala: `🛋️ **DICA PARA SALA DE ESTAR**

• Sofá solto no centro (não encostado na parede) cria circulação
• Tapete delimita o espaço e traz aconchego
• Prateleiras flutuantes aproveitam parede vertical
• Luminária de piso em ponto cego completa a iluminação

Quer incluir isso no seu projeto? Posso simular um orçamento com essas ideias!`,
  
  dicaCozinha: `🍳 **DICA PARA COZINHA**

• Triângulo de trabalho (pia-fogão-geladeira) máximo 6m de distância
• Iluminação embaixo dos armários (fita de LED) transforma a bancada
• Gavetas com fecho suave são mais funcionais que portas
• Tomadas planejadas para cada eletroportátil

Que tal um projeto de cozinha personalizado?`,
  
  dicaQuarto: `🛏️ **DICA PARA QUARTO**

• Cabeceira estofada traz conforto visual e acústico
• Cortinas blackout melhoram o sono em 40%
• Luz indireta no teto ou arandex cria clima relaxante
• Roupeiro do chão ao teto otimiza espaço

Posso criar um projeto de quarto dos sonhos para você!`,
  
  contato: `📞 **FALE CONOSCO**

📱 WhatsApp: (11) 99999-9999 (resposta em até 2h)
📧 E-mail: contato@espacoessencia.com
📍 Av. Paulista, 1000 - São Paulo - SP
📷 Instagram: @espacoessencia

Horário: Seg-Sex 9h às 19h

**Já posso transferir sua conversa para um atendente humano agora mesmo?**`,
  
  sugestaoContato: [
    { texto: "✅ Sim, quero falar com humano", acao: "humano" },
    { texto: "💰 Voltar ao orçamento", acao: "orcamento" },
    { texto: "🏠 Ver serviços novamente", acao: "servicos" }
  ],
  
  humano: `👨‍💼 **Ótimo!** Um de nossos especialistas entrará em contato em breve.

Enquanto isso, posso te ajudar com mais alguma informação?`,
  
  projetos: `📸 **VEJA NOSSOS PROJETOS**

Role a página para baixo e confira nossa galeria de projetos reais! Temos:

• Salas integradas
• Cozinhas planejadas
• Home offices ergonômicos
• Banheiros estilo spa
• Varandas gourmet

**Quer um orçamento para um estilo parecido com algum desses?**`,
  
  naoEntendi: `🤔 **Não entendi completamente...**

Clique em uma das opções abaixo para continuar:`,
  
  sugestaoPadrao: [
    { texto: "💰 Orçamento", acao: "orcamento" },
    { texto: "🏠 Serviços", acao: "servicos" },
    { texto: "💡 Dicas", acao: "dicas" },
    { texto: "📞 Contato", acao: "contato" }
  ],
  
  residencial: `🏡 **Projeto Residencial Completo**

O que incluímos:
• Estudo de fluxo e funcionalidade
• Planta baixa humanizada
• Projeto de marcenaria sob medida
• Renderização 3D fotorrealista
• Projeto luminotécnico
• Especificação de revestimentos e móveis
• Lista de compras com links

💰 A partir de R$ 3.500

Quer simular um orçamento para sua casa?`,
  
  comercial: `🏢 **Projeto Comercial Estratégico**

Ideal para:
• Lojas e vitrines
• Escritórios e consultórios
• Restaurantes e cafeterias
• Clínicas e salões

Diferenciais:
• Layout para vendas/produtividade
• Identidade visual integrada
• Normas de acessibilidade
• Materiais de alta durabilidade

💰 A partir de R$ 5.000

Vamos transformar seu negócio?`
};

// Função para processar ação
function processarAcao(acao, param = null) {
  let resposta = "";
  let sugestoes = [];
  
  switch(acao) {
    case "inicio":
      resposta = respostasIA.boasVindas;
      sugestoes = respostasIA.sugestoesIniciais;
      memoriaConversa.etapa = "inicio";
      break;
      
    case "servicos":
      resposta = respostasIA.servicos;
      sugestoes = respostasIA.sugestaoServicos;
      memoriaConversa.etapa = "servicos";
      break;
      
    case "residencial":
      resposta = respostasIA.residencial;
      sugestoes = [{ texto: "💰 Simular orçamento residencial", acao: "orcamento_residencial" }, { texto: "🏠 Voltar aos serviços", acao: "servicos" }];
      break;
      
    case "comercial":
      resposta = respostasIA.comercial;
      sugestoes = [{ texto: "💰 Simular orçamento comercial", acao: "orcamento_comercial" }, { texto: "🏠 Voltar aos serviços", acao: "servicos" }];
      break;
      
    case "orcamento":
      resposta = respostasIA.iniciarOrcamento;
      sugestoes = respostasIA.sugestaoOrcamento;
      memoriaConversa.etapa = "aguardandoTipoOrcamento";
      break;
      
    case "orcamento_residencial":
      memoriaConversa.tipoProjeto = "residencial";
      resposta = respostasIA.pedirMetragem("residencial");
      sugestoes = [];
      memoriaConversa.etapa = "aguardandoMetragem";
      break;
      
    case "orcamento_comercial":
      memoriaConversa.tipoProjeto = "comercial";
      resposta = respostasIA.pedirMetragem("comercial");
      sugestoes = [];
      memoriaConversa.etapa = "aguardandoMetragem";
      break;
      
    case "consultoria":
      resposta = "🎨 **Consultoria de Decoração**: R$ 800 - R$ 1.500\n\nInclui visita técnica (ou online), moodboard personalizado, paleta de cores e lista de compras com links.\n\nPrazo: 7 a 15 dias.\n\nQuer agendar?";
      sugestoes = [{ texto: "📞 Sim, quero agendar consultoria", acao: "contato" }, { texto: "💰 Voltar", acao: "orcamento" }];
      memoriaConversa.etapa = "finalizando";
      break;
      
    case "dicas":
      resposta = respostasIA.dicas;
      sugestoes = respostasIA.sugestaoDicas;
      memoriaConversa.etapa = "dicas";
      break;
      
    case "dica_sala":
      resposta = respostasIA.dicaSala;
      sugestoes = [{ texto: "💰 Simular orçamento para minha sala", acao: "orcamento" }, { texto: "💡 Mais dicas", acao: "dicas" }];
      break;
      
    case "dica_cozinha":
      resposta = respostasIA.dicaCozinha;
      sugestoes = [{ texto: "💰 Simular orçamento para minha cozinha", acao: "orcamento" }, { texto: "💡 Mais dicas", acao: "dicas" }];
      break;
      
    case "dica_quarto":
      resposta = respostasIA.dicaQuarto;
      sugestoes = [{ texto: "💰 Simular orçamento para meu quarto", acao: "orcamento" }, { texto: "💡 Mais dicas", acao: "dicas" }];
      break;
      
    case "contato":
      resposta = respostasIA.contato;
      sugestoes = respostasIA.sugestaoContato;
      memoriaConversa.etapa = "contato";
      break;
      
    case "humano":
      resposta = respostasIA.humano;
      sugestoes = [{ texto: "💰 Orçamento", acao: "orcamento" }, { texto: "🏠 Serviços", acao: "servicos" }];
      memoriaConversa.etapa = "finalizando";
      break;
      
    case "projetos":
      resposta = respostasIA.projetos;
      sugestoes = [{ texto: "💰 Simular orçamento parecido", acao: "orcamento" }, { texto: "🏠 Voltar aos serviços", acao: "servicos" }];
      break;
      
    default:
      resposta = respostasIA.naoEntendi;
      sugestoes = respostasIA.sugestaoPadrao;
  }
  
  return { resposta, sugestoes };
}

// Função para extrair metragem de texto
function extrairMetragem(texto) {
  const match = texto.match(/(\d+)\s*m2|\b(\d+)\s*metros|\b(\d+)\s*m/);
  if (match) {
    return parseInt(match[1] || match[2] || match[3]);
  }
  
  // Tentar extrair por cômodos
  const comodosMatch = texto.match(/(\d+)\s*(quartos|cômodos|comodos|ambiente|ambientes)/i);
  if (comodosMatch) {
    const numComodos = parseInt(comodosMatch[1]);
    return numComodos * 20;
  }
  
  return null;
}

// Interface do Chat
document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-ia");
  const toggleBtn = document.getElementById("chat-toggle");
  const closeBtn = document.getElementById("close-chat");
  const sendBtn = document.getElementById("send-chat");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");
  
  function addMessage(text, isUser) {
    const div = document.createElement("div");
    div.classList.add(isUser ? "user-msg" : "bot-msg");
    div.innerHTML = text.replace(/\n/g, '<br>');
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  function addSugestoes(sugestoes) {
    if (!sugestoes || sugestoes.length === 0) return;
    
    const div = document.createElement("div");
    div.classList.add("bot-msg");
    div.style.background = "#e8f0e4";
    div.style.padding = "10px";
    div.style.borderRadius = "15px";
    div.style.marginTop = "8px";
    
    sugestoes.forEach(sug => {
      const btn = document.createElement("button");
      btn.innerText = sug.texto;
      btn.style.background = "#7d9f6e";
      btn.style.color = "white";
      btn.style.border = "none";
      btn.style.borderRadius = "25px";
      btn.style.padding = "8px 15px";
      btn.style.margin = "5px";
      btn.style.cursor = "pointer";
      btn.style.fontSize = "0.85rem";
      btn.style.transition = "0.2s";
      
      btn.onmouseenter = () => btn.style.background = "#5c7a4e";
      btn.onmouseleave = () => btn.style.background = "#7d9f6e";
      
      btn.onclick = () => {
        addMessage(sug.texto, true);
        const { resposta, sugestoes: novasSugestoes } = processarAcao(sug.acao);
        setTimeout(() => {
          addMessage(resposta, false);
          if (novasSugestoes && novasSugestoes.length > 0) {
            addSugestoes(novasSugestoes);
          }
        }, 400);
      };
      
      div.appendChild(btn);
    });
    
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  function processarTexto(texto) {
    const textoLower = texto.toLowerCase();
    
    // Verificar se é uma metragem (quando está aguardando)
    const metragem = extrairMetragem(texto);
    if (memoriaConversa.etapa === "aguardandoMetragem" && metragem) {
      memoriaConversa.metragem = metragem;
      const orcamentoResposta = respostasIA.calcularOrcamento(memoriaConversa.tipoProjeto, metragem);
      addMessage(orcamentoResposta, false);
      addSugestoes(respostasIA.sugestaoFinal);
      memoriaConversa.etapa = "finalizando";
      return true;
    }
    
    // Se está aguardando metragem mas não veio número
    if (memoriaConversa.etapa === "aguardandoMetragem") {
      addMessage("📏 Por favor, me informe a metragem em números. Exemplo: '45 m2' ou '60 metros'", false);
      return true;
    }
    
    // Mapear palavras para ações
    if (textoLower.includes("orçamento") || textoLower.includes("preço") || textoLower.includes("quanto custa")) {
      const { resposta, sugestoes } = processarAcao("orcamento");
      addMessage(resposta, false);
      addSugestoes(sugestoes);
      return true;
    }
    
    if (textoLower.includes("serviço") || textoLower.includes("fazem") || textoLower.includes("trabalham")) {
      const { resposta, sugestoes } = processarAcao("servicos");
      addMessage(resposta, false);
      addSugestoes(sugestoes);
      return true;
    }
    
    if (textoLower.includes("dica") || textoLower.includes("decoração") || textoLower.includes("decorar")) {
      const { resposta, sugestoes } = processarAcao("dicas");
      addMessage(resposta, false);
      addSugestoes(sugestoes);
      return true;
    }
    
    if (textoLower.includes("contato") || textoLower.includes("whatsapp") || textoLower.includes("telefone") || textoLower.includes("email")) {
      const { resposta, sugestoes } = processarAcao("contato");
      addMessage(resposta, false);
      addSugestoes(sugestoes);
      return true;
    }
    
    if (textoLower.includes("sala")) {
      const { resposta, sugestoes } = processarAcao("dica_sala");
      addMessage(resposta, false);
      addSugestoes(sugestoes);
      return true;
    }
    
    if (textoLower.includes("cozinha")) {
      const { resposta, sugestoes } = processarAcao("dica_cozinha");
      addMessage(resposta, false);
      addSugestoes(sugestoes);
      return true;
    }
    
    if (textoLower.includes("quarto")) {
      const { resposta, sugestoes } = processarAcao("dica_quarto");
      addMessage(resposta, false);
      addSugestoes(sugestoes);
      return true;
    }
    
    // Não entendeu
    const { resposta, sugestoes } = processarAcao("naoEntendi");
    addMessage(resposta, false);
    addSugestoes(sugestoes);
    return true;
  }
  
  function enviarMensagem() {
    const msg = chatInput.value.trim();
    if (!msg) return;
    
    addMessage(msg, true);
    chatInput.value = "";
    
    setTimeout(() => {
      processarTexto(msg);
    }, 300);
  }
  
  // Abrir chat com saudação inicial
  toggleBtn.onclick = () => {
    chatBox.style.display = "flex";
    toggleBtn.style.display = "none";
    
    const mensagensExistentes = chatMessages.querySelectorAll(".bot-msg");
    if (mensagensExistentes.length === 1) {
      setTimeout(() => {
        const { resposta, sugestoes } = processarAcao("inicio");
        addMessage(resposta, false);
        addSugestoes(sugestoes);
      }, 500);
    }
  };
  
  closeBtn.onclick = () => {
    chatBox.style.display = "none";
    toggleBtn.style.display = "flex";
  };
  
  sendBtn.onclick = enviarMensagem;
  chatInput.addEventListener("keypress", (e) => e.key === "Enter" && enviarMensagem());
  
  // Form contato
  const form = document.getElementById("formContato");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("✅ Mensagem enviada! Retornamos em até 24h.");
      form.reset();
    });
  }
  
  // Botão Ver Mais Projetos
  const verMaisBtn = document.getElementById("verMaisBtn");
  const projetosExtras = document.getElementById("projetosExtras");
  if (verMaisBtn) {
    verMaisBtn.addEventListener("click", () => {
      projetosExtras.classList.toggle("d-none");
      verMaisBtn.innerText = projetosExtras.classList.contains("d-none") ? "Ver mais projetos" : "Ver menos projetos";
    });
  }
  
  // Newsletter
  const newsBtn = document.getElementById("newsBtn");
  const newsEmail = document.getElementById("newsEmail");
  if (newsBtn) {
    newsBtn.addEventListener("click", () => {
      if (newsEmail.value.includes("@")) {
        alert("📧 Inscrição confirmada! Agora você receberá tendências e dicas.");
        newsEmail.value = "";
      } else {
        alert("Por favor, digite um e-mail válido.");
      }
    });
  }
  
  // Inicializar AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, once: true, offset: 80 });
  }
});