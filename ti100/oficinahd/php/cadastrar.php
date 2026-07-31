<?php
session_start();
require "config.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") exit;

$nome  = trim($_POST['nome']  ?? '');
$email = trim($_POST['email'] ?? '');
$senha = $_POST['senha'] ?? '';

if (!$nome || !$email || !$senha) {
    echo "<script>alert('Preencha todos os campos.'); window.history.back();</script>";
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "<script>alert('Email inválido.'); window.history.back();</script>";
    exit;
}

if (strlen($senha) < 6) {
    echo "<script>alert('A senha deve ter pelo menos 6 caracteres.'); window.history.back();</script>";
    exit;
}

// Verifica se email já existe
$check = $conn->prepare("SELECT id FROM usuarios WHERE email = ? LIMIT 1");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo "<script>alert('Este email já está cadastrado.'); window.history.back();</script>";
    $check->close();
    $conn->close();
    exit;
}
$check->close();

$hash = password_hash($senha, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $nome, $email, $hash);

if ($stmt->execute()) {
    // Inicia sessão após cadastro
    $_SESSION['usuario_id']    = $conn->insert_id;
    $_SESSION['usuario_nome']  = $nome;
    $_SESSION['usuario_email'] = $email;

    // Redirecionar para destino original (ex: checkout após cadastro)
    $next = trim($_POST['next'] ?? '');
    $destinos_permitidos = ['checkout' => '../checkout.php'];
    if ($next && isset($destinos_permitidos[$next])) {
        $destino = $destinos_permitidos[$next];
        echo "<script>window.location.href = '{$destino}';</script>";
    } else {
        echo "<script>window.location.href = '../index.php';</script>";
    }
} else {
    echo "<script>alert('Erro ao cadastrar. Tente novamente.'); window.history.back();</script>";
}

$stmt->close();
$conn->close();
