<?php
$host = getenv('DB_HOST') ?: 'localhost';
$user = getenv('DB_USER') ?: 'dennys07_root';
$pass = getenv('DB_PASSWORD') ?: 'Senac@123';
$db   = getenv('DB_NAME') ?: 'dennys07_oficinahd';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['success' => false, 'erro' => 'Erro de conexão com o banco.']));
}

$conn->set_charset('utf8mb4');
