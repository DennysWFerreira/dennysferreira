document.addEventListener('DOMContentLoaded', () => {
    // Elementos do menu
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Fechar menu ao clicar em qualquer link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
    
    // ========== SCROLL SUAVE ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === "#" || targetId === "") return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // ========== FADE-IN AO SCROLL ==========
    const fadeElements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    
    fadeElements.forEach(el => observer.observe(el));
    
    // ========== HEADER DINÂMICO ==========
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.style.background = "rgba(5,5,5,0.95)";
            header.style.borderBottomColor = "#00ff88";
        } else {
            header.style.background = "rgba(10,10,10,0.85)";
            header.style.borderBottomColor = "rgba(0,255,0,0.15)";
        }
    });
    
    // ========== NEWSLETTER ==========
    const subscribeBtn = document.getElementById('subscribeBtn');
    const emailInput = document.getElementById('emailInput');
    const msgFeedback = document.getElementById('msgFeedback');
    
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            const emailPattern = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
            
            if (email === "") {
                msgFeedback.style.color = "#ff8888";
                msgFeedback.innerText = "⚠️ Por favor, insira um e-mail válido.";
            } else if (!emailPattern.test(email)) {
                msgFeedback.style.color = "#ff8888";
                msgFeedback.innerText = "❌ E-mail inválido. Use formato nome@exemplo.com";
            } else {
                msgFeedback.style.color = "#00ff88";
                msgFeedback.innerText = "✅ Inscrição confirmada! Você receberá novidades em breve.";
                emailInput.value = "";
                
                subscribeBtn.style.transform = "scale(0.98)";
                setTimeout(() => { 
                    subscribeBtn.style.transform = ""; 
                }, 200);
            }
            
            setTimeout(() => {
                if (msgFeedback.innerText) {
                    msgFeedback.innerText = "";
                }
            }, 3000);
        });
    }
    
    // ========== MODAL DE LOGIN ==========
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    let perfilIcon = document.querySelector('.nav-icons i:nth-child(2)');
    
    function clearMessages() {
        const loginMsg = document.getElementById('loginMessage');
        const registerMsg = document.getElementById('registerMessage');
        if (loginMsg) loginMsg.style.display = 'none';
        if (registerMsg) registerMsg.style.display = 'none';
    }
    
    function showMessage(formType, message, isSuccess) {
        const msgElement = document.getElementById(`${formType}Message`);
        if (msgElement) {
            msgElement.textContent = message;
            msgElement.className = `login-message ${isSuccess ? 'success' : 'error'}`;
            msgElement.style.display = 'block';
            
            if (isSuccess) {
                setTimeout(() => {
                    loginModal.classList.remove('show');
                    document.body.style.overflow = '';
                    clearMessages();
                }, 1500);
            }
        }
    }
    
    function updateProfileIcon(userName) {
        const icon = document.querySelector('.nav-icons i:nth-child(2)');
        if (icon && userName) {
            const initial = userName.charAt(0).toUpperCase();
            icon.innerHTML = `👤 ${initial}`;
            icon.style.fontSize = '0.9rem';
            icon.style.fontWeight = '600';
            icon.style.background = 'rgba(0, 255, 136, 0.1)';
            icon.style.padding = '4px 10px';
            icon.style.borderRadius = '40px';
            icon.style.border = '1px solid #00ff88';
        }
    }
    
    function checkLoggedIn() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userData = localStorage.getItem('userData');
        
        if (isLoggedIn === 'true' && userData) {
            const data = JSON.parse(userData);
            updateProfileIcon(data.name);
        }
    }
    
    // Abrir modal
    if (perfilIcon) {
        perfilIcon.addEventListener('click', () => {
            loginModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            clearMessages();
        });
    }
    
    // Fechar modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            loginModal.classList.remove('show');
            document.body.style.overflow = '';
            clearMessages();
        });
    }
    
    // Fechar ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('show');
            document.body.style.overflow = '';
            clearMessages();
        }
    });
    
    // Tabs
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginTab && registerTab) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            clearMessages();
        });
        
        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
            clearMessages();
        });
    }
    
    // Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                showMessage('login', '❌ Preencha todos os campos.', false);
                return;
            }
            
            if (!email.includes('@')) {
                showMessage('login', '❌ E-mail inválido.', false);
                return;
            }
            
            if (password.length < 4) {
                showMessage('login', '❌ Senha muito curta (mínimo 4 caracteres).', false);
                return;
            }
            
            const userName = email.split('@')[0];
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify({ name: userName, email: email }));
            
            showMessage('login', `✅ Bem-vindo(a) ${userName}!`, true);
            updateProfileIcon(userName);
            
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
        });
    }
    
    // Registro
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            if (!name || !email || !password || !confirmPassword) {
                showMessage('register', '❌ Preencha todos os campos.', false);
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('register', '❌ As senhas não coincidem!', false);
                return;
            }
            
            if (password.length < 6) {
                showMessage('register', '❌ A senha deve ter pelo menos 6 caracteres.', false);
                return;
            }
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify({ name: name, email: email }));
            
            showMessage('register', `✅ Conta criada! Bem-vindo(a) ${name}!`, true);
            updateProfileIcon(name);
            
            document.getElementById('regName').value = '';
            document.getElementById('regEmail').value = '';
            document.getElementById('regPassword').value = '';
            document.getElementById('regConfirmPassword').value = '';
            
            setTimeout(() => loginTab.click(), 1500);
        });
    }
    
    // ESC para fechar
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && loginModal.classList.contains('show')) {
            loginModal.classList.remove('show');
            document.body.style.overflow = '';
            clearMessages();
        }
    });
    
    // Logout com botão direito
    const logoutIcon = document.querySelector('.nav-icons i:nth-child(2)');
    if (logoutIcon) {
        logoutIcon.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (localStorage.getItem('isLoggedIn') === 'true') {
                if (confirm('Deseja sair da sua conta?')) {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userData');
                    
                    logoutIcon.innerHTML = `👤`;
                    logoutIcon.style.fontSize = '1.4rem';
                    logoutIcon.style.background = '';
                    logoutIcon.style.padding = '';
                    logoutIcon.style.borderRadius = '';
                    logoutIcon.style.border = '';
                    
                    alert('✅ Você saiu da sua conta.');
                }
            }
        });
    }
    
    // Social buttons
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showMessage('login', '🔐 Login social em breve! Use e-mail e senha.', false);
        });
    });
    
    // Carrinho
    const cartIcon = document.querySelector('.nav-icons i:last-child');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            alert("🛍️ Seu carrinho está vazio. Explore as coleções!");
        });
    }
    
    // Busca
    const searchIcon = document.querySelector('.nav-icons i:first-child');
    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            alert("🔎 Busca: em breve teremos pesquisa avançada.");
        });
    }
    
    // Botões "Ver Mais"
    const verMaisBtns = document.querySelectorAll('.btn-outline');
    verMaisBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const cardTitle = btn.closest('.card-info')?.querySelector('h3')?.innerText || "Coleção";
            alert(`✨ Em breve: Mais detalhes sobre "${cardTitle}". Fique ligado!`);
        });
    });
    
    checkLoggedIn();
    console.log("🚀 NYX | Site premium carregado com sucesso!");
});