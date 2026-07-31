<?php session_start(); ?>
<!DOCTYPE html>
<html lang="pt-br">
 
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jumbox</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="style.css">
    <style>
        .badge-carrinho-fixo {
            position: fixed;
            bottom: 88px;
            right: 22px;
            width: 28px;
            height: 28px;
            background: #0d2b4e;
            color: white;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 13px;
            font-weight: bold;
            border: 2px solid white;
            z-index: 9999999;
        }
        .btn-qtd {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid #f87d26;
            background: transparent;
            color: #f87d26;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }
        .btn-qtd:hover { background: #f87d26; color: #fff; }
        .item-personalizado { transition: 0.2s; }
        .item-personalizado:hover { border-color: #f87d26 !important; background: #fff8f3; }
        .tipo-card {
            border-color: #e5e5e5 !important;
            transition: .2s;
            cursor: pointer;
        }
        .tipo-card:hover {
            border-color: #f87d26 !important;
            background: #fff8f3;
        }
    </style>
</head>
 
<body>
 
<a href="#conteudo-principal" class="pular-conteudo">Pular para o conteudo principal</a>
 
<!-- NAVBAR -->
<header class="header-main sticky-top py-5" role="banner">
    <div class="container d-flex justify-content-between align-items-center">
        <div class="logo-wrapper">
            <img src="imagens/jumbox.png" alt="Logotipo Jumbox" style="height: 110px;">
        </div>
        <nav class="nav-links d-none d-md-flex gap-4">
            <a href="#inicio" class="fs-5">Início</a>
            <a href="#como-funciona" class="fs-5">Como funciona</a>
            <a href="#sobre" class="fs-5">Sobre Nós</a>
            <a href="#cestas" class="fs-5">Nossas Cestas</a>
            <a href="#avaliacoes" class="fs-5">Avaliações</a>
        </nav>
        <div class="d-flex gap-3 align-items-center">
        <?php if (isset($_SESSION['usuario_nome'])): ?>
            <a href="meus_pedidos.php"
               class="btn btn-lg px-3 me-1"
               title="Meus Pedidos"
               style="background:#fff0e6; color:#f87d26; border:2px solid #f87d26; border-radius:12px;">
               <i class="bi bi-box-seam-fill"></i>
            </a>
            <span class="fw-bold text-dark fs-5"><i class="bi bi-person-circle me-2"></i><?= htmlspecialchars($_SESSION['usuario_nome']); ?></span>
            <a href="logout.php" class="btn btn-outline-danger btn-lg px-4 ms-3">Sair</a>
        <?php else: ?>
            <a href="login.php" class="btn btn-outline-dark btn-lg px-4 py-2 fw-bold fs-6">Entrar</a>
            <button type="button"
                    class="btn btn-orange text-white btn-lg px-4 py-2 fw-bold fs-6"
                    data-bs-toggle="modal"
                    data-bs-target="#modalTipoCadastro">
                Cadastre-se
            </button>
        <?php endif; ?>
        </div>
    </div>
</header>
 
<main id="conteudo-principal">
 
    <!-- INICIO -->
    <section id="inicio" class="container py-5">
        <div class="row align-items-center py-lg-5">
            <div class="col-lg-7">
                <h1 class="display-4 fw-bold text-blue">Conectando famílias com cuidado e confianca.</h1>
                <p class="lead mb-4">Cestas assistenciais aprovadas pelo sistema prisional, com praticidade e carinho para quem voce ama.</p>
                <div class="d-flex gap-3">
                    <a href="#cestas" class="btn btn-orange btn-lg text-white fw-bold">Montar minha cesta</a>
                    <a href="#como-funciona" class="btn btn-outline-orange btn-lg fw-bold">Como funciona</a>
                </div>
            </div>
            <div class="col-lg-5 mt-5 mt-lg-0">
                <div id="sobre" class="hero-about-box p-4 shadow-sm">
                    <h2 class="h4 text-orange fw-bold">Sobre Nós</h2>
                    <p>Conhecendo e observando a realidade de muitas pessoas que utilizam a Jumbox, 
                        tivemos a ideia de colocar esse plano em ação, visando solucionar a dificuldade enfrentada por aqueles que 
                        convivem com a realidade de ter que visitar, ou que não têm condições de se locomover para visitar, parentes em situação de reclusão penitenciária.
                        O principal objetivo é a produção de kits pré-definidos no site, com o intuito de otimizar o tempo dessas pessoas. 
                        Os preços variam do kit mais simples ao mais completo, para que qualquer pessoa, independentemente de sua classe social, 
                        possa garantir o "jumbo" de seu ente querido, levando um pouco de acalento, carinho e amor a cada JUMBOX entregue.</p>
                </div>
            </div>
        </div>
    </section>
 
    <!-- COMO FUNCIONA -->
    <section id="como-funciona" class="bg-light py-5">
        <div class="container text-center">
            <h3 class="section-title mb-5">Como funciona</h3>
            <div class="row g-4">
                <div class="col-md-3">
                    <div class="icon-circle mx-auto mb-3"><img src="imagens/Monte a sua.png" alt="Escolha"></div>
                    <h5 class="fw-bold">Escolha sua cesta</h5>
                </div>
                <div class="col-md-3">
                    <div class="icon-circle mx-auto mb-3"><img src="imagens/Organizacao.png" alt="Organizacao"></div>
                    <h5 class="fw-bold">A gente organiza</h5>
                </div>
                <div class="col-md-3">
                    <div class="icon-circle mx-auto mb-3"><img src="imagens/Retirada.png" alt="Retirada"></div>
                    <h5 class="fw-bold">Ponto de retirada</h5>
                </div>
                <div class="col-md-3">
                    <div class="icon-circle mx-auto mb-3"><img src="imagens/Entrega.png" alt="Entrega"></div>
                    <h5 class="fw-bold">Entrega segura</h5>
                </div>
            </div>
        </div>
    </section>
 
    <!-- CESTAS -->
    <section id="cestas" class="container py-5">
        <h3 class="section-title text-center mb-5">Nossos Jumbos</h3>
        <div id="carouselCestas" class="carousel slide" data-bs-ride="false">
            <div class="carousel-inner px-md-5">
 
                <!-- SLIDE 1: PEQUENO + MEDIO -->
                <div class="carousel-item active">
                    <div class="row justify-content-center g-4">
                        <div class="col-md-5 col-10">
                            <div class="card h-100 border-0 shadow-sm p-4 rounded-4 text-center">
                                <h4 class="fw-bold mb-2">Jumbo Pequeno</h4>
                                <p class="text-orange fw-bold fs-5 mb-1">10 a 15 itens</p>
                                <p class="fw-bold fs-4 text-dark mb-3">R$ 150,00</p>
                                <button class="btn btn-outline-orange w-100 fw-bold" data-bs-toggle="modal" data-bs-target="#modalPequeno">Ver detalhes</button>
                            </div>
                        </div>
                        <div class="col-md-5 col-10">
                            <div class="card h-100 border-0 shadow-sm p-4 rounded-4 text-center">
                                <h4 class="fw-bold mb-2">Jumbo Médio</h4>
                                <p class="text-orange fw-bold fs-5 mb-1">20 a 25 itens</p>
                                <p class="fw-bold fs-4 text-dark mb-3">R$ 280,00</p>
                                <button class="btn btn-outline-orange w-100 fw-bold" data-bs-toggle="modal" data-bs-target="#modalMedio">Ver detalhes</button>
                            </div>
                        </div>
                    </div>
                </div>
 
                <!-- SLIDE 2: GRANDE + PERSONALIZADO -->
                <div class="carousel-item">
                    <div class="row justify-content-center g-4">
                        <div class="col-md-5 col-10">
                            <div class="card h-100 border-0 shadow-sm p-4 rounded-4 text-center">
                                <h4 class="fw-bold mb-2">Jumbo Grande</h4>
                                <p class="text-orange fw-bold fs-5 mb-1">30 a 40 itens</p>
                                <p class="fw-bold fs-4 text-dark mb-3">R$ 320,00</p>
                                <button class="btn btn-outline-orange w-100 fw-bold" data-bs-toggle="modal" data-bs-target="#modalGrande">Ver detalhes</button>
                            </div>
                        </div>
                        <div class="col-md-5 col-10">
                            <div class="card h-100 border-0 shadow-sm p-4 rounded-4 text-center">
                                <h4 class="fw-bold mb-2">Jumbo Personalizado</h4>
                                <p class="text-orange fw-bold fs-5 mb-1">Monte do seu jeito</p>
                                <p class="fw-bold fs-4 text-dark mb-3">Preco variavel</p>
                                <button class="btn btn-outline-orange w-100 fw-bold" data-bs-toggle="modal" data-bs-target="#modalPersonalizado">Montar meu Jumbo</button>
                            </div>
                        </div>
                    </div>
                </div>
 
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselCestas" data-bs-slide="prev">
                <span class="control-btn-icon">&#10094;</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselCestas" data-bs-slide="next">
                <span class="control-btn-icon">&#10095;</span>
            </button>
        </div>
    </section>
 
    <!-- AVALIACOES -->
    <section id="avaliacoes" class="bg-light py-5">
        <div class="container text-center">
            <h3 class="section-title mb-5">Avaliações</h3>
            <div id="carouselReviews" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner px-md-5">
                    <div class="carousel-item active">
                        <div class="row justify-content-center g-4">
                            <div class="col-md-6">
                                <div class="p-4 bg-white rounded-4 shadow-sm h-100">
                                    <div class="stars mb-2">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                                    <p class="fst-italic small">"Retirada rapida e atendimento excelente."</p>
                                    <h6 class="fw-bold mb-0">Vanessa Almeida</h6>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-4 bg-white rounded-4 shadow-sm h-100">
                                    <div class="stars mb-2">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                                    <p class="fst-italic small">"Tudo organizado e sem preocupacao."</p>
                                    <h6 class="fw-bold mb-0">Adriana Lopes</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="carousel-item">
                        <div class="row justify-content-center g-4">
                            <div class="col-md-6">
                                <div class="p-4 bg-white rounded-4 shadow-sm h-100">
                                    <div class="stars mb-2">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                                    <p class="fst-italic small">"O melhor custo beneficio da regiao."</p>
                                    <h6 class="fw-bold mb-0">Marcos Silva</h6>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-4 bg-white rounded-4 shadow-sm h-100">
                                    <div class="stars mb-2">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                                    <p class="fst-italic small">"Atendimento humanizado e agil."</p>
                                    <h6 class="fw-bold mb-0">Juliana Costa</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselReviews" data-bs-slide="prev">
                    <span class="control-btn-icon">&#10094;</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselReviews" data-bs-slide="next">
                    <span class="control-btn-icon">&#10095;</span>
                </button>
            </div>
        </div>
    </section>
 
</main>
 
<!-- FOOTER -->
<footer id="contato" class="footer-main py-5 border-top bg-light">
    <div class="container">
        <div class="row align-items-start text-center text-md-start">
            <div class="col-md-4">
                <img src="imagens/jumbox.png" alt="Logo Jumbox" class="mb-3" style="max-height: 80px;">
                <p class="mb-3">Cestas assistenciais com proposito e carinho.</p>
                <a href="login_funcionario.php" class="btn btn-dark btn-sm rounded-pill px-4">Login Institucional</a>
            </div>
            <div class="col-md-4 text-center">
                <h5 class="fw-bold mb-3 text-orange">Navegação</h5>
                <ul class="list-unstyled">
                    <li><a href="#inicio" class="text-dark text-decoration-none">Início</a></li>
                    <li><a href="#cestas" class="text-dark text-decoration-none">Cestas</a></li>
                    <li><a href="#sobre" class="text-dark text-decoration-none">Sobre</a></li>
                </ul>
            </div>
            <div class="col-md-4 ps-md-5">
                <h5 class="fw-bold mb-3 text-orange">Contato</h5>
                <p class="mb-2">&#128231; contato@jumbox.com.br</p>
                <p class="mb-0">&#128222; (11) 99999-9999</p>
            </div>
        </div>
    </div>
</footer>
 
<!-- ============ MODAIS ============ -->
 
<!-- MODAL JUMBO PEQUENO -->
<div class="modal fade" id="modalPequeno" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow">
            <div class="modal-header border-0 bg-light rounded-top-4">
                <h5 class="modal-title fw-bold">Jumbo Pequeno &mdash; R$ 150,00</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <h6 class="fw-bold text-orange"><i class="bi bi-droplet-fill"></i> Higiene (4 a 5 itens)</h6>
                <ul class="list-unstyled ps-3 mb-4 text-muted">
                    <li>• Sabonete</li><li>• Shampoo</li><li>• Creme dental</li><li>• Escova</li><li>• Papel Higienico</li>
                </ul>
                <h6 class="fw-bold text-orange"><i class="bi bi-basket-fill"></i> Alimentacao (6 a 10 itens)</h6>
                <ul class="list-unstyled ps-3 text-muted">
                    <li>• Pao de forma</li><li>• Bolo</li><li>• Leite em po</li><li>• Margarina</li><li>• Bolacha</li><li>• Chocolate</li>
                </ul>
            </div>
            <div class="modal-footer border-0">
                <form action="carrinho_helper.php?action=adicionar" method="POST" class="w-100">
                    <input type="hidden" name="id" value="jumbo_pequeno">
                    <input type="hidden" name="nome" value="Jumbo Pequeno">
                    <input type="hidden" name="preco" value="150.00">
                    <button type="submit" class="btn btn-orange text-white w-100 fw-bold py-2">
                        <i class="bi bi-cart-plus me-2"></i> Adicionar ao Carrinho
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
 
<!-- MODAL JUMBO MEDIO -->
<div class="modal fade" id="modalMedio" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow">
            <div class="modal-header border-0 bg-light rounded-top-4">
                <h5 class="modal-title fw-bold">Jumbo Medio &mdash; R$ 280,00</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <h6 class="fw-bold text-orange"><i class="bi bi-droplet-fill"></i> Higiene (10 a 12 itens)</h6>
                <ul class="list-unstyled ps-3 mb-4 text-muted">
                    <li>• Shampoo</li><li>• Sabonetes</li><li>• Condicionador</li><li>• Creme dental</li>
                    <li>• Escovas</li><li>• Desodorante</li><li>• Barbeadores</li><li>• Papel higienico</li>
                    <li>• Cortador de unha</li><li>• Protetor Solar</li><li>• Anti-sarna</li><li>• Enxague bucal (sem alcool)</li>
                </ul>
                <h6 class="fw-bold text-orange"><i class="bi bi-basket-fill"></i> Alimentacao (10 a 13 itens)</h6>
                <ul class="list-unstyled ps-3 text-muted">
                    <li>• Adocante liquido</li><li>• Pao de forma</li><li>• Bolo industrial</li>
                    <li>• Leite em po</li><li>• Margarina</li><li>• Bolacha</li><li>• Chocolate</li><li>• Bala</li>
                </ul>
                <p class="text-muted small mt-3 fst-italic">* Quantidades de cada item a serem escolhidas pelo cliente</p>
            </div>
            <div class="modal-footer border-0">
                <form action="carrinho_helper.php?action=adicionar" method="POST" class="w-100">
                    <input type="hidden" name="id" value="jumbo_medio">
                    <input type="hidden" name="nome" value="Jumbo Medio">
                    <input type="hidden" name="preco" value="280.00">
                    <button type="submit" class="btn btn-orange text-white w-100 fw-bold py-2">
                        <i class="bi bi-cart-plus me-2"></i> Adicionar ao Carrinho
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
 
<!-- MODAL JUMBO GRANDE -->
<div class="modal fade" id="modalGrande" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow">
            <div class="modal-header border-0 bg-light rounded-top-4">
                <h5 class="modal-title fw-bold">Jumbo Grande &mdash; R$ 320,00</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <h6 class="fw-bold text-orange"><i class="bi bi-droplet-fill"></i> Higiene (15 a 20 itens)</h6>
                <ul class="list-unstyled ps-3 mb-4 text-muted">
                    <li>• Sabonetes</li><li>• Shampoo</li><li>• Condicionador</li><li>• Creme dental</li>
                    <li>• Escovas</li><li>• Desodorante</li><li>• Barbeadores</li><li>• Papel higienico</li>
                    <li>• Cortador de unha</li><li>• Protetor Solar</li><li>• Anti-sarna</li>
                    <li>• Enxague bucal (sem alcool)</li><li>• Cotonete</li><li>• Pente</li>
                </ul>
                <h6 class="fw-bold text-orange"><i class="bi bi-basket-fill"></i> Alimentacao (15 a 20 itens)</h6>
                <ul class="list-unstyled ps-3 text-muted">
                    <li>• Adocante liquido</li><li>• Pao de forma</li><li>• Bolo industrial</li>
                    <li>• Leite em po</li><li>• Margarina</li><li>• Bolacha</li><li>• Chocolate</li><li>• Bala</li>
                </ul>
                <p class="text-muted small mt-3 fst-italic">* Quantidades de cada item a serem escolhidas pelo cliente</p>
            </div>
            <div class="modal-footer border-0">
                <form action="carrinho_helper.php?action=adicionar" method="POST" class="w-100">
                    <input type="hidden" name="id" value="jumbo_grande">
                    <input type="hidden" name="nome" value="Jumbo Grande">
                    <input type="hidden" name="preco" value="320.00">
                    <button type="submit" class="btn btn-orange text-white w-100 fw-bold py-2">
                        <i class="bi bi-cart-plus me-2"></i> Adicionar ao Carrinho
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
 
<!-- MODAL JUMBO PERSONALIZADO -->
<div class="modal fade" id="modalPersonalizado" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content border-0 rounded-4 shadow">
            <div class="modal-header border-0 bg-light rounded-top-4">
                <h5 class="modal-title fw-bold">Jumbo Personalizado &mdash; Monte do seu jeito</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <p class="text-muted small mb-4">Escolha a quantidade de cada item. O total e calculado automaticamente.</p>
 
                <h6 class="fw-bold text-orange mb-3"><i class="bi bi-droplet-fill"></i> Higiene</h6>
                <div class="row g-3 mb-4">
                    <?php
                    $itens_higiene = [
                        'Sabonete'             => 3.00,
                        'Shampoo'              => 8.00,
                        'Condicionador'        => 8.00,
                        'Creme dental'         => 5.00,
                        'Escova de dente'      => 4.00,
                        'Desodorante'          => 9.00,
                        'Barbeador'            => 4.00,
                        'Papel higienico 4un'  => 7.00,
                        'Cortador de unha'     => 3.50,
                        'Protetor Solar'       => 12.00,
                        'Anti-sarna'           => 6.00,
                        'Enxague bucal'        => 9.00,
                        'Cotonete'             => 4.00,
                        'Pente'                => 2.50,
                    ];
                    foreach ($itens_higiene as $nome => $preco):
                        $slug = 'pers_' . preg_replace('/[^a-z0-9]/', '_', strtolower($nome));
                    ?>
                    <div class="col-6 col-md-4">
                        <div class="border rounded-3 p-2 text-center item-personalizado">
                            <div class="fw-bold small mb-1"><?= htmlspecialchars($nome) ?></div>
                            <div class="text-orange small mb-2">R$ <?= number_format($preco, 2, ',', '.') ?>/un</div>
                            <div class="d-flex align-items-center justify-content-center gap-2">
                                <button type="button" class="btn-qtd" onclick="alterarQtd('<?= $slug ?>', -1)">&#8722;</button>
                                <span id="qtd_<?= $slug ?>" class="fw-bold" style="min-width:24px">0</span>
                                <button type="button" class="btn-qtd" onclick="alterarQtd('<?= $slug ?>', 1)">+</button>
                            </div>
                            <input type="hidden" id="input_<?= $slug ?>" value="0"
                                   data-nome="<?= htmlspecialchars($nome) ?>" data-preco="<?= $preco ?>">
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
 
                <h6 class="fw-bold text-orange mb-3"><i class="bi bi-basket-fill"></i> Alimentacao</h6>
                <div class="row g-3">
                    <?php
                    $itens_alim = [
                        'Pao de forma'          => 7.00,
                        'Bolo industrial'       => 6.00,
                        'Leite em po 200g'      => 10.00,
                        'Margarina'             => 5.00,
                        'Bolacha cream cracker' => 4.00,
                        'Chocolate'             => 5.00,
                        'Bala'                  => 3.00,
                        'Adocante liquido'      => 5.00,
                    ];
                    foreach ($itens_alim as $nome => $preco):
                        $slug = 'pers_' . preg_replace('/[^a-z0-9]/', '_', strtolower($nome));
                    ?>
                    <div class="col-6 col-md-4">
                        <div class="border rounded-3 p-2 text-center item-personalizado">
                            <div class="fw-bold small mb-1"><?= htmlspecialchars($nome) ?></div>
                            <div class="text-orange small mb-2">R$ <?= number_format($preco, 2, ',', '.') ?>/un</div>
                            <div class="d-flex align-items-center justify-content-center gap-2">
                                <button type="button" class="btn-qtd" onclick="alterarQtd('<?= $slug ?>', -1)">&#8722;</button>
                                <span id="qtd_<?= $slug ?>" class="fw-bold" style="min-width:24px">0</span>
                                <button type="button" class="btn-qtd" onclick="alterarQtd('<?= $slug ?>', 1)">+</button>
                            </div>
                            <input type="hidden" id="input_<?= $slug ?>" value="0"
                                   data-nome="<?= htmlspecialchars($nome) ?>" data-preco="<?= $preco ?>">
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
 
                <div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                    <span class="fw-bold fs-5 text-blue">Total estimado:</span>
                    <span class="fw-bold fs-4 text-orange" id="totalPersonalizado">R$ 0,00</span>
                </div>
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-orange text-white w-100 fw-bold py-2" onclick="adicionarPersonalizado()">
                    <i class="bi bi-cart-plus me-2"></i> Adicionar ao Carrinho
                </button>
            </div>
        </div>
    </div>
</div>
 
<!-- FORM OCULTO PERSONALIZADO -->
<form id="formPersonalizado" action="carrinho_helper.php?action=adicionar" method="POST" style="display:none;">
    <input type="hidden" name="id" value="jumbo_personalizado">
    <input type="hidden" name="nome" id="nomePersonalizadoInput" value="Jumbo Personalizado">
    <input type="hidden" name="preco" id="precoPersonalizadoInput" value="0">
</form>
 
<!-- ============ MODAL TIPO DE CADASTRO ============ -->
<div class="modal fade" id="modalTipoCadastro" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow-lg" style="overflow:hidden;">
 
            <div style="background:#0d2b4e; padding:28px 32px 20px; position:relative;">
                <h5 style="font-family:sans-serif; color:#fff; font-weight:800; font-size:1.3rem; margin:0;">
                    Como deseja se cadastrar?
                </h5>
                <p style="color:rgba(255,255,255,.6); font-size:.85rem; margin:6px 0 0;">
                    Escolha o tipo de conta que melhor se encaixa ao seu perfil.
                </p>
                <button type="button" class="btn-close btn-close-white"
                        data-bs-dismiss="modal"
                        style="position:absolute;top:16px;right:16px;"></button>
            </div>
 
            <div class="modal-body p-4">
                <div class="row g-3">
 
                    <!-- Pessoa Fisica -->
                    <div class="col-12">
                        <a href="cadastro.php" class="text-decoration-none">
                            <div class="d-flex align-items-center gap-3 p-3 rounded-3 border tipo-card">
                                <div style="width:48px;height:48px;background:#fff0e6;border-radius:12px;
                                            display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    <i class="bi bi-person-fill" style="color:#f87d26;font-size:1.3rem;"></i>
                                </div>
                                <div>
                                    <div style="font-weight:700;color:#0d2b4e;font-size:.95rem;">Pessoa Fisica</div>
                                    <div style="font-size:.8rem;color:#888;">Para familiares e visitantes individuais</div>
                                </div>
                                <i class="bi bi-arrow-right ms-auto" style="color:#f87d26;font-size:1.1rem;"></i>
                            </div>
                        </a>
                    </div>
 
                    <!-- Pessoa Juridica -->
                    <div class="col-12">
                        <a href="cadastro_pj.php" class="text-decoration-none">
                            <div class="d-flex align-items-center gap-3 p-3 rounded-3 border tipo-card">
                                <div style="width:48px;height:48px;background:#fff0e6;border-radius:12px;
                                            display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    <i class="bi bi-building-fill" style="color:#f87d26;font-size:1.3rem;"></i>
                                </div>
                                <div>
                                    <div style="font-weight:700;color:#0d2b4e;font-size:.95rem;">Pessoa Juridica</div>
                                    <div style="font-size:.8rem;color:#888;">Para empresas e organizacoes</div>
                                </div>
                                <i class="bi bi-arrow-right ms-auto" style="color:#f87d26;font-size:1.1rem;"></i>
                            </div>
                        </a>
                    </div>
 
                </div>
 
                <p class="text-center mt-3 mb-0" style="font-size:.8rem;color:#aaa;">
                    Ja tem conta? <a href="login.php" style="color:#f87d26;font-weight:600;text-decoration:none;">Entrar agora</a>
                </p>
            </div>
 
        </div>
    </div>
</div>
<!-- ============ FIM MODAL TIPO DE CADASTRO ============ -->
 
<!-- CARRINHO FLUTUANTE -->
<a href="carrinho.php" class="carrinho-flutuante">
    <i class="bi bi-cart-fill"></i>
</a>
 
<span class="badge-carrinho-fixo">
    <?php
    $quantidade_carrinho = 0;
    if (isset($_SESSION['carrinho'])) {
        foreach ($_SESSION['carrinho'] as $item) {
            $quantidade_carrinho += $item['qtd'];
        }
    }
    echo $quantidade_carrinho;
    ?>
</span>
 
<!-- Bootstrap JS - versao unificada 5.3.3 -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script>
function alterarQtd(slug, delta) {
    const span  = document.getElementById('qtd_' + slug);
    const input = document.getElementById('input_' + slug);
    let qtd = parseInt(span.textContent) + delta;
    if (qtd < 0) qtd = 0;
    span.textContent = qtd;
    input.value = qtd;
    calcularTotal();
}
 
function calcularTotal() {
    let total = 0;
    document.querySelectorAll('#modalPersonalizado input[type="hidden"][data-preco]').forEach(function(input) {
        total += (parseInt(input.value) || 0) * (parseFloat(input.dataset.preco) || 0);
    });
    document.getElementById('totalPersonalizado').textContent =
        'R$ ' + total.toFixed(2).replace('.', ',');
    document.getElementById('precoPersonalizadoInput').value = total.toFixed(2);
}
 
function adicionarPersonalizado() {
    const total = parseFloat(document.getElementById('precoPersonalizadoInput').value);
    if (!total || total <= 0) {
        alert('Adicione pelo menos um item ao seu Jumbo Personalizado!');
        return;
    }
    let itens = [];
    document.querySelectorAll('#modalPersonalizado input[type="hidden"][data-preco]').forEach(function(input) {
        const qtd = parseInt(input.value) || 0;
        if (qtd > 0) itens.push(qtd + 'x ' + input.dataset.nome);
    });
    document.getElementById('nomePersonalizadoInput').value = 'Jumbo Personalizado (' + itens.join(', ') + ')';
    document.getElementById('formPersonalizado').submit();
}
</script>
 
</body>
</html>
 