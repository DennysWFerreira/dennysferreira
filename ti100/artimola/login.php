<?php

/*
======================================
INICIA A SESSÃO
======================================
*/

session_start();

/*
======================================
CONEXÃO COM O BANCO
======================================
*/

$servidor = "localhost";
$usuario = "dennys07_root";
$senha = "Senac@123";
$banco = "dennys07_artimola";

$conexao = new mysqli(
    $host,
    $usuario,
    $senhaBanco,
    $banco
);

if ($conexao->connect_error) {

    die("Erro de conexão: " . $conexao->connect_error);

}

/*
======================================
VERIFICA ENVIO DO FORMULÁRIO
======================================
*/

if (!isset($_POST['cpf']) || !isset($_POST['senha'])) {

    header("Location: login.php");
    exit();

}

/*
======================================
RECEBE DADOS
======================================
*/

$cpf = trim($_POST['cpf']);
$senha = trim($_POST['senha']);

/*
======================================
BUSCA USUÁRIO
======================================
*/

$sql = "SELECT * 
        FROM cadastro_artistas
        WHERE cpf = ?
        AND senha = ?";

$stmt = $conexao->prepare($sql);

$stmt->bind_param(
    "ss",
    $cpf,
    $senha
);

$stmt->execute();

$resultado = $stmt->get_result();

/*
======================================
LOGIN CORRETO
======================================
*/

if ($resultado->num_rows > 0) {

    $usuarioLogado = $resultado->fetch_assoc();

    /*
    ======================================
    SESSÕES
    ======================================
    */

    $_SESSION['id_usuario'] = $usuarioLogado['id'];

    $_SESSION['nome'] = $usuarioLogado['nome'];

    $_SESSION['sobrenome'] = $usuarioLogado['sobrenome'];

    $_SESSION['nome_artistico'] = $usuarioLogado['nome_artistico'];

    $_SESSION['email'] = $usuarioLogado['email'];

    $_SESSION['cidade'] = $usuarioLogado['cidade'];

    $_SESSION['estado'] = $usuarioLogado['estado'];

    $_SESSION['area_atuacao'] = $usuarioLogado['area_atuacao'];

    $_SESSION['biografia'] = $usuarioLogado['biografia'];

    $_SESSION['foto_perfil'] = $usuarioLogado['foto_perfil'];

    $_SESSION['foto1'] = $usuarioLogado['foto1'];

    $_SESSION['foto2'] = $usuarioLogado['foto2'];

    $_SESSION['foto3'] = $usuarioLogado['foto3'];

    $_SESSION['foto4'] = $usuarioLogado['foto4'];

    $_SESSION['foto5'] = $usuarioLogado['foto5'];

    /*
    ======================================
    REDIRECIONA
    ======================================
    */

    header("Location: usuario.php");
    exit();

}

/*
======================================
LOGIN INVÁLIDO
======================================
*/

echo "

<script>

alert('CPF ou senha incorretos!');

window.location.href='login.php';

</script>

";

$stmt->close();

$conexao->close();

?>