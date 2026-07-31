<?php
session_start();
require "config.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") exit;

$email = trim(strtolower($_POST['email'] ?? ''));
$senha = $_POST['senha'] ?? '';

if (!$email || !$senha) {
    echo "<script>alert('Preencha email e senha.'); window.history.back();</script>";
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "<script>alert('Email inválido.'); window.history.back();</script>";
    exit;
}

$stmt = $conn->prepare("SELECT id, nome, email, senha FROM usuarios WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$usuario = $stmt->get_result()->fetch_assoc();
$stmt->close();
$conn->close();

if ($usuario && password_verify($senha, $usuario['senha'])) {
    $_SESSION['usuario_id']    = $usuario['id'];
    $_SESSION['usuario_nome']  = $usuario['nome'];
    $_SESSION['usuario_email'] = $usuario['email'];

    // Redirecionar para destino original (ex: checkout após login)
    $next = trim($_POST['next'] ?? '');
    $destinos_permitidos = ['checkout' => '../checkout.php'];
    if ($next && isset($destinos_permitidos[$next])) {
        header("Location: " . $destinos_permitidos[$next]);
    } else {
        header("Location: ../index.php");
    }
    exit;
}

echo "<script>alert('Email ou senha inválidos!'); window.history.back();</script>";
