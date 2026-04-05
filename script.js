document.addEventListener("DOMContentLoaded", () => {

// --- GLOBAL VARS ---
let isDVD = false, posDX=Math.random()*100, posDY=Math.random()*100, velX=5, velY=5, labHits=0, comboKeys="";
let isPlaying = false, timeRemaining = 60, cutCount = 0, balanceVal = 0;
let audioOn = false;
let touchTimer;
let currentUser = null;

// --- AUDIO ---
const soundtrack = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
soundtrack.loop = true;

// --- ACCOUNT LOGIC ---
window.handleAuth = function() {
const u = document.getElementById('auth-user').value.trim();
const p = document.getElementById('auth-pass').value;
const msg = document.getElementById('auth-msg');

```
if (!u || !p) {
    msg.innerText = "Please fill in both fields!";
    return;
}

if (u.toLowerCase() === "tyler") {
    if (p === "1234") {
        document.getElementById('login-box').style.animation = "boxShake 0.2s 5";
        msg.style.color = "#ff4b4b";
        msg.style.fontSize = "1.1rem";
        msg.style.fontWeight = "900";
        msg.innerText = "OI! WHO DARES TO HACK TYLER?";
        
        setTimeout(() => {
            msg.style.color = "#f1c40f";
            msg.style.fontWeight = "bold";
            msg.innerText = "Fine, I'll let you stay on since there's nothing important on this account anyway.";
            setTimeout(() => { loginSuccess("Tyler"); }, 3000);
        }, 2000);
    } else {
        msg.innerText = "Incorrect password for Tyler!";
    }
    return; 
}

if (u.toLowerCase() === "tylergameryt") {
    if (p === "2222") {
        msg.style.color = "#00fff2";
        msg.innerText = "Connecting to TylerGamerYT's Gaming Vault...";
        
        setTimeout(() => {
            msg.style.color = "#e67e22";
            msg.innerText = "Warning: 0 V-Bucks found. 0 Wins found. This account is kind of mid.";
            setTimeout(() => { loginSuccess("TylerGamerYT"); }, 3000);
        }, 2000);
    } else {
        msg.innerText = "Wrong pin for the Gamer Vault!";
    }
    return;
}

let accounts = JSON.parse(localStorage.getItem('fake_db') || "{}");
if (accounts[u]) {
    if (accounts[u] === p) {
        loginSuccess(u);
    } else {
        msg.innerText = "Incorrect password!";
    }
} else {
    accounts[u] = p;
    localStorage.setItem('fake_db', JSON.stringify(accounts));
    loginSuccess(u);
}
```

};

function loginSuccess(username) {
currentUser = username;
sessionStorage.setItem('loggedInUser', username);
document.getElementById('auth-overlay').style.display = 'none';
document.getElementById('display-username').innerText = username;
refreshStats();
}

window.logout = function() {
sessionStorage.removeItem('loggedInUser');
location.reload();
};

window.onload = () => {
let saved = sessionStorage.getItem('loggedInUser');
if (saved) loginSuccess(saved);
};

// --- AUDIO ---
window.toggleAudio = function() {
audioOn = !audioOn;
if(audioOn) {
soundtrack.play();
document.getElementById('music-btn').innerText = "🎵";
} else {
soundtrack.pause();
document.getElementById('music-btn').innerText = "📻";
}
};

// --- MOBILE SECRET ---
window.startTouchSecret = function() {
touchTimer = setTimeout(() => {
document.getElementById('mobile-secret-input').style.display = 'block';
document.getElementById('mob-input').focus();
}, 1500);
};

window.endTouchSecret = function() { clearTimeout(touchTimer); };

window.checkMobileSecret = function() {
let val = document.getElementById('mob-input').value.toLowerCase();
processSecret(val);
document.getElementById('mobile-secret-input').style.display = 'none';
document.getElementById('mob-input').value = "";
};

function processSecret(cmd) {
if(cmd === "sus") triggerSprite('sprite-sus', 3500);
if(cmd === "fortnite") triggerSprite('sprite-bus', 5500);
if(cmd === "creeper") { document.body.style.background="#2ecc71"; alert("Ssssss.... BOOM!"); }
if(cmd === "roblox") alert("OOF!");
if(cmd === "godmode") { timeRemaining=99; triggerWin(); }
}

// --- STATS ---
function refreshStats() {
if(!currentUser) return;
document.getElementById('val-best').innerText = localStorage.getItem('t_best_'+currentUser) || "0s";
document.getElementById('val-close').innerText = localStorage.getItem('t_close_'+currentUser) || "0s";
}

// --- LAB ---
window.labCounter = function() {
labHits++;
if(labHits >= 5) openLab();
};

window.openLab = function() { document.getElementById('lab-panel').style.display='block'; };
window.closeLab = function() { document.getElementById('lab-panel').style.display='none'; };
window.applyTheme = function(t) { document.body.className = "theme-"+t; };
window.clearAllData = function() { localStorage.clear(); location.reload(); };

// --- DVD MODE ---
window.toggleDVD = function() {
isDVD = !isDVD;
if(isDVD) {
document.getElementById('main-pfp').classList.add('dvd-mode');
requestAnimationFrame(moveDVD);
} else {
location.reload();
}
};

function moveDVD() {
if(!isDVD) return;
let el = document.getElementById('main-pfp');
posDX += velX; posDY += velY;
let maxX = window.innerWidth - 110, maxY = window.innerHeight - 110;

```
if(posDX >= maxX || posDX <= 0) {
    velX *= -1;
    el.style.borderColor = `hsl(${Math.random()*360},80%,60%)`;
}

if(posDY >= maxY || posDY <= 0) {
    velY *= -1;
    el.style.borderColor = `hsl(${Math.random()*360},80%,60%)`;
}

el.style.left = posDX+'px';
el.style.top = posDY+'px';

requestAnimationFrame(moveDVD);
```

}

// --- KEY COMBOS ---
window.addEventListener('keydown', (e) => {
if(document.activeElement.tagName === 'INPUT') return;

```
comboKeys += e.key.toLowerCase();

if(comboKeys.endsWith("sus")) { processSecret("sus"); comboKeys=""; }
if(comboKeys.endsWith("fortnite")) { processSecret("fortnite"); comboKeys=""; }
if(comboKeys.endsWith("creeper")) { processSecret("creeper"); comboKeys=""; }
if(comboKeys.endsWith("roblox")) { processSecret("roblox"); comboKeys=""; }
if(comboKeys.endsWith("godmode")) { processSecret("godmode"); comboKeys=""; }

if(comboKeys.length > 30) comboKeys = comboKeys.slice(-15);
```

});

// --- SPRITES ---
function triggerSprite(id, dur) {
let s = document.getElementById(id);
s.style.left = "130vw";
setTimeout(() => { s.style.left = "-250px"; }, dur);
}

// --- GAME START ---
setTimeout(() => {
document.getElementById('bomb-container').style.display='flex';
document.getElementById('intro-bio').style.display = 'none';
document.body.classList.add('alert-active');
isPlaying = true;

```
let ticker = setInterval(() => {
    if(!isPlaying) { clearInterval(ticker); return; }

    timeRemaining--;

    document.getElementById('digital-timer').innerText =
        `00:${timeRemaining<10?'0'+timeRemaining:timeRemaining}`;

    if(timeRemaining <= 10) {
        document.getElementById('digital-timer').style.animation = "shake 0.1s infinite";
        if(audioOn) soundtrack.playbackRate = 1.5;
    }

    if(timeRemaining <= 0) {
        clearInterval(ticker);
        failGame();
    }
}, 1000);
```

}, 12000);

// --- STEP 1 ---
document.getElementById('input-code').addEventListener('input', (e) => {
if(e.target.value === "1234") {
document.getElementById('step-1').classList.add('hidden');
document.getElementById('step-2').classList.remove('hidden');
}
});

// --- STEP 2 ---
document.getElementById('slider-freq').addEventListener('input', (e) => {
document.getElementById('freq-readout').innerText = e.target.value + "%";

```
if(e.target.value == "50") { 
    document.getElementById('step-2').classList.add('hidden'); 
    document.getElementById('step-3').classList.remove('hidden'); 
    generateWires(); 
}
```

});

// --- STEP 3 ---
function generateWires() {
const grid = document.getElementById('wire-grid');
grid.innerHTML = "";

```
const colors = ['#e74c3c','#3498db','#f1c40f','#2ecc71','#9b59b6','#e67e22'];

colors.forEach(c => {
    let w = document.createElement('div');
    w.className = 'wire-strand';
    w.style.background = c;

    w.onclick = function() {
        if(!this.classList.contains('cut')){
            this.classList.add('cut');
            cutCount++;

            if(cutCount===6){ 
                document.getElementById('step-3').classList.add('hidden'); 
                document.getElementById('step-4').classList.remove('hidden'); 
                runGyro(); 
            }
        }
    };

    grid.appendChild(w);
});
```

}

// --- STEP 4 ---
function runGyro() {
let isMoving = false;

```
window.onmousemove = () => { isMoving = true; setTimeout(()=>isMoving=false,100); };
window.ontouchmove = () => { isMoving = true; setTimeout(()=>isMoving=false,100); };

let gi = setInterval(() => {
    if(!isPlaying) { clearInterval(gi); return; }

    if(!isMoving) balanceVal += 3;
    else balanceVal = 0;

    document.getElementById('gyro-fill').style.width = balanceVal + "%";

    if(balanceVal >= 100) { 
        clearInterval(gi); 
        document.getElementById('step-4').classList.add('hidden'); 
        document.getElementById('step-5').classList.remove('hidden'); 
    }
}, 100);
```

}

// --- WIN ---
window.triggerWin = function() {
isPlaying = false;
document.getElementById('bomb-container').style.display='none';

```
const card = document.getElementById('award-card');
card.style.display = 'block';

if (timeRemaining === 99) {
    document.getElementById('award-main-text').innerText = "GODMODE";
    document.getElementById('award-sub-text').innerText = "CHEATER CHEATER PEANUT BUTTER EATER";
} 
else if (timeRemaining <= 10 && timeRemaining > 0) {
    document.getElementById('award-main-text').innerText = "CLOSE CALL";
    document.getElementById('award-sub-text').innerText = `DISARMED WITH ${timeRemaining}s LEFT!`;
    localStorage.setItem('t_close_'+currentUser, timeRemaining + "s");
} 
else {
    document.getElementById('award-main-text').innerText = "SURVIVOR";
    document.getElementById('award-sub-text').innerText = "MISSION ACCOMPLISHED";
}

let lastBest = parseInt(localStorage.getItem('t_best_'+currentUser)) || 0;

if(timeRemaining > lastBest) {
    localStorage.setItem('t_best_'+currentUser, timeRemaining + "s");
}

refreshStats();
setTimeout(() => location.reload(), 8000);
```

};

// --- FAIL ---
function failGame() {
document.body.style.background = "white";
alert("💥 KABOOM! MISSION FAILED.");
location.reload();
}

});
