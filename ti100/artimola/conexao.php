```php
<?php
 
/*
========================================
ARQUIVO: conexao.php
FUNÇÃO:
Conectar o sistema ao banco de dados
========================================
*/
 
$servidor = "localhost";
$usuario = "dennys07_root";
$senha = "Senac@123";
$banco = "dennys07_artimola";
 
/*
========================================
CRIANDO CONEXÃO
========================================
*/
 
$conexao = new mysqli(
    $servidor,
    $usuario,
    $senha,
    $banco
);
 
/*
========================================
VERIFICAÇÃO DE ERRO
========================================
*/
 
if($conexao->connect_error){
 
    die("Erro na conexão: " . $conexao->connect_error);
 
}
 
?>
```
 