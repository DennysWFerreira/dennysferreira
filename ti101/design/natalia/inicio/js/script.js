// ==================== IA SUPER INTELIGENTE COM SUGESTÕES ATIVAS ====================

let memoriaConversa = {
  etapa: "inicio"
};

// Respostas com sugestões embutidas
const respostasIA = {
  boasVindas: `👋 Olá! Sou a assistente virtual da **Espaço Essência**.
  
Vou te ajudar com tudo sobre design de interiores! 😊

**O que você gostaria de fazer?**`,

  sugestoesIniciais: [
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
    { texto: "🏠 Ver serviços", acao: "servicos" }
  ],

  sugestaoFinal: [
    { texto: "📞 Quero agendar reunião", acao: "contato" },
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
    { texto: "🏠 Ver serviços", acao: "servicos" }
  ],

  dicaSala: `🛋️ **DICA PARA SALA DE ESTAR**

• Sofá solto no centro (não encostado na parede) cria circulação
• Tapete delimita o espaço e traz aconchego
• Prateleiras flutuantes aproveitam parede vertical
• Luminária de piso em ponto cego completa a iluminação`,

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
• Varandas gourmet`,

  sugestaoPadrao: [
    { texto: "🏠 Serviços", acao: "servicos" },
    { texto: "💡 Dicas", acao: "dicas" },
    { texto: "📸 Ver projetos", acao: "projetos" },
    { texto: "📞 Contato", acao: "contato" }
  ],

  naoEntendi: `🤔 Não entendi completamente...

Escolha uma opção abaixo para continuar:`,

  residencial: `🏡 **PROJETO RESIDENCIAL**

Criamos ambientes planejados para casas e apartamentos.

Incluímos:
• Estudo de layout
• Projeto personalizado
• Iluminação
• Seleção de materiais
• Visualização do ambiente

Quer falar com nossa equipe?`,

  comercial: `🏢 **PROJETO COMERCIAL**

Desenvolvemos espaços funcionais e com identidade.

Incluímos:
• Planejamento estratégico
• Layout comercial
• Experiência do cliente
• Projeto visual completo

Vamos conversar sobre seu espaço?`,

};

// Função para processar ação
function processarAcao(acao, param = null) {
  let resposta = "";
  let sugestoes = [];

  switch (acao) {
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
      sugestoes = [
        { texto: "📞 Entrar em contato", acao: "contato" },
        { texto: "🏠 Voltar aos serviços", acao: "servicos" }
      ];
      break;

    case "comercial":
      resposta = respostasIA.comercial;
      sugestoes = [
        { texto: "📞 Entrar em contato", acao: "contato" },
        { texto: "🏠 Voltar aos serviços", acao: "servicos" }
      ];
      break;

    case "consultoria":
      resposta = `🎨 **CONSULTORIA DE DECORAÇÃO**
      
      Inclui:
      • Visita técnica (ou online)
      • Moodboard personalizado
      • Paleta de cores
      • Lista de compras com sugestões
      
      Prazo médio: 7 a 15 dias.
      
      Quer falar com nossa equipe para conhecer mais?`;

      sugestoes = [
        { texto: "📞 Entrar em contato", acao: "contato" },
        { texto: "🏠 Voltar aos serviços", acao: "servicos" }
      ];

      memoriaConversa.etapa = "finalizando";
      break;

    case "dicas":
      resposta = respostasIA.dicas;
      sugestoes = respostasIA.sugestaoDicas;
      memoriaConversa.etapa = "dicas";
      break;

    case "dica_sala":
      resposta = respostasIA.dicaSala;
      sugestoes = [
        { texto: "📞 Falar com a equipe", acao: "contato" },
        { texto: "💡 Mais dicas", acao: "dicas" }
      ];
      break;

    case "dica_cozinha":
      resposta = respostasIA.dicaCozinha;
      sugestoes = [
        { texto: "📞 Falar com a equipe", acao: "contato" },
        { texto: "💡 Mais dicas", acao: "dicas" }
      ];
      break;

    case "dica_quarto":
      resposta = respostasIA.dicaQuarto;
      sugestoes = [
        { texto: "📞 Falar com a equipe", acao: "contato" },
        { texto: "💡 Mais dicas", acao: "dicas" }
      ];
      break;

    case "contato":
      resposta = respostasIA.contato;
      sugestoes = respostasIA.sugestaoContato;
      memoriaConversa.etapa = "contato";
      break;

    case "humano":
      resposta = respostasIA.humano;
      sugestoes = [
        { texto: "🏠 Serviços", acao: "servicos" },
        { texto: "📞 Contato", acao: "contato" }
      ];
      memoriaConversa.etapa = "finalizando";
      break;

    case "projetos":
      resposta = respostasIA.projetos;
      sugestoes = [
        { texto: "📞 Conversar sobre um projeto", acao: "contato" },
        { texto: "🏠 Voltar aos serviços", acao: "servicos" }
      ];
      break;

    default:
      resposta = respostasIA.naoEntendi;
      sugestoes = respostasIA.sugestaoPadrao;
  }

  return { resposta, sugestoes };
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
    div.innerHTML = (text || "").replace(/\n/g, "<br>");
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

    // Mapear palavras para ações
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
    if (mensagensExistentes.length <= 1) {
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
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      enviarMensagem();
    }
  });

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