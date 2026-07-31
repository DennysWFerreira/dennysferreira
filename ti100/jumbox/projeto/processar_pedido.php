<?php
session_start();

// 1. Inclui o seu arquivo de conexão
require_once "conexao.php"; 

// 2. Garante que ninguém acesse esse arquivo diretamente sem enviar o formulário
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_SESSION['carrinho'])) {
    header("Location: finalizar_pedido.php"); 
    exit();
}

// 3. Recebe os dados vindos do formulário
$nome_detento      = trim($_POST['nome_detento']);
$codigo_detento    = trim($_POST['codigo_detento']);
$unidade_prisional = trim($_POST['unidade_prisional']);
$forma_pagamento   = $_POST['pagamento']; // Vai para a coluna 'pagamento'
$observacoes       = isset($_POST['observacoes']) ? trim($_POST['observacoes']) : '';

// Campos adicionais que existem na sua tabela:
$usuario_id        = isset($_SESSION['usuario_id']) ? $_SESSION['usuario_id'] : null; // Se tiver usuário logado
$nome_cliente      = isset($_SESSION['usuario_nome']) ? $_SESSION['usuario_nome'] : 'Não Identificado'; 
$status            = 'pendente';

// 4. Calcula o valor total e prepara o JSON dos itens
$total_pedido = 0;
foreach ($_SESSION['carrinho'] as $item) {
    $total_pedido += $item['preco'] * $item['qtd'];
}

// Converte os itens do carrinho em uma string JSON para salvar na coluna 'itens_json'
$itens_json = json_encode($_SESSION['carrinho'], JSON_UNESCAPED_UNICODE);

// 5. Salva os dados batendo EXATAMENTE com as colunas da sua imagem
$sql_pedido = "INSERT INTO pedidos (usuario_id, nome_cliente, nome_detento, codigo_detento, unidade_prisional, itens_json, total, pagamento, observacoes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = mysqli_prepare($conn, $sql_pedido);

// "iissssssss" -> i = inteiro, s = string, d = decimal (total é decimal/double)
mysqli_stmt_bind_param($stmt, "isssssdsss", $usuario_id, $nome_cliente, $nome_detento, $codigo_detento, $unidade_prisional, $itens_json, $total_pedido, $forma_pagamento, $observacoes, $status);

if (mysqli_stmt_execute($stmt)) {
    // Pega o ID gerado para exibir na tela
    $id_pedido = mysqli_insert_id($conn);

    // 6. Limpa o carrinho da sessão
    unset($_SESSION['carrinho']);
    
    $sucesso = true;
} else {
    $sucesso = false;
    $erro_msg = mysqli_error($conn);
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Status do Pedido – Jumbox</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Nunito', sans-serif; background: #f4f4f4; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .card-status { background: #fff; border-radius: 20px; box-shadow: 0 4px 24 rgba(0,0,0,0.08); padding: 40px; text-align: center; max-width: 500px; width: 100%; }
        .icon-sucesso { color: #f87d26; font-size: 64px; }
        .icon-erro { color: #dc3545; font-size: 64px; }
        .btn-voltar { background: #f87d26; color: #fff; border-radius: 12px; padding: 12px 24px; font-weight: 700; text-decoration: none; display: inline-block; transition: 0.2s; margin-top: 20px; }
        .btn-voltar:hover { background: #d66a1f; color: #fff; }
    </style>
</head>
<body>

<div class="container d-flex justify-content-center">
    <div class="card-status">
        <?php if ($sucesso): ?>
            <div class="icon-sucesso"><i class="bi bi-check-circle-fill"></i></div>
            <h2 class="fw-800 my-3" style="color: #1a4a8e;">Pedido Realizado!</h2>
            <p class="text-muted">O pedido foi registrado com sucesso no sistema e os dados foram arquivados.</p>
            <p class="fw-bold text-dark">Código do Registro: #<?= $id_pedido ?></p>
        <?php else: ?>
            <div class="icon-erro"><i class="bi bi-exclamation-circle-fill"></i></div>
            <h2 class="fw-800 my-3 text-danger">Erro ao salvar dados</h2>
            <p class="text-muted">Houve um descompasso com o banco de dados:</p>
            <small class="text-danger d-block mt-2"><?= $erro_msg ?></small>
        <?php endif; ?>

        <a href="index.php" class="btn-voltar">Voltar ao Início</a>
    </div>
</div>

</body>
</html>