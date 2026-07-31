<?php
session_start();
include_once("conexao.php");
 
$mensagem = "";
 
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
 
    $tipo = $_POST['tipo_cadastro'];
 
    if ($tipo == "pf") {
 
        $nome              = trim($_POST['nome_completo']);
        $cpf               = preg_replace('/[^0-9]/', '', trim($_POST['cpf']));
        $data              = trim($_POST['data_nascimento']);
        $email             = trim($_POST['email']);
        $telefone          = trim($_POST['telefone']);
        $telefone_recado   = trim($_POST['telefone_recado']);
        $endereco          = trim($_POST['endereco']);
        $cep               = trim($_POST['cep']);
        $cidade            = trim($_POST['cidade']);
        $estado            = trim($_POST['estado']);
        $unidade           = trim($_POST['unidade_penitenciaria']);
        $numero_rol        = trim($_POST['numero_rol']);
        $receber_cupons    = isset($_POST['receber_cupons']) ? 1 : 0;
        $acompanhar_status = isset($_POST['acompanhar_status']) ? 1 : 0;
        $senha             = password_hash($_POST['senha'], PASSWORD_DEFAULT);
 
        if (!is_dir("uploads")) mkdir("uploads", 0777, true);
 
        $arquivo_cpf = "";
        if (isset($_FILES['arquivo_cpf']) && $_FILES['arquivo_cpf']['error'] == 0) {
            $arquivo_cpf = time() . "_cpf_" . $_FILES['arquivo_cpf']['name'];
            move_uploaded_file($_FILES['arquivo_cpf']['tmp_name'], "uploads/" . $arquivo_cpf);
        }
 
        $arquivo_rg = "";
        if (isset($_FILES['arquivo_rg']) && $_FILES['arquivo_rg']['error'] == 0) {
            $arquivo_rg = time() . "_rg_" . $_FILES['arquivo_rg']['name'];
            move_uploaded_file($_FILES['arquivo_rg']['tmp_name'], "uploads/" . $arquivo_rg);
        }
 
        $arquivo_carteirinha = "";
        if (isset($_FILES['arquivo_carteirinha']) && $_FILES['arquivo_carteirinha']['error'] == 0) {
            $arquivo_carteirinha = time() . "_carteirinha_" . $_FILES['arquivo_carteirinha']['name'];
            move_uploaded_file($_FILES['arquivo_carteirinha']['tmp_name'], "uploads/" . $arquivo_carteirinha);
        }
 
        $sql = "INSERT INTO usuarios_pf
        (nome_completo, cpf, data_nascimento, email, telefone, telefone_recado,
         endereco, cep, cidade, estado, unidade_penitenciaria, numero_rol,
         arquivo_cpf, arquivo_rg, arquivo_carteirinha, receber_cupons, acompanhar_status, senha)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
 
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "sssssssssssssssiis",
            $nome, $cpf, $data, $email, $telefone, $telefone_recado,
            $endereco, $cep, $cidade, $estado, $unidade, $numero_rol,
            $arquivo_cpf, $arquivo_rg, $arquivo_carteirinha,
            $receber_cupons, $acompanhar_status, $senha
        );
 
        if (mysqli_stmt_execute($stmt)) {
            $_SESSION['usuario_nome'] = $nome;
            header("Location: index.php");
            exit();
        } else {
            $mensagem = "Erro ao cadastrar. Tente novamente.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro — Jumbox</title>
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
        body { font-family: 'DM Sans', sans-serif; background: var(--claro); min-height: 100vh; }
 
        .topo {
            background: var(--azul);
            padding: 18px 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .topo img { height: 90px; }
        .topo a {
            color: #fff; text-decoration: none;
            font-size: .9rem; opacity: .75; transition: opacity .2s;
        }
        .topo a:hover { opacity: 1; }
 
        .layout-principal { display: flex; min-height: calc(100vh - 88px); }
 
        .hero-strip {
            width: 380px; min-width: 320px; flex-shrink: 0;
            background: var(--azul); color: #fff;
            padding: 52px 48px 48px;
            display: flex; flex-direction: column; justify-content: center;
        }
        .hero-strip h1 {
            font-family: 'Syne', sans-serif;
            font-size: 2rem; font-weight: 800; line-height: 1.2; margin-bottom: 12px;
        }
        .hero-strip h1 span { color: var(--laranja); }
        .hero-strip p { font-size: .95rem; opacity: .75; max-width: 340px; }
 
        .badge-step {
            display: inline-flex; align-items: center; gap: 8px;
            background: rgba(248,125,38,.15);
            border: 1px solid rgba(248,125,38,.35);
            border-radius: 100px; padding: 4px 14px 4px 6px;
            font-size: .75rem; color: var(--laranja);
            font-weight: 600; letter-spacing: .04em; margin-bottom: 20px;
        }
        .badge-step .dot { width:6px; height:6px; background:var(--laranja); border-radius:50%; }
 
        .form-card { flex: 1; background: #fff; padding: 48px 48px 56px; overflow-y: auto; }
 
        .section-label {
            font-family: 'Syne', sans-serif;
            font-size: .7rem; font-weight: 700;
            letter-spacing: .12em; text-transform: uppercase;
            color: var(--laranja); margin-bottom: 16px;
            padding-bottom: 8px; border-bottom: 2px solid #fde8d4;
            display: flex; align-items: center; gap: 8px;
        }
 
        .form-label { font-size: .8rem; font-weight: 500; color: #444; margin-bottom: 5px; }
        .form-label .req { color: var(--laranja); }
 
        .form-control, .form-select {
            border: 1.5px solid #e5e5e5; border-radius: 10px;
            padding: 10px 14px; font-size: .9rem;
            font-family: 'DM Sans', sans-serif;
            transition: border-color .2s, box-shadow .2s;
            background: #fafafa;
        }
        .form-control:focus, .form-select:focus {
            border-color: var(--laranja);
            box-shadow: 0 0 0 3px rgba(248,125,38,.12);
            background: #fff; outline: none;
        }
 
        .input-icon-wrap { position: relative; }
        .input-icon-wrap .bi {
            position: absolute; left: 13px; top: 50%;
            transform: translateY(-50%); color: #bbb;
            font-size: .95rem; pointer-events: none;
        }
        .input-icon-wrap .form-control,
        .input-icon-wrap .form-select { padding-left: 36px; }
 
        .upload-box {
            border: 1.5px dashed #e0e0e0; border-radius: 10px;
            padding: 12px 14px; background: #fafafa;
            transition: border-color .2s;
        }
        .upload-box:hover { border-color: var(--laranja); }
        .upload-box input[type="file"] {
            border: none; background: transparent;
            padding: 0; font-size: .85rem;
        }
        .upload-label {
            font-size: .75rem; font-weight: 600;
            color: var(--laranja); letter-spacing: .04em;
            text-transform: uppercase; margin-bottom: 6px;
            display: flex; align-items: center; gap: 6px;
        }
 
        .pass-wrap { position: relative; }
        .pass-wrap .toggle-pw {
            position: absolute; right: 13px; top: 50%;
            transform: translateY(-50%); border: none;
            background: none; color: #aaa; cursor: pointer;
            font-size: 1rem; padding: 0; line-height: 1;
        }
        .pass-wrap .toggle-pw:hover { color: var(--laranja); }
        .pw-strength { height: 4px; border-radius: 4px; background: #eee; margin-top: 6px; overflow: hidden; }
        .pw-strength-bar { height: 100%; width: 0; border-radius: 4px; transition: width .3s, background .3s; }
 
        .cep-btn {
            border: 1.5px solid var(--laranja); border-radius: 10px;
            background: transparent; color: var(--laranja);
            padding: 9px 14px; font-size: .82rem; font-weight: 600;
            cursor: pointer; white-space: nowrap; transition: background .2s, color .2s;
        }
        .cep-btn:hover { background: var(--laranja); color: #fff; }
 
        .form-check-input:checked { background-color: var(--laranja); border-color: var(--laranja); }
        .form-check-label { font-size: .88rem; color: #555; }
 
        .aviso-docs {
            background: #fff8f0; border: 1px solid #fde8d4;
            border-radius: 10px; padding: 12px 16px;
            font-size: .82rem; color: #b45309;
            display: flex; align-items: flex-start; gap: 8px;
        }
 
        .btn-primary-jumbox {
            background: var(--laranja); color: #fff; border: none;
            border-radius: 12px; padding: 14px 32px;
            font-family: 'Syne', sans-serif; font-weight: 700;
            font-size: 1rem; letter-spacing: .02em;
            width: 100%; cursor: pointer; transition: background .2s, transform .1s;
        }
        .btn-primary-jumbox:hover { background: #e86d18; }
        .btn-primary-jumbox:active { transform: scale(.98); }
 
        .alert-erro {
            background: #fef2f2; border: 1px solid #fca5a5; color: #b91c1c;
            border-radius: 12px; padding: 12px 16px; font-size: .875rem;
            display: flex; align-items: center; gap: 10px; margin-bottom: 24px;
        }
        .link-login { font-size: .85rem; text-align: center; margin-top: 20px; color: #777; }
        .link-login a { color: var(--laranja); font-weight: 600; text-decoration: none; }
        .link-login a:hover { text-decoration: underline; }
 
        @media (max-width: 900px) {
            .layout-principal { flex-direction: column; }
            .hero-strip { width: 100%; min-width: unset; padding: 32px 22px 28px; }
            .hero-strip .bullets { display: none; }
            .hero-strip h1 { font-size: 1.5rem; }
            .form-card { padding: 32px 22px 48px; }
        }
    </style>
</head>
<body>
 
<div class="topo">
    <img src="imagens/jumbox.png" alt="Jumbox">
    <a href="index.php"><i class="bi bi-arrow-left me-1"></i>Voltar ao site</a>
</div>
 
<div class="layout-principal">
 
    <div class="hero-strip">
        <div class="badge-step"><span class="dot"></span>Cadastro Pessoal</div>
        <h1>Sua conta<br>na <span>Jumbox</span></h1>
        <p class="mt-2">Preencha os dados abaixo para criar sua conta e comecar a montar Jumbos com cuidado e carinho para quem voce ama.</p>
 
        <div class="mt-5 bullets d-flex flex-column gap-3">
            <div class="d-flex align-items-start gap-3">
                <i class="bi bi-shield-check" style="color:var(--laranja);font-size:1.2rem;margin-top:2px"></i>
                <div>
                    <div style="font-size:.85rem;font-weight:600;">Dados protegidos</div>
                    <div style="font-size:.78rem;opacity:.6;">Informacoes criptografadas e seguras</div>
                </div>
            </div>
            <div class="d-flex align-items-start gap-3">
                <i class="bi bi-truck" style="color:var(--laranja);font-size:1.2rem;margin-top:2px"></i>
                <div>
                    <div style="font-size:.85rem;font-weight:600;">Entregas rastreadas</div>
                    <div style="font-size:.78rem;opacity:.6;">Acompanhe cada pedido em tempo real</div>
                </div>
            </div>
            <div class="d-flex align-items-start gap-3">
                <i class="bi bi-heart" style="color:var(--laranja);font-size:1.2rem;margin-top:2px"></i>
                <div>
                    <div style="font-size:.85rem;font-weight:600;">Feito com carinho</div>
                    <div style="font-size:.78rem;opacity:.6;">Cada Jumbo preparado com atencao</div>
                </div>
            </div>
        </div>
    </div>
 
    <div class="form-card">
 
        <?php if (!empty($mensagem)): ?>
        <div class="alert-erro"><i class="bi bi-exclamation-circle-fill"></i><?= htmlspecialchars($mensagem) ?></div>
        <?php endif; ?>
 
        <form method="POST" enctype="multipart/form-data" novalidate>
            <input type="hidden" name="tipo_cadastro" value="pf">
 
            <div class="section-label"><i class="bi bi-person"></i> Dados Pessoais</div>
            <div class="row g-3 mb-4">
                <div class="col-md-7">
                    <label class="form-label">Nome completo <span class="req">*</span></label>
                    <div class="input-icon-wrap">
                        <i class="bi bi-person"></i>
                        <input type="text" name="nome_completo" class="form-control" placeholder="Seu nome completo" required>
                    </div>
                </div>
                <div class="col-md-5">
                    <label class="form-label">CPF <span class="req">*</span></label>
                    <div class="input-icon-wrap">
                        <i class="bi bi-credit-card"></i>
                        <input type="text" name="cpf" id="cpf" class="form-control" placeholder="000.000.000-00" maxlength="14" required>
                    </div>
                </div>
                <div class="col-md-5">
                    <label class="form-label">Data de nascimento <span class="req">*</span></label>
                    <div class="input-icon-wrap">
                        <i class="bi bi-calendar"></i>
                        <input type="date" name="data_nascimento" class="form-control" required>
                    </div>
                </div>
                <div class="col-md-7">
                    <label class="form-label">E-mail <span class="req">*</span></label>
                    <div class="input-icon-wrap">
                        <i class="bi bi-envelope"></i>
                        <input type="email" name="email" class="form-control" placeholder="seu@email.com" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Telefone <span class="req">*</span></label>
                    <div class="input-icon-wrap">
                        <i class="bi bi-telephone"></i>
                        <input type="text" name="telefone" id="telefone" class="form-control" placeholder="(00) 00000-0000" maxlength="15" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Telefone para recado</label>
                    <div class="input-icon-wrap">
                        <i class="bi bi-telephone-forward"></i>
                        <input type="text" name="telefone_recado" id="telefone_recado" class="form-control" placeholder="(00) 00000-0000" maxlength="15">
                    </div>
                </div>
            </div>
 
            <div class="section-label"><i class="bi bi-geo-alt"></i> Endereco</div>
            <div class="row g-3 mb-4">
                <div class="col-md-3">
                    <label class="form-label">CEP <span class="req">*</span></label>
                    <div class="d-flex gap-2">
                        <div class="input-icon-wrap flex-grow-1">
                            <i class="bi bi-mailbox"></i>
                            <input type="text" name="cep" id="cep" class="form-control" placeholder="00000-000" maxlength="9" required>
                        </div>
                        <button type="button" class="cep-btn" onclick="buscarCEP()"><i class="bi bi-search"></i></button>
                    </div>
                </div>
                <div class="col-md-9">
                    <label class="form-label">Endereco completo <span class="req">*</span></label>
                    <div class="input-icon-wrap">
                        <i class="bi bi-house"></i>
                        <input type="text" name="endereco" id="endereco" class="form-control" placeholder="Rua, no, complemento" required>
                    </div>
                </div>
                <div class="col-md-7">
                    <label class="form-label">Cidade <span class="req">*</span></label>
                    <div class="input-icon-wrap">
                        <i class="bi bi-pin-map"></i>
                        <input type="text" name="cidade" id="cidade" class="form-control" placeholder="Cidade" required>
                    </div>
                </div>
                <div class="col-md-5">
                    <label class="form-label">Estado <span class="req">*</span></label>
                    <div class="input-icon-wrap">
                        <i class="bi bi-map"></i>
                        <input type="text" name="estado" id="estado" class="form-control" placeholder="Estado" required>
                    </div>
                </div>
            </div>
 
            <div class="section-label"><i class="bi bi-building-lock"></i> Dados Penitenciarios</div>
            <div class="row g-3 mb-4">
                <div class="col-md-7">
                    <label class="form-label">Unidade Penitenciaria <span class="req">*</span></label>
                    <div class="input-icon-wrap">
                        <i class="bi bi-building"></i>
                        <input type="text" name="unidade_penitenciaria" class="form-control" placeholder="Nome da unidade" required>
                    </div>
                </div>
                <div class="col-md-5">
                    <label class="form-label">Numero inscricao no ROL <span class="req">*</span></label>
                    <div class="input-icon-wrap">
                        <i class="bi bi-hash"></i>
                        <input type="text" name="numero_rol" class="form-control" placeholder="No de inscricao" required>
                    </div>
                </div>
            </div>
 
            <div class="section-label"><i class="bi bi-file-earmark-text"></i> Documentos</div>
            <div class="aviso-docs mb-3">
                <i class="bi bi-info-circle-fill" style="margin-top:2px;flex-shrink:0;"></i>
                Obs: todos os documentos sao somente para cadastro e envio solicitado para cada unidade penitenciaria.
            </div>
            <div class="row g-3 mb-4">
                <div class="col-md-4">
                    <div class="upload-label"><i class="bi bi-file-person"></i> CPF (PDF/JPG)</div>
                    <div class="upload-box">
                        <input type="file" name="arquivo_cpf" class="form-control" accept=".pdf,.jpg,.jpeg,.png" required>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="upload-label"><i class="bi bi-card-text"></i> RG (PDF/JPG)</div>
                    <div class="upload-box">
                        <input type="file" name="arquivo_rg" class="form-control" accept=".pdf,.jpg,.jpeg,.png" required>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="upload-label"><i class="bi bi-person-badge"></i> Carteirinha de visita</div>
                    <div class="upload-box">
                        <input type="file" name="arquivo_carteirinha" class="form-control" accept=".pdf,.jpg,.jpeg,.png" required>
                    </div>
                </div>
            </div>
 
            <div class="section-label"><i class="bi bi-toggles"></i> Preferencias</div>
            <div class="row g-2 mb-4">
                <div class="col-12">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="receber_cupons" id="cupons">
                        <label class="form-check-label" for="cupons">Gostaria de receber mensagens com cupons e novidades?</label>
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="acompanhar_status" id="status">
                        <label class="form-check-label" for="status">Quero acompanhar o status do meu pedido</label>
                    </div>
                </div>
            </div>
 
            <div class="section-label"><i class="bi bi-lock"></i> Criar Senha de Acesso</div>
            <div class="row g-3 mb-5">
                <div class="col-md-5">
                    <label class="form-label">Senha <span class="req">*</span></label>
                    <div class="pass-wrap input-icon-wrap">
                        <i class="bi bi-lock"></i>
                        <input type="password" name="senha" id="senha" class="form-control"
                               placeholder="Minimo 8 caracteres" minlength="8" required oninput="verificarSenha()">
                        <button type="button" class="toggle-pw" onclick="toggleSenha('senha', this)">
                            <i class="bi bi-eye"></i>
                        </button>
                    </div>
                    <div class="pw-strength mt-2"><div class="pw-strength-bar" id="pwBar"></div></div>
                    <div style="font-size:.72rem;color:#999;margin-top:4px;" id="pwHint"></div>
                </div>
            </div>
 
            <button type="submit" class="btn-primary-jumbox">
                <i class="bi bi-person-check me-2"></i>Finalizar Cadastro
            </button>
 
            <p class="link-login mt-3">Ja tem conta? <a href="login.php">Entrar agora</a></p>
 
        </form>
    </div>
</div>
 
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script>
function mascara(el, fn) {
    el.addEventListener('input', function() {
        let v = this.value.replace(/\D/g, '');
        this.value = fn(v);
    });
}
mascara(document.getElementById('cpf'), v => {
    v = v.slice(0,11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return v;
});
function mascaraTel(id) {
    mascara(document.getElementById(id), v => {
        v = v.slice(0,11);
        v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
        v = v.replace(/(\d)(\d{4})$/, '$1-$2');
        return v;
    });
}
mascaraTel('telefone');
if (document.getElementById('telefone_recado')) mascaraTel('telefone_recado');
 
mascara(document.getElementById('cep'), v => {
    v = v.slice(0,8);
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    return v;
});
 
async function buscarCEP() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    if (cep.length !== 8) { alert('CEP invalido.'); return; }
    try {
        const r = await fetch('https://viacep.com.br/ws/' + cep + '/json/');
        const d = await r.json();
        if (d.erro) { alert('CEP nao encontrado.'); return; }
        document.getElementById('endereco').value = (d.logradouro ? d.logradouro + ', ' : '') + (d.bairro || '');
        document.getElementById('cidade').value   = d.localidade || '';
        document.getElementById('estado').value   = d.uf || '';
    } catch(e) { alert('Erro ao buscar CEP.'); }
}
document.getElementById('cep').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); buscarCEP(); }
});
 
function toggleSenha(id, btn) {
    const el = document.getElementById(id);
    const icon = btn.querySelector('i');
    if (el.type === 'password') { el.type = 'text'; icon.className = 'bi bi-eye-slash'; }
    else { el.type = 'password'; icon.className = 'bi bi-eye'; }
}
 
function verificarSenha() {
    const v = document.getElementById('senha').value;
    const bar = document.getElementById('pwBar');
    const hint = document.getElementById('pwHint');
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const levels = [
        { w:'0%',   bg:'#eee',    txt:'' },
        { w:'25%',  bg:'#ef4444', txt:'Fraca' },
        { w:'50%',  bg:'#f97316', txt:'Razoavel' },
        { w:'75%',  bg:'#eab308', txt:'Boa' },
        { w:'100%', bg:'#22c55e', txt:'Excelente' },
    ];
    bar.style.width      = levels[score].w;
    bar.style.background = levels[score].bg;
    hint.textContent     = levels[score].txt;
}
</script>
</body>
</html>
 