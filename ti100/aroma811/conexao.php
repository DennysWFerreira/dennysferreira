<?php

$host = "localhost";
$usuario = "dennys07_root";
$senha = "Senac@123";
$banco = "dennys07_aroma";

$conn = new mysqli($host, $usuario, $senha, $banco);

if($conn->connect_error){
    die("Erro na conexão: " . $conn->connect_error);
}

?>
