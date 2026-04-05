document.addEventListener("DOMContentLoaded", () => {

// --- GLOBAL VARS ---
let isDVD = false,
    posDX = Math.random() * 100,
    posDY = Math.random() * 100,
    velX = 5,
    velY = 5,
    labHits = 0,
    comboKeys = "";

let isPlaying = false;
let timeRemaining = 60;
let cutCount = 0;
let balanceVal = 0;
let audioOn = false;
let currentUser = null;

// --- AUDIO ---
const soundtrack = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3");
soundtrack.loop = true;

// --- ACCOUNT LOGIC ---
window.handleAuth = function () {
    const u = document.getElementById("auth-user")?.value.trim();
    const p = document.getElementById("auth-pass")?.value;
    const msg = document.getElementById("auth-msg");

    if (!u || !p) {
        if (msg) msg.innerText = "Please fill in both fields!";
        return;
    }

    if (u.toLowerCase() === "tyler") {
        if (p === "1234") {
            if (msg) msg.innerText = "Access granted...";
            setTimeout(() => loginSuccess("Tyler"), 1000);
        } else {
            if (msg) msg.innerText = "Incorrect password for Tyler!";
        }
        return;
    }

    if (u.toLowerCase() === "tylergameryt") {
        if (p === "2222") {
            if (msg) msg.innerText = "Connecting to Gaming Vault...";
            setTimeout(() => loginSuccess("TylerGamerYT"), 1500);
        } else {
            if (msg) msg.innerText = "Wrong password!";
        }
        return;
    }

    let accounts = JSON.parse(localStorage.getItem("fake_db") || "{}");

    if (accounts[u]) {
        if (accounts[u] === p) {
            loginSuccess(u);
        } else {
            if (msg) msg.innerText = "Incorrect password!";
        }
    } else {
        accounts[u] = p;
        localStorage.setItem("fake_db", JSON.stringify(accounts));
        loginSuccess(u);
    }
};

function loginSuccess(username) {
    currentUser = username;
    sessionStorage.setItem("loggedInUser", username);

    const overlay = document.getElementById("auth-overlay");
    const displayName = document.getElementById("display-username");

    if (overlay) overlay.style.display = "none";
    if (displayName) displayName.innerText = username;
}

// auto login
let saved = sessionStorage.getItem("loggedInUser");
if (saved) loginSuccess(saved);

// --- LOGOUT ---
window.logout = function () {
    sessionStorage.removeItem("loggedInUser");
    location.reload();
};

// --- AUDIO ---
window.toggleAudio = function () {
    audioOn = !audioOn;

    const btn = document.getElementById("music-btn");

    if (audioOn) {
        soundtrack.play();
        if (btn) btn.innerText = "🎵";
    } else {
        soundtrack.pause();
        if (btn) btn.innerText = "📻";
    }
};

// --- LAB ---
window.openLab = function () {
    const panel = document.getElementById("lab-panel");
    if (panel) panel.style.display = "block";
};

window.closeLab = function () {
    const panel = document.getElementById("lab-panel");
    if (panel) panel.style.display = "none";
};

// --- DVD MODE ---
window.toggleDVD = function () {
    isDVD = !isDVD;

    const el = document.getElementById("main-pfp");
    if (!el) return;

    if (isDVD) {
        el.style.position = "fixed";
        requestAnimationFrame(moveDVD);
    } else {
        location.reload();
    }
};

function moveDVD() {
    if (!isDVD) return;

    let el = document.getElementById("main-pfp");
    if (!el) return;

    posDX += velX;
    posDY += velY;

    let maxX = window.innerWidth - 110;
    let maxY = window.innerHeight - 110;

    if (posDX >= maxX || posDX <= 0) velX *= -1;
    if (posDY >= maxY || posDY <= 0) velY *= -1;

    el.style.left = posDX + "px";
    el.style.top = posDY + "px";

    requestAnimationFrame(moveDVD);
}

// --- INPUT CODE ---
const codeInput = document.getElementById("input-code");
if (codeInput) {
    codeInput.addEventListener("input", (e) => {
        if (e.target.value === "1234") {
            document.getElementById("step-1")?.classList.add("hidden");
            document.getElementById("step-2")?.classList.remove("hidden");
        }
    });
}

// --- SLIDER ---
const slider = document.getElementById("slider-freq");
if (slider) {
    slider.addEventListener("input", (e) => {
        const readout = document.getElementById("freq-readout");
        if (readout) readout.innerText = e.target.value + "%";

        if (e.target.value == "50") {
            document.getElementById("step-2")?.classList.add("hidden");
            document.getElementById("step-3")?.classList.remove("hidden");
        }
    });
}

// --- WIN ---
window.triggerWin = function () {
    isPlaying = false;
    alert("You won!");
    location.reload();
};

});
