// =====================================================
// PORTFÓLIO - DENNYS FERREIRA
// Script Principal
// =====================================================

// ----------------------------
// BOTÃO VOLTAR AO TOPO
// ----------------------------

const topButton = document.getElementById("topButton");

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {

        topButton.classList.add("show");

    } else {

        topButton.classList.remove("show");

    }

});

topButton.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

// ----------------------------
// NAVBAR TRANSPARENTE
// ----------------------------

const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        nav.classList.add("nav-scroll");

    } else {

        nav.classList.remove("nav-scroll");

    }

});

// ----------------------------
// SCROLL REVEAL
// ----------------------------

const revealElements = document.querySelectorAll(

    ".categoria, .hero-text, .bio, .card"

);

const reveal = () => {

    const trigger = window.innerHeight * 0.88;

    revealElements.forEach(item => {

        const top = item.getBoundingClientRect().top;

        if (top < trigger) {

            item.classList.add("active");

        }

    });

};

window.addEventListener("scroll", reveal);

reveal();

// ----------------------------
// EFEITO 3D NOS CARDS
// ----------------------------

document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("mousemove", e => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = (y - rect.height / 2) / 18;
        const rotateY = (rect.width / 2 - x) / 18;

        card.style.transform =
            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-8px)`;

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});

// ----------------------------
// PARALLAX SUAVE
// ----------------------------

const blob = document.querySelector(".blob");

window.addEventListener("scroll", () => {

    const value = window.scrollY * 0.15;

    if(blob){

        blob.style.transform = `translateY(${value}px)`;

    }

});

// ----------------------------
// DIGITAÇÃO NO TÍTULO
// ----------------------------

const titulo = document.querySelector(".hero-text h1");

if(titulo){

    const texto = titulo.innerText;

    titulo.innerHTML = "";

    let i = 0;

    function escrever(){

        if(i < texto.length){

            titulo.innerHTML += texto.charAt(i);

            i++;

            setTimeout(escrever,90);

        }

    }

    escrever();

}