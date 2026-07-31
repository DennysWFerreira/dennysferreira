<?php
session_start();
require_once 'conexao.php';
 
$erro = '';
$sucesso = '';
 
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $razao_social     = trim($_POST['razao_social'] ?? '');
    $nome_fantasia    = trim($_POST['nome_fantasia'] ?? '');
    $cnpj             = preg_replace('/\D/', '', $_POST['cnpj'] ?? '');
    $inscricao_est    = trim($_POST['inscricao_estadual'] ?? '');
    $nome_resp        = trim($_POST['nome_responsavel'] ?? '');
    $cpf_resp         = preg_replace('/\D/', '', $_POST['cpf_responsavel'] ?? '');
    $email            = trim($_POST['email'] ?? '');
    $telefone         = preg_replace('/\D/', '', $_POST['telefone'] ?? '');
    $endereco         = trim($_POST['endereco'] ?? '');
    $cep              = preg_replace('/\D/', '', $_POST['cep'] ?? '');
    $cidade           = trim($_POST['cidade'] ?? '');
    $estado           = trim($_POST['estado'] ?? '');
    $senha            = $_POST['senha'] ?? '';
    $confirma_senha   = $_POST['confirma_senha'] ?? '';
 
    // Validações básicas
    if (empty($razao_social) || empty($cnpj) || empty($nome_resp) || empty($cpf_resp) ||
        empty($email) || empty($telefone) || empty($endereco) || empty($cep) ||
        empty($cidade) || empty($estado) || empty($senha)) {
        $erro = 'Preencha todos os campos obrigatórios.';
    } elseif (strlen($cnpj) !== 14) {
        $erro = 'CNPJ inválido. Verifique e tente novamente.';
    } elseif (strlen($cpf_resp) !== 11) {
        $erro = 'CPF do responsável inválido.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $erro = 'E-mail inválido.';
    } elseif ($senha !== $confirma_senha) {
        $erro = 'As senhas não coincidem.';
    } elseif (strlen($senha) < 8) {
        $erro = 'A senha deve ter no mínimo 8 caracteres.';
    } else {
        // Verifica CNPJ duplicado
        $stmt = mysqli_prepare($conn, "SELECT id FROM usuarios_pj WHERE cnpj = ?");
        mysqli_stmt_bind_param($stmt, 's', $cnpj);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);
 
        if (mysqli_stmt_num_rows($stmt) > 0) {
            $erro = 'Este CNPJ já está cadastrado.';
        } else {
            mysqli_stmt_close($stmt);
 
            $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
 
            $sql = "INSERT INTO usuarios_pj 
                    (razao_social, nome_fantasia, cnpj, inscricao_estadual, responsavel_legal, cpf_responsavel,
                     email_corporativo, telefone, endereco, cep, cidade, estado, senha)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
 
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, 'sssssssssssss',
                $razao_social, $nome_fantasia, $cnpj, $inscricao_est,
                $nome_resp, $cpf_resp, $email, $telefone,
                $endereco, $cep, $cidade, $estado, $senha_hash
            );
 
            if (mysqli_stmt_execute($stmt)) {
                $sucesso = 'Cadastro realizado com sucesso! Você já pode fazer login.';
            } else {
                $erro = 'Erro ao salvar. Tente novamente.';
            }
        }
        mysqli_stmt_close($stmt);
    }
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro Empresarial — Jumbox</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --laranja: #f87d26;
            --azul:    #0d2b4e;
            --claro:   #fff8f3;
        }
 
        * { box-sizing: border-box; margin: 0; padding: 0; }
 
        body {
            font-family: 'DM Sans', sans-serif;
            background: var(--claro);
            min-height: 100vh;
        }
 
        /* ── topo ── */
        .topo {
            background: var(--azul);
            padding: 18px 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .topo img { height: 52px; }
        .topo a {
            color: #fff;
            text-decoration: none;
            font-size: .9rem;
            opacity: .75;
            transition: opacity .2s;
        }
        .topo a:hover { opacity: 1; }
 
        /* ── hero lateral ── */
        .hero-strip {
            background: var(--azul);
            color: #fff;
            padding: 52px 48px 48px;
        }
        .hero-strip h1 {
            font-family: 'Syne', sans-serif;
            font-size: 2rem;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 12px;
        }
        .hero-strip h1 span { color: var(--laranja); }
        .hero-strip p { font-size: .95rem; opacity: .75; max-width: 340px; }
 
        .badge-step {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(248,125,38,.15);
            border: 1px solid rgba(248,125,38,.35);
            border-radius: 100px;
            padding: 4px 14px 4px 6px;
            font-size: .75rem;
            color: var(--laranja);
            font-weight: 600;
            letter-spacing: .04em;
            margin-bottom: 20px;
        }
        .badge-step .dot {
            width: 6px; height: 6px;
            background: var(--laranja);
            border-radius: 50%;
        }
 
        /* ── formulário ── */
        .form-card {
            background: #fff;
            border-radius: 0 0 0 0;
            padding: 48px 48px 56px;
        }
 
        .section-label {
            font-family: 'Syne', sans-serif;
            font-size: .7rem;
            font-weight: 700;
            letter-spacing: .12em;
            text-transform: uppercase;
            color: var(--laranja);
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid #fde8d4;
            display: flex;
            align-items: center;
            gap: 8px;
        }
 
        .form-label {
            font-size: .8rem;
            font-weight: 500;
            color: #444;
            margin-bottom: 5px;
        }
        .form-label .req { color: var(--laranja); }
 
        .form-control, .form-select {
            border: 1.5px solid #e5e5e5;
            border-radius: 10px;
            padding: 10px 14px;
            font-size: .9rem;
            font-family: 'DM Sans', sans-serif;
            transition: border-color .2s, box-shadow .2s;
            background: #fafafa;
        }
        .form-control:focus, .form-select:focus {
            border-color: var(--laranja);
            box-shadow: 0 0 0 3px rgba(248,125,38,.12);
            background: #fff;
            outline: none;
        }
        .form-control.is-invalid { border-color: #dc3545; }
 
        .input-icon-wrap { position: relative; }
        .input-icon-wrap .bi {
            position: absolute;
            left: 13px;
            top: 50%;
            transform: translateY(-50%);
            color: #bbb;
            font-size: .95rem;
            pointer-events: none;
        }
        .input-icon-wrap .form-control,
        .input-icon-wrap .form-select { padding-left: 36px; }
 
        /* toggle senha */
        .pass-wrap { position: relative; }
        .pass-wrap .toggle-pw {
            position: absolute;
            right: 13px;
            top: 50%;
            transform: translateY(-50%);
            border: none;
            background: none;
            color: #aaa;
            cursor: pointer;
            font-size: 1rem;
            padding: 0;
            line-height: 1;
        }
        .pass-wrap .toggle-pw:hover { color: var(--laranja); }
 
        /* força senha */
        .pw-strength { height: 4px; border-radius: 4px; background: #eee; margin-top: 6px; overflow: hidden; }
        .pw-strength-bar { height: 100%; width: 0; border-radius: 4px; transition: width .3s, background .3s; }
 
        /* btn principal */
        .btn-primary-jumbox {
            background: var(--laranja);
            color: #fff;
            border: none;
            border-radius: 12px;
            padding: 14px 32px;
            font-family: 'Syne', sans-serif;
            font-weight: 700;
            font-size: 1rem;
            letter-spacing: .02em;
            width: 100%;
            cursor: pointer;
            transition: background .2s, transform .1s;
        }
        .btn-primary-jumbox:hover { background: #e86d18; }
        .btn-primary-jumbox:active { transform: scale(.98); }
 
        .alert-custom {
            border-radius: 12px;
            font-size: .875rem;
            padding: 12px 16px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .alert-erro  { background: #fef2f2; border: 1px solid #fca5a5; color: #b91c1c; }
        .alert-ok    { background: #f0fdf4; border: 1px solid #86efac; color: #15803d; }
 
        .link-login { font-size: .85rem; text-align: center; margin-top: 20px; color: #777; }
        .link-login a { color: var(--laranja); font-weight: 600; text-decoration: none; }
        .link-login a:hover { text-decoration: underline; }
 
        .cep-btn {
            border: 1.5px solid var(--laranja);
            border-radius: 10px;
            background: transparent;
            color: var(--laranja);
            padding: 9px 14px;
            font-size: .82rem;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
            transition: background .2s, color .2s;
        }
        .cep-btn:hover { background: var(--laranja); color: #fff; }
 
        /* ── layout principal ── */
        .layout-principal {
            display: flex;
            min-height: calc(100vh - 72px);
        }
        .hero-strip {
            width: 380px;
            min-width: 320px;
            flex-shrink: 0;
        }
        .form-card {
            flex: 1;
            overflow-y: auto;
        }
 
        @media (max-width: 900px) {
            .layout-principal { flex-direction: column; }
            .hero-strip { width: 100%; min-width: unset; padding: 32px 22px 28px; }
            .hero-strip .mt-5 { display: none !important; }
            .hero-strip h1 { font-size: 1.5rem; }
            .form-card { padding: 32px 22px 48px; }
        }
    </style>
</head>
<body>
 
<!-- topo -->
<div class="topo">
    <img src="imagens/jumbox.png" alt="Jumbox" style="height:90px;">
    <a href="index.php"><i class="bi bi-arrow-left me-1"></i>Voltar ao site</a>
</div>
 
<div class="layout-principal">
 
        <!-- coluna esquerda: hero -->
        <div class="hero-strip d-flex flex-column justify-content-center">
            <div class="badge-step"><span class="dot"></span>Cadastro Empresarial</div>
            <h1>Sua empresa<br>na <span>Jumbox</span></h1>
            <p class="mt-2">Preencha os dados abaixo para criar sua conta corporativa e começar a fazer pedidos de Jumbos para seus colaboradores ou familiares.</p>
 
            <div class="mt-5 d-flex flex-column gap-3">
                <div class="d-flex align-items-start gap-3">
                    <i class="bi bi-shield-check text-orange" style="color:var(--laranja);font-size:1.2rem;margin-top:2px"></i>
                    <div>
                        <div style="font-size:.85rem;font-weight:600;">Dados protegidos</div>
                        <div style="font-size:.78rem;opacity:.6;">Informações criptografadas e seguras</div>
                    </div>
                </div>
                <div class="d-flex align-items-start gap-3">
                    <i class="bi bi-truck text-orange" style="color:var(--laranja);font-size:1.2rem;margin-top:2px"></i>
                    <div>
                        <div style="font-size:.85rem;font-weight:600;">Entregas rastreadas</div>
                        <div style="font-size:.78rem;opacity:.6;">Acompanhe cada pedido em tempo real</div>
                    </div>
                </div>
                <div class="d-flex align-items-start gap-3">
                    <i class="bi bi-headset text-orange" style="color:var(--laranja);font-size:1.2rem;margin-top:2px"></i>
                    <div>
                        <div style="font-size:.85rem;font-weight:600;">Suporte dedicado</div>
                        <div style="font-size:.78rem;opacity:.6;">Atendimento prioritário para empresas</div>
                    </div>
                </div>
            </div>
        </div>
 
        <!-- coluna direita: formulário -->
        <div class="form-card">
 
            <?php if ($erro): ?>
            <div class="alert-custom alert-erro"><i class="bi bi-exclamation-circle-fill"></i><?= htmlspecialchars($erro) ?></div>
            <?php endif; ?>
 
            <?php if ($sucesso): ?>
            <div class="alert-custom alert-ok"><i class="bi bi-check-circle-fill"></i><?= htmlspecialchars($sucesso) ?></div>
            <?php endif; ?>
 
            <form method="POST" novalidate>
 
                <!-- ── Dados da Empresa ── -->
                <div class="section-label"><i class="bi bi-building"></i> Dados da Empresa</div>
                <div class="row g-3 mb-4">
                    <div class="col-md-7">
                        <label class="form-label">Razão Social <span class="req">*</span></label>
                        <div class="input-icon-wrap">
                            <i class="bi bi-building"></i>
                            <input type="text" class="form-control" name="razao_social"
                                   value="<?= htmlspecialchars($_POST['razao_social'] ?? '') ?>"
                                   placeholder="Nome jurídico da empresa" required>
                        </div>
                    </div>
                    <div class="col-md-5">
                        <label class="form-label">Nome Fantasia</label>
                        <div class="input-icon-wrap">
                            <i class="bi bi-tag"></i>
                            <input type="text" class="form-control" name="nome_fantasia"
                                   value="<?= htmlspecialchars($_POST['nome_fantasia'] ?? '') ?>"
                                   placeholder="Como é conhecida">
                        </div>
                    </div>
                    <div class="col-md-5">
                        <label class="form-label">CNPJ <span class="req">*</span></label>
                        <div class="input-icon-wrap">
                            <i class="bi bi-upc-scan"></i>
                            <input type="text" class="form-control" name="cnpj" id="cnpj"
                                   value="<?= htmlspecialchars($_POST['cnpj'] ?? '') ?>"
                                   placeholder="00.000.000/0000-00" maxlength="18" required>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Inscrição Estadual</label>
                        <div class="input-icon-wrap">
                            <i class="bi bi-file-earmark-text"></i>
                            <input type="text" class="form-control" name="inscricao_estadual"
                                   value="<?= htmlspecialchars($_POST['inscricao_estadual'] ?? '') ?>"
                                   placeholder="Se houver">
                        </div>
                    </div>
                </div>
 
                <!-- ── Responsável Legal ── -->
                <div class="section-label"><i class="bi bi-person-badge"></i> Responsável Legal</div>
                <div class="row g-3 mb-4">
                    <div class="col-md-7">
                        <label class="form-label">Nome do Responsável <span class="req">*</span></label>
                        <div class="input-icon-wrap">
                            <i class="bi bi-person"></i>
                            <input type="text" class="form-control" name="nome_responsavel"
                                   value="<?= htmlspecialchars($_POST['nome_responsavel'] ?? '') ?>"
                                   placeholder="Nome completo" required>
                        </div>
                    </div>
                    <div class="col-md-5">
                        <label class="form-label">CPF do Responsável <span class="req">*</span></label>
                        <div class="input-icon-wrap">
                            <i class="bi bi-credit-card"></i>
                            <input type="text" class="form-control" name="cpf_responsavel" id="cpf_resp"
                                   value="<?= htmlspecialchars($_POST['cpf_responsavel'] ?? '') ?>"
                                   placeholder="000.000.000-00" maxlength="14" required>
                        </div>
                    </div>
                </div>
 
                <!-- ── Contato ── -->
                <div class="section-label"><i class="bi bi-envelope"></i> Contato</div>
                <div class="row g-3 mb-4">
                    <div class="col-md-6">
                        <label class="form-label">E-mail Corporativo <span class="req">*</span></label>
                        <div class="input-icon-wrap">
                            <i class="bi bi-envelope"></i>
                            <input type="email" class="form-control" name="email"
                                   value="<?= htmlspecialchars($_POST['email'] ?? '') ?>"
                                   placeholder="contato@empresa.com.br" required>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Telefone <span class="req">*</span></label>
                        <div class="input-icon-wrap">
                            <i class="bi bi-telephone"></i>
                            <input type="text" class="form-control" name="telefone" id="telefone"
                                   value="<?= htmlspecialchars($_POST['telefone'] ?? '') ?>"
                                   placeholder="(00) 00000-0000" maxlength="15" required>
                        </div>
                    </div>
                </div>
 
                <!-- ── Endereço ── -->
                <div class="section-label"><i class="bi bi-geo-alt"></i> Endereço da Empresa</div>
                <div class="row g-3 mb-4">
                    <div class="col-md-3">
                        <label class="form-label">CEP <span class="req">*</span></label>
                        <div class="d-flex gap-2">
                            <div class="input-icon-wrap flex-grow-1">
                                <i class="bi bi-mailbox"></i>
                                <input type="text" class="form-control" name="cep" id="cep"
                                       value="<?= htmlspecialchars($_POST['cep'] ?? '') ?>"
                                       placeholder="00000-000" maxlength="9" required>
                            </div>
                            <button type="button" class="cep-btn" onclick="buscarCEP()">
                                <i class="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Endereço completo <span class="req">*</span></label>
                        <div class="input-icon-wrap">
                            <i class="bi bi-house"></i>
                            <input type="text" class="form-control" name="endereco" id="endereco"
                                   value="<?= htmlspecialchars($_POST['endereco'] ?? '') ?>"
                                   placeholder="Rua, nº, complemento" required>
                        </div>
                    </div>
                    <div class="col-md-5">
                        <label class="form-label">Cidade <span class="req">*</span></label>
                        <div class="input-icon-wrap">
                            <i class="bi bi-pin-map"></i>
                            <input type="text" class="form-control" name="cidade" id="cidade"
                                   value="<?= htmlspecialchars($_POST['cidade'] ?? '') ?>"
                                   placeholder="Cidade" required>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Estado <span class="req">*</span></label>
                        <select class="form-select" name="estado" id="estado" required>
                            <option value="">UF</option>
                            <?php
                            $ufs = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
                                    'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
                            $sel = $_POST['estado'] ?? '';
                            foreach ($ufs as $uf) {
                                echo "<option value=\"$uf\"" . ($sel === $uf ? ' selected' : '') . ">$uf</option>";
                            }
                            ?>
                        </select>
                    </div>
                </div>
 
                <!-- ── Senha ── -->
                <div class="section-label"><i class="bi bi-lock"></i> Criar Senha de Acesso</div>
                <div class="row g-3 mb-5">
                    <div class="col-md-5">
                        <label class="form-label">Senha <span class="req">*</span></label>
                        <div class="pass-wrap input-icon-wrap">
                            <i class="bi bi-lock"></i>
                            <input type="password" class="form-control" name="senha" id="senha"
                                   placeholder="Mínimo 8 caracteres" required oninput="verificarSenha()">
                            <button type="button" class="toggle-pw" onclick="toggleSenha('senha', this)">
                                <i class="bi bi-eye"></i>
                            </button>
                        </div>
                        <div class="pw-strength mt-2"><div class="pw-strength-bar" id="pwBar"></div></div>
                        <div style="font-size:.72rem;color:#999;margin-top:4px;" id="pwHint"></div>
                    </div>
                    <div class="col-md-5">
                        <label class="form-label">Confirmar Senha <span class="req">*</span></label>
                        <div class="pass-wrap input-icon-wrap">
                            <i class="bi bi-lock-fill"></i>
                            <input type="password" class="form-control" name="confirma_senha" id="confirma_senha"
                                   placeholder="Repita a senha" required>
                            <button type="button" class="toggle-pw" onclick="toggleSenha('confirma_senha', this)">
                                <i class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
 
                <button type="submit" class="btn-primary-jumbox">
                    <i class="bi bi-building-check me-2"></i>Criar Conta Empresarial
                </button>
 
                <p class="link-login mt-3">Já tem conta? <a href="login.php">Entrar agora</a></p>
 
            </form>
    </div><!-- fim form-card -->
</div><!-- fim layout-principal -->
 
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script>
// ── Máscaras ──
function mascara(el, pattern) {
    el.addEventListener('input', function() {
        let v = this.value.replace(/\D/g, '');
        let i = 0;
        this.value = pattern.replace(/#/g, () => v[i++] || '').replace(/[^0-9\s()\-./]+$/, '');
    });
}
mascara(document.getElementById('cnpj'),    '##.###.###/####-##');
mascara(document.getElementById('cpf_resp'),'###.###.###-##');
mascara(document.getElementById('telefone'),'(##) #####-####');
mascara(document.getElementById('cep'),     '#####-###');
 
// ── Busca CEP ──
async function buscarCEP() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    if (cep.length !== 8) { alert('CEP inválido.'); return; }
    try {
        const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const d = await r.json();
        if (d.erro) { alert('CEP não encontrado.'); return; }
        document.getElementById('endereco').value = (d.logradouro ? d.logradouro + ', ' : '') + (d.bairro || '');
        document.getElementById('cidade').value   = d.localidade || '';
        document.getElementById('estado').value   = d.uf || '';
    } catch(e) { alert('Erro ao buscar CEP.'); }
}
document.getElementById('cep').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); buscarCEP(); } });
 
// ── Toggle senha ──
function toggleSenha(id, btn) {
    const el = document.getElementById(id);
    const icon = btn.querySelector('i');
    if (el.type === 'password') {
        el.type = 'text';
        icon.className = 'bi bi-eye-slash';
    } else {
        el.type = 'password';
        icon.className = 'bi bi-eye';
    }
}
 
// ── Força da senha ──
function verificarSenha() {
    const v = document.getElementById('senha').value;
    const bar = document.getElementById('pwBar');
    const hint = document.getElementById('pwHint');
    let score = 0;
    if (v.length >= 8)  score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const levels = [
        { w:'0%',   bg:'#eee',     txt:'' },
        { w:'25%',  bg:'#ef4444',  txt:'Fraca' },
        { w:'50%',  bg:'#f97316',  txt:'Razoável' },
        { w:'75%',  bg:'#eab308',  txt:'Boa' },
        { w:'100%', bg:'#22c55e',  txt:'Excelente' },
    ];
    bar.style.width      = levels[score].w;
    bar.style.background = levels[score].bg;
    hint.textContent     = levels[score].txt;
}
</script>
</body>
</html>
 