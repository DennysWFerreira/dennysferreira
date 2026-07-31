document.addEventListener("DOMContentLoaded", () => {
 
    AOS.init({
        duration: 800,
        once: true
    });
 
    const form = document.getElementById("formContato");
 
    form.addEventListener("submit", (e) => {
 
        e.preventDefault();
 
        const btn = form.querySelector("button");
 
        btn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Enviando...';
 
        btn.disabled = true;
 
        setTimeout(() => {
 
            alert(
                "✅ Mensagem enviada com sucesso! Entraremos em contato em breve."
            );
 
            form.reset();
 
            btn.innerHTML =
            '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
 
            btn.disabled = false;
 
        }, 1500);
 
    });
 
});