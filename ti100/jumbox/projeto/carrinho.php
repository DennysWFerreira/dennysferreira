<?php
session_start();
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Seu Carrinho de Compras</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light py-5">
    <div class="container bg-white p-5 rounded shadow-sm" style="max-width: 800px;">
        <h2 class="fw-bold mb-4 text-primary">Seu Carrinho de Compras</h2>
        
        <?php if (!isset($_SESSION['carrinho']) || empty($_SESSION['carrinho'])): ?>
            <div class="alert alert-warning">Seu carrinho está vazio!</div>
            <a href="index.php" class="btn btn-secondary">Voltar e escolher Jumbos</a>
        <?php else: ?>
            <table class="table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Preço</th>
                        <th>Qtd</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                    $total_geral = 0;
                    foreach ($_SESSION['carrinho'] as $id => $item): 
                        $subtotal = $item['preco'] * $item['qtd'];
                        $total_geral += $subtotal;
                    ?>
                        <tr>
                            <td><?= $item['nome'] ?></td>
                            <td>R$ <?= number_format($item['preco'], 2, ',', '.') ?></td>
                            <td><?= $item['qtd'] ?></td>
                            <td>R$ <?= number_format($subtotal, 2, ',', '.') ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            
            <div class="d-flex justify-content-between align-items-center mt-4">
                <h4>Total Geral: <strong class="text-success">R$ <?= number_format($total_geral, 2, ',', '.') ?></strong></h4>
                <div>
                    <a href="index.php" class="btn btn-outline-secondary me-2">Continuar Comprando</a>
                    
                    <a href="finalizar_pedido.php"><button class="btn btn-success fw-bold">Finalizar Compra</button></a>
                </div>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>