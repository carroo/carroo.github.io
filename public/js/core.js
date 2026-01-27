// ===================================
// Swiper Initialization
// ===================================
var swiper = new Swiper(".mySwiper", {
    effect: "cards",
    grabCursor: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
    },
    on: {
        slideChange: function () {
            var activeIndex = this.activeIndex + 1;
            var portoElements = document.querySelectorAll('[id^="porto-"]');
            portoElements.forEach(function (element) {
                if (element.id === "porto-" + activeIndex) {
                    element.classList.remove("hidden");
                } else {
                    element.classList.add("hidden");
                }
            });
        },
    },
});

// ===================================
// Scroll Event Handler
// ===================================
window.onscroll = function () {
    const header = document.querySelector('header');
    const fixednav = header.offsetTop;
    const imglogo = document.querySelector('#imglogo');
    const aboutme = document.querySelector('#aboutme');
    const carroo = document.querySelector('#carroo');
    const aboutmeOffset = aboutme.offsetTop / 2;
    if (window.pageYOffset > fixednav) {
        header.classList.add('navbar-fixed');
    } else {
        header.classList.remove('navbar-fixed');
    }
    if (window.pageYOffset > aboutmeOffset) {
        imglogo.classList.remove('hidden');
        const scale = (window.pageYOffset - aboutmeOffset) / 500;
        if (scale <= 1) {
            imglogo.style.transform = `scale(${scale})`;
            const textList = ['Carroo', 'Carro', 'Carr', 'Catr', 'Catr H', 'Catr He', 'Catur He', 'Catur Hen', 'Catur Hend', 'Catur Hendra'];

            const index = Math.floor(scale * (textList.length));
            const newText = textList[index];

            carroo.innerText = newText;
            if (scale >= 0.97) {
                carroo.classList.add('animate-anigra', 'bg-clip-text', 'text-transparent');
            } else {
                carroo.classList.remove('animate-anigra', 'bg-clip-text', 'text-transparent');
            }
        } else {
            carroo.innerText = 'Catur Hendra';
            carroo.classList.add('animate-anigra', 'bg-clip-text', 'text-transparent');
        }
    } else {
        imglogo.classList.add('hidden');
        carroo.innerText = 'Carroo';
    }
};

// Hamburger Menu Toggle
hamburger = document.getElementById('hamburger');
navMenu = document.getElementById('nav-menu');
hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('hamburger-active');
    navMenu.classList.toggle('hidden');
});

// ===================================
// Opening Animate Text
// ===================================
var typed_loading = new Typed('#loading_text', {
    strings: ["Welcome to the Carroo's world"],
    typeSpeed: 60,
    loop: false,
    showCursor: false,
    onComplete: function () {
        document.getElementById('loading').classList.add('animate-fadeOutUp');
        document.getElementById('utama').classList.remove('hidden');
    }
});

var typed = new Typed('#multiple_text', {
    strings: [' Web Developer', ' Student', ' Freelancer'],
    typeSpeed: 100,
    loop: true,
});

// ===================================
// Resume Menu
// ===================================
document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('#btns-resume > button');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            buttons.forEach(btn => btn.classList.remove('bg-primary', 'text-white'));
            this.classList.add('bg-primary', 'text-white');
            buttons.forEach(btn => btn.classList.add('bg-secondary', 'text-forth'));
            this.classList.remove('bg-secondary', 'text-forth');

            const sections = document.querySelectorAll('#sections-resume > div');
            sections.forEach(section => section.classList.add('hidden'));
            const targetId = this.id.replace('btn-', '');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });
});

// ===================================
// Click Effect
// ===================================
let currentTextIndex = 0;
const texts = ["😀", "🥰", "😜", "🤭"];

function createClickEffect(event) {
    const clickEffect = document.createElement("div");
    clickEffect.classList.add('click-effect');
    clickEffect.textContent = texts[currentTextIndex];

    const x = event.clientX + window.pageXOffset;
    const y = event.clientY + window.pageYOffset;
    clickEffect.style.left = `${x - 28}px`;
    clickEffect.style.top = `${y - 28}px`;

    document.body.appendChild(clickEffect);

    let scaleValue = 99;
    const scaleInterval = setInterval(() => {
        clickEffect.style.transform = `scale(${scaleValue / 100})`;
        scaleValue--;

        if (scaleValue < 0) {
            clearInterval(scaleInterval);

            setTimeout(() => {
                clickEffect.remove();
            }, 500);
        }
    }, 10);
    currentTextIndex = (currentTextIndex + 1) % texts.length;
}

document.body.addEventListener("click", createClickEffect);

// ===================================
// Game Script
// ===================================
let interval = 3000;
const minInterval = 500;
let intervalId;
let jb = 0;
const emote = ["😍", "😀", "🙂", "😐", "🙁", "😢", "😭"];

function updateEmote() {
    let emoji;
    if (jb <= 4) {
        emoji = emote[0];
    } else if (jb <= 8) {
        emoji = emote[1];
    } else if (jb <= 12) {
        emoji = emote[2];
    } else if (jb <= 16) {
        emoji = emote[3];
    } else if (jb <= 20) {
        emoji = emote[4];
    } else if (jb <= 24) {
        emoji = emote[5];
    } else {
        emoji = emote[6];
    }
    document.getElementById('emote-wajah').innerHTML = emoji;
}

function createBubble() {
    const homeSection = document.getElementById('home');
    const bubble = document.createElement('div');

    const size = Math.random() * 60 + 20;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    const posX = Math.random() * (window.innerWidth - size);
    const posY = Math.random() * (window.innerHeight - size - 90) + 90;
    bubble.style.left = `${posX}px`;
    bubble.style.top = `${posY}px`;

    bubble.className = 'bubbles bg-primary animate-lentur duration-1000 rounded-full absolute ring-2 ring-forth cursor-grab';

    const bubbleText = document.createElement('div');
    bubbleText.textContent = '🐞';
    bubbleText.className = 'flex items-center justify-center h-full w-full';
    bubbleText.style.fontSize = `${size * 0.5}px`;
    bubble.appendChild(bubbleText);

    bubble.addEventListener('click', () => {
        jb--;
        document.getElementById('stopButton').innerHTML = `bug (${jb}/30)`;
        bubble.remove();
        updateEmote();
    });

    homeSection.appendChild(bubble);
    jb++;
    document.getElementById('stopButton').innerHTML = `bug (${jb}/30)`;
    updateEmote();
    interval = Math.max(minInterval, interval * 0.9);
    clearInterval(intervalId);
    intervalId = setInterval(createBubble, interval);

    if (jb > 30) {
        clearInterval(intervalId);
        jb = 0;
        interval = 3000;
        document.getElementById('gameover').classList.remove('hidden');
        document.getElementById('gameover').classList.add('animate-fadeInUp');
        if (typed_gameover) {
            typed_gameover.destroy();
        }
        document.getElementById('gameover_text').innerHTML = "";
        var typed_gameover = new Typed('#gameover_text', {
            strings: ["Game over! It seems the bug is challenging to fix. Let's enlist Carroo's expertise; he might have the solution......"],
            typeSpeed: 80,
            loop: false,
            showCursor: false,
            onComplete: function () {
                document.getElementById('stopButton').innerHTML = `bug (${jb}/30)`;
                document.getElementById('stopButton').classList.add('hidden');
                document.getElementById('emote-wajah').classList.add('hidden');
                document.querySelectorAll('.bubbles').forEach(bubble => bubble.remove());
                document.getElementById('gameover').classList.remove('animate-fadeInUp');
                document.getElementById('gameover').classList.add('animate-fadeOutUp');
            }
        });
    }
}

document.querySelectorAll('.startButton').forEach(button => {
    button.onclick = function () {
        intervalId = setInterval(createBubble, interval);
        document.getElementById('emote-wajah').classList.remove('hidden');
        document.getElementById('emote-wajah').innerHTML = emote[0];
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.getElementById('stopButton').classList.remove('hidden');
    };
});

document.getElementById('stopButton').addEventListener('click', () => {
    clearInterval(intervalId);
    document.querySelectorAll('.bubbles').forEach(bubble => bubble.remove());
    document.getElementById('stopButton').classList.add('hidden');
    document.getElementById('emote-wajah').classList.add('hidden');
    jb = 0;
    interval = 3000;
    document.getElementById('stopButton').innerHTML = `bug (${jb}/30)`;
});

// ===================================
// Cursor Trail
// ===================================
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

const dots = [];
const cursor = {
    y: 0,
    x: 0,
    initialY: 0,
};

if (!isTouchDevice()) {
    for (let i = 0; i < 30; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot-cursor');
        document.body.appendChild(dot);
        dots.push(dot);
    }
    window.addEventListener('mousemove', (e) => {
        cursor.x = e.clientX + window.scrollX;
        cursor.y = e.clientY + window.scrollY;
        cursor.initialY = e.clientY;
    });
    window.addEventListener('scroll', (e) => {
        cursor.y = window.scrollY + cursor.initialY;
    });
    function dotsTrail() {
        let x = cursor.x;
        let y = cursor.y;
        dots.forEach((dot, i) => {
            const nextDot = dots[i + 1] || dots[0];
            dot.style.left = (x - 12) + 'px';
            dot.style.top = (y - 12) + 'px';

            dot.style.scale = (dots.length - i) / dots.length;

            x += (nextDot.offsetLeft - dot.offsetLeft) * 0.25;
            y += (nextDot.offsetTop - dot.offsetTop) * 0.25;
        });
        requestAnimationFrame(dotsTrail);
    }
    dotsTrail();
}
