-- ============================================================
--  SETUP DO BANCO DE DADOS — Oficina do HD
--  Execute: mysql -u root -p < setup_banco.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS dennys07_oficinahd
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE dennys07_oficinahd;

CREATE TABLE IF NOT EXISTS usuarios (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    nome       VARCHAR(255)        NOT NULL,
    email      VARCHAR(255) UNIQUE NOT NULL,
    senha      VARCHAR(255)        NOT NULL,
    criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- usuario_id é NULL quando o cliente não está logado
CREATE TABLE IF NOT EXISTS pedidos (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id       INT           NULL,
    valor_total      DECIMAL(10,2) NOT NULL,
    forma_pagamento  VARCHAR(30)   NOT NULL,
    status           ENUM('Pendente','Pago','Processando','Enviado','Entregue','Cancelado')
                       DEFAULT 'Pendente',
    data_pedido      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (usuario_id)
);

CREATE TABLE IF NOT EXISTS pedido_itens (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id    INT           NOT NULL,
    produto_id   VARCHAR(50)   NOT NULL DEFAULT '',
    nome_produto VARCHAR(255)  NOT NULL,
    quantidade   INT           NOT NULL,
    preco        DECIMAL(10,2) NOT NULL,
    INDEX (pedido_id),
    CONSTRAINT fk_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);
