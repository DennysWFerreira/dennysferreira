<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Oficina do HD</title>

  <!-- CSS -->
  <link rel="stylesheet" href="./css/style.css">

  <!-- FONTES -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@300;400;500;600;700&display=swap"
    rel="stylesheet">

  <!-- FONT AWESOME -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

</head>

<body>
<?php

session_start();

?>




  <!-- HEADER -->
  <header class="topo">

    <a class="logo-area" href="./index.php" aria-label="Ir para a página inicial" style="text-decoration:none; display:flex; align-items:center; gap:16px;">

      <div class="logo">
        <img src="./img/Gemini_Generated_Image_1nkg661nkg661nkg__3_-removebg-preview.png" alt="Logo">
      </div>

      <div class="logo-texto">
        <h1>OFICINA</h1>
        <span>DO</span>
        <h2>HD</h2>
      </div>

    </a>

    <div class="search-box">

      <i class="fa-solid fa-bars"></i>

      <input type="text">

      <i class="fa-solid fa-magnifying-glass"></i>

    </div>

    <div class="icons">

      <div>
      <?php if (isset($_SESSION['usuario_nome'])): ?>

        <p>
            <?php echo $_SESSION['usuario_nome']; ?>
      </p>
      <?php endif ?>

      </div>

      <!-- CARRINHO -->
      <button class="icon-btn" data-cart-toggle aria-label="Abrir carrinho">
        <i class="fa-solid fa-cart-shopping"></i>
        <span class="cart-badge" data-cart-count>0</span>
      </button>

      <!-- PEDIDOS -->
      <button class="icon-btn" onclick="location.href='./meus-pedidos.php'" aria-label="Meus pedidos">
        <i class="fa-solid fa-receipt"></i>
      </button>

      <!-- LOGIN / LOGOUT -->
      <?php if (isset($_SESSION['usuario_id'])): ?>
        <a href="php/logout.php" class="icon-btn" aria-label="Sair" title="Sair da conta">
          <i class="fa-solid fa-right-from-bracket"></i>
        </a>
      <?php else: ?>
        <a href="login.html" class="icon-btn" aria-label="Login" title="Entrar">
          <i class="fa-regular fa-circle-user"></i>
        </a>
      <?php endif; ?>

    </div>

  </header>

  <!-- BANNER -->
  <section class="banner-area">

    <button class="seta esquerda">
      <i class="fa-solid fa-chevron-left"></i>
    </button>

    <div class="banner-slider">

      <img class="banner ativo" src="./img/ChatGPT Image 28 de abr. de 2026, 20_06_00.png">

      <img class="banner" src="img/ChatGPT Image 18 de mai. de 2026, 21_55_03.png">

      <img class="banner" src="img/ChatGPT Image 18 de mai. de 2026, 21_55_09.png">

      <img class="banner" src="img/ChatGPT Image 18 de mai. de 2026, 21_55_13.png">
    </div>

    <button class="seta direita">
      <i class="fa-solid fa-chevron-right"></i>
    </button>

  </section>

  <!-- ESPECIALIZADOS -->
  <section class="secao">

    <div class="titulo-area">
      <h2>ESPECIALIZADOS</h2>
      <div class="linha"></div>
    </div>

    <div class="marcas">

      <div class="marca-card">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg">
      </div>

      <div class="marca-card">
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg">
      </div>

      <div class="marca-card">
        <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg">
      </div>

      <div class="marca-card">
        <img src="./img/intel-logo-transparent-free-png.webp">
      </div>

    </div>

  </section>

  <!-- PRODUTOS -->
  <section class="secao">

    <div class="titulo-area">
      <h2>PRODUTOS</h2>
      <div class="linha"></div>
    </div>

    <div class="produtos-area">

      <div
        class="carrossel-produtos"
        data-autoplay="false"
        data-autoplay-interval="3500"
      >
        <button class="seta-produto seta-produto-prev" type="button" aria-label="Próximos produtos (voltar)">
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <div class="carrossel-viewport" data-carousel-viewport="true">

          <div class="carrossel-track" data-carousel-track>

            <div class="produto-card" data-product data-page="1">
              <div class="desconto">40% off</div>
              <img src="./img/41kYqZoclCL._AC_SX679_.jpg" alt="Kit 20 Cabo Sata">

              <h3>Kit 20 Cabo Sata</h3>

              <span>3x de R$6,67 sem juros</span>

              <p>R$ 20,00</p>

              <button class="comprar-btn" type="button" data-add-to-cart data-id="kit20" data-name="Kit 20 Cabo Sata"
                data-price="20" data-image="./img/41kYqZoclCL._AC_SX679_.jpg">
                Comprar
              </button>

            </div>

            <div class="produto-card" data-product data-page="1">
              <div class="desconto">40% off</div>
              <img src="./img/41kYqZoclCL._AC_SX679_.jpg" alt="Kit 100 Cabo Sata">
              <h3>Kit 100 Cabo Sata</h3>
              <span>3x de R$33,00 sem juros</span>
              <p>R$ 99,00</p>
              <button class="comprar-btn" type="button" data-add-to-cart data-id="kit100" data-name="Kit 100 Cabo Sata"
                data-price="99" data-image="./img/41kYqZoclCL._AC_SX679_.jpg">
                Comprar
              </button>
            </div>

            <div class="produto-card" data-product data-page="1">
              <div class="desconto">40% off</div>
              <img src="./img/41kYqZoclCL._AC_SX679_.jpg" alt="Kit 300 Cabo Sata">
              <h3>Kit 300 Cabo Sata</h3>
              <span>3x de R$100,00 sem juros</span>
              <p>R$ 300,00</p>
              <button class="comprar-btn" type="button" data-add-to-cart data-id="kit300" data-name="Kit 300 Cabo Sata"
                data-price="300" data-image="./img/41kYqZoclCL._AC_SX679_.jpg">
                Comprar
              </button>
            </div>

            <div class="produto-card" data-product data-page="1">
              <div class="desconto">40% off</div>
              <img src="./img/41kYqZoclCL._AC_SX679_.jpg" alt="Kit 500 Cabo Sata">
              <h3>Kit 500 Cabo Sata</h3>
              <span>3x de R$166,67 sem juros</span>
              <p>R$ 500,00</p>

              <button class="comprar-btn" type="button" data-add-to-cart data-id="kit500" data-name="Kit 500 Cabo Sata"
                data-price="500" data-image="./img/41kYqZoclCL._AC_SX679_.jpg">
                Comprar
              </button>
            </div>

            <div class="produto-card" data-product data-page="1">
              <div class="desconto">40% off</div>
              <img src="./img/41kYqZoclCL._AC_SX679_.jpg" alt="Kit 250 Cabo Sata">
              <h3>Kit 250 Cabo Sata</h3>
              <span>3x de R$83,33 sem juros</span>
              <p>R$ 250,00</p>

              <button class="comprar-btn" type="button" data-add-to-cart data-id="kit250" data-name="Kit 250 Cabo Sata"
                data-price="250" data-image="./img/41kYqZoclCL._AC_SX679_.jpg">
                Comprar
              </button>
            </div>

          </div>
        </div>

        <button class="seta-produto seta-produto-next" type="button" aria-label="Próximos produtos">
          <i class="fa-solid fa-chevron-right"></i>
        </button>

        <div class="carrossel-indicadores" data-carousel-indicators aria-hidden="true"></div>
      </div>

    </div>

  </section>


  <!-- AVALIAÇÕES -->
  <section class="secao">

    <div class="titulo-area">
      <h2>AVALIAÇÕES</h2>
      <div class="linha"></div>
    </div>

    <div class="avaliacoes">

      <button class="seta-av">
        <i class="fa-solid fa-chevron-left"></i>
      </button>

      <div class="reviews">

        <div class="review-card">
          <h4>Nilson Alves</h4>
          <p>Comprei um PC incrível nessa loja e não poderia estar mais satisfeito!</p>
          <span>★★★★★</span>
        </div>

        <div class="review-card">
          <h4>Nany Peres</h4>
          <p>Muito atenciosos, indicações e soluções perfeitas.</p>
          <span>★★★★★</span>
        </div>

        <div class="review-card">
          <h4>Gilvan Barros</h4>
          <p>Gostaria de agradecer a empresa pelo atendimento ótimo!</p>
          <span>★★★★★</span>
        </div>

      </div>

      <button class="seta-av">
        <i class="fa-solid fa-chevron-right"></i>
      </button>

    </div>

  </section>

  <!-- CARRINHO -->
  <div class="cart-overlay" data-cart-overlay></div>

  <aside class="cart-panel" data-cart-panel aria-hidden="true">

    <div class="cart-header">
      <div>
        <h3>Seu carrinho</h3>
        <span class="cart-subtitle" data-cart-count>0 itens</span>
      </div>

      <button class="cart-close" data-cart-close>✕</button>
    </div>

    <div class="cart-items" data-cart-items></div>

    <div class="cart-footer">

      <div class="cart-subtotal-line">
        <span>Subtotal</span>
        <strong data-cart-subtotal>R$ 0,00</strong>
      </div>

      <button class="cart-checkout">
        Finalizar compra
      </button>

    </div>

  </aside>

  <!-- FOOTER -->
  <footer class="footer">

    <div class="footer-container">

      <div class="footer-box">
        <h3>QUEM SOMOS</h3>
        <p>Somos a 1º Loja brasileira de Informática a possuir um novo olhar para os produtos eletrônicos.</p>
      </div>

      <div class="footer-box">
        <h3>CONTATO</h3>
        <p>5511988586272</p>
        <p>11988586272</p>
        <p>sohdbrasil@gmail.com</p>
        <p>Rua Cruzeiro, 959</p>
      </div>

      <div class="footer-box">
        <h3>FORMAS DE PAGAMENTO</h3>

        <div class="pagamentos">
          <i class="fa-brands fa-cc-visa"></i>
          <i class="fa-brands fa-cc-mastercard"></i>
          <i class="fa-brands fa-pix"></i>
        </div>

        <h3>MEIOS DE ENVIO</h3>

        <div class="envio">
          <img src="https://logodownload.org/wp-content/uploads/2017/03/correios-logo-8.png">
        </div>
      </div>

      <div class="footer-box">
        <input type="email" placeholder="Email">
        <input type="text" placeholder="(11) 99999-9999">
        <button>Enviar</button>
      </div>

    </div>

    <div class="footer-bottom">
      <p>Copyright OFICINA DO HD - 2026.</p>
    </div>

  </footer>


  <!-- Status de sessão para o JS -->
  <script>
    window.__LOGADO__ = <?php echo isset($_SESSION['usuario_id']) ? 'true' : 'false'; ?>;
  </script>
  <script src="./js/script.js"></script>
  <script src="./js/carrossel-produtos.js"></script>


</body>

</html>