<?php
session_start();
require_once "conexao.php";
// Redireciona se não estiver logado
if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.php?redirect=meus_pedidos.php");
    exit();
}
$usuario_id   = $_SESSION['usuario_id'];
$usuario_nome = $_SESSION['usuario_nome'];
// Busca todos os pedidos do usuário logado, do mais recente ao mais antigo
$sql = "SELECT id, nome_detento, codigo_detento, unidade_prisional, itens_json, total, pagamento, observacoes, status, created_at
        FROM pedidos
        WHERE usuario_id = ?
        ORDER BY created_at DESC";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $usuario_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$pedidos = [];
while ($row = mysqli_fetch_assoc($result)) {
    $row['itens'] = json_decode($row['itens_json'], true);
    $pedidos[] = $row;
}
// Mapeamento de status para label/cor
function statusInfo($status) {
    return match($status) {
        'pendente'   => ['label' => 'Confirmado', 'color' => '#10b981', 'bg' => '#ecfdf5', 'icon' => 'bi-check-circle-fill'],
        'confirmado' => ['label' => 'Confirmado', 'color' => '#3b82f6', 'bg' => '#eff6ff', 'icon' => 'bi-check-circle'],
        'em_preparo' => ['label' => 'Em Preparo', 'color' => '#8b5cf6', 'bg' => '#f5f3ff', 'icon' => 'bi-box-seam'],
        'entregue'   => ['label' => 'Entregue',   'color' => '#10b981', 'bg' => '#ecfdf5', 'icon' => 'bi-bag-check-fill'],
        'cancelado'  => ['label' => 'Cancelado',  'color' => '#ef4444', 'bg' => '#fef2f2', 'icon' => 'bi-x-circle'],
        default      => ['label' => ucfirst($status), 'color' => '#6b7280', 'bg' => '#f9fafb', 'icon' => 'bi-question-circle'],
    };
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Meus Pedidos – Jumbox</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
        :root {
            --orange:      #f87d26;
            --orange-dark: #d66a1f;
            --orange-soft: #fff3e8;
            --blue:        #1a4a8e;
            --blue-light:  #e8f0fb;
            --gray-bg:     #e5e5e5;
        }
        * { box-sizing: border-box; }
        body {
            font-family: 'Nunito', sans-serif;
            background: #f0f2f5;
            min-height: 100vh;
        }
        /* HEADER */
        .header-main {
            background-color: var(--gray-bg);
            padding: 14px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .header-main img { height: 70px; }
        /* PAGE HERO */
        .page-hero {
            background: linear-gradient(135deg, var(--blue) 0%, #0d2b5e 100%);
            padding: 48px 0 60px;
            position: relative;
            overflow: hidden;
        }
        .page-hero::before {
            content: '';
            position: absolute;
            top: -60px; right: -60px;
            width: 280px; height: 280px;
            border-radius: 50%;
            background: rgba(248,125,38,0.12);
        }
        .page-hero::after {
            content: '';
            position: absolute;
            bottom: -80px; left: -40px;
            width: 220px; height: 220px;
            border-radius: 50%;
            background: rgba(255,255,255,0.05);
        }
        .hero-heart {
            font-size: 52px;
            color: var(--orange);
            filter: drop-shadow(0 4px 12px rgba(248,125,38,0.4));
            animation: pulse-heart 2s ease-in-out infinite;
        }
        @keyframes pulse-heart {
            0%, 100% { transform: scale(1); }
            50%       { transform: scale(1.12); }
        }
        .hero-title {
            color: #fff;
            font-size: 2rem;
            font-weight: 900;
            margin: 12px 0 6px;
        }
        .hero-subtitle {
            color: rgba(255,255,255,0.7);
            font-size: 1rem;
            font-weight: 600;
        }
        .hero-stats {
            display: flex;
            gap: 24px;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        .stat-pill {
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.18);
            border-radius: 50px;
            padding: 6px 18px;
            color: #fff;
            font-size: 13px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
            backdrop-filter: blur(4px);
        }
        .stat-pill i { color: var(--orange); }
        /* CONTENT AREA */
        .content-wrap {
            margin-top: -28px;
            padding-bottom: 60px;
            position: relative;
            z-index: 2;
        }
        /* FILTRO TABS */
        .filter-bar {
            background: #fff;
            border-radius: 16px;
            padding: 6px;
            display: flex;
            gap: 4px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.08);
            overflow-x: auto;
            margin-bottom: 24px;
        }
        .filter-bar::-webkit-scrollbar { display: none; }
        .filter-tab {
            border: none;
            background: transparent;
            border-radius: 12px;
            padding: 8px 18px;
            font-family: 'Nunito', sans-serif;
            font-weight: 700;
            font-size: 13px;
            color: #888;
            cursor: pointer;
            transition: 0.2s;
            white-space: nowrap;
        }
        .filter-tab:hover { background: #f5f5f5; color: #333; }
        .filter-tab.active {
            background: var(--orange);
            color: #fff;
            box-shadow: 0 2px 8px rgba(248,125,38,0.3);
        }
        /* CARD DE PEDIDO */
        .pedido-card {
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 2px 16px rgba(0,0,0,0.07);
            margin-bottom: 20px;
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
            border: 1px solid rgba(0,0,0,0.04);
        }
        .pedido-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }
        .card-header-custom {
            padding: 18px 24px 14px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 10px;
            border-bottom: 1px solid #f0f0f0;
        }
        .pedido-id {
            font-size: 13px;
            font-weight: 800;
            color: var(--blue);
            letter-spacing: 0.5px;
        }
        .pedido-data {
            font-size: 12px;
            color: #aaa;
            font-weight: 600;
            margin-top: 3px;
        }
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            border-radius: 50px;
            padding: 5px 14px;
            font-size: 12px;
            font-weight: 800;
        }
        .card-body-custom { padding: 20px 24px; }
        /* DESTINATÁRIO */
        .destinatario-box {
            background: var(--blue-light);
            border-radius: 12px;
            padding: 14px 16px;
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 16px;
        }
        .dest-icon {
            width: 44px;
            height: 44px;
            background: var(--blue);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 18px;
            flex-shrink: 0;
        }
        .dest-nome  { font-weight: 800; color: var(--blue); font-size: 15px; }
        .dest-info  { font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px; }
        /* ITENS */
        .itens-label {
            font-size: 12px;
            font-weight: 800;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 10px;
        }
        .item-chip {
            display: inline-flex;
            align-items: center;
            background: #f5f5f5;
            border-radius: 50px;
            padding: 4px 12px;
            font-size: 12px;
            font-weight: 700;
            color: #555;
            margin: 3px;
        }
        .item-chip .qtd-dot {
            background: var(--orange);
            color: #fff;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 800;
            margin-right: 6px;
        }
        /* CARD FOOTER */
        .card-footer-custom {
            padding: 14px 24px;
            background: #fafafa;
            border-top: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
        }
        .pagamento-info {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #777;
            font-weight: 600;
        }
        .pagamento-info i { color: var(--orange); }
        .total-valor {
            font-size: 22px;
            font-weight: 900;
            color: var(--orange);
        }
        .total-label {
            font-size: 11px;
            font-weight: 700;
            color: #aaa;
            text-align: right;
        }
        /* OBSERVAÇÃO */
        .obs-box {
            background: #fffbf5;
            border-left: 3px solid var(--orange);
            border-radius: 0 8px 8px 0;
            padding: 10px 14px;
            font-size: 13px;
            color: #888;
            font-weight: 600;
            margin-top: 14px;
        }
        /* ESTADO VAZIO */
        .empty-state {
            text-align: center;
            padding: 80px 20px;
        }
        .empty-heart {
            font-size: 72px;
            color: #e0e0e0;
            margin-bottom: 16px;
            display: block;
        }
        .empty-title {
            font-size: 1.4rem;
            font-weight: 800;
            color: #ccc;
            margin-bottom: 8px;
        }
        .empty-sub {
            font-size: 15px;
            color: #bbb;
            margin-bottom: 28px;
        }
        .btn-ir-cestas {
            background: var(--orange);
            color: #fff;
            border-radius: 14px;
            padding: 14px 32px;
            font-weight: 800;
            font-size: 15px;
            text-decoration: none;
            transition: 0.2s;
            display: inline-block;
        }
        .btn-ir-cestas:hover {
            background: var(--orange-dark);
            color: #fff;
            transform: translateY(-2px);
        }
        /* ACCORDION itens (toggle) */
        .toggle-itens {
            background: none;
            border: 1.5px solid #e8e8e8;
            border-radius: 10px;
            padding: 5px 14px;
            font-family: 'Nunito', sans-serif;
            font-size: 12px;
            font-weight: 700;
            color: #888;
            cursor: pointer;
            transition: 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .toggle-itens:hover { border-color: var(--orange); color: var(--orange); }
        @media (max-width: 576px) {
            .hero-title { font-size: 1.5rem; }
            .card-header-custom { flex-direction: column; }
            .card-footer-custom { flex-direction: column; align-items: flex-start; }
        }
</style>
</head>
<body>
<!-- HEADER -->
<header class="header-main">
<div class="container d-flex justify-content-between align-items-center">
<a href="index.php">
<img src="imagens/jumbox.png" alt="Logotipo Jumbox">
</a>
<div class="d-flex align-items-center gap-3">
<span class="fw-bold text-dark" style="font-size:15px;">
<i class="bi bi-person-circle me-1" style="color:var(--orange)"></i>
<?= htmlspecialchars($usuario_nome) ?>
</span>
<a href="logout.php" class="btn btn-outline-danger btn-sm rounded-pill px-3">Sair</a>
</div>
</div>
</header>
<!-- HERO -->
<div class="page-hero">
<div class="container" style="position:relative; z-index:1;">
<i class="bi bi-box-seam-fill hero-heart"></i>
<h1 class="hero-title">Meus Pedidos</h1>
<p class="hero-subtitle">Acompanhe todas as suas cestas com carinho</p>
<div class="hero-stats">
<div class="stat-pill">
<i class="bi bi-box-seam-fill"></i>
<?= count($pedidos) ?> pedido<?= count($pedidos) != 1 ? 's' : '' ?> realizad<?= count($pedidos) != 1 ? 'os' : 'o' ?>
</div>
<?php
            $total_gasto = array_sum(array_column($pedidos, 'total'));
            if ($total_gasto > 0):
            ?>
<div class="stat-pill">
<i class="bi bi-currency-dollar"></i>
                R$ <?= number_format($total_gasto, 2, ',', '.') ?> investido em amor
</div>
<?php endif; ?>
</div>
</div>
</div>
<!-- CONTEÚDO -->
<div class="content-wrap">
<div class="container" style="max-width:800px;">
<?php if (empty($pedidos)): ?>
<!-- ESTADO VAZIO -->
<div class="empty-state">
<i class="bi bi-box-seam empty-heart"></i>
<div class="empty-title">Nenhum pedido ainda</div>
<div class="empty-sub">Que tal enviar sua primeira cesta com carinho?</div>
<a href="index.php#cestas" class="btn-ir-cestas">
<i class="bi bi-basket me-2"></i> Ver Nossas Cestas
</a>
</div>
<?php else: ?>
<!-- FILTRO -->
<div class="filter-bar" id="filterBar">
<button class="filter-tab active" data-filter="todos" onclick="filtrar(this, 'todos')">
                Todos (<?= count($pedidos) ?>)
</button>
<?php
            $status_counts = array_count_values(array_column($pedidos, 'status'));
            foreach ($status_counts as $st => $cnt):
                $info = statusInfo($st);
            ?>
<button class="filter-tab" data-filter="<?= $st ?>" onclick="filtrar(this, '<?= $st ?>')">
<?= $info['label'] ?> (<?= $cnt ?>)
</button>
<?php endforeach; ?>
</div>
<!-- LISTA DE PEDIDOS -->
<div id="listaPedidos">
<?php foreach ($pedidos as $pedido):
            $info    = statusInfo($pedido['status']);
            $itens   = $pedido['itens'] ?? [];
            $data_fmt = isset($pedido['created_at'])
                ? date('d/m/Y \à\s H:i', strtotime($pedido['created_at']))
                : '—';
            $pagamento_label = match($pedido['pagamento']) {
                'pix'            => ['PIX',            'bi-lightning-charge-fill'],
                'cartao_credito' => ['Cartão de Crédito','bi-credit-card-2-front-fill'],
                'cartao_debito'  => ['Cartão de Débito', 'bi-bank'],
                'boleto'         => ['Boleto',           'bi-file-earmark-text-fill'],
                default          => [ucfirst($pedido['pagamento']), 'bi-cash'],
            };
        ?>
<div class="pedido-card" data-status="<?= $pedido['status'] ?>">
<!-- CABEÇALHO -->
<div class="card-header-custom">
<div>
<div class="pedido-id"><i class="bi bi-hash"></i><?= $pedido['id'] ?> · Jumbox</div>
<div class="pedido-data"><i class="bi bi-calendar3 me-1"></i><?= $data_fmt ?></div>
</div>
<span class="status-badge"
                      style="color:<?= $info['color'] ?>; background:<?= $info['bg'] ?>;">
<i class="bi <?= $info['icon'] ?>"></i>
<?= $info['label'] ?>
</span>
</div>
<!-- CORPO -->
<div class="card-body-custom">
<!-- DESTINATÁRIO -->
<div class="destinatario-box">
<div class="dest-icon"><i class="bi bi-person-badge-fill"></i></div>
<div>
<div class="dest-nome"><?= htmlspecialchars($pedido['nome_detento']) ?></div>
<div class="dest-info">
<i class="bi bi-tag-fill me-1"></i> Matrícula: <?= htmlspecialchars($pedido['codigo_detento']) ?>
&nbsp;·&nbsp;
<i class="bi bi-building me-1"></i> <?= htmlspecialchars($pedido['unidade_prisional']) ?>
</div>
</div>
</div>
<!-- ITENS -->
<?php if (!empty($itens)): ?>
<div class="itens-label"><i class="bi bi-basket3 me-1"></i> Itens da cesta</div>
<div class="itens-wrap" id="itens_<?= $pedido['id'] ?>">
<?php foreach ($itens as $item):
                        $nome_item = htmlspecialchars($item['nome']);
                        $qtd_item  = intval($item['qtd']);
                    ?>
<span class="item-chip">
<span class="qtd-dot"><?= $qtd_item ?></span>
<?= $nome_item ?>
</span>
<?php endforeach; ?>
</div>
<?php endif; ?>
<!-- OBSERVAÇÕES -->
<?php if (!empty($pedido['observacoes'])): ?>
<div class="obs-box">
<i class="bi bi-chat-left-quote me-2" style="color:var(--orange)"></i>
<?= htmlspecialchars($pedido['observacoes']) ?>
</div>
<?php endif; ?>
</div>
<!-- RODAPÉ -->
<div class="card-footer-custom">
<div class="pagamento-info">
<i class="bi <?= $pagamento_label[1] ?>"></i>
<?= $pagamento_label[0] ?>
</div>
<div class="text-end">
<div class="total-label">Total pago</div>
<div class="total-valor">R$ <?= number_format($pedido['total'], 2, ',', '.') ?></div>
</div>
</div>
</div>
<?php endforeach; ?>
</div><!-- /listaPedidos -->
<?php endif; ?>
<!-- VOLTAR -->
<div class="text-center mt-4">
<a href="index.php" style="color:#aaa; font-weight:700; font-size:14px; text-decoration:none;">
<i class="bi bi-arrow-left me-1"></i> Voltar ao início
</a>
</div>
</div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
function filtrar(btn, filtro) {
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.pedido-card').forEach(card => {
        if (filtro === 'todos' || card.dataset.status === filtro) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
</script>
</body>
</html>         