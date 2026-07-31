import os
import pymysql

HOST     = os.environ.get("DB_HOST",     "localhost")
USER     = os.environ.get("DB_USER",     "dennys07_root")
PASSWORD = os.environ.get("DB_PASSWORD", "Senac@123")
DATABASE = os.environ.get("DB_NAME",     "dennys07_oficinahd")
PORT     = int(os.environ.get("DB_PORT", 3306))


def get_connection(database=None):
    return pymysql.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=database,
        port=PORT,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True,
    )


def criar_banco_e_tabelas():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"CREATE DATABASE IF NOT EXISTS {DATABASE} "
                "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
            )

    with get_connection(database=DATABASE) as conn:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS usuarios (
                    id         INT AUTO_INCREMENT PRIMARY KEY,
                    nome       VARCHAR(255) NOT NULL,
                    email      VARCHAR(255) UNIQUE NOT NULL,
                    senha      VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS pedidos (
                    id               INT AUTO_INCREMENT PRIMARY KEY,
                    usuario_id       INT           NULL,
                    status           VARCHAR(100)  NOT NULL DEFAULT 'Pendente',
                    forma_pagamento  VARCHAR(50)   NOT NULL,
                    valor_total      DECIMAL(10,2) NOT NULL DEFAULT 0,
                    data_pedido      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX (usuario_id)
                );
            """)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS pedido_itens (
                    id           INT AUTO_INCREMENT PRIMARY KEY,
                    pedido_id    INT           NOT NULL,
                    produto_id   VARCHAR(50)   NOT NULL DEFAULT '',
                    nome_produto VARCHAR(255)  NOT NULL,
                    quantidade   INT           NOT NULL DEFAULT 1,
                    preco        DECIMAL(10,2) NOT NULL,
                    INDEX (pedido_id)
                );
            """)


if __name__ == "__main__":
    criar_banco_e_tabelas()
    print("Banco e tabelas prontos.")
