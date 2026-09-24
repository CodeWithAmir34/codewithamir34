// --- 1. SMOKE CANVAS ANIMATION ---
const canvas = document.getElementById('smokeCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let hue = 190;
let smokeActive = true;

const mouse = { x: undefined, y: undefined };

window.addEventListener('mousemove', (event) => {
    if (smokeActive) {
        mouse.x = event.x;
        mouse.y = event.y;
        for (let i = 0; i < 5; i++) {
            particlesArray.push(new Particle());
        }
    }
}, { passive: true });

class Particle {
    constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 20 + 8;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `hsl(${hue}, 100%, 50%)`;
        this.opacity = 0.8;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.1;
        if (this.opacity > 0) this.opacity -= 0.008;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(this.opacity, 0);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function animateSmoke() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        if (particlesArray[i].opacity <= 0) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
    hue += 0.5;
    if (hue > 200) hue = 180;
    requestAnimationFrame(animateSmoke);
}
animateSmoke();

// --- 2. HAMBURGER MENU ---
const hamburger = document.querySelector('.menu-icon');
const navLinks = document.querySelector('.nav-links');
const allNavLinks = document.querySelectorAll('.nav-links li a');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });
}

allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});

// --- 3. AUTOMATIC PRELOADER HANDLER ---
window.addEventListener('load', () => {
    const progressRing = document.getElementById('progressRing');
    const status = document.getElementById('loader-status');
    const preloader = document.getElementById('preloader');
    const percentText = document.getElementById('percentText');

    let width = 0;
    const messages = ["Loading Assets...", "Setting Up UI...", "Injecting Scripts...", "Ready!"];
    let msgIndex = 0;

    let circumference = 251.2;
    if (progressRing) {
        progressRing.style.strokeDasharray = `${circumference}`;
        progressRing.style.strokeDashoffset = `${circumference}`;
    }

    const preloaderInterval = setInterval(() => {
        if (width >= 100) {
            clearInterval(preloaderInterval);
            if (status) status.innerText = "READY!";
            if (percentText) percentText.innerText = "100%";
            if (progressRing) progressRing.style.strokeDashoffset = `0`;

            // Auto transition to site
            setTimeout(() => {
                preloader.style.transform = "translateY(-100%)";
                setTimeout(() => {
                    preloader.style.display = 'none';
                    startRainEffect();
                    initTypewriterEffect(); // Preloader hitne ke baad typewriter start hoga
                }, 800);
            }, 500);

        } else {
            width += Math.random() * 15;
            if (width > 100) width = 100;
            const MathFloorWidth = Math.floor(width);
            
            if (percentText) percentText.innerText = MathFloorWidth + '%';
            if (progressRing) {
                const offset = circumference - (MathFloorWidth / 100) * circumference;
                progressRing.style.strokeDashoffset = offset;
            }

            if (width > (msgIndex + 1) * 25 && msgIndex < messages.length) {
                if (status) status.innerText = messages[msgIndex];
                msgIndex++;
            }
        }
    }, 80);
});

// --- 4. IMPROVED TYPEWRITER ANIMATION ---
function initTypewriterEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const words = ["Full Stack Developer", "UI/UX Designer", "Web Architect", "Freelancer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; // Poora word type hone ke baad pause
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Agla word start hone se pehle pause
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

// --- 5. RAIN CANVAS ANIMATION ---
function startRainEffect() {
    const rCanvas = document.getElementById('rainCanvas');
    if (!rCanvas) return;
    
    rCanvas.style.display = 'block';
    const rCtx = rCanvas.getContext('2d');
    rCanvas.width = window.innerWidth;
    rCanvas.height = window.innerHeight;

    const drops = [];
    const dropCount = Math.min(Math.floor(window.innerWidth / 3), 400);

    for (let i = 0; i < dropCount; i++) {
        drops.push({
            x: Math.random() * rCanvas.width,
            y: Math.random() * rCanvas.height,
            velY: Math.random() * 4 + 6,
            velX: Math.random() * 0.6 - 0.3
        });
    }

    function renderRain() {
        rCtx.clearRect(0, 0, rCanvas.width, rCanvas.height);
        rCtx.strokeStyle = 'rgba(0, 212, 255, 0.4)';
        rCtx.lineWidth = 1;
        rCtx.beginPath();

        for (let i = 0; i < drops.length; i++) {
            const d = drops[i];
            rCtx.moveTo(d.x, d.y);
            rCtx.lineTo(d.x + d.velX, d.y + d.velY * 2);

            d.x += d.velX;
            d.y += d.velY;

            if (d.y > rCanvas.height) {
                d.y = -10;
                d.x = Math.random() * rCanvas.width;
            }
        }
        rCtx.stroke();
        requestAnimationFrame(renderRain);
    }
    renderRain();
}

// Form ko select karein
const contactForm = document.querySelector('form'); // Agar id hai toh document.getElementById('your-form-id') use karein

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Default form submit hone se rokein

        // Agar aap koi API / Formspree etc. use kar rahe hain toh pehle message send ka logic yahan aayega,
        // phir redirection hoga:
        
        window.location.href = './pages/Thankyou.html'; // Apne thank you page ka sahi path daalein
    });
}