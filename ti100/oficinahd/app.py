import os
from flask import Flask, render_template, request, redirect, url_for, session, flash
from banco import get_connection, DATABASE

try:
    from werkzeug.security import generate_password_hash, check_password_hash
    USE_HASH = True
except ImportError:
    USE_HASH = False

app = Flask(__name__, template_folder="templates", static_folder="static")
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "troque-isso-em-producao")


def usuario_atual():
    uid = session.get("user_id")
    return {"id": uid, "nome": session.get("user_nome")} if uid else None


@app.context_processor
def inject_user():
    return {"usuario": usuario_atual()}


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/login")
def login_page():
    return render_template("login.html")


@app.get("/cadastro")
def cadastro_page():
    return render_template("login.html", tab="register")


@app.post("/login")
def login_post():
    email = (request.form.get("email") or "").strip().lower()
    senha = request.form.get("senha") or ""

    if not email or not senha:
        flash("Preencha email e senha.", "error")
        return redirect(url_for("login_page"))

    with get_connection(database=DATABASE) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, nome, email, senha FROM usuarios WHERE email=%s LIMIT 1",
                (email,)
            )
            user = cur.fetchone()

    if not user:
        flash("Email ou senha inválidos.", "error")
        return redirect(url_for("login_page"))

    # Verifica senha: suporta hash PHP (password_hash) e hash Python
    senha_ok = False
    if USE_HASH:
        try:
            senha_ok = check_password_hash(user["senha"], senha)
        except Exception:
            # fallback: senha em texto puro (migração)
            senha_ok = user["senha"] == senha
    else:
        senha_ok = user["senha"] == senha

    if not senha_ok:
        flash("Email ou senha inválidos.", "error")
        return redirect(url_for("login_page"))

    session["user_id"]    = user["id"]
    session["user_nome"]  = user["nome"]
    session["user_email"] = user["email"]
    flash("Login realizado com sucesso!", "success")
    return redirect(url_for("index"))


@app.post("/cadastro")
def cadastro_post():
    nome  = (request.form.get("nome")  or "").strip()
    email = (request.form.get("email") or "").strip().lower()
    senha = request.form.get("senha") or ""

    if not nome or not email or not senha:
        flash("Preencha todos os campos.", "error")
        return redirect(url_for("cadastro_page"))

    if len(senha) < 6:
        flash("A senha deve ter pelo menos 6 caracteres.", "error")
        return redirect(url_for("cadastro_page"))

    senha_hash = generate_password_hash(senha) if USE_HASH else senha

    with get_connection(database=DATABASE) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM usuarios WHERE email=%s LIMIT 1", (email,))
            if cur.fetchone():
                flash("Este email já está cadastrado.", "error")
                return redirect(url_for("cadastro_page"))
            cur.execute(
                "INSERT INTO usuarios (nome, email, senha) VALUES (%s, %s, %s)",
                (nome, email, senha_hash)
            )
            new_id = cur.lastrowid

    session["user_id"]    = new_id
    session["user_nome"]  = nome
    session["user_email"] = email
    flash("Conta criada com sucesso!", "success")
    return redirect(url_for("index"))


@app.get("/logout")
def logout():
    session.clear()
    flash("Você saiu da sua conta.", "success")
    return redirect(url_for("login_page"))


if __name__ == "__main__":
    app.run(debug=False, host="127.0.0.1", port=5000)
