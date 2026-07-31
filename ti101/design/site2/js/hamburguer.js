document.addEventListener("DOMContentLoaded", () => {

    console.log("JS carregou");

    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    console.log(hamburger);
    console.log(navMenu);

    hamburger.addEventListener("click", () => {

        console.log("clicou");

        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");

    });

});