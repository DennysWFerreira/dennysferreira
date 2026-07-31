<?php
$host = "localhost";
$usuario = "dennys07_root";
$senha = "Senac@123";
$banco = "dennys07_aroma";
$conexao = new mysqli($host, $usuario, $senha, $banco);
if ($conexao->connect_error) {
    die("Erro na conexão: " . $conexao->connect_error);
}
$sql = "SELECT * FROM cadastro_clientes ORDER BY data_cadastro DESC";
$resultado = $conexao->query($sql);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Clientes Cadastrados | Aroma 811</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet">
<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}
body{
    background:#efede3;
    font-family:'Poppins',sans-serif;
    color:#111;
}
.container{
    width:90%;
    max-width:1200px;
    margin:auto;
}
header{
    padding:25px 0;
    border-bottom:1px solid #ddd7ca;
}
.header-content{
    display:flex;
    justify-content:space-between;
    align-items:center;
}
.logo{
    font-family:'Playfair Display',serif;
    font-size:32px;
    font-weight:700;
}
.voltar{
    text-decoration:none;
    background:#111;
    color:#fff;
    padding:12px 22px;
    border-radius:30px;
    transition:.3s;
}
.voltar:hover{
    background:#000;
}
.hero{
    padding:70px 0 40px;
    text-align:center;
}
.hero h1{
    font-family:'Playfair Display',serif;
    font-size:56px;
    margin-bottom:15px;
}
.hero p{
    color:#666;
    max-width:700px;
    margin:auto;
}
.info-card{
    background:#f7f5ef;
    border-radius:18px;
    padding:25px;
    margin-bottom:30px;
    box-shadow:0 8px 20px rgba(0,0,0,.08);
}
.total-clientes{
    font-size:22px;
    font-weight:600;
}
.table-wrapper{
    overflow-x:auto;
    background:#f7f5ef;
    border-radius:20px;
    box-shadow:0 8px 20px rgba(0,0,0,.08);
}
table{
    width:100%;
    border-collapse:collapse;
}
thead{
    background:#111;
    color:#fff;
}
th{
    padding:18px;
    text-align:left;
    font-weight:600;
}
td{
    padding:18px;
    border-bottom:1px solid #e5dfd0;
}
tbody tr{
    transition:.3s;
}
tbody tr:hover{
    background:#ebe6d8;
}
.sem-registro{
    text-align:center;
    padding:30px;
    color:#666;
}
footer{
    text-align:center;
    padding:50px 0;
    color:#777;
}
@media(max-width:768px){
.hero h1{
    font-size:38px;
}
th,td{
    padding:12px;
    font-size:14px;
}
}
</style>
</head>
<body>
<header>
<div class="container header-content">
<div class="logo">Aroma 811</div>
<a href="index.html" class="voltar">
            Voltar ao Site
</a>
</div>
</header>
<section class="hero">
<div class="container">
<h1>Clientes Cadastrados</h1>
<p>
            Visualize todos os clientes registrados na plataforma Aroma 811.
</p>
</div>
</section>
<div class="container">
<div class="info-card">
<div class="total-clientes">
            Total de Clientes:
<?php echo $resultado->num_rows; ?>
</div>
</div>
<div class="table-wrapper">
<table>
<thead>
<tr>
<th>ID</th>
<th>Nome</th>
<th>Telefone</th>
<th>Email</th>
<th>Data Cadastro</th>
</tr>
</thead>
<tbody>
<?php
            if($resultado->num_rows > 0){
                mysqli_data_seek($resultado,0);
                while($cliente = $resultado->fetch_assoc()){
                    echo "
<tr>
<td>{$cliente['id']}</td>
<td>{$cliente['nome']}</td>
<td>{$cliente['numero']}</td>
<td>{$cliente['email']}</td>
<td>{$cliente['data_cadastro']}</td>
</tr>";
                }
            }else{
                echo "
<tr>
<td colspan='5' class='sem-registro'>
                        Nenhum cliente cadastrado.
</td>
</tr>";
            }
            ?>
</tbody>
</table>
</div>
</div>
<footer>
    © <?php echo date('Y'); ?> Aroma 811 • Todos os direitos reservados.
</footer>
</body>
</html>