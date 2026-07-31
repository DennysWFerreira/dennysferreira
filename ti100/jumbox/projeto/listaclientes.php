<?php
session_start();
 
if (!isset($_SESSION["funcionario_logado"])) {
    header("Location: login_funcionario.php");
    exit();
}
 
include_once("conexao.php");
 
$sql_usuarios = "SELECT * FROM usuarios_pf ORDER BY id DESC";
$resultado_usuarios = mysqli_query($conn, $sql_usuarios);
 
$sql_pedidos = "SELECT p.*, u.nome_completo as nome_cliente_cadastro
                FROM pedidos p
                LEFT JOIN usuarios_pf u ON p.usuario_id = u.id
                ORDER BY p.id DESC";
$resultado_pedidos = mysqli_query($conn, $sql_pedidos);
 
$total_usuarios = mysqli_num_rows($resultado_usuarios);
 
$resultado_pedidos_count = mysqli_query($conn, "SELECT COUNT(*) as total FROM pedidos");
$row_count = mysqli_fetch_assoc($resultado_pedidos_count);
$total_pedidos = $row_count['total'];
 
$resultado_valor = mysqli_query($conn, "SELECT SUM(total) as soma FROM pedidos");
$row_valor = mysqli_fetch_assoc($resultado_valor);
$total_valor = $row_valor['soma'] ?? 0;
 
// Reexecuta para usar nos loops
$resultado_usuarios = mysqli_query($conn, $sql_usuarios);
$resultado_pedidos  = mysqli_query($conn, $sql_pedidos);
 
function statusBadge($status) {
    return '<span class="badge" style="background:#10b981">Confirmado</span>';
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel Admin – Jumbox</title>
 
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
 
    <style>
        :root {
            --orange: #f87d26;
            --orange-dark: #d66a1f;
            --blue: #1a4a8e;
            --blue-dark: #0d2b5e;
            --sidebar-w: 240px;
        }
 
        * { box-sizing: border-box; margin: 0; padding: 0; }
 
        body {
            font-family: 'Nunito', sans-serif;
            background: #f0f2f5;
            min-height: 100vh;
        }
 
        /* SIDEBAR */
        .sidebar {
            position: fixed;
            top: 0; left: 0;
            width: var(--sidebar-w);
            height: 100vh;
            background: linear-gradient(180deg, var(--blue-dark) 0%, var(--blue) 100%);
            display: flex;
            flex-direction: column;
            z-index: 100;
            box-shadow: 4px 0 20px rgba(0,0,0,0.15);
        }
        .sidebar-logo {
            padding: 24px 20px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            text-align: center;
        }
        .sidebar-logo img { height: 60px; }
        .sidebar-label {
            font-size: 10px;
            font-weight: 800;
            color: rgba(255,255,255,0.4);
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 20px 20px 8px;
        }
        .nav-item-admin {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            color: rgba(255,255,255,0.7);
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            transition: 0.2s;
            border-left: 3px solid transparent;
            text-decoration: none;
        }
        .nav-item-admin:hover {
            background: rgba(255,255,255,0.08);
            color: #fff;
        }
        .nav-item-admin.active {
            background: rgba(248,125,38,0.15);
            color: #fff;
            border-left-color: var(--orange);
        }
        .nav-item-admin i { font-size: 18px; width: 22px; text-align: center; }
        .sidebar-footer {
            margin-top: auto;
            padding: 20px;
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        .btn-sair {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(239,68,68,0.15);
            border: 1px solid rgba(239,68,68,0.3);
            color: #fca5a5;
            border-radius: 10px;
            padding: 10px 16px;
            font-family: 'Nunito', sans-serif;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            transition: 0.2s;
            text-decoration: none;
            width: 100%;
        }
        .btn-sair:hover { background: rgba(239,68,68,0.3); color: #fff; }
 
        /* MAIN */
        .main-content {
            margin-left: var(--sidebar-w);
            padding: 32px;
            min-height: 100vh;
        }
 
        /* TOPBAR */
        .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 28px;
        }
        .page-title {
            font-size: 1.6rem;
            font-weight: 900;
            color: var(--blue);
        }
        .admin-badge {
            background: var(--orange);
            color: #fff;
            border-radius: 50px;
            padding: 6px 16px;
            font-size: 13px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 8px;
        }
 
        /* STATS */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 28px;
        }
        .stat-card {
            background: #fff;
            border-radius: 16px;
            padding: 22px 24px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .stat-icon {
            width: 52px; height: 52px;
            border-radius: 14px;
            display: flex; align-items: center; justify-content: center;
            font-size: 22px;
            flex-shrink: 0;
        }
        .stat-num { font-size: 1.8rem; font-weight: 900; color: var(--blue); line-height: 1; }
        .stat-lbl { font-size: 13px; font-weight: 700; color: #888; margin-top: 4px; }
 
        /* TABS */
        .tab-nav {
            display: flex;
            gap: 4px;
            background: #fff;
            border-radius: 14px;
            padding: 6px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            margin-bottom: 20px;
            width: fit-content;
        }
        .tab-btn {
            border: none;
            background: transparent;
            border-radius: 10px;
            padding: 10px 24px;
            font-family: 'Nunito', sans-serif;
            font-weight: 800;
            font-size: 14px;
            color: #888;
            cursor: pointer;
            transition: 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .tab-btn:hover { background: #f5f5f5; color: #333; }
        .tab-btn.active { background: var(--orange); color: #fff; box-shadow: 0 2px 8px rgba(248,125,38,0.3); }
 
        /* TABELA */
        .table-card {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            overflow: hidden;
        }
        .table-card .table {
            margin: 0;
            font-size: 13px;
        }
        .table-card .table thead th {
            background: var(--blue);
            color: #fff;
            font-weight: 800;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: none;
            padding: 14px 16px;
            white-space: nowrap;
        }
        .table-card .table tbody td {
            padding: 12px 16px;
            border-color: #f0f0f0;
            vertical-align: middle;
            color: #444;
            font-weight: 600;
        }
        .table-card .table tbody tr:hover { background: #fafafa; }
 
        /* PEDIDO ITENS */
        .itens-resumo {
            max-width: 220px;
            font-size: 12px;
            color: #888;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
 
        /* BUSCA */
        .search-bar {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }
        .search-input {
            border: 2px solid #e8e8e8;
            border-radius: 10px;
            padding: 8px 16px;
            font-family: 'Nunito', sans-serif;
            font-size: 14px;
            font-weight: 600;
            outline: none;
            transition: 0.2s;
            width: 280px;
        }
        .search-input:focus { border-color: var(--orange); }
 
        .tab-content-section { display: none; }
        .tab-content-section.active { display: block; }
 
        @media (max-width: 900px) {
            .sidebar { display: none; }
            .main-content { margin-left: 0; padding: 16px; }
            .stats-grid { grid-template-columns: 1fr 1fr; }
        }
    </style>
</head>
<body>
 
<!-- SIDEBAR -->
<aside class="sidebar">
    <div class="sidebar-logo">
        <img src="imagens/jumbox.png" alt="Jumbox">
    </div>
    <div class="sidebar-label">Menu</div>
    <a class="nav-item-admin active" onclick="showTab('cadastros')" href="#">
        <i class="bi bi-people-fill"></i> Cadastros
    </a>
    <a class="nav-item-admin" onclick="showTab('pedidos')" href="#">
        <i class="bi bi-bag-heart-fill"></i> Pedidos
    </a>
    <div class="sidebar-footer">
        <a href="logout_funcionario.php" class="btn-sair">
            <i class="bi bi-box-arrow-left"></i> Sair
        </a>
    </div>
</aside>
 
<!-- MAIN -->
<main class="main-content">
 
    <!-- TOPBAR -->
    <div class="topbar">
        <div>
            <div class="page-title">Painel Administrativo</div>
            <div style="font-size:13px; color:#aaa; font-weight:600; margin-top:4px;">Gerencie cadastros e pedidos</div>
        </div>
        <div class="admin-badge"><i class="bi bi-shield-fill-check"></i> Admin</div>
    </div>
 
    <!-- STATS -->
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon" style="background:#e8f0fb;">
                <i class="bi bi-people-fill" style="color:var(--blue)"></i>
            </div>
            <div>
                <div class="stat-num"><?= $total_usuarios ?></div>
                <div class="stat-lbl">Clientes Cadastrados</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:#fff3e8;">
                <i class="bi bi-bag-heart-fill" style="color:var(--orange)"></i>
            </div>
            <div>
                <div class="stat-num"><?= $total_pedidos ?></div>
                <div class="stat-lbl">Pedidos Realizados</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:#ecfdf5;">
                <i class="bi bi-currency-dollar" style="color:#10b981"></i>
            </div>
            <div>
                <div class="stat-num">R$ <?= number_format($total_valor, 0, ',', '.') ?></div>
                <div class="stat-lbl">Total em Pedidos</div>
            </div>
        </div>
    </div>
 
    <!-- TABS -->
    <div class="tab-nav">
        <button class="tab-btn active" id="tab-btn-cadastros" onclick="showTab('cadastros')">
            <i class="bi bi-people-fill"></i> Cadastros
        </button>
        <button class="tab-btn" id="tab-btn-pedidos" onclick="showTab('pedidos')">
            <i class="bi bi-bag-heart-fill"></i> Pedidos
        </button>
    </div>
 
    <!-- ABA CADASTROS -->
    <div class="tab-content-section active" id="section-cadastros">
        <div class="search-bar">
            <input type="text" class="search-input" placeholder="🔍 Buscar por nome ou CPF..." oninput="filtrarTabela('tbl-cadastros', this.value)">
        </div>
        <div class="table-card">
            <div class="table-responsive">
                <table class="table table-hover" id="tbl-cadastros">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Nascimento</th>
                            <th>E-mail</th>
                            <th>Telefone</th>
                            <th>Unidade</th>
                            <th>ROL</th>
                            <th>Cidade/UF</th>
                            <th>CPF Arq.</th>
                            <th>RG Arq.</th>
                            <th>Carteirinha</th>
                            <th>Cupons</th>
                            <th>Acomp.</th>
                            <th>Cadastro</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php if(mysqli_num_rows($resultado_usuarios) > 0): ?>
                        <?php while($u = mysqli_fetch_assoc($resultado_usuarios)): ?>
                        <tr>
                            <td><strong>#<?= $u['id'] ?></strong></td>
                            <td><?= htmlspecialchars($u['nome_completo']) ?></td>
                            <td><code><?= htmlspecialchars($u['cpf']) ?></code></td>
                            <td><?= date('d/m/Y', strtotime($u['data_nascimento'])) ?></td>
                            <td><?= htmlspecialchars($u['email']) ?></td>
                            <td><?= htmlspecialchars($u['telefone']) ?></td>
                            <td><?= htmlspecialchars($u['unidade_penitenciaria']) ?></td>
                            <td><?= htmlspecialchars($u['numero_rol']) ?></td>
                            <td><?= htmlspecialchars($u['cidade']) ?>/<?= htmlspecialchars($u['estado']) ?></td>
                            <td>
                                <?php if(!empty($u['arquivo_cpf'])): ?>
                                    <a href="uploads/<?= $u['arquivo_cpf'] ?>" target="_blank" class="btn btn-sm btn-primary">Ver</a>
                                <?php else: ?><span class="text-muted">—</span><?php endif; ?>
                            </td>
                            <td>
                                <?php if(!empty($u['arquivo_rg'])): ?>
                                    <a href="uploads/<?= $u['arquivo_rg'] ?>" target="_blank" class="btn btn-sm btn-success">Ver</a>
                                <?php else: ?><span class="text-muted">—</span><?php endif; ?>
                            </td>
                            <td>
                                <?php if(!empty($u['arquivo_carteirinha'])): ?>
                                    <a href="uploads/<?= $u['arquivo_carteirinha'] ?>" target="_blank" class="btn btn-sm btn-warning">Ver</a>
                                <?php else: ?><span class="text-muted">—</span><?php endif; ?>
                            </td>
                            <td><?= $u['receber_cupons'] ? '<span class="text-success fw-bold">Sim</span>' : '<span class="text-muted">Não</span>' ?></td>
                            <td><?= $u['acompanhar_status'] ? '<span class="text-success fw-bold">Sim</span>' : '<span class="text-muted">Não</span>' ?></td>
                            <td><?= date('d/m/Y', strtotime($u['data_cadastro'])) ?></td>
                        </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr><td colspan="15" class="text-center text-muted py-4">Nenhum cadastro encontrado.</td></tr>
                    <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
 
    <!-- ABA PEDIDOS -->
    <div class="tab-content-section" id="section-pedidos">
        <div class="search-bar">
            <input type="text" class="search-input" placeholder="🔍 Buscar por cliente ou detento..." oninput="filtrarTabela('tbl-pedidos', this.value)">
        </div>
        <div class="table-card">
            <div class="table-responsive">
                <table class="table table-hover" id="tbl-pedidos">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Detento</th>
                            <th>Matrícula</th>
                            <th>Unidade Prisional</th>
                            <th>Itens</th>
                            <th>Total</th>
                            <th>Pagamento</th>
                            <th>Status</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php if($resultado_pedidos && mysqli_num_rows($resultado_pedidos) > 0): ?>
                        <?php while($p = mysqli_fetch_assoc($resultado_pedidos)):
                            $itens = json_decode($p['itens_json'], true);
                            $itens_resumo = '';
                            if($itens) {
                                $nomes = array_map(fn($i) => $i['qtd'].'x '.$i['nome'], $itens);
                                $itens_resumo = implode(', ', $nomes);
                            }
                            $pagamento_label = match($p['pagamento']) {
                                'pix'            => '⚡ PIX',
                                'cartao_credito' => '💳 Crédito',
                                'cartao_debito'  => '🏦 Débito',
                                'boleto'         => '📄 Boleto',
                                default          => ucfirst($p['pagamento']),
                            };
                            $data_fmt = isset($p['created_at']) ? date('d/m/Y H:i', strtotime($p['created_at'])) : '—';
                        ?>
                        <tr>
                            <td><strong>#<?= $p['id'] ?></strong></td>
                            <td><?= htmlspecialchars($p['nome_cliente'] ?? '—') ?></td>
                            <td><?= htmlspecialchars($p['nome_detento']) ?></td>
                            <td><code><?= htmlspecialchars($p['codigo_detento']) ?></code></td>
                            <td><?= htmlspecialchars($p['unidade_prisional']) ?></td>
                            <td>
                                <div class="itens-resumo" title="<?= htmlspecialchars($itens_resumo) ?>">
                                    <?= htmlspecialchars($itens_resumo) ?: '—' ?>
                                </div>
                            </td>
                            <td><strong style="color:var(--orange)">R$ <?= number_format($p['total'], 2, ',', '.') ?></strong></td>
                            <td><?= $pagamento_label ?></td>
                            <td><?= statusBadge($p['status']) ?></td>
                            <td><?= $data_fmt ?></td>
                        </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr><td colspan="10" class="text-center text-muted py-4">Nenhum pedido encontrado.</td></tr>
                    <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
 
</main>
 
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
function showTab(tab) {
    document.querySelectorAll('.tab-content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.nav-item-admin').forEach(b => b.classList.remove('active'));
 
    document.getElementById('section-' + tab).classList.add('active');
    document.getElementById('tab-btn-' + tab).classList.add('active');
}
 
function filtrarTabela(tblId, termo) {
    const tbl = document.getElementById(tblId);
    const rows = tbl.querySelectorAll('tbody tr');
    const t = termo.toLowerCase();
    rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(t) ? '' : 'none';
    });
}
</script>
</body>
</html>
