// ==============================================
// Partículas Tecnológicas
// ==============================================

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

document.getElementById("particles").appendChild(canvas);

let w, h;
let particles = [];
let mouse = {
    x: null,
    y: null,
    radius: 140
};

function resize() {

    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

}

window.addEventListener("resize", resize);

resize();

// --------------------------

window.addEventListener("mousemove", e => {

    mouse.x = e.clientX;
    mouse.y = e.clientY;

});

// --------------------------

class Particle{

    constructor(){

        this.reset();

    }

    reset(){

        this.x = Math.random()*w;
        this.y = Math.random()*h;

        this.vx = (Math.random()-0.5)*0.6;
        this.vy = (Math.random()-0.5)*0.6;

        this.size = Math.random()*2+1;

    }

    update(){

        this.x += this.vx;
        this.y += this.vy;

        if(this.x<0 || this.x>w)
            this.vx *= -1;

        if(this.y<0 || this.y>h)
            this.vy *= -1;

    }

    draw(){

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI*2
        );

        ctx.fillStyle="#00d4ff";

        ctx.shadowBlur=12;
        ctx.shadowColor="#00d4ff";

        ctx.fill();

    }

}

// --------------------------

for(let i=0;i<90;i++){

    particles.push(new Particle());

}

// --------------------------

function connect(){

    for(let a=0;a<particles.length;a++){

        for(let b=a;b<particles.length;b++){

            let dx=particles[a].x-particles[b].x;
            let dy=particles[a].y-particles[b].y;

            let dist=Math.sqrt(dx*dx+dy*dy);

            if(dist<120){

                ctx.beginPath();

                ctx.moveTo(
                    particles[a].x,
                    particles[a].y
                );

                ctx.lineTo(
                    particles[b].x,
                    particles[b].y
                );

                ctx.strokeStyle=
                `rgba(0,212,255,${
                    1-dist/120
                })`;

                ctx.lineWidth=1;

                ctx.stroke();

            }

        }

    }

}

// --------------------------

function mouseGlow(){

    if(mouse.x==null) return;

    particles.forEach(p=>{

        const dx=mouse.x-p.x;
        const dy=mouse.y-p.y;

        const dist=Math.sqrt(dx*dx+dy*dy);

        if(dist<mouse.radius){

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                6,
                0,
                Math.PI*2
            );

            ctx.fillStyle="rgba(0,212,255,.35)";

            ctx.fill();

        }

    });

}

// --------------------------

function animate(){

    ctx.clearRect(0,0,w,h);

    particles.forEach(p=>{

        p.update();
        p.draw();

    });

    connect();

    mouseGlow();

    requestAnimationFrame(animate);

}

animate();