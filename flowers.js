 // -----------------------------
// IMAGINI FLORI + INIMIOARE + PETALE (FUNCȚIONALE 100%)
// -----------------------------
const FLOWERS = [
    "https://raw.githubusercontent.com/cosmindevstuff/overlay-assets/main/flowers/rose1.png",
    "https://raw.githubusercontent.com/cosmindevstuff/overlay-assets/main/flowers/rose2.png",
    "https://raw.githubusercontent.com/cosmindevstuff/overlay-assets/main/flowers/cherry.png",
    "https://raw.githubusercontent.com/cosmindevstuff/overlay-assets/main/flowers/tulip.png"
];

const HEARTS = [
    "https://raw.githubusercontent.com/cosmindevstuff/overlay-assets/main/hearts/heart1.png",
    "https://raw.githubusercontent.com/cosmindevstuff/overlay-assets/main/hearts/heart2.png"
];

const PETALS = [
    "https://raw.githubusercontent.com/cosmindevstuff/overlay-assets/main/petals/petal1.png",
    "https://raw.githubusercontent.com/cosmindevstuff/overlay-assets/main/petals/petal2.png"
]; 

// -----------------------------
// CANVAS
// -----------------------------
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

// -----------------------------
// OBIECTE
// -----------------------------
let objects = [];
const MAX_OBJECTS = 200;

// -----------------------------
// SPAWN PETALE CONTINUU
// -----------------------------
setInterval(() => {
    spawnPetal();
}, 300);

function spawnPetal() {
    const img = new Image();
    img.src = PETALS[Math.floor(Math.random() * PETALS.length)];

    objects.push({
        img: img,
        x: Math.random() * canvas.width,
        y: -50,
        vx: (Math.random() * 1 - 0.5),
        vy: 1 + Math.random() * 2,
        size: 40 + Math.random() * 20,
        born: Date.now(),
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.02,
        type: "petal"
    });
}

// -----------------------------
// SPAWN FLORI + INIMIOARE LA CADOURI
// -----------------------------
function spawnGiftEffect() {
    for (let i = 0; i < 20; i++) {
        spawnFlowerOrHeart();
    }
}

function spawnFlowerOrHeart() {
    const list = Math.random() < 0.5 ? FLOWERS : HEARTS;

    const img = new Image();
    img.src = list[Math.floor(Math.random() * list.length)];

    objects.push({
        img: img,
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() * 10 - 5),
        vy: (Math.random() * 10 - 5),
        size: 60 + Math.random() * 40,
        born: Date.now(),
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.1,
        type: "burst"
    });
}

// -----------------------------
// LOOP
// -----------------------------
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();

    for (let i = objects.length - 1; i >= 0; i--) {
        const o = objects[i];

        o.x += o.vx;
        o.y += o.vy;
        o.rot += o.vr;

        if (o.type === "petal") {
            o.vx += (Math.random() - 0.5) * 0.05;
        }

        if (o.img.complete) {
            ctx.save();
            ctx.translate(o.x, o.y);
            ctx.rotate(o.rot);
            ctx.drawImage(o.img, -o.size/2, -o.size/2, o.size, o.size);
            ctx.restore();
        }

        if (now - o.born > 9000) {
            objects.splice(i, 1);
        }
    }

    requestAnimationFrame(loop);
}
loop();

// -----------------------------
// WEBSOCKET
// -----------------------------
const ws = new WebSocket("ws://localhost:62024");

ws.onmessage = (event) => {
    const packet = JSON.parse(event.data);

    if (packet.event === "gift") {
        spawnGiftEffect();
    }
};