# Oficina do HD — Loja Virtual

## Requisitos
- PHP 8.0+ com extensão MySQLi habilitada
- MySQL 5.7+ / MariaDB 10.4+
- Python 3.9+ com Flask e PyMySQL (opcional — o back-end principal é PHP)

## Instalação

### 1. Banco de dados
```bash
mysql -u root -p < setup_banco.sql
```

### 2. Configurar credenciais do banco
Crie um arquivo `.env` na raiz ou configure diretamente no servidor web com as variáveis:
```
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=oficina_hd
```

### 3. Servidor PHP (Apache/Nginx)
Aponte o DocumentRoot para a pasta `oficinahd/`.
Certifique-se de que o PHP tem permissão de leitura às variáveis de ambiente.

### 4. Servidor Python/Flask (opcional)
```bash
pip install flask pymysql werkzeug
python app.py
```

## Estrutura de arquivos
```
index.php          — Página inicial
login.html         — Login e cadastro
checkout.php       — Finalização de compra
pix.html           — Pagamento Pix
meus-pedidos.php   — Histórico de pedidos
pedido-aprovado.html
pedido-cancelado.html
php/               — Back-end PHP
js/                — JavaScript do front-end
css/               — Estilos
img/               — Imagens
```

## Alterações realizadas
1. **Segurança**: Credenciais do banco movidas para variáveis de ambiente
2. **Segurança**: Senhas agora são armazenadas com hash (password_hash/bcrypt)
3. **Segurança**: `listar_pedidos.php` retorna apenas os pedidos do usuário logado
4. **Segurança**: `detalhes_pedido.php` verifica se o pedido pertence ao usuário
5. **Bug fix**: Chave do localStorage do carrinho unificada (`oficina_hd_carrinho_v1`)
6. **Bug fix**: Banner — apenas 1 imagem com classe `ativo` ao carregar
7. **Bug fix**: `session_start()` adicionado em `cadastrar.php` e `login.php`
8. **Bug fix**: Validação de email com `filter_var()` nos formulários PHP
9. **Bug fix**: Validação mínima de senha (6 caracteres)
10. **Melhoria**: `checkout.html` → `checkout.php` com sessão PHP
11. **Melhoria**: `meus-pedidos.html` → `meus-pedidos.php` com sessão PHP
12. **Melhoria**: Header mostra nome do usuário e botão "Sair" quando logado
13. **Bug fix**: `criar_pedido.php` valida dados de entrada (forma de pagamento, status, valor)
14. **Bug fix**: `index.php` — usuário logado vê botão "Sair" em vez de "Login"
