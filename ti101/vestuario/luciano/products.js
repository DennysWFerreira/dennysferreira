// products.js - ARTEX STUDIO
const products = [
    { 
        id: 1, 
        name: "Oversized - Zodiac Warriors", 
        category: "oversized", 
        price: 89.90, 
        originalPrice: 149.90, 
        discount: true, 
        imageUrl: "./img/sagitario.jpg",
        description: "Cosmo Dourado: A Flecha da Esperança é uma camiseta inspirada nos lendários Cavaleiros de Ouro, destacando o Cavaleiro de Sagitário em uma arte vibrante com fundo cósmico e detalhes dourados.", 
        stock: 12,
        quote: "Cada um carrega nas suas costas o peso das suas próprias escolhas."
    },
    { 
        id: 2, 
        name: "Oversized - Teorema da Vida", 
        category: "oversized", 
        price: 89.90, 
        originalPrice: 139.90, 
        discount: true, 
        imageUrl: "./img/cao.jpg",
        description: "Matemática da Vida – Se Tá Fácil, Tá Errado é uma camiseta divertida e cheia de personalidade.", 
        stock: 9,
        quote: "A VIDA É TIPO MATEMÁTICA, SE TÁ FÁCIL, TÁ ERRADO."
    },
    { 
        id: 3, 
        name: "Camiseta - Shadow Rider", 
        category: "camiseta", 
        price: 69.90, 
        originalPrice: null, 
        discount: false, 
        imageUrl: "./img/cavaleiro.jpg",
        description: "Shadow Rider – Edição Sombria traz um visual impactante inspirado nos lendários heróis mascarados japoneses.", 
        stock: 20,
        quote: "Soul of Gold - 黄金魂"
    },
    { 
        id: 4, 
        name: "Oversized - Primal Fury", 
        category: "oversized", 
        price: 99.90, 
        originalPrice: 159.90, 
        discount: true, 
        imageUrl: "./img/4.jpg",
        description: "Primal Fury – Instinto Supremo traz uma arte intensa inspirada em guerreiros lendários.", 
        stock: 7,
        quote: "Soul of Gold - 黄金魂"
    },
    { 
        id: 5, 
        name: "Camiseta - Escudo da Honra", 
        category: "camiseta", 
        price: 59.90, 
        originalPrice: 99.90, 
        discount: true, 
        imageUrl: "./img/escudo.jpg",
        description: "Escudo da Honra – Edição Guerreiro é uma camiseta com design imponente que simboliza força.", 
        stock: 15,
        quote: "O peso das suas próprias escolhas"
    },
    { 
        id: 6, 
        name: "Camiseta Cavaleiros Dourados", 
        category: "camiseta", 
        price: 49.90, 
        originalPrice: null, 
        discount: false, 
        imageUrl: "./img/3cara.jpg",
        description: "Estilo e poder em uma só peça! Camiseta preta com estampa vibrante de guerreiros lendários.", 
        stock: 30,
        quote: "Soul of Gold"
    },
    { 
        id: 7, 
        name: "Camiseta Saint Seiya", 
        category: "camiseta", 
        price: 69.90, 
        originalPrice: 109.90, 
        discount: true, 
        imageUrl: "./img/dourado.jpg",
        description: "Camiseta preta com estampa épica dos Cavaleiros de Ouro em ação!", 
        stock: 18,
        quote: "SE TÁ FÁCIL, TÁ ERRADO"
    },
    { 
        id: 8, 
        name: "Oversized - Soul of Gold", 
        category: "oversized", 
        price: 99.90, 
        originalPrice: 149.90, 
        discount: true, 
        imageUrl: "./img/coisas.jpg",
        description: "Camiseta preta com estampa oficial de Saint Seiya: Soul of Gold!", 
        stock: 5,
        quote: "黄金魂 - Alma Dourada"
    },
    { 
        id: 9, 
        name: "Camiseta Leão", 
        category: "camiseta", 
        price: 74.90, 
        originalPrice: null, 
        discount: false, 
        imageUrl: "./img/leao.jpg",
        description: "Camiseta preta com estampa realista de leão, símbolo de coragem e liderança.", 
        stock: 14,
        quote: "Cada um carrega o peso das suas próprias escolhas"
    },
    { 
        id: 10, 
        name: "Oversized Dragon Ball Z", 
        category: "oversized", 
        price: 89.90, 
        originalPrice: 149.90, 
        discount: true, 
        imageUrl: "./img/goku.jpg",
        description: "Moletom preto com estampa vibrante de Goku e Gohan em suas formas Super Saiyajin!", 
        stock: 11,
        quote: "A VIDA É TIPO MATEMÁTICA"
    },
    { 
        id: 11, 
        name: "Camiseta Pegasus Seiya", 
        category: "camiseta", 
        price: 49.90, 
        originalPrice: 79.90, 
        discount: true, 
        imageUrl: "./img/seia.jpg",
        description: "Camiseta preta com estampa vibrante de Seiya em sua armadura de Pégaso!", 
        stock: 22,
        quote: "Soul of Gold"
    },
    { 
        id: 12, 
        name: "Camiseta Os Cinco Cavaleiros", 
        category: "camiseta", 
        price: 79.90, 
        originalPrice: 119.90, 
        discount: true, 
        imageUrl: "./img/zodiacos.jpg",
        description: "Camiseta preta com estampa vibrante dos lendários Cavaleiros de Bronze!", 
        stock: 10,
        quote: "O peso das suas próprias escolhas"
    },
    { 
        id: 13, 
        name: "Moletom Saint Seiya", 
        category: "moletom", 
        price: 249.90, 
        originalPrice: 359.90, 
        discount: true, 
        imageUrl: "./img/moletom.png",
        description: "Moletom premium com estampa exclusiva da Akatsuki.", 
        stock: 17,
        quote: "Um dia vou me tornar Hokage!"
    },
    { 
        id: 14, 
        name: "Moletom Fé e Força", 
        category: "moletom",
        price: 279.90, 
        originalPrice: 349.90, 
        discount: true, 
        imageUrl: "./img/god.png",
        description: "Moletom com estampa luminosa de Jesus Cristo.", 
        stock: 13,
        quote: "Soul of Gold"
    }
];

function fixImageUrls() {
    const defaultImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e0d5c8'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-size='40' fill='%23ff3366'%3E⚡%3C/text%3E%3C/svg%3E";
    document.querySelectorAll('.product-img, .detail-img, .related-img, .cart-item-img, .order-item-img').forEach(el => {
        const imgStyle = el.style.backgroundImage;
        if (imgStyle && imgStyle !== 'none') {
            const url = imgStyle.replace(/url\(["']?/, '').replace(/["']?\)/, '');
            if (url && !url.includes('picsum.photos')) {
                const img = new Image();
                img.onerror = () => {
                    el.style.backgroundImage = `url('${defaultImage}')`;
                    el.style.backgroundSize = 'cover';
                };
                img.src = url;
            }
        }
    });
}

if (typeof window !== 'undefined') {
    window.products = products;
    window.fixImageUrls = fixImageUrls;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(fixImageUrls, 100);
    });
}