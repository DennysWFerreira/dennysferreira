<?php

include("conexao.php");

$nome = $_POST['nome'];
$numero = $_POST['numero'];
$email = $_POST['email'];

$sql = "INSERT INTO cadastro_clientes (nome, numero, email)
        VALUES ('$nome', '$numero', '$email')";

if($conn->query($sql) === TRUE){
    echo "
    <script>
        alert('Cadastro realizado com sucesso!');
        window.location.href='index.html';
    </script>
    ";
} else {
    echo "Erro: " . $conn->error;
}

$conn->close();

?>