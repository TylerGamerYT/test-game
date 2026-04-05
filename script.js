// --- INITIAL STATE ---
let isDVD = false, posDX = Math.random() * 100, posDY = Math.random() * 100, velX = 5, velY = 5;
let labHits = 0, comboKeys = "";
let isPlaying = false, timeRemaining = 60, cutCount = 0, balanceVal = 0;
let audioOn = false;
let touchTimer;
let currentUser = null;

const soundtrack = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
soundtrack.loop = true;

// --- AUTH SYSTEM ---
function handleAuth() {
    const u = document.getElementById('auth-user').value.trim();
    const p = document.getElementById('auth-pass').value;
    const msg = document.getElementById('auth-msg');

    if (!u || !p) {
        msg.innerText = "Please fill in both fields!";
        return;
    }

    if (u.toLowerCase() === "tyler") {
        if (p === "1234") {
            document.getElementById('login-box').style.animation = "boxShake 0.2s 5";
            msg.style.color = "#ff4b4b";
            msg.innerText = "OI! WHO DARES TO HACK TYLER?";
            setTimeout(() => {
                msg.style.color = "#f1c40f";
                msg.innerText = "Fine, I'll let you stay on...";
                setTimeout(() => { loginSuccess("Tyler"); }, 2000);
            }, 2000);
        } else {
            msg.innerText = "Incorrect password for Tyler!";
        }
        return; 
    }

    let accounts = JSON.parse(localStorage.getItem('fake_db') || "{}");
    if (accounts[u]) {
        if (accounts[u] === p) loginSuccess(u);
        else msg.innerText = "Incorrect password!";
    } else {
        accounts[u] = p;
        localStorage.setItem('fake_db', JSON.stringify(accounts));
        loginSuccess(u);
    }
}

function loginSuccess(username) {
    currentUser = username;
    sessionStorage.setItem('loggedInUser', username);
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('display-username').innerText = username;
    refreshStats();
}

function logout() {
    sessionStorage.removeItem('loggedInUser');
    location.reload();
}

// --- UTILITIES & UI ---
function toggleAudio() {
    audioOn = !audioOn;
    if(audioOn) {
        soundtrack.play();
        document.getElementById('music-btn').innerText = "🎵";
    } else {
        soundtrack.pause();
        document.getElementById('music-btn').innerText = "📻";
    }
}

function labCounter() { 
    labHits++; 
    if(labHits >= 5) openLab(); 
}
function openLab() { document.getElementById('lab-panel').style.display='block'; }
function closeLab() { document.getElementById('lab-panel').style.display='none'; }
function applyTheme(t) { document.body.className = "theme-"+t; }
function clearAllData() { localStorage.clear(); location.reload(); }

// --- DVD MODE ---
function toggleDVD() { 
    isDVD = !isDVD; 
    if(isDVD) { 
        document.getElementById('main-pfp').classList.add('dvd-mode'); 
        requestAnimationFrame(moveDVD); 
    } else { location.reload(); } 
}
function moveDVD() {
    if(!isDVD) return;
    let el = document.getElementById('main-pfp');
    posDX += velX; posDY += velY;
    let maxX = window.innerWidth - 110, maxY = window.innerHeight - 110;
    if(posDX >= maxX || posDX <= 0) { velX *= -1; el.style.borderColor = `hsl(${Math.random()*360},80%,60%)`; }
    if(posDY >= maxY || posDY <= 0) { velY *= -1; el.style.borderColor = `hsl(${Math.random()*360},80%,60%)`; }
    el.style.left = posDX+'px'; el.style.top = posDY+'px';
    requestAnimationFrame(moveDVD);
}

// --- SECRETS & SPRITES ---
function processSecret(cmd) {
    if(cmd === "sus") triggerSprite('sprite-sus', 3500);
    if(cmd === "fortnite") triggerSprite('sprite-bus', 5500);
    if(cmd === "creeper") { document.body.style.background="#2ecc71"; alert("Ssssss.... BOOM!"); }
    if(cmd === "godmode") { timeRemaining=99; triggerWin(); }
}

function triggerSprite(id, dur) {
    let s = document.getElementById(id);
    s.style.left = "130vw";
    setTimeout(() => { s.style.left = "-250px"; }, dur);
}

// --- GAME LOGIC ---
setTimeout(() => {
    if(!currentUser) return;
    document.getElementById('bomb-container').style.display='flex';
    document.getElementById('intro-bio').style.display = 'none';
    document.body.classList.add('alert-active');
    isPlaying = true;
    let ticker = setInterval(() => {
        if(!isPlaying) { clearInterval(ticker); return; }
        timeRemaining--;
        document.getElementById('digital-timer').innerText = `00:${timeRemaining<10?'0'+timeRemaining:timeRemaining}`;
        if(timeRemaining <= 0) { clearInterval(ticker); failGame(); }
    }, 1000);
}, 12000);

document.getElementById('input-code').addEventListener('input', (e) => {
    if(e.target.value === "1234") { 
        document.getElementById('step-1').classList.add('hidden'); 
        document.getElementById('step-2').classList.remove('hidden'); 
    }
});

document.getElementById('slider-freq').addEventListener('input', (e) => {
    document.getElementById('freq-readout').innerText = e.target.value + "%";
    if(e.target.value == "50") { 
        document.getElementById('step-2').classList.add('hidden'); 
        document.getElementById('step-3').classList.remove('hidden'); 
        generateWires(); 
    }
});

function generateWires() {
    const grid = document.getElementById('wire-grid');
    grid.innerHTML = "";
    const colors = ['#e74c3c','#3498db','#f1c40f','#2ecc71','#9b59b6','#e67e22'];
    colors.forEach(c => {
        let w = document.createElement('div');
        w.className = 'wire-strand';
        w.style.background = c;
        w.onclick = function() {
            if(!this.classList.contains('cut')){
                this.classList.add('cut');
                cutCount++;
                if(cutCount === 6){ 
                    document.getElementById('step-3').classList.add('hidden'); 
                    document.getElementById('step-4').classList.remove('hidden'); 
                    runGyro(); 
                }
            }
        };
        grid.appendChild(w);
    });
}

function runGyro() {
    let isMoving = false; 
    window.onmousemove = () => { isMoving = true; setTimeout(()=>isMoving=false,100); };
    let gi = setInterval(() => {
        if(!isPlaying) { clearInterval(gi); return; }
        if(!isMoving) balanceVal += 3; else balanceVal = 0;
        document.getElementById('gyro-fill').style.width = balanceVal + "%";
        if(balanceVal >= 100) { 
            clearInterval(gi); 
            document.getElementById('step-4').classList.add('hidden'); 
            document.getElementById('step-5').classList.remove('hidden'); 
        }
    }, 100);
}

function triggerWin() {
    isPlaying = false;
    document.getElementById('bomb-container').style.display='none';
    document.getElementById('award-card').style.display = 'block';
    
    let best = parseInt(localStorage.getItem('t_best_'+currentUser)) || 0;
    if(timeRemaining > best) localStorage.setItem('t_best_'+currentUser, timeRemaining + "s");
    
    refreshStats();
    setTimeout(() => location.reload(), 8000);
}

function failGame() { alert("💥 KABOOM!"); location.reload(); }

function refreshStats() {
    if(!currentUser) return;
    document.getElementById('val-best').innerText = localStorage.getItem('t_best_'+currentUser) || "0s";
    document.getElementById('val-close').innerText = localStorage.getItem('t_close_'+currentUser) || "0s";
}

window.onload = () => {
    let saved = sessionStorage.getItem('loggedInUser');
    if (saved) loginSuccess(saved);
};
