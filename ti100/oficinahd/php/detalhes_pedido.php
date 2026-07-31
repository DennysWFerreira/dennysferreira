<?php
header("Content-Type: application/json");
session_start();
require "config.php";

$id = intval($_GET["id"] ?? 0);

if (!$id) {
    echo json_encode(["pedido" => null, "items" => []]);
    exit;
}

$usuario_id = $_SESSION['usuario_id'] ?? null;

// Busca o pedido garantindo que pertence ao usuário (ou é pedido sem login)
if ($usuario_id) {
    $stmt = $conn->prepare("
        SELECT id, usuario_id, valor_total, forma_pagamento, status, data_pedido
        FROM pedidos WHERE id = ? AND (usuario_id = ? OR usuario_id IS NULL)
    ");
    $stmt->bind_param("ii", $id, $usuario_id);
} else {
    // Não logado: só retorna pedidos sem usuario_id (guest)
    $stmt = $conn->prepare("
        SELECT id, usuario_id, valor_total, forma_pagamento, status, data_pedido
        FROM pedidos WHERE id = ? AND usuario_id IS NULL
    ");
    $stmt->bind_param("i", $id);
}

$stmt->execute();
$pedido = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$pedido) {
    echo json_encode(["pedido" => null, "items" => []]);
    exit;
}

// Busca os itens
$stmt2 = $conn->prepare("
    SELECT id, pedido_id, produto_id, nome_produto, quantidade, preco
    FROM pedido_itens WHERE pedido_id = ?
");
$stmt2->bind_param("i", $id);
$stmt2->execute();
$itens = $stmt2->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt2->close();

$conn->close();

echo json_encode(["pedido" => $pedido, "items" => $itens]);
