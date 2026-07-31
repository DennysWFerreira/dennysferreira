<?php
session_start();
// Proteção: exige login para acessar o checkout
if (!isset($_SESSION['usuario_id'])) {
    header('Location: ./login.html?next=checkout');
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Checkout - Oficina do HD</title>

  <link rel="stylesheet" href="./css/style.css">
  <link rel="stylesheet" href="./css/checkout.css">
  <link rel="stylesheet" href="./css/nav-return.css">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>

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
      <input type="text" placeholder="Hinted search text">
      <i class="fa-solid fa-magnifying-glass"></i>
    </div>

    <div class="icons">
      <button class="icon-btn" onclick="location.href='./index.php'" aria-label="Voltar para a home">
        <i class="fa-solid fa-house"></i>
      </button>
      <button class="icon-btn" onclick="location.href='./carrinho.php'" aria-label="Carrinho">
        <i class="fa-solid fa-cart-shopping"></i>
        <span class="badge-carrinho" id="badge-carrinho">0</span>
      </button>
      <?php if (isset($_SESSION['usuario_id'])): ?>
        <span style="font-weight:700;color:#333;font-size:14px;margin-right:6px;"><?php echo htmlspecialchars($_SESSION['usuario_nome']); ?></span>
        <a href="php/logout.php" class="icon-btn" aria-label="Sair" title="Sair">
          <i class="fa-solid fa-right-from-bracket"></i>
        </a>
      <?php else: ?>
        <a href="login.html" class="icon-btn" aria-label="Login" title="Login">
          <i class="fa-regular fa-circle-user"></i>
        </a>
      <?php endif; ?>
    </div>
  </header>

  <section class="secao checkout-section">
    <div class="checkout-wrap">

      <div class="checkout-left">
        <div class="checkout-card checkout-card-form">
          <div class="checkout-header">
            <i class="fa-solid fa-credit-card"></i>
            <h2>FINALIZAR COMPRA</h2>
          </div>

          <p class="checkout-hint">Preencha os dados e escolha a forma de pagamento.</p>

          <form id="checkout-form" class="checkout-form" onsubmit="return false;">
            <div class="grid-2">
              <div class="field">
                <label for="nome">Nome</label>
                <input id="nome" name="nome" type="text" placeholder="Seu nome" required />
              </div>
              <div class="field">
                <label for="cpf">CPF</label>
                <input id="cpf" name="cpf" type="text" placeholder="000.000.000-00" required />
              </div>
            </div>

            <div class="grid-2">
              <div class="field">
                <label for="cep">CEP</label>
                <input id="cep" name="cep" type="text" placeholder="00000-000" required />
              </div>
              <div class="field">
                <label for="cidade">Cidade</label>
                <input id="cidade" name="cidade" type="text" placeholder="Cidade" required />
              </div>
            </div>

            <div class="field">
              <label for="endereco">Endereço</label>
              <input id="endereco" name="endereco" type="text" placeholder="Rua, número, complemento" required />
            </div>

            <div class="field">
              <label for="pagamento">Forma de pagamento</label>
              <div class="payment-methods" id="payment-methods">
                <button type="button" class="pm-btn active" data-method="pix">
                  <i class="fa-brands fa-pix"></i>
                  <span>PIX</span>
                </button>
                <button type="button" class="pm-btn" data-method="cartao" id="pm-btn-cartao" onclick="location.href='./cart-card.html'">
                  <i class="fa-regular fa-credit-card"></i>
                  <span>Cartão</span>
                </button>

              </div>
            </div>

            <!-- painel cartão (mostra quando selecionar "Cartão") -->
          <div class="cartao-panel" id="cartao-panel" style="display:none;">
              <div class="cartao-use-card-row" style="display:flex; justify-content:flex-end; margin-bottom:10px;">
                <button type="button" id="btn-usar-este-cartao" class="btn-secundario" style="height:42px;">Usar este cartão</button>
              </div>

              <div class="field">
                <label for="card-number">Número do cartão</label>
                <input id="card-number" name="card-number" type="text" inputmode="numeric" autocomplete="cc-number" placeholder="0000 0000 0000 0000" />
              </div>

              <!-- Parcelamento (aparece apenas com Cartão de crédito) -->
              <div class="parcelamento" id="parcelamento-section" style="display:none;">
                <div class="parcelamento-header">
                  <i class="fa-solid fa-receipt"></i>
                  <h3>Parcelamento</h3>
                </div>

                <div class="parcelamento-body">
                  <div class="field">
                    <label for="parcelamento-select">Escolha a quantidade de parcelas</label>
                    <select id="parcelamento-select" name="parcelamento-select" class="parcelamento-select">
                      <option value="">Selecione</option>
                    </select>
                    <div class="parcelamento-subhint" id="parcelamento-subhint">Opções calculadas automaticamente.</div>
                  </div>

                  <div class="parcelamento-summary" aria-live="polite">
                    <div class="parcelamento-summary-line">
                      <span id="parcelamento-summary">Selecione uma parcela para ver o valor.</span>
                    </div>
                  </div>

                  <input type="hidden" id="parcelamento-count" name="parcelamento-count" value="" />
                  <input type="hidden" id="parcelamento-value" name="parcelamento-value" value="" />
                </div>
              </div>

              <div class="grid-2">
                <div class="field">
                  <label for="card-exp">Validade</label>
                  <input id="card-exp" name="card-exp" type="text" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/AA" />
                </div>

                <div class="field">
                  <label for="card-cvv">CVV</label>
                  <input id="card-cvv" name="card-cvv" type="text" inputmode="numeric" autocomplete="cc-csc" placeholder="000" />
                </div>
              </div>

              <div class="field">
                <label for="card-name">Nome impresso</label>
                <input id="card-name" name="card-name" type="text" autocomplete="cc-name" placeholder="Como está no cartão" />
              </div>

              <div class="grid-2">
                <div class="field">
                  <label for="card-holder-cpf">CPF do titular</label>
                  <input id="card-holder-cpf" name="card-holder-cpf" type="text" inputmode="numeric" autocomplete="off" placeholder="000.000.000-00" />
                </div>

                <div class="field">
                  <label for="card-holder-phone">Telefone</label>
                  <input id="card-holder-phone" name="card-holder-phone" type="text" inputmode="text" autocomplete="tel" placeholder="(11) 99999-9999" />
                </div>
              </div>

              <div class="field">
                <label for="billing-address">Endereço de cobrança</label>
                <input id="billing-address" name="billing-address" type="text" autocomplete="address-line1" placeholder="Rua, nº, complemento" />
              </div>

              <div class="grid-2">
                <div class="field">
                  <label for="billing-neighborhood">Bairro</label>
                  <input id="billing-neighborhood" name="billing-neighborhood" type="text" autocomplete="address-level2" placeholder="Bairro" />
                </div>

                <div class="field">
                  <label for="billing-number-extra">Nº (complemento)</label>
                  <input id="billing-number-extra" name="billing-number-extra" type="text" autocomplete="off" placeholder="Ex.: Apto 12" />
                </div>
              </div>

              <div class="cartao-demo" style="color:#666; font-size:13px; margin-top:8px; line-height:1.4;">
                Pagamento por cartão em processamento seguro. Preencha os dados para concluir a contratação.
              </div>
            </div>

            <div class="checkout-actions">
              <button class="btn-comprar" id="btn-confirmar" type="submit" style="flex:1;">Confirmar pedido</button>

              <div class="summary-actions-right">
                <a class="btn-secundario" href="./index.php" style="flex:1;">Voltar ao carrinho</a>
                <button class="btn-cancelar" type="button" id="btn-cancelar-compra" style="flex:1;">Cancelar compra</button>
              </div>
            </div>

            <p class="checkout-hint checkout-hint-note">* Seus dados são protegidos e criptografados.</p>

            <div class="checkout-msg" id="checkout-msg" aria-live="polite"></div>
          </form>
        </div>
      </div>

      <aside class="checkout-right">
        <div class="checkout-card summary-card">
          <div class="checkout-header">
            <i class="fa-solid fa-bag-shopping"></i>
            <h2>RESUMO</h2>
          </div>

          <div id="checkout-itens" class="checkout-itens"></div>

          <div style="padding:0 18px 12px 18px;">
            <button class="btn-limpar" type="button" id="btn-limpar-produtos">Limpar produtos</button>
          </div>

          <div class="summary-row">
            <span>Subtotal</span>
            <b id="checkout-subtotal">R$ 0,00</b>
          </div>
          <div class="summary-row">
            <span>Frete</span>
            <b id="checkout-frete">R$ 0,00</b>
          </div>
          <div class="summary-row" id="parcelamento-resumo-linha" style="display:none;">
            <span id="parcelamento-resumo-label">Parcelamento</span>
            <b id="parcelamento-resumo-valor">—</b>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <b id="checkout-total">R$ 0,00</b>
          </div>

          <div class="payment-logos">
            <p><b>Formas de pagamento</b></p>
            <div class="logos">
              <i class="fa-brands fa-cc-visa"></i>
              <i class="fa-brands fa-cc-mastercard"></i>
              <i class="fa-brands fa-pix"></i>
            </div>
          </div>

          <div class="nav-return-wrap" style="margin-top:10px;">
            <a class="nav-return-btn" href="./index.php" aria-label="Voltar para a página inicial">
              <i class="fa-solid fa-arrow-left"></i>
              Voltar para a página inicial
            </a>
          </div>
        </div>
      </aside>

    </div>
  </section>

  <footer class="footer">
    <div class="footer-container">
      <div class="footer-box">
        <h3>QUEM SOMOS</h3>
        <p>Somos a 1ª Loja brasileira de Informática a possuir um novo olhar para os produtos eletrônicos.</p>
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
          <img src="https://www.sedex.com.br/wp-content/uploads/2020/10/logo-sedex.png" alt="SEDEX" />
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

  <!-- Carrinho (mesma UI do index) -->
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

  <!-- Modal de confirmação e processamento -->
  <div class="pay-overlay" id="confirm-overlay" aria-hidden="true"></div>

  <div class="pay-modal" id="confirm-modal" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="confirm-modal-title">
    <div class="pay-modal-header">
      <div class="pay-modal-title-wrap">
        <i class="fa-solid fa-credit-card" aria-hidden="true"></i>
        <h3 id="confirm-modal-title">Confirmação de pagamento</h3>
      </div>
      <button class="pay-modal-close" type="button" id="btn-modal-fechar" aria-label="Fechar">✕</button>
    </div>

    <p class="pay-modal-text">Tem certeza que deseja usar este cartão para concluir a compra?</p>

    <div class="pay-modal-section">
      <div class="pay-modal-section-title">Parcelamento:</div>

      <div class="pay-modal-field">
        <label for="modal-parcelamento-select">Escolha a quantidade de parcelas</label>
        <select id="modal-parcelamento-select" class="pay-modal-select">
          <option value="">Selecione</option>
        </select>
      </div>

      <div class="pay-modal-summary" aria-live="polite" id="modal-parcelamento-summary">
        Selecione uma parcela para ver o valor.
      </div>
    </div>

    <div class="pay-modal-actions">
      <button type="button" class="btn-cancelar" id="btn-modal-nao">Não</button>
      <button type="button" class="btn-comprar" id="btn-modal-confirmar">Confirmar compra</button>
    </div>
  </div>

  <div class="process-overlay" id="process-overlay" aria-hidden="true"></div>

  <div class="process-modal" id="process-modal" role="status" aria-live="polite" aria-hidden="true">
    <div class="process-box">
      <div class="process-spinner" aria-hidden="true"></div>
      <div class="process-text" id="process-text">Processando pagamento...</div>
      <div class="process-subtext" id="process-subtext">Aguarde um instante.</div>
    </div>
  </div>

  <script src="js/script.js"></script>
  <script src="js/checkout.js"></script>
  <script src="js/card-page.js" defer></script>

</body>
</html>


