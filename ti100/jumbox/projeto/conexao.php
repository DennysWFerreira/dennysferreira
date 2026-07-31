<?php

$servidor = "localhost";
$usuario = "dennys07_root";
$senha = "Senac@123";
$banco = "dennys07_jumbox";

$conn = mysqli_connect($servidor, $usuario, $senha, $banco);

if (!$conn) {
    die("Erro na conexão: " . mysqli_connect_error());
}

mysqli_set_charset($conn, "utf8");
?>