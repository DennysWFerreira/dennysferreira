<?php
header("Content-Type: application/json");
session_start();
require "config.php";

$dados = json_decode(file_get_contents("php://input"), true);

if (!$dados || !is_array($dados)) {
    echo json_encode(["success" => false, "erro" => "Dados inválidos"]);
    exit;
}

$usuario_id      = $_SESSION['usuario_id'] ?? null;
$forma_pagamento = htmlspecialchars(trim($dados["forma_pagamento"] ?? $dados["payment_method"] ?? ''));
$valor_total     = floatval($dados["valor_total"] ?? $dados["total"] ?? 0);
$status          = htmlspecialchars(trim($dados["status"] ?? 'Pendente'));

// Validações básicas
$formas_validas = ['pix', 'cartao', 'Pix', 'Cartao', 'Cartão', 'cartão'];
if (!in_array($forma_pagamento, $formas_validas)) {
    $forma_pagamento = 'pix'; // fallback
}

$statuses_validos = ['Pendente','Pago','Processando','Enviado','Entregue','Cancelado'];
if (!in_array($status, $statuses_validos)) {
    $status = 'Pendente';
}

if ($valor_total <= 0) {
    echo json_encode(["success" => false, "erro" => "Valor inválido"]);
    exit;
}

$stmt = $conn->prepare("
    INSERT INTO pedidos (usuario_id, valor_total, forma_pagamento, status)
    VALUES (?, ?, ?, ?)
");
$stmt->bind_param("idss", $usuario_id, $valor_total, $forma_pagamento, $status);

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "erro" => "Erro ao criar pedido"]);
    exit;
}
$pedidoId = $stmt->insert_id;
$stmt->close();

// Insere os itens do pedido
if (!empty($dados["items"]) && is_array($dados["items"])) {
    $stmtItem = $conn->prepare("
        INSERT INTO pedido_itens (pedido_id, produto_id, nome_produto, quantidade, preco)
        VALUES (?, ?, ?, ?, ?)
    ");

    foreach ($dados["items"] as $item) {
        $produto_id   = htmlspecialchars(trim($item["id"]    ?? $item["produto_id"] ?? ''));
        $nome_produto = htmlspecialchars(trim($item["nome"]  ?? $item["name"]       ?? 'Produto'));
        $quantidade   = max(1, intval($item["qtd"]   ?? $item["qty"]   ?? 1));
        $preco        = floatval($item["preco"] ?? $item["price"] ?? 0);

        if ($preco < 0) $preco = 0;

        $stmtItem->bind_param("issid", $pedidoId, $produto_id, $nome_produto, $quantidade, $preco);
        $stmtItem->execute();
    }
    $stmtItem->close();
}

$conn->close();

echo json_encode(["success" => true, "pedido_id" => $pedidoId]);
