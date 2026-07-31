<?php 
session_start(); 
 
if (!isset($_SESSION['carrinho']) || empty($_SESSION['carrinho'])) {
    $_SESSION['carrinho'] = [
        ['nome' => 'Cesta Assistencial Padrão (Teste)', 'preco' => 150.00, 'qtd' => 1]
    ];
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Finalizar Pedido – Jumbox</title>
 
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
 
    <style>
        :root {
            --orange: #f87d26;
            --orange-dark: #d66a1f;
            --blue: #1a4a8e;
            --gray-bg: #e5e5e5;
        }
 
        * { box-sizing: border-box; }
 
        body {
            font-family: 'Nunito', sans-serif;
            background: #f4f4f4;
            min-height: 100vh;
        }
 
        .header-main {
            background-color: var(--gray-bg);
            padding: 18px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .header-main img { height: 70px; }
 
        .checkout-steps {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0;
            margin: 36px auto 32px;
            max-width: 480px;
        }
        .step {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            flex: 1;
            position: relative;
        }
        .step:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 18px;
            left: 60%;
            width: 80%;
            height: 3px;
            background: #ddd;
            z-index: 0;
        }
        .step.done:not(:last-child)::after,
        .step.active:not(:last-child)::after { background: var(--orange); }
        .step-circle {
            width: 36px; height: 36px;
            border-radius: 50%;
            background: #ddd; color: #999;
            display: flex; align-items: center; justify-content: center;
            font-weight: 800; font-size: 15px;
            position: relative; z-index: 1; transition: 0.3s;
        }
        .step.done .step-circle { background: var(--orange); color: #fff; }
        .step.active .step-circle { background: var(--blue); color: #fff; box-shadow: 0 0 0 4px rgba(26,74,142,0.15); }
        .step-label { font-size: 11px; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.5px; }
        .step.active .step-label { color: var(--blue); }
        .step.done .step-label { color: var(--orange); }
 
        .checkout-card {
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
            padding: 32px;
            margin-bottom: 24px;
        }
        .card-section-title {
            font-size: 16px; font-weight: 800; color: var(--blue);
            margin-bottom: 20px; display: flex; align-items: center; gap: 10px;
        }
        .card-section-title i {
            background: var(--orange); color: #fff;
            width: 32px; height: 32px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center; font-size: 15px;
        }
 
        .item-row {
            display: flex; justify-content: space-between; align-items: center;
            padding: 12px 0; border-bottom: 1px solid #f0f0f0;
        }
        .item-row:last-child { border-bottom: none; }
        .item-nome { font-weight: 700; color: #333; font-size: 15px; }
        .item-qtd { font-size: 13px; color: #888; margin-top: 2px; }
        .item-preco { font-weight: 800; color: var(--orange); font-size: 16px; white-space: nowrap; }
        .total-row {
            display: flex; justify-content: space-between; align-items: center;
            padding-top: 18px; margin-top: 8px; border-top: 3px solid var(--orange);
        }
        .total-label { font-size: 18px; font-weight: 800; color: var(--blue); }
        .total-valor { font-size: 24px; font-weight: 800; color: var(--orange); }
 
        .form-label { font-weight: 700; color: #444; font-size: 13px; margin-bottom: 6px; }
        .form-control, .form-select {
            border: 2px solid #e8e8e8; border-radius: 12px;
            padding: 12px 16px; font-family: 'Nunito', sans-serif;
            font-size: 14px; font-weight: 600; transition: 0.2s;
        }
        .form-control:focus, .form-select:focus {
            border-color: var(--orange);
            box-shadow: 0 0 0 3px rgba(248,125,38,0.12); outline: none;
        }
 
        .payment-options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .payment-option {
            border: 2px solid #e8e8e8; border-radius: 14px;
            padding: 16px 12px; cursor: pointer; text-align: center;
            transition: 0.2s; user-select: none;
        }
        .payment-option:hover { border-color: var(--orange); background: #fff8f3; }
        .payment-option.selected { border-color: var(--orange); background: #fff3e8; }
        .payment-option input[type="radio"] { display: none; }
        .payment-icon { font-size: 28px; margin-bottom: 6px; display: block; }
        .payment-label { font-size: 13px; font-weight: 700; color: #444; }
 
        .detento-info {
            background: #fff8f3; border: 2px solid #ffe0c4;
            border-radius: 14px; padding: 16px;
            font-size: 13px; color: #888; margin-top: 8px;
        }
        .detento-info i { color: var(--orange); }
 
        /* PIX BOX */
        .pix-box {
            background: #f0fdf4;
            border: 2px solid #bbf7d0;
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            margin-top: 16px;
            display: none;
        }
        .pix-box.show { display: block; }
        .pix-title {
            font-size: 15px; font-weight: 800; color: #15803d;
            margin-bottom: 16px;
            display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .qr-wrapper {
            display: inline-block;
            background: #fff;
            border-radius: 12px;
            padding: 12px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.1);
            margin-bottom: 16px;
        }
        .qr-wrapper canvas { display: block; }
        .pix-code-label {
            font-size: 12px; font-weight: 700; color: #888;
            text-transform: uppercase; letter-spacing: 0.5px;
            margin-bottom: 8px;
        }
        .pix-code-wrap {
            display: flex; align-items: center; gap: 8px;
            background: #fff; border: 1.5px solid #d1fae5;
            border-radius: 10px; padding: 10px 14px;
        }
        .pix-code {
            font-size: 11px; font-weight: 700; color: #333;
            word-break: break-all; flex: 1; text-align: left;
            font-family: monospace;
        }
        .btn-copiar {
            background: #16a34a; color: #fff; border: none;
            border-radius: 8px; padding: 6px 14px;
            font-size: 12px; font-weight: 700;
            cursor: pointer; transition: 0.2s; white-space: nowrap;
        }
        .btn-copiar:hover { background: #15803d; }
        .btn-copiar.copiado { background: #0d9488; }
        .pix-aviso {
            font-size: 12px; color: #6b7280; margin-top: 12px; font-weight: 600;
        }
 
        .btn-finalizar {
            background: var(--orange); color: #fff; border: none;
            border-radius: 16px; padding: 16px; font-size: 18px; font-weight: 800;
            width: 100%; transition: 0.3s; letter-spacing: 0.3px;
            cursor: pointer; display: block; text-align: center; text-decoration: none;
        }
        .btn-finalizar:hover {
            background: var(--orange-dark); transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(248,125,38,0.3); color: #fff;
        }
        .btn-voltar {
            border: 2px solid #ddd; color: #666; border-radius: 16px;
            padding: 14px; font-size: 15px; font-weight: 700; width: 100%;
            background: transparent; transition: 0.2s; cursor: pointer;
            text-decoration: none; display: block; text-align: center;
        }
        .btn-voltar:hover { border-color: var(--orange); color: var(--orange); }
 
        .seguranca-bar { display: flex; justify-content: center; gap: 24px; margin-top: 20px; flex-wrap: wrap; }
        .seguranca-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #aaa; font-weight: 600; }
        .seguranca-item i { color: var(--orange); font-size: 14px; }
 
        @media (max-width: 576px) {
            .payment-options { grid-template-columns: 1fr 1fr; }
            .checkout-card { padding: 20px; }
        }
    </style>
</head>
<body>
 
<header class="header-main">
    <div class="container d-flex justify-content-between align-items-center">
        <a href="index.php">
            <img src="imagens/jumbox.png" alt="Logotipo Jumbox">
        </a>
        <span style="font-size:15px; font-weight:700; color:#555;">
            <i class="bi bi-lock-fill me-1" style="color:var(--orange)"></i> Checkout Seguro
        </span>
    </div>
</header>
 
<div class="container py-4" style="max-width: 720px;">
 
    <div class="checkout-steps">
        <div class="step done">
            <div class="step-circle"><i class="bi bi-cart-check"></i></div>
            <span class="step-label">Carrinho</span>
        </div>
        <div class="step active">
            <div class="step-circle">2</div>
            <span class="step-label">Pedido</span>
        </div>
        <div class="step">
            <div class="step-circle">3</div>
            <span class="step-label">Confirmação</span>
        </div>
    </div>
 
    <div class="checkout-card">
        <div class="card-section-title">
            <i class="bi bi-receipt"></i>
            Resumo do Pedido
        </div>
 
        <?php
        $total = 0;
        foreach ($_SESSION['carrinho'] as $item):
            $subtotal = $item['preco'] * $item['qtd'];
            $total += $subtotal;
        ?>
        <div class="item-row">
            <div>
                <div class="item-nome"><?= htmlspecialchars($item['nome']) ?></div>
                <div class="item-qtd">Qtd: <?= $item['qtd'] ?> × R$ <?= number_format($item['preco'], 2, ',', '.') ?></div>
            </div>
            <div class="item-preco">R$ <?= number_format($subtotal, 2, ',', '.') ?></div>
        </div>
        <?php endforeach; ?>
 
        <div class="total-row">
            <span class="total-label">Total</span>
            <span class="total-valor">R$ <?= number_format($total, 2, ',', '.') ?></span>
        </div>
    </div>
 
    <form action="processar_pedido.php" method="POST">
 
        <div class="checkout-card">
            <div class="card-section-title">
                <i class="bi bi-person-badge"></i>
                Dados do Destinatário
            </div>
            <div class="mb-3">
                <label class="form-label">Nome completo do detento</label>
                <input type="text" name="nome_detento" class="form-control" placeholder="Ex: João da Silva" required>
            </div>
            <div class="row g-3">
                <div class="col-sm-6">
                    <label class="form-label">Código / Matrícula do detento</label>
                    <input type="text" name="codigo_detento" class="form-control" placeholder="Ex: 123456" required>
                </div>
                <div class="col-sm-6">
                    <label class="form-label">Unidade Prisional</label>
                    <input type="text" name="unidade_prisional" class="form-control" placeholder="Ex: CDP Belém" required>
                </div>
            </div>
            <div class="detento-info mt-3">
                <i class="bi bi-info-circle-fill me-2"></i>
                Esses dados são necessários para garantir que a cesta chegue ao destinatário correto.
            </div>
        </div>
 
        <div class="checkout-card">
            <div class="card-section-title">
                <i class="bi bi-credit-card"></i>
                Forma de Pagamento
            </div>
 
            <div class="payment-options" id="paymentOptions">
                <label class="payment-option selected" onclick="selectPayment(this, 'pix')">
                    <input type="radio" name="pagamento" value="pix" checked>
                    <span class="payment-icon">⚡</span>
                    <span class="payment-label">PIX</span>
                </label>
                <label class="payment-option" onclick="selectPayment(this, 'cartao_credito')">
                    <input type="radio" name="pagamento" value="cartao_credito">
                    <span class="payment-icon">💳</span>
                    <span class="payment-label">Cartão de Crédito</span>
                </label>
                <label class="payment-option" onclick="selectPayment(this, 'cartao_debito')">
                    <input type="radio" name="pagamento" value="cartao_debito">
                    <span class="payment-icon">🏦</span>
                    <span class="payment-label">Cartão de Débito</span>
                </label>
                <label class="payment-option" onclick="selectPayment(this, 'boleto')">
                    <input type="radio" name="pagamento" value="boleto">
                    <span class="payment-icon">📄</span>
                    <span class="payment-label">Boleto</span>
                </label>
            </div>
 
            <!-- INFO PIX COM QR CODE -->
            <div id="info-pix" class="pix-box show">
                <div class="pix-title">
                    <i class="bi bi-lightning-charge-fill"></i>
                    Pague com PIX — rápido e seguro
                </div>
                <div class="qr-wrapper">
                    <img src="imagens/qrcode_pix.png" alt="QR Code PIX Jumbox" width="180" height="180" style="display:block; border-radius:8px;">
                </div>
                <div class="pix-code-label">Código PIX Copia e Cola</div>
                <div class="pix-code-wrap">
                    <span class="pix-code" id="pixCodeText"></span>
                    <button type="button" class="btn-copiar" id="btnCopiar" onclick="copiarPix()">
                        <i class="bi bi-clipboard me-1"></i> Copiar
                    </button>
                </div>
                <div class="pix-aviso">
                    <i class="bi bi-clock me-1"></i> Este código expira em <strong>30 minutos</strong>. Após o pagamento, seu pedido será confirmado automaticamente.
                </div>
            </div>
 
            <div id="info-cartao_credito" class="detento-info mt-3" style="display:none;">
                <i class="bi bi-credit-card-2-front-fill me-2"></i>
                Você será redirecionado para inserir os dados do cartão na próxima etapa.
            </div>
            <div id="info-cartao_debito" class="detento-info mt-3" style="display:none;">
                <i class="bi bi-bank me-2"></i>
                Você será redirecionado para inserir os dados do cartão na próxima etapa.
            </div>
            <div id="info-boleto" class="detento-info mt-3" style="display:none;">
                <i class="bi bi-file-earmark-text-fill me-2"></i>
                O boleto será gerado após a confirmação. Prazo de vencimento: 3 dias úteis.
            </div>
        </div>
 
        <div class="checkout-card">
            <div class="card-section-title">
                <i class="bi bi-chat-left-text"></i>
                Observações (opcional)
            </div>
            <textarea name="observacoes" class="form-control" rows="3" placeholder="Alguma informação adicional sobre o pedido..."></textarea>
        </div>
 
        <button type="submit" class="btn-finalizar mb-3 border-0">
            <i class="bi bi-check-circle-fill me-2"></i>
            Confirmar Pedido · R$ <?= number_format($total, 2, ',', '.') ?>
        </button>
 
        <a href="index.php#cestas" class="btn-voltar mb-4">
            <i class="bi bi-arrow-left me-1"></i> Voltar às Cestas
        </a>
 
        <div class="seguranca-bar">
            <div class="seguranca-item"><i class="bi bi-shield-lock-fill"></i> Dados protegidos</div>
            <div class="seguranca-item"><i class="bi bi-lock-fill"></i> Conexão segura</div>
            <div class="seguranca-item"><i class="bi bi-patch-check-fill"></i> Pedido garantido</div>
        </div>
 
    </form>
</div>
 
<!-- QRCode.js -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
 
// Gera código PIX dinâmico com valor e ID único por transação
function gerarPixDinamico(valor) {
    // ID único da transação (8 chars aleatórios)
    const txid = Math.random().toString(36).substr(2, 8).toUpperCase();
 
    // Valor formatado com 2 casas decimais
    const valorStr = parseFloat(valor).toFixed(2);
    const valorField = '54' + String(valorStr.length).padStart(2, '0') + valorStr;
 
    // Monta o payload PIX
    const chave = 'contato@jumbox.com.br';
    const nome  = 'Jumbox Assistencial';
    const cidade = 'Sao Paulo';
    const txidField = '05' + String(txid.length).padStart(2, '0') + txid;
 
    const merchantInfo = '0014br.gov.bcb.pix' +
        '01' + String(chave.length).padStart(2, '0') + chave +
        '02' + String(nome.length).padStart(2, '0') + nome;
 
    const payload =
        '000201' +
        '26' + String(merchantInfo.length).padStart(2, '0') + merchantInfo +
        '52040000' +
        '5303986' +
        valorField +
        '5802BR' +
        '59' + String(nome.length).padStart(2, '0') + nome +
        '60' + String(cidade.length).padStart(2, '0') + cidade +
        '62' + String((txidField.length + 4).toString().padStart(2, '0')) + '0' + String(txidField.length).padStart(2,'0') + txidField +
        '6304';
 
    // CRC16 fictício baseado no payload (simplificado para demonstração)
    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
        }
    }
    const crcHex = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
 
    return payload + crcHex;
}
 
const totalPedido = <?= number_format($total, 2, '.', '') ?>;
const pixCode = gerarPixDinamico(totalPedido);
document.getElementById('pixCodeText').textContent = pixCode;
 
 
function copiarPix() {
    navigator.clipboard.writeText(pixCode).then(() => {
        const btn = document.getElementById('btnCopiar');
        btn.textContent = '✓ Copiado!';
        btn.classList.add('copiado');
        setTimeout(() => {
            btn.innerHTML = '<i class="bi bi-clipboard me-1"></i> Copiar';
            btn.classList.remove('copiado');
        }, 2500);
    });
}
 
function selectPayment(el, tipo) {
    document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    el.querySelector('input[type="radio"]').checked = true;
 
    // Esconde tudo
    document.getElementById('info-pix').classList.remove('show');
    document.getElementById('info-pix').style.display = 'none';
    ['cartao_credito','cartao_debito','boleto'].forEach(t => {
        const box = document.getElementById('info-' + t);
        if (box) box.style.display = 'none';
    });
 
    // Mostra o certo
    if (tipo === 'pix') {
        document.getElementById('info-pix').style.display = 'block';
        document.getElementById('info-pix').classList.add('show');
    } else {
        const info = document.getElementById('info-' + tipo);
        if (info) info.style.display = 'block';
    }
}
</script>
</body>
</html>