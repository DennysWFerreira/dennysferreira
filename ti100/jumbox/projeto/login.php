<?php
session_start();
include_once("conexao.php");
 
$erro = "";
 
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
 
    $usuario = trim($_POST['usuario']);
    $senha   = trim($_POST['senha']);
 
    // Remove caracteres especiais
    $usuarioLimpo = preg_replace('/[^0-9]/', '', $usuario);

 
    // =========================
    // LOGIN PESSOA FÍSICA
    // =========================
    $sql_pf = "SELECT * FROM usuarios_pf WHERE cpf = ?";
    $stmt_pf = mysqli_prepare($conn, $sql_pf);
 
    mysqli_stmt_bind_param($stmt_pf, "s", $usuarioLimpo);
    mysqli_stmt_execute($stmt_pf);
 
    $resultado_pf = mysqli_stmt_get_result($stmt_pf);
 
    if (mysqli_num_rows($resultado_pf) > 0) {
 
        $usuario_pf = mysqli_fetch_assoc($resultado_pf);
 
        if (password_verify($senha, $usuario_pf['senha'])) {
 
            $_SESSION['usuario_id']   = $usuario_pf['id'];
            $_SESSION['usuario_nome'] = $usuario_pf['nome_completo'];
            $_SESSION['tipo']         = 'pf';
 
            header("Location: index.php");
            exit();
        }
    }
 
    // =========================
    // LOGIN PESSOA JURÍDICA
    // =========================
    $sql_pj = "SELECT * FROM usuarios_pj WHERE cnpj = ?";
    $stmt_pj = mysqli_prepare($conn, $sql_pj);
 
    mysqli_stmt_bind_param($stmt_pj, "s", $usuarioLimpo);
    mysqli_stmt_execute($stmt_pj);
 
    $resultado_pj = mysqli_stmt_get_result($stmt_pj);
 
    if (mysqli_num_rows($resultado_pj) > 0) {
 
        $usuario_pj = mysqli_fetch_assoc($resultado_pj);
 
        if (password_verify($senha, $usuario_pj['senha'])) {
 
            $_SESSION['usuario_id']   = $usuario_pj['id'];
            $_SESSION['usuario_nome'] = $usuario_pj['razao_social'];
            $_SESSION['tipo']         = 'pj';
 
            header("Location: index.php");
            exit();
        }
    }
 
    $erro = "CPF/CNPJ ou senha inválidos.";
}
?>
 
<!DOCTYPE html>
<html lang="pt-br">
 
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Jumbox</title>
 
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
 
    <style>
        body {
            background: #f5f5f5;
        }
 
        .login-box {
            max-width: 450px;
            margin: 70px auto;
            background: #fff;
            padding: 35px;
            border-radius: 12px;
            box-shadow: 0 0 20px rgba(0,0,0,0.08);
        }
 
        .btn-orange {
            background: #ff7a00;
            color: white;
            border: none;
        }
 
        .btn-orange:hover {
            background: #e96f00;
            color: white;
        }
 
        .title-login {
            text-align: center;
            margin-bottom: 25px;
            font-weight: bold;
            color: #333;
        }
    </style>
</head>
 
<body>
 
    <div class="container">
 
        <div class="login-box">
 
            <h2 class="title-login">Entrar na Conta</h2>
 
            <?php if (!empty($erro)) { ?>
                <div class="alert alert-danger">
                    <?php echo $erro; ?>
                </div>
            <?php } ?>
 
            <form method="POST">
 
                <div class="mb-3">
                    <label class="form-label">CPF ou CNPJ</label>
 
                    <input
                        type="text"
                        name="usuario"
                        id="usuario"
                        class="form-control"
                        placeholder="Digite seu CPF ou CNPJ"
                        required>
                </div>
 
                <div class="mb-4">
                    <label class="form-label">Senha</label>
 
                    <input
                        type="password"
                        name="senha"
                        class="form-control"
                        placeholder="Digite sua senha"
                        required>
                </div>
 
                <button type="submit" class="btn btn-orange w-100">
                    Entrar
                </button>
 
                <div class="text-center mt-4">
                    <a href="cadastro.php">
                        Não possui conta? Cadastre-se
                    </a>
                </div>
 
            </form>
 
        </div>
 
    </div>
 
    <script>
 
        const usuario = document.getElementById('usuario');
 
        usuario.addEventListener('input', function (e) {
 
            let value = e.target.value.replace(/\D/g, '');
 
            // CPF
            if (value.length <= 11) {
 
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
 
            } 
            // CNPJ
            else {
 
                value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            }
 
            e.target.value = value;
        });
 
    </script>
 
</body>
 
</html>