// Acalme+ - JavaScript Principal

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema Acalme+ inicializado');
    
    // ================= ELEMENTOS DOM =================
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const modal = document.getElementById('modal-perfil');
    const closeModal = document.querySelector('.close-modal');
    const userIconNav = document.getElementById('user-icon-nav');
    const userNameDisplay = document.getElementById('user-name-display');
    const ctaCadastro = document.getElementById('cta-cadastro');
    
    // Formulários
    const formLogin = document.getElementById('form-login');
    const formCadastro = document.getElementById('form-cadastro');
    const btnLogout = document.getElementById('btn-logout');
    
    // Elementos do perfil
    const perfilNomeSpan = document.getElementById('perfil-nome');
    const perfilEmailSpan = document.getElementById('perfil-email');
    const perfilTelefoneSpan = document.getElementById('perfil-telefone');
    const perfilDataCadastroSpan = document.getElementById('perfil-data-cadastro');
    const perfilTotalRegistrosSpan = document.getElementById('perfil-total-registros');
    
    // Mensagens de erro
    const msgErroLogin = document.getElementById('mensagem-erro-login');
    const msgErroCadastro = document.getElementById('mensagem-erro-cadastro');
    
    // Variáveis de sessão
    let currentUser = null;
    let currentUserData = null;
    let historicoEmocoes = [];
    
    // ================= SISTEMA DE ABAS =================
    function initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const tabId = this.getAttribute('data-tab');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                this.classList.add('active');
                const activeTab = document.getElementById(tabId);
                if (activeTab) activeTab.classList.add('active');
            });
        });
    }
    
    function showTab(tabId) {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        tabContents.forEach(content => {
            if (content.id === tabId) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }
    
    // ================= GERENCIAMENTO DE USUÁRIO =================
    function openProfileModal() {
        if (modal) {
            modal.style.display = 'flex';
            if (currentUser) {
                showTab('perfil-tab');
                loadProfileData();
            } else {
                showTab('login-tab');
            }
        }
    }
    
    function closeProfileModal() {
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    function loadProfileData() {
        if (currentUserData) {
            if (perfilNomeSpan) perfilNomeSpan.innerText = currentUserData.nome || currentUserData.email?.split('@')[0] || 'Usuário';
            if (perfilEmailSpan) perfilEmailSpan.innerText = currentUserData.email || currentUser;
            if (perfilTelefoneSpan) perfilTelefoneSpan.innerText = currentUserData.telefone || 'Não informado';
            if (perfilDataCadastroSpan) perfilDataCadastroSpan.innerText = currentUserData.dataCadastro || new Date().toLocaleDateString('pt-BR');
            
            const allRegistros = JSON.parse(localStorage.getItem(`acalme_historico_${currentUserData.email || currentUser}`)) || [];
            if (perfilTotalRegistrosSpan) perfilTotalRegistrosSpan.innerText = allRegistros.length;
        }
    }
    
    // Login
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const senha = document.getElementById('login-senha').value;
            
            if (!email || !senha) {
                if (msgErroLogin) msgErroLogin.innerText = 'Preencha e-mail e senha.';
                showNotification('Preencha e-mail e senha.', 'error');
                return;
            }
            
            let users = JSON.parse(localStorage.getItem('acalme_users')) || {};
            
            if (users[email] && users[email].senha === senha) {
                currentUser = email;
                currentUserData = users[email];
                currentUserData.email = email;
                localStorage.setItem('acalme_current_user', currentUser);
                localStorage.setItem('acalme_current_user_data', JSON.stringify(currentUserData));
                
                updateUserInterface();
                carregarHistorico();
                loadProfileData();
                
                showNotification(`Bem-vindo(a) de volta, ${currentUserData.nome || email.split('@')[0]}!`, 'success');
                showTab('perfil-tab');
                
                document.getElementById('login-email').value = '';
                document.getElementById('login-senha').value = '';
                if (msgErroLogin) msgErroLogin.innerText = '';
            } else {
                if (msgErroLogin) msgErroLogin.innerText = 'E-mail ou senha incorretos.';
                showNotification('E-mail ou senha incorretos', 'error');
            }
        });
    }
    
    // Cadastro
    if (formCadastro) {
        formCadastro.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = document.getElementById('cad-nome').value.trim();
            const email = document.getElementById('cad-email').value.trim();
            const telefone = document.getElementById('cad-telefone').value.trim();
            const senha = document.getElementById('cad-senha').value;
            const confirmSenha = document.getElementById('cad-confirm-senha').value;
            
            if (!nome || !email || !senha) {
                if (msgErroCadastro) msgErroCadastro.innerText = 'Preencha todos os campos obrigatórios (*).';
                showNotification('Preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            if (senha !== confirmSenha) {
                if (msgErroCadastro) msgErroCadastro.innerText = 'As senhas não conferem.';
                showNotification('As senhas não conferem.', 'error');
                return;
            }
            
            if (senha.length < 6) {
                if (msgErroCadastro) msgErroCadastro.innerText = 'A senha deve ter no mínimo 6 caracteres.';
                showNotification('A senha deve ter no mínimo 6 caracteres.', 'error');
                return;
            }
            
            let users = JSON.parse(localStorage.getItem('acalme_users')) || {};
            
            if (users[email]) {
                if (msgErroCadastro) msgErroCadastro.innerText = 'Este e-mail já está cadastrado. Faça login.';
                showNotification('Este e-mail já está cadastrado.', 'error');
                return;
            }
            
            const newUser = {
                senha: senha,
                nome: nome,
                telefone: telefone || 'Não informado',
                dataCadastro: new Date().toLocaleDateString('pt-BR'),
                criadoEm: new Date().toISOString()
            };
            
            users[email] = newUser;
            localStorage.setItem('acalme_users', JSON.stringify(users));
            
            currentUser = email;
            currentUserData = { ...newUser, email: email };
            localStorage.setItem('acalme_current_user', currentUser);
            localStorage.setItem('acalme_current_user_data', JSON.stringify(currentUserData));
            
            updateUserInterface();
            loadProfileData();
            showNotification(`Cadastro realizado com sucesso! Bem-vindo(a), ${nome}!`, 'success');
            showTab('perfil-tab');
            
            document.getElementById('cad-nome').value = '';
            document.getElementById('cad-email').value = '';
            document.getElementById('cad-telefone').value = '';
            document.getElementById('cad-senha').value = '';
            document.getElementById('cad-confirm-senha').value = '';
            if (msgErroCadastro) msgErroCadastro.innerText = '';
        });
    }
    
    // Logout
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            currentUser = null;
            currentUserData = null;
            localStorage.removeItem('acalme_current_user');
            localStorage.removeItem('acalme_current_user_data');
            
            updateUserInterface();
            showTab('login-tab');
            
            const listaUl = document.getElementById('historico-lista');
            if (listaUl) {
                listaUl.innerHTML = '<li style="text-align: center; padding: 2rem;">Faça login para registrar suas emoções 💙</li>';
            }
            
            showNotification('Você saiu da conta.', 'info');
            closeProfileModal();
        });
    }
    
    function updateUserInterface() {
        if (userNameDisplay) {
            if (currentUser && currentUserData) {
                const displayName = currentUserData.nome || currentUser.split('@')[0];
                userNameDisplay.innerText = displayName.length > 15 ? displayName.substring(0, 12) + '...' : displayName;
            } else {
                userNameDisplay.innerText = 'Perfil';
            }
        }
    }
    
    function initUserSession() {
        const savedUser = localStorage.getItem('acalme_current_user');
        const savedUserData = localStorage.getItem('acalme_current_user_data');
        
        if (savedUser) {
            currentUser = savedUser;
            if (savedUserData) {
                currentUserData = JSON.parse(savedUserData);
            } else {
                let users = JSON.parse(localStorage.getItem('acalme_users')) || {};
                if (users[currentUser]) {
                    currentUserData = { ...users[currentUser], email: currentUser };
                }
            }
            updateUserInterface();
            carregarHistorico();
        }
    }
    
    // ================= NOTIFICAÇÃO =================
    function showNotification(message, type = 'info') {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        
        toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> <span>${message}</span>`;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28A745' : type === 'error' ? '#DC3545' : type === 'warning' ? '#FFC107' : '#17A2B8'};
            color: ${type === 'warning' ? '#000' : 'white'};
            padding: 14px 24px;
            border-radius: 12px;
            z-index: 2000;
            animation: slideIn 0.3s ease;
            font-weight: 500;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: 'Inter', sans-serif;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (toast && toast.remove) toast.remove();
            }, 300);
        }, 3000);
    }
    
    // ================= PROFISSIONAIS =================
    const profissionais = [
        { nome: "Dra. Ana Beatriz", especialidade: "Ansiedade e pânico", bio: "10 anos de experiência em terapia cognitivo-comportamental", fotoIcon: "🧠", disponivel: true, preco: "R$ 150" },
        { nome: "Dr. Carlos Mendez", especialidade: "Terapia cognitiva", bio: "Especialista em mindfulness e redução de estresse", fotoIcon: "📚", disponivel: true, preco: "R$ 180" },
        { nome: "Maísa Lima", especialidade: "Saúde emocional", bio: "Psicóloga humanista focada em acolhimento", fotoIcon: "🌸", disponivel: false, preco: "R$ 120" },
        { nome: "Rodrigo Alves", especialidade: "Depressão e luto", bio: "Atendimento com abordagem existencial", fotoIcon: "🌿", disponivel: true, preco: "R$ 160" },
        { nome: "Dra. Patrícia Souza", especialidade: "Transtornos alimentares", bio: "Doutora em psicologia clínica", fotoIcon: "💜", disponivel: true, preco: "R$ 200" },
        { nome: "Dr. Fernando Rocha", especialidade: "Terapia de casal", bio: "Atendimento a relacionamentos", fotoIcon: "💑", disponivel: true, preco: "R$ 170" }
    ];
    
    function renderProfissionais() {
        const grid = document.getElementById('profissionais-list');
        if (!grid) return;
        grid.innerHTML = '';
        profissionais.forEach(prof => {
            const card = document.createElement('div');
            card.className = 'prof-card';
            card.innerHTML = `
                <div class="prof-foto">${prof.fotoIcon}</div>
                <h3>${prof.nome}</h3>
                <p style="color: var(--primary); font-weight: 500;">${prof.especialidade}</p>
                <p style="font-size: 0.9rem; margin: 0.5rem 0;">${prof.bio}</p>
                <p style="font-weight: bold; color: var(--secondary);">${prof.preco}/consulta</p>
                <span style="display: inline-block; margin: 0.5rem 0; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; background: ${prof.disponivel ? '#28A74520' : '#DC354520'}; color: ${prof.disponivel ? '#28A745' : '#DC3545'}">
                    ${prof.disponivel ? 'Disponível' : 'Indisponível'}
                </span>
                <button class="btn-secundary contato-prof" ${!prof.disponivel ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>${prof.disponivel ? 'Agendar consulta' : 'Em breve'}</button>
            `;
            const btn = card.querySelector('.contato-prof');
            if (btn && prof.disponivel) {
                btn.addEventListener('click', () => {
                    if (currentUser) {
                        showNotification(`Solicitação enviada para ${prof.nome}. Entraremos em contato!`, 'success');
                    } else {
                        showNotification('Faça login para agendar uma consulta', 'error');
                        openProfileModal();
                    }
                });
            }
            grid.appendChild(card);
        });
    }
    
    // ================= REGISTRO EMOCIONAL =================
    function carregarHistorico() {
        if (!currentUser) {
            historicoEmocoes = [];
            atualizarListaHistorico();
            return;
        }
        
        const saved = localStorage.getItem(`acalme_historico_${currentUser}`);
        if (saved) {
            historicoEmocoes = JSON.parse(saved);
        } else {
            historicoEmocoes = [];
        }
        atualizarListaHistorico();
    }
    
    function salvarHistoricoStorage() {
        if (currentUser) {
            localStorage.setItem(`acalme_historico_${currentUser}`, JSON.stringify(historicoEmocoes));
        }
    }
    
    function adicionarRegistro(sentimento, humor) {
        const data = new Date().toLocaleString('pt-BR');
        const novoRegistro = { data, sentimento, humor, id: Date.now() };
        historicoEmocoes.unshift(novoRegistro);
        if (historicoEmocoes.length > 50) historicoEmocoes.pop();
        salvarHistoricoStorage();
        atualizarListaHistorico();
        showNotification('Emoção registrada com sucesso!', 'success');
    }
    
    function atualizarEstatisticas() {
        if (!currentUser) return;
        
        const total = historicoEmocoes.length;
        const totalSpan = document.getElementById('total-registros');
        if (totalSpan) totalSpan.textContent = total;
        
        const umaSemanaAtras = new Date();
        umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);
        const registrosSemana = historicoEmocoes.filter(reg => {
            const dataReg = new Date(reg.data.split(',')[0]);
            return dataReg >= umaSemanaAtras;
        });
        const mediaSpan = document.getElementById('media-semanal');
        if (mediaSpan) mediaSpan.textContent = registrosSemana.length;
        
        const humores = {};
        historicoEmocoes.forEach(reg => {
            const humor = reg.humor;
            humores[humor] = (humores[humor] || 0) + 1;
        });
        let humorDominante = '-';
        let maxCount = 0;
        for (const [humor, count] of Object.entries(humores)) {
            if (count > maxCount) {
                maxCount = count;
                humorDominante = humor;
            }
        }
        const humorSpan = document.getElementById('humor-dominante');
        if (humorSpan) humorSpan.textContent = humorDominante;
    }
    
    function atualizarListaHistorico() {
        const listaUl = document.getElementById('historico-lista');
        if (!listaUl) return;
        
        if (!currentUser) {
            listaUl.innerHTML = '<li style="text-align: center; padding: 2rem;">Faça login para registrar suas emoções 💙</li>';
            return;
        }
        
        if (historicoEmocoes.length === 0) {
            listaUl.innerHTML = '<li style="text-align: center; padding: 2rem;">Nenhum registro ainda. Compartilhe como você está se sentindo! 💙</li>';
            return;
        }
        
        listaUl.innerHTML = '';
        historicoEmocoes.slice(0, 20).forEach(reg => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${reg.data}</strong>
                <span class="historico-humor">${reg.humor}</span>
                <p style="margin-top: 0.5rem; color: var(--gray-700);">"${reg.sentimento.substring(0, 120)}${reg.sentimento.length > 120 ? '...' : ''}"</p>
            `;
            listaUl.appendChild(li);
        });
        
        atualizarEstatisticas();
    }
    
    // Contador de caracteres
    const textarea = document.getElementById('sentimento-texto');
    const charCount = document.getElementById('char-count');
    if (textarea && charCount) {
        textarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }
    
    // Botão limpar
    const btnLimpar = document.getElementById('limpar-form');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', function() {
            if (textarea) textarea.value = '';
            document.querySelectorAll('.mood-option').forEach(o => o.classList.remove('active'));
            if (charCount) charCount.textContent = '0';
            showNotification('Formulário limpo!', 'info');
        });
    }
    
    // Exportar histórico
    const btnExportar = document.getElementById('exportar-historico');
    if (btnExportar) {
        btnExportar.addEventListener('click', function() {
            if (!currentUser) {
                showNotification('Faça login para exportar seu histórico', 'error');
                return;
            }
            
            let csv = "Data,Humor,Sentimento\n";
            historicoEmocoes.forEach(reg => {
                csv += `"${reg.data}","${reg.humor}","${reg.sentimento.replace(/"/g, '""')}"\n`;
            });
            
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', `historico_emocional_${currentUser}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showNotification('Histórico exportado com sucesso!', 'success');
        });
    }
    
    // Mood selector
    document.querySelectorAll('.mood-option').forEach(opt => {
        opt.addEventListener('click', function() {
            document.querySelectorAll('.mood-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Salvar emoção
    const salvarEmocaoBtn = document.getElementById('salvar-emocao');
    if (salvarEmocaoBtn) {
        salvarEmocaoBtn.addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Faça login para registrar suas emoções', 'error');
                openProfileModal();
                return;
            }
            const texto = document.getElementById('sentimento-texto').value.trim();
            let humorSelecionado = '';
            const selected = document.querySelector('.mood-option.active');
            if (selected) {
                humorSelecionado = selected.getAttribute('data-humor');
            } else {
                humorSelecionado = '😊 Feliz';
            }
            if (!texto) {
                showNotification('Escreva como você está se sentindo.', 'error');
                return;
            }
            adicionarRegistro(texto, humorSelecionado);
            if (textarea) textarea.value = '';
            if (charCount) charCount.textContent = '0';
            document.querySelectorAll('.mood-option').forEach(o => o.classList.remove('active'));
        });
    }
    
    // ================= CHAT =================
    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat');
    
    const respostasAutomaticas = [
        "Entendo como se sente. Pode me contar mais? Estou aqui para ouvir. 💙",
        "Obrigado por compartilhar. Como posso te ajudar?",
        "Que bom que você está buscando ajuda! Lembre-se: pedir apoio é sinal de força.",
        "Você não está sozinho(a). Respire fundo por 4 segundos...",
        "Continue conversando, sua saúde mental importa! 🌟",
        "É normal sentir o que você está sentindo. Quer explorar isso juntos?",
        "Que tal fazer uma pausa de 5 minutos e tomar um copo d'água?"
    ];
    
    function addMensagem(texto, isUser = false) {
        if (!chatBox) return;
        const div = document.createElement('div');
        div.className = `chat-message ${isUser ? 'user' : 'bot'}`;
        div.innerHTML = `<span class="chat-name">${isUser ? 'Você' : 'Estagiário Lucas'}</span><p>${texto}</p>`;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    if (sendChatBtn) {
        sendChatBtn.addEventListener('click', function() {
            const msg = chatInput.value.trim();
            if (!msg) return;
            addMensagem(msg, true);
            chatInput.value = '';
            setTimeout(() => {
                const resposta = respostasAutomaticas[Math.floor(Math.random() * respostasAutomaticas.length)];
                addMensagem(resposta, false);
            }, 800);
        });
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendChatBtn.click();
        });
    }
    
    // ================= NEWSLETTER =================
    const btnNewsletter = document.getElementById('btn-newsletter');
    if (btnNewsletter) {
        btnNewsletter.addEventListener('click', function() {
            const email = document.getElementById('newsletter-email').value;
            if (email && email.includes('@')) {
                showNotification('Inscrição realizada com sucesso!', 'success');
                document.getElementById('newsletter-email').value = '';
            } else {
                showNotification('Digite um e-mail válido', 'error');
            }
        });
    }
    
    // ================= SAC MODERN =================
    const sacFormModern = document.getElementById('sac-form-modern');
    if (sacFormModern) {
        sacFormModern.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = document.getElementById('sac-nome-modern').value;
            const email = document.getElementById('sac-email-modern').value;
            const mensagem = document.getElementById('sac-mensagem-modern').value;
            if (nome && email && mensagem) {
                showNotification(`Obrigado ${nome}! Sua mensagem foi enviada.`, 'success');
                sacFormModern.reset();
            } else {
                showNotification('Preencha todos os campos', 'error');
            }
        });
    }
    
    // ================= NAVEGAÇÃO =================
    function showPage(pageId) {
        const profPage = document.getElementById('profissionais-page');
        const chatPage = document.getElementById('chat-page');
        
        if (profPage) profPage.classList.add('hidden');
        if (chatPage) chatPage.classList.add('hidden');
        
        if (pageId === 'profissionais' && profPage) profPage.classList.remove('hidden');
        if (pageId === 'chat' && chatPage) chatPage.classList.remove('hidden');
        
        setTimeout(() => {
            if (pageId === 'profissionais' && profPage) {
                profPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            if (pageId === 'chat' && chatPage) {
                chatPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
    
    const navProfissionais = document.getElementById('nav-profissionais');
    const navChat = document.getElementById('nav-chat');
    
    if (navProfissionais) {
        navProfissionais.addEventListener('click', function(e) {
            e.preventDefault();
            showPage('profissionais');
            if (navMenu) navMenu.classList.remove('active');
        });
    }
    
    if (navChat) {
        navChat.addEventListener('click', function(e) {
            e.preventDefault();
            showPage('chat');
            if (navMenu) navMenu.classList.remove('active');
        });
    }
    
    // Footer links
    const footerProfissionais = document.getElementById('footer-profissionais');
    if (footerProfissionais) {
        footerProfissionais.addEventListener('click', function(e) {
            e.preventDefault();
            showPage('profissionais');
        });
    }
    
    const footerChat = document.getElementById('footer-chat');
    if (footerChat) {
        footerChat.addEventListener('click', function(e) {
            e.preventDefault();
            showPage('chat');
        });
    }
    
    // Recursos
    document.querySelectorAll('.recurso-item').forEach(item => {
        item.addEventListener('click', () => {
            const tipo = item.getAttribute('data-recurso');
            if (tipo === 'profissionais') showPage('profissionais');
            if (tipo === 'chat') showPage('chat');
            if (tipo === 'emocional') {
                const emocionalSection = document.getElementById('emocional-section');
                if (emocionalSection) emocionalSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // ================= MENU MOBILE =================
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => navMenu.classList.toggle('active'));
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
        });
    });
    
    // ================= MODAL HANDLERS =================
    if (closeModal) {
        closeModal.onclick = function() {
            if (modal) modal.style.display = 'none';
        };
    }
    
    window.onclick = function(e) {
        if (e.target === modal && modal) {
            modal.style.display = 'none';
        }
    };
    
    if (userIconNav) {
        userIconNav.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openProfileModal();
        });
    }
    
    if (ctaCadastro) {
        ctaCadastro.addEventListener('click', function(e) {
            e.preventDefault();
            openProfileModal();
        });
    }
    
    // ================= SCROLL ACTIVE MENU =================
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // ================= ANIMAÇÕES =================
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.sobre-card, .recurso-item, .prof-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // ================= INICIALIZAÇÃO =================
    initUserSession();
    initTabs();
    renderProfissionais();
    
    const profPage = document.getElementById('profissionais-page');
    const chatPage = document.getElementById('chat-page');
    if (profPage) profPage.classList.add('hidden');
    if (chatPage) chatPage.classList.add('hidden');
});

// Estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);