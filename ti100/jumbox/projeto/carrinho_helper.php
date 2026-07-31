<?php
session_start();

// Verifica se a ação é de adicionar um item
if (isset($_GET['action']) && $_GET['action'] === 'adicionar') {
    
    // Filtra e valida as entradas vindas do formulário
    $id    = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_SPECIAL_CHARS);
    $nome  = filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_SPECIAL_CHARS);
    $preco = filter_input(INPUT_POST, 'preco', FILTER_VALIDATE_FLOAT);

    if ($id && $nome && $preco !== false) {
        // Inicializa o carrinho se ele não existir na sessão
        if (!isset($_SESSION['carrinho'])) {
            $_SESSION['carrinho'] = [];
        }

        // Se o produto já estiver no carrinho, apenas aumenta a quantidade
        if (isset($_SESSION['carrinho'][$id])) {
            $_SESSION['carrinho'][$id]['qtd'] += 1;
        } else {
            // Se for um item novo, adiciona ao carrinho
            $_SESSION['carrinho'][$id] = [
                'nome'  => $nome,
                'preco' => $preco,
                'qtd'   => 1
            ];
        }
    }
}

// ==========================================
// AQUI ESTÁ A MÁGICA DO REDIRECIONAMENTO:
// Após processar, envia o usuário direto para o carrinho
// ==========================================
header("Location: carrinho.php");
exit();