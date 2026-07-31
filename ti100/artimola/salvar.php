<?php
 
/*
=====================================================
CONEXÃO COM O BANCO
=====================================================
 
ARQUIVO:
salvar.php
 
COLOQUE ESTE ARQUIVO NA MESMA PASTA
DO SEU HTML.
 
Porque PHP adora quebrar quando você coloca
um arquivo 2cm fora do lugar.
=====================================================
*/
include("conexao.php");
 
/*
=====================================================
RECEBENDO DADOS DO FORMULÁRIO
=====================================================
*/
 
$nome = $_POST['nome'];
$sobrenome = $_POST['sobrenome'];
$nome_artistico = $_POST['nome_artistico'];
 
$cpf = $_POST['cpf'];
 
$nascimento = $_POST['nascimento'];
 
$telefone = $_POST['telefone'];
 
$email = $_POST['email'];
 
$instagram = $_POST['instagram'];
 
$senha = $_POST['senha'];
 
$cep = $_POST['cep'];
 
$cidade = $_POST['cidade'];
 
$estado = $_POST['estado'];
 
$bairro = $_POST['bairro'];
 
$area_atuacao = $_POST['area_atuacao'];
 
$altura = $_POST['altura'];
 
$peso = $_POST['peso'];
 
$manequim = $_POST['manequim'];
 
$biografia = $_POST['biografia'];
 
/*
=====================================================
UPLOAD DAS IMAGENS
=====================================================
 
CRIE UMA PASTA:
uploads
 
NA MESMA PASTA DO salvar.php
 
Porque arquivos precisam morar em algum lugar
antes de desaparecerem misteriosamente.
=====================================================
*/
 
$pasta = "uploads/";
 
/*
=====================================================
FUNÇÃO PARA SALVAR IMAGEM
=====================================================
*/
 
function salvarArquivo($arquivo, $pasta)
{
 
    if (isset($_FILES[$arquivo]) && $_FILES[$arquivo]['error'] == 0) {
 
        $nomeArquivo = time() . "_" . $_FILES[$arquivo]['name'];
 
        $destino = $pasta . $nomeArquivo;
 
        move_uploaded_file(
            $_FILES[$arquivo]['tmp_name'],
            $destino
        );
 
        return $destino;
    }
 
    return "";
}
 
/*
=====================================================
SALVANDO IMAGENS
=====================================================
*/
 
$foto_perfil = salvarArquivo("foto_perfil", $pasta);
 
$foto1 = salvarArquivo("foto1", $pasta);
 
$foto2 = salvarArquivo("foto2", $pasta);
 
$foto3 = salvarArquivo("foto3", $pasta);
 
$foto4 = salvarArquivo("foto4", $pasta);
 
$foto5 = salvarArquivo("foto5", $pasta);
 
/*
=====================================================
INSERT NO BANCO
=====================================================
*/
 
$sql = "INSERT INTO cadastro_artistas (
 
    nome,
    sobrenome,
    nome_artistico,
    cpf,
    nascimento,
    telefone,
    email,
    instagram,
    senha,
    cep,
    cidade,
    estado,
    bairro,
    area_atuacao,
    altura,
    peso,
    manequim,
    biografia,
    foto_perfil,
    foto1,
    foto2,
    foto3,
    foto4,
    foto5
 
) VALUES (
 
    '$nome',
    '$sobrenome',
    '$nome_artistico',
    '$cpf',
    '$nascimento',
    '$telefone',
    '$email',
    '$instagram',
    '$senha',
    '$cep',
    '$cidade',
    '$estado',
    '$bairro',
    '$area_atuacao',
    '$altura',
    '$peso',
    '$manequim',
    '$biografia',
    '$foto_perfil',
    '$foto1',
    '$foto2',
    '$foto3',
    '$foto4',
    '$foto5'
 
)";
 
/*
=====================================================
EXECUTA O INSERT
=====================================================
*/
 
if ($conexao->query($sql) === TRUE) {
 
    /*
    =============================================
    REDIRECIONA PARA A PÁGINA DE SUCESSO
    =============================================
    */
 
    header("Location: cadastrorealizado.html");
 
} else {
 
    echo "Erro ao cadastrar: " . $conexao->error;
 
}
 
/*
=====================================================
FECHA CONEXÃO
=====================================================
*/
 
$conexao->close();
 
?>
 