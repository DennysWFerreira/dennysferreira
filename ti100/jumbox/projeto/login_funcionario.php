<?php
session_start();

$erro = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $usuario = trim($_POST["usuario"]);
    $senha = trim($_POST["senha"]);

    // LOGIN INSTITUCIONAL
    $usuario_correto = "admin";
    $senha_correta = "123456";

    if ($usuario === $usuario_correto && $senha === $senha_correta) {

        $_SESSION["funcionario_logado"] = true;

        header("Location: listaclientes.php");
        exit();

    } else {

        $erro = "Usuário ou senha inválidos.";
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Login Funcionário</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>

        body{
            background:#f5f5f5;
        }

        .login-box{
            max-width:420px;
            margin:auto;
            margin-top:100px;
            background:#fff;
            padding:40px;
            border-radius:15px;
            box-shadow:0 0 20px rgba(0,0,0,0.08);
        }

        .titulo{
            color:#ff7a00;
            font-weight:bold;
        }

    </style>

</head>

<body>

    <div class="container">

        <div class="login-box">

            <h2 class="text-center mb-4 titulo">
                Área Institucional
            </h2>

            <?php if($erro != ""){ ?>

                <div class="alert alert-danger">

                    <?php echo $erro; ?>

                </div>

            <?php } ?>

            <form method="POST">

                <!-- USUÁRIO -->

                <div class="mb-3">

                    <label class="form-label">
                        Usuário
                    </label>

                    <input
                        type="text"
                        name="usuario"
                        class="form-control"
                        required
                    >

                </div>

                <!-- SENHA -->

                <div class="mb-4">

                    <label class="form-label">
                        Senha
                    </label>

                    <input
                        type="password"
                        name="senha"
                        class="form-control"
                        required
                    >

                </div>

                <!-- BOTÃO ENTRAR -->

                <button
                    type="submit"
                    class="btn btn-dark w-100"
                >
                    Entrar
                </button>

                <!-- BOTÃO VOLTAR -->

                <div class="mt-3 text-center">

                    <a
                        href="index.php"
                        class="btn btn-outline-secondary w-100"
                    >
                        Voltar para Página Inicial
                    </a>

                </div>

            </form>

        </div>

    </div>

</body>
</html>