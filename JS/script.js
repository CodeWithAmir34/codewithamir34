const canvas = document.getElementById('smokeCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let hue = 260; 
let smokeActive = true; 

const mouse = { x: undefined, y: undefined };

// --- SMOKE GENERATION ---
window.addEventListener('mousemove', (event) => {
    if (smokeActive) {
        mouse.x = event.x;
        mouse.y = event.y;
        for (let i = 0; i < 8; i++) {
            particlesArray.push(new Particle());
        }
    }
});

class Particle {
    constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 25 + 10; 
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `hsl(${hue}, 100%, 50%)`;
        this.opacity = 1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.1;
        if (this.opacity > 0) this.opacity -= 0.007; 
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        if (particlesArray[i].opacity <= 0) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
    hue += 1;
    requestAnimationFrame(animate);
}
animate();

// --- HAMBURGER MENU FUNCTION ---
const hamburger = document.querySelector('.menu-icon');
const navLinks = document.querySelector('.nav-links');
const allNavLinks = document.querySelectorAll('.nav-links li');

if(hamburger) {
    hamburger.addEventListener('click', () => {
        // Menu open/close toggle
        navLinks.classList.toggle('active');
        // Hamburger animation (agar CSS mein 'toggle' class banayi hai)
        hamburger.classList.toggle('toggle');
    });
}

// Links par click hote hi menu band ho jaye
allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('toggle');
    });
});

// --- PRELOADER & RAIN LOGIC ---
window.addEventListener('load', () => {
    const progress = document.getElementById('progress');
    const status = document.getElementById('loader-status');
    const preloader = document.getElementById('preloader');
    
    let width = 0;
    const messages = ["Loading Assets...", "Setting Up UI...", "Injecting Scripts...", "Ready!"];
    let msgIndex = 0;

    const preloaderInterval = setInterval(() => {
        if (width >= 100) {
            clearInterval(preloaderInterval);
            status.innerText = "Welcome, Bro!";
            setTimeout(() => {
                preloader.style.transform = "translateY(-100%)"; 
                setTimeout(() => {
                    preloader.style.display = 'none';
                    startRainEffect(); 
                }, 1000);
            }, 500);
        } else {
            width += Math.random() * 15; 
            if (width > 100) width = 100;
            progress.style.width = width + '%';
            if (width > (msgIndex + 1) * 25) {
                status.innerText = messages[msgIndex];
                msgIndex++;
            }
        }
    }, 200);
});

function startRainEffect() {
    const rCanvas = document.getElementById('rainCanvas');
    rCanvas.style.display = 'block';
    const rCtx = rCanvas.getContext('2d');
    rCanvas.width = window.innerWidth;
    rCanvas.height = window.innerHeight;

    const drops = [];
    for (let i = 0; i < 500; i++) {
        drops.push({
            x: Math.random() * rCanvas.width,
            y: Math.random() * rCanvas.height,
            velY: Math.random() * 5 + 5,
            velX: Math.random() * 1 - 0.5,
            size: Math.random() * 2 + 1
        });
    }

    function drawRain() {
        rCtx.clearRect(0, 0, rCanvas.width, rCanvas.height);
        rCtx.strokeStyle = 'rgb(255, 255, 255)'; 
        rCtx.lineWidth = 1;
        rCtx.beginPath();
        for (let i = 0; i < drops.length; i++) {
            const d = drops[i];
            rCtx.moveTo(d.x, d.y);
            rCtx.lineTo(d.x + d.velX, d.y + d.velY);
        }
        rCtx.stroke();
        updateRain();
    }

    function updateRain() {
        for (let i = 0; i < drops.length; i++) {
            const d = drops[i];
            d.y += d.velY;
            d.x += d.velX;
            if (d.y > rCanvas.height) {
                d.y = -20;
                d.x = Math.random() * rCanvas.width;
            }
        }
    }
    setInterval(drawRain, 30);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const rCanvas = document.getElementById('rainCanvas');
    if (rCanvas) {
        rCanvas.width = window.innerWidth;
        rCanvas.height = window.innerHeight;
    }
});

// --- TYPEWRITER ---
const roles = ["Web Developer", "UI/UX Designer", "Freelancer", "Graphic Designer"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;
const typingText = document.getElementById('typing-text');

function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000; 
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }
    setTimeout(type, typeSpeed);
}

window.addEventListener('load', () => {
    setTimeout(type, 3000); 
});

// --- CONTACT FORM ---
const contactForm = document.getElementById('my-contact-form');
const submitBtn = document.getElementById('submit-btn');

if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitBtn.innerHTML = "Sending... 🚀";
        submitBtn.disabled = true;
        const formData = new FormData(this);

        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                window.location.href = "./Pages/Thankyou.html"; 
            } else {
                alert("Something went wrong");
                submitBtn.innerHTML = "Send Message";
                submitBtn.disabled = false;
            }
        })
        .catch(error => {
            alert("Internet check");
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Send Message";
        });
    });
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/CodeWithAmir/sw.js")
    .then(() => console.log("Service Worker Registered"));
}