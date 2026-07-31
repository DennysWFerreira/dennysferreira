<?php

/*
=================================================
INICIA A SESSÃO
=================================================
*/

session_start();

/*
=================================================
VERIFICA LOGIN
=================================================
*/

if (!isset($_SESSION['id_usuario'])) {

    header("Location: login.html");
    exit();

}

/*
=================================================
CONEXÃO COM BANCO
=================================================
*/

include("conexao.php");

/*
=================================================
BUSCA DADOS DO USUÁRIO LOGADO
=================================================
*/

$id = $_SESSION['id_usuario'];

$sql = "SELECT * FROM cadastro_artistas WHERE id = ?";

$stmt = $conexao->prepare($sql);

$stmt->bind_param("i", $id);

$stmt->execute();

$resultado = $stmt->get_result();

$usuario = $resultado->fetch_assoc();

/*
=================================================
USUÁRIO NÃO ENCONTRADO
=================================================
*/

if (!$usuario) {

    session_destroy();

    header("Location: login.html");

    exit();

}

?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Painel do Artista | Artimola</title>

    <link rel="stylesheet" href="CSS/usuariologado.css">

    <link rel="preconnect" href="https://fonts.googleapis.com">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet">

</head>

<body>

    <!-- ===================================================== -->
    <!-- MENU SUPERIOR -->
    <!-- ===================================================== -->

    <header class="custom-navbar">

        <div class="container nav-wrapper">

            <div class="logo">

                <img src="img/logo.png" alt="Artimola">

            </div>

            <nav class="menu">

                <a href="usuario.php">Início</a>

                <a href="#biografia">Perfil</a>

                <a href="#portfolio">Portfólio</a>

                <a href="#">Eventos</a>

                <a href="#">Mensagens</a>

            </nav>

            <div class="nav-buttons">

                <a href="logout.php" class="btn-nav">
                    Sair
                </a>

            </div>

        </div>

    </header>

    <!-- ===================================================== -->
    <!-- DASHBOARD -->
    <!-- ===================================================== -->

    <main class="dashboard">

        <!-- ===================================================== -->
        <!-- PERFIL LATERAL -->
        <!-- ===================================================== -->

        <aside class="perfil-lateral">

            <img
                src="<?php echo !empty($usuario['foto_perfil']) ? $usuario['foto_perfil'] : 'img/perfil.jpg'; ?>"
                alt="Foto do artista">

            <h2>

                <?php echo $usuario['nome_artistico']; ?>

            </h2>

            <span>

                <?php echo $usuario['area_atuacao']; ?>

            </span>

            <div class="status">

                Perfil em análise

            </div>

            <a href="#" class="btn-editar">

                Editar Perfil

            </a>

        </aside>

        <!-- ===================================================== -->
        <!-- CONTEÚDO DIREITO -->
        <!-- ===================================================== -->

        <section class="conteudo">

            <div class="welcome-box">

                <h1>

                    Bem-vindo,
                    <?php echo $usuario['nome']; ?>

                </h1>

                <p>

                    Aqui você acompanha seu cadastro,
                    oportunidades, portfólio e status
                    dentro da Artimola.

                </p>

            </div>

            <!-- ===================================================== -->
            <!-- CARDS -->
            <!-- ===================================================== -->

            <div class="cards-grid">

                <div class="card">

                    <h3>🎭 Área de Atuação</h3>

                    <p>

                        <?php echo $usuario['area_atuacao']; ?>

                    </p>

                </div>

                <div class="card">

                    <h3>📍 Cidade</h3>

                    <p>

                        <?php echo $usuario['cidade']; ?>

                    </p>

                </div>

                <div class="card">

                    <h3>📧 E-mail</h3>

                    <p>

                        <?php echo $usuario['email']; ?>

                    </p>

                </div>

                <div class="card">

                    <h3>⭐ Status</h3>

                    <p>

                        Ativo

                    </p>

                </div>

            </div>