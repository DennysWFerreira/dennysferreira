class DesignerChatbot {
    constructor() {
        this.memoria = {
            ambiente: null,
            estilo: null,
            cor: null,
            tamanho: null,
            orcamento: null,
            nome: null,
            prioridade: null,
            comodos: [],
            animaisEstimacao: false,
            criancas: false
        };
        
        this.historico = [];
        this.ultimaPergunta = null;
        
        this.conhecimento = {
            estilos: {
                moderno: {
                    palavras: ["moderno", "contemporâneo", "atual", "clean"],
                    dicas: ["Linhas retas e geométricas", "Cores neutras com um toque vibrante", "Móveis funcionais sem excessos"],
                    moveis: ["Sofá retangular", "Mesa de centro minimalista", "Prateleiras flutuantes"],
                    cores: ["Branco", "Cinza", "Preto", "Toque de amarelo ou azul"]
                },
                rustico: {
                    palavras: ["rústico", "campestre", "natural", "madeira"],
                    dicas: ["Madeira aparente", "Pedras naturais", "Tons terrosos e aconchegantes"],
                    moveis: ["Mesa de madeira maciça", "Cadeira de palha", "Cama com cabeceira de madeira"],
                    cores: ["Marrom", "Terracota", "Verde musgo", "Bege"]
                },
                industrial: {
                    palavras: ["industrial", "loft", "urbano", "concreto"],
                    dicas: ["Tijolo aparente", "Cano aparente", "Iluminação pendente"],
                    moveis: ["Sofá de couro", "Mesa com estrutura metálica", "Prateleiras de ferro"],
                    cores: ["Cinza", "Preto", "Ferrugem", "Branco"]
                },
                escandinavo: {
                    palavras: ["escandinavo", "nórdico", "hygge", "minimalista nórdico"],
                    dicas: ["Madeira clara", "Muito branco", "Texturas aconchegantes"],
                    moveis: ["Móveis funcionais", "Tapete de lã", "Cadeiras de madeira clara"],
                    cores: ["Branco", "Cinza claro", "Azul suave", "Madeira natural"]
                },
                boho: {
                    palavras: ["boho", "boêmio", "descolado", "artístico"],
                    dicas: ["Mistura de estampas", "Plantas penduradas", "Tapetes macios"],
                    moveis: ["Pufes", "Redes", "Móveis de vime"],
                    cores: ["Terracota", "Verde", "Mostarda", "Rosa queimado"]
                },
                luxuoso: {
                    palavras: ["luxuoso", "elegante", "sofisticado", "premium"],
                    dicas: ["Acabamentos nobres", "Iluminação indireta", "Tecidos de alta qualidade"],
                    moveis: ["Móveis estofados", "Cristais", "Espelhos grandes"],
                    cores: ["Dourado", "Azul marinho", "Verde esmeralda", "Preto"]
                }
            },
            
            ambientes: {
                quarto: {
                    essenciais: ["Cama confortável", "Criados-mudos", "Iluminação regulável", "Cortinas blackout"],
                    otimizacao: {
                        pequeno: "Use espelhos e móveis multifuncionais como cama com gavetas",
                        grande: "Crie uma área de leitura com poltrona e luminária"
                    }
                },
                sala: {
                    essenciais: ["Sofá", "Mesa de centro", "Tapete", "TV ou ponto focal"],
                    otimizacao: {
                        pequeno: "Opte por sofá compacto e mesa de centro com nichos",
                        grande: "Divida em zonas (TV, leitura, conversa)"
                    }
                },
                cozinha: {
                    essenciais: ["Bancada de trabalho", "Armários", "Boa circulação", "Iluminação de tarefa"],
                    otimizacao: {
                        pequeno: "Use prateleiras abertas e ganchos para otimizar espaço",
                        grande: "Invista em ilha central com banquetas"
                    }
                },
                banheiro: {
                    essenciais: ["Ventilação", "Impermeabilização", "Armários de banheiro", "Espelho"],
                    otimizacao: {
                        pequeno: "Use box de vidro e prateleiras de canto",
                        grande: "Considere duchas duplas e bancada dupla"
                    }
                },
                escritorio: {
                    essenciais: ["Mesa ergonômica", "Cadeira confortável", "Boa iluminação", "Organização"],
                    otimizacao: {
                        pequeno: "Use mesa dobrável e prateleiras altas",
                        grande: "Crie área de reunião e descanso"
                    }
                }
            },
            
            paletas: {
                relaxante: ["Verde sálvia + Bege + Branco", "Azul petróleo + Areia + Bronze"],
                energizante: ["Amarelo mostarda + Cinza + Preto", "Laranja queimado + Terracota + Branco"],
                elegante: ["Azul marinho + Dourado + Branco", "Verde esmeralda + Preto + Dourado"],
                natural: ["Verde oliva + Marrom + Bege", "Terracota + Areia + Branco"],
                neutro: ["Branco total + Texturas", "Cinza claro + Preto + Madeira"]
            }
        };
    }

    extrairInformacoes(texto) {
        const textoLower = texto.toLowerCase();
        
        // Detectar nome
        const nomeMatch = textoLower.match(/me chamo (\w+)|sou (\w+)|meu nome é (\w+)/i);
        if (nomeMatch) {
            const nome = nomeMatch[1] || nomeMatch[2] || nomeMatch[3];
            if (nome && nome.length > 2) this.memoria.nome = nome.charAt(0).toUpperCase() + nome.slice(1);
        }
        
        // Detectar ambientes
        Object.keys(this.conhecimento.ambientes).forEach(ambiente => {
            if (textoLower.includes(ambiente)) {
                this.memoria.ambiente = ambiente;
                if (!this.memoria.comodos.includes(ambiente)) {
                    this.memoria.comodos.push(ambiente);
                }
            }
        });
        
        // Detectar estilos
        Object.entries(this.conhecimento.estilos).forEach(([estilo, dados]) => {
            if (dados.palavras.some(palavra => textoLower.includes(palavra))) {
                this.memoria.estilo = estilo;
            }
        });
        
        // Detectar cores
        const cores = ["verde", "azul", "bege", "branco", "cinza", "preto", "terracota", "rosa", "amarelo", "roxo", "marrom", "mostarda"];
        cores.forEach(cor => {
            if (textoLower.includes(cor)) this.memoria.cor = cor;
        });
        
        // Detectar tamanho
        if (textoLower.includes("pequeno") || textoLower.includes("compacto")) this.memoria.tamanho = "pequeno";
        if (textoLower.includes("grande") || textoLower.includes("amplo")) this.memoria.tamanho = "grande";
        
        // Detectar orçamento
        if (textoLower.includes("baixo") || textoLower.includes("economizar") || textoLower.includes("barato")) this.memoria.orcamento = "baixo";
        if (textoLower.includes("alto") || textoLower.includes("luxo") || textoLower.includes("sem limites")) this.memoria.orcamento = "alto";
        
        // Detectar prioridade
        if (textoLower.includes("conforto")) this.memoria.prioridade = "conforto";
        if (textoLower.includes("estética") || textoLower.includes("bonito")) this.memoria.prioridade = "estetica";
        if (textoLower.includes("economia") || textoLower.includes("barato")) this.memoria.prioridade = "economia";
        
        // Detectar animais
        if (textoLower.includes("cachorro") || textoLower.includes("gato") || textoLower.includes("pet")) {
            this.memoria.animaisEstimacao = true;
        }
        
        // Detectar crianças
        if (textoLower.includes("criança") || textoLower.includes("bebê") || textoLower.includes("filho")) {
            this.memoria.criancas = true;
        }
    }

    resposta(pergunta) {
        if (!pergunta || pergunta.trim() === "") {
            return "Por favor, digite uma pergunta ou descrição do seu projeto. 😊";
        }
        
        this.extrairInformacoes(pergunta);
        
        // Saudação
        if (pergunta.toLowerCase().match(/^(oi|olá|ola|bom dia|boa tarde|boa noite|e aí|opa|hey)/i)) {
            const nome = this.memoria.nome ? ` ${this.memoria.nome}` : "";
            return `Olá${nome}! 👋 Sou a Aura IA, sua consultora de design de interiores.\n\n✨ **Posso ajudar com:**\n🏠 Ambientes (quarto, sala, cozinha, escritório)\n🎨 Paletas de cores personalizadas\n🛋️ Móveis e disposição\n💡 Dicas de iluminação\n🎯 Estilos decorativos (moderno, rústico, industrial...)\n\n💬 **Qual ambiente você quer transformar hoje?**`;
        }
        
        // Agradecimento
        if (pergunta.toLowerCase().includes("obrigado") || pergunta.toLowerCase().includes("valeu")) {
            return `Por nada${this.memoria.nome ? " " + this.memoria.nome : ""}! 🎉 Fico feliz em ajudar.\n\nSe precisar de mais dicas sobre ${this.memoria.ambiente || "design"}, é só chamar!\n\n🌿 Conte com a Aura Interiores sempre!`;
        }
        
        // Despedida
        if (pergunta.toLowerCase().includes("tchau") || pergunta.toLowerCase().includes("até logo") || pergunta.toLowerCase().includes("bye")) {
            return `Até logo${this.memoria.nome ? " " + this.memoria.nome : ""}! 🏠✨\n\nContinue acompanhando a Aura Interiores para mais inspirações.\n\nSeu lar merece transformação! Volte sempre. 👋`;
        }
        
        // Ajuda
        if (pergunta.toLowerCase().includes("ajuda") || pergunta.toLowerCase().includes("como funciona")) {
            return `🔮 **Como posso te ajudar:**\n\n📝 **Comandos úteis:**\n• Fale o ambiente (ex: "quarto", "sala", "cozinha")\n• Diga seu estilo preferido (moderno, rústico, industrial...)\n• Pergunte sobre cores (ex: "sugira cores para sala")\n• Compartilhe o tamanho (ex: "espaço pequeno")\n• Mencione seu orçamento (ex: "quero algo econômico")\n\n💡 **Exemplos:**\n✓ "Quero um quarto rústico com verde"\n✓ "Sugestões para sala pequena"\n✓ "Paletas de cores relaxantes"\n\nO que você gostaria de saber hoje?`;
        }
        
        // Resposta sobre ambiente específico
        if (this.memoria.ambiente) {
            const dados = this.conhecimento.ambientes[this.memoria.ambiente];
            if (dados) {
                let resposta = `✨ **Dicas para ${this.memoria.ambiente.charAt(0).toUpperCase() + this.memoria.ambiente.slice(1)}** ✨\n\n`;
                resposta += `📌 **Itens essenciais:**\n`;
                dados.essenciais.forEach(item => { resposta += `✓ ${item}\n`; });
                
                if (this.memoria.tamanho) {
                    resposta += `\n📏 **Para espaço ${this.memoria.tamanho === "pequeno" ? "compacto" : "amplo"}:**\n`;
                    resposta += `✓ ${dados.otimizacao[this.memoria.tamanho]}\n`;
                }
                
                if (this.memoria.estilo) {
                    const estiloDados = this.conhecimento.estilos[this.memoria.estilo];
                    if (estiloDados) {
                        resposta += `\n🎨 **Toque ${this.memoria.estilo.charAt(0).toUpperCase() + this.memoria.estilo.slice(1)}:**\n`;
                        resposta += `✓ ${estiloDados.dicas[0]}\n`;
                        resposta += `✓ Cores: ${estiloDados.cores.slice(0,2).join(", ")}\n`;
                    }
                }
                
                if (this.memoria.cor) {
                    resposta += `\n🎨 **Harmonizando com ${this.memoria.cor}:**\n`;
                    resposta += `✓ Use em paredes de destaque ou acessórios\n`;
                    resposta += `✓ Combine com tons neutros (branco, bege, cinza)`;
                }
                
                resposta += `\n\n💡 Quer sugestões específicas de móveis ou uma paleta de cores completa para esse ambiente?`;
                return resposta;
            }
        }
        
        // Resposta sobre estilo
        if (this.memoria.estilo && !this.memoria.ambiente) {
            const dados = this.conhecimento.estilos[this.memoria.estilo];
            if (dados) {
                let estiloNome = this.memoria.estilo.charAt(0).toUpperCase() + this.memoria.estilo.slice(1);
                return `✨ **Estilo ${estiloNome}** ✨\n\n` +
                       `**Características:**\n${dados.dicas.map(d => `✓ ${d}`).join("\n")}\n\n` +
                       `**🛋️ Móveis sugeridos:**\n${dados.moveis.map(m => `✓ ${m}`).join("\n")}\n\n` +
                       `**🎨 Cores principais:**\n${dados.cores.map(c => `✓ ${c}`).join("\n")}\n\n` +
                       `Quer saber como aplicar esse estilo no ${this.memoria.ambiente || "seu ambiente"}? Posso dar mais detalhes! 🎯`;
            }
        }
        
        // Resposta sobre cores
        if (pergunta.toLowerCase().includes("cor") || pergunta.toLowerCase().includes("paleta")) {
            const paletasKeys = Object.keys(this.conhecimento.paletas);
            const paletaAleatoria = paletasKeys[Math.floor(Math.random() * paletasKeys.length)];
            const paletaEscolhida = this.conhecimento.paletas[paletaAleatoria][0];
            
            return `🎨 **Paleta ${paletaAleatoria.toUpperCase()} recomendada** 🎨\n\n` +
                   `✓ ${paletaEscolhida}\n\n` +
                   `**💡 Dicas profissionais:**\n` +
                   `✓ Regra 60-30-10: 60% cor dominante, 30% secundária, 10% destaque\n` +
                   `✓ Cores claras ampliam o ambiente\n` +
                   `✓ Cores escuras trazem aconchego e elegância\n` +
                   `✓ Teste a cor na parede antes de pintar todo o ambiente\n\n` +
                   `Quer uma paleta específica para ${this.memoria.ambiente || "seu ambiente"}? Me diga o estilo que você prefere! 🎯`;
        }
        
        // Resposta sobre móveis
        if (pergunta.toLowerCase().includes("móvel") || pergunta.toLowerCase().includes("sofá") || pergunta.toLowerCase().includes("cama")) {
            return `🛋️ **Dicas de mobiliário** 🛋️\n\n` +
                   `${this.memoria.ambiente ? `Para ${this.memoria.ambiente}:` : "Dicas gerais:"}\n\n` +
                   `✓ **Priorize conforto e funcionalidade**\n` +
                   `✓ **Meça o espaço** antes de comprar qualquer móvel\n` +
                   `✓ **Invista nos itens essenciais primeiro**\n` +
                   `✓ **Deixe circulação mínima de 60cm entre móveis**\n` +
                   (this.memoria.orcamento === "baixo" ? `✓ **Economize:** Compre aos poucos e reforme móveis antigos\n` : "") +
                   (this.memoria.orcamento === "alto" ? `✓ **Premium:** Invista em peças de design e materiais nobres\n` : "") +
                   (this.memoria.animaisEstimacao ? `\n🐾 **Com pets:** Prefira tecidos anti-riscos e cantos arredondados\n` : "") +
                   `\nQuer recomendações específicas de móveis para seu espaço?`;
        }
        
        // Resumo do projeto (quando não tem pergunta específica)
        let resposta = `📋 **Resumo do seu projeto** 📋\n\n`;
        
        resposta += `🏠 **Ambiente:** ${this.memoria.ambiente ? this.memoria.ambiente.charAt(0).toUpperCase() + this.memoria.ambiente.slice(1) : "não definido"}\n`;
        resposta += `✨ **Estilo:** ${this.memoria.estilo ? this.memoria.estilo.charAt(0).toUpperCase() + this.memoria.estilo.slice(1) : "não definido"}\n`;
        resposta += `🎨 **Cor preferida:** ${this.memoria.cor ? this.memoria.cor.charAt(0).toUpperCase() + this.memoria.cor.slice(1) : "não definida"}\n`;
        resposta += `📏 **Tamanho:** ${this.memoria.tamanho ? (this.memoria.tamanho === "pequeno" ? "Compacto" : "Amplo") : "não informado"}\n`;
        resposta += `💰 **Orçamento:** ${this.memoria.orcamento ? (this.memoria.orcamento === "baixo" ? "Econômico 💸" : "Premium ✨") : "não informado"}\n`;
        
        if (this.memoria.prioridade) {
            const prioridades = { conforto: "Conforto máximo", estetica: "Estética e beleza", economia: "Custo-benefício" };
            resposta += `🎯 **Prioridade:** ${prioridades[this.memoria.prioridade] || this.memoria.prioridade}\n`;
        }
        
        resposta += `\n💡 **Próximo passo:**\n`;
        
        if (!this.memoria.ambiente) {
            resposta += `Me diga qual ambiente você quer transformar primeiro! (ex: "quarto", "sala", "cozinha")`;
        } else if (!this.memoria.estilo) {
            resposta += `Qual estilo mais combina com você? (moderno, rústico, industrial, escandinavo, boho, luxuoso)`;
        } else if (!this.memoria.cor) {
            resposta += `Que tipo de paleta de cores você prefere? (relaxante, energizante, elegante, natural)`;
        } else {
            resposta += `✨ Posso criar um moodboard personalizado para você!\n\nQuer sugestões específicas ou um orçamento personalizado?`;
        }
        
        return resposta;
    }
    
    reiniciar() {
        this.memoria = {
            ambiente: null,
            estilo: null,
            cor: null,
            tamanho: null,
            orcamento: null,
            nome: null,
            prioridade: null,
            comodos: [],
            animaisEstimacao: false,
            criancas: false
        };
        this.historico = [];
        return "🔄 **Conversa reiniciada!**\n\nVamos começar do zero. Qual ambiente você quer transformar hoje? 🏠✨";
    }
}

// EXPORTAR PARA USO GLOBAL
window.DesignerChatbot = DesignerChatbot;

// INICIALIZAR O CHAT AUTOMATICAMENTE
document.addEventListener('DOMContentLoaded', function() {
    criarChatInterface();
});

function criarChatInterface() {
    // Verificar se o chat já existe
    if (document.getElementById('chat-ia')) return;
    
    // Criar o HTML do chat
    const chatHTML = `
    <div id="chat-ia" style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 380px;
        height: 550px;
        background: white;
        border-radius: 20px;
        overflow: hidden;
        display: none;
        flex-direction: column;
        box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        z-index: 99999;
        font-family: 'Poppins', sans-serif;
    ">
        <div style="
            background: #2C4A2E;
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        ">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">🤖</span>
                <div>
                    <strong style="font-size: 16px;">Aura IA Designer</strong>
                    <div style="font-size: 11px; opacity: 0.9;">Online • Especialista em interiores</div>
                </div>
            </div>
            <button id="fecharChat" style="
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 5px;
            ">✕</button>
        </div>
        
        <div id="chatMensagens" style="
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #F9F6F0;
            display: flex;
            flex-direction: column;
            gap: 12px;
        "></div>
        
        <div style="
            padding: 15px;
            background: white;
            border-top: 1px solid #E8E2D4;
            display: flex;
            gap: 10px;
        ">
            <input id="chatInput" 
                   type="text" 
                   placeholder="Digite sua pergunta..." 
                   style="
                       flex: 1;
                       padding: 12px;
                       border: 1px solid #D4CCBE;
                       border-radius: 25px;
                       font-family: 'Poppins', sans-serif;
                       outline: none;
                       font-size: 14px;
                   ">
            <button id="enviarChat" style="
                background: #2C4A2E;
                color: white;
                border: none;
                width: 45px;
                height: 45px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 18px;
                transition: transform 0.2s;
            ">➤</button>
        </div>
    </div>
    
    <button id="abrirChat" style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 65px;
        height: 65px;
        background: #2C4A2E;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 99999;
        box-shadow: 0 5px 15px rgba(44,74,46,0.3);
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: white;
    ">
        💬
    </button>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatHTML);
    
    // Configurar eventos
    const abrirBtn = document.getElementById('abrirChat');
    const fecharBtn = document.getElementById('fecharChat');
    const chatDiv = document.getElementById('chat-ia');
    const enviarBtn = document.getElementById('enviarChat');
    const inputField = document.getElementById('chatInput');
    const mensagensDiv = document.getElementById('chatMensagens');
    
    // Inicializar o bot
    const bot = new window.DesignerChatbot();
    
    // Função para adicionar mensagem
    function addMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        
        if (isUser) {
            msgDiv.style.cssText = `
                background: #2C4A2E;
                color: white;
                padding: 12px 15px;
                border-radius: 18px;
                border-top-right-radius: 5px;
                max-width: 85%;
                align-self: flex-end;
                font-size: 14px;
                line-height: 1.5;
                white-space: pre-line;
            `;
            msgDiv.innerHTML = text;
        } else {
            msgDiv.style.cssText = `
                background: #E8F0E6;
                padding: 12px 15px;
                border-radius: 18px;
                border-top-left-radius: 5px;
                max-width: 85%;
                align-self: flex-start;
                color: #1F2F1F;
                font-size: 14px;
                line-height: 1.5;
                white-space: pre-line;
            `;
            msgDiv.innerHTML = `<strong>🤖 Aura:</strong><br>${text}`;
        }
        
        mensagensDiv.appendChild(msgDiv);
        mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
    }
    
    // Mensagem de boas-vindas
    setTimeout(() => {
        addMessage('Olá! 👋 Sou a Aura IA, sua consultora de design de interiores.\n\n✨ **Posso ajudar com:**\n🏠 Ambientes (quarto, sala, cozinha...)\n🎨 Paletas de cores\n🛋️ Móveis e decoração\n💡 Iluminação\n🎯 Estilos decorativos\n\n💬 **Qual ambiente você quer transformar hoje?**');
    }, 500);
    
    // Enviar mensagem
    async function enviarMensagem() {
        const texto = inputField.value.trim();
        if (!texto) return;
        
        addMessage(texto, true);
        inputField.value = '';
        
        // Indicador de digitação
        const loadingDiv = document.createElement('div');
        loadingDiv.style.cssText = `
            background: #E8F0E6;
            padding: 10px 15px;
            border-radius: 18px;
            align-self: flex-start;
            font-size: 13px;
            color: #5B7B5A;
            font-style: italic;
        `;
        loadingDiv.innerHTML = '🤔 Aura está pensando...';
        mensagensDiv.appendChild(loadingDiv);
        mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
        
        setTimeout(() => {
            loadingDiv.remove();
            const resposta = bot.resposta(texto);
            addMessage(resposta);
        }, 600);
    }
    
    // Eventos
    abrirBtn.onclick = () => {
        chatDiv.style.display = 'flex';
        abrirBtn.style.display = 'none';
    };
    
    fecharBtn.onclick = () => {
        chatDiv.style.display = 'none';
        abrirBtn.style.display = 'flex';
    };
    
    enviarBtn.onclick = enviarMensagem;
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') enviarMensagem();
    });
}