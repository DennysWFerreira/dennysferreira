<?php
header("Content-Type: application/json");
session_start();
require "config.php";

$usuario_id = $_SESSION['usuario_id'] ?? null;

// Se não estiver logado, retorna array vazio (privacidade)
if (!$usuario_id) {
    echo json_encode([]);
    exit;
}

$stmt = $conn->prepare("
    SELECT id, usuario_id, valor_total, forma_pagamento, status, data_pedido
    FROM pedidos
    WHERE usuario_id = ?
    ORDER BY id DESC
");
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();

$pedidos = [];
while ($row = $result->fetch_assoc()) {
    $pedidos[] = $row;
}

$stmt->close();
$conn->close();
echo json_encode($pedidos);
