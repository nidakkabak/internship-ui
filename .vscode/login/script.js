/* =========================================
   InternshipMS — Main Script
========================================= */

// ---------- PARTICLES ----------
(function spawnParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 28; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 3 + 1.5;
        p.style.cssText = `
            left:${Math.random() * 100}%;
            bottom:${Math.random() * -20}%;
            width:${size}px; height:${size}px;
            animation-duration:${6 + Math.random() * 12}s;
            animation-delay:${Math.random() * 10}s;
            opacity:${0.2 + Math.random() * 0.5};
        `;
        container.appendChild(p);
    }
})();

// ---------- PASSWORD TOGGLE ----------
function togglePw(icon) {
    const input = icon.closest('.input-group').querySelector('input');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// ---------- LOGIN ----------
function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const pass  = document.getElementById('login-password').value;
    if (!email || !pass) { shake('login-card'); return; }
    // TODO: real auth
    alert('Login functionality coming soon!');
}

function shake(id) {
    const el = document.getElementById(id);
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'shake 0.4s ease';
}

// ---------- REGISTER OVERLAY ----------
function openRegister() {
    document.getElementById('register-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    goRegStep(1);
}

function closeRegister() {
    document.getElementById('register-overlay').classList.remove('open');
    document.body.style.overflow = '';
}

function finishRegister() {
    // pre-fill email on login form
    const email = document.getElementById('reg-email').value;
    const loginEmail = document.getElementById('login-email');
    if (loginEmail && email) loginEmail.value = email;
}

// ---------- REGISTER STEPS ----------
let currentRegStep = 1;

function goRegStep(n) {
    // hide all
    document.querySelectorAll('.reg-step').forEach(el => el.classList.remove('active-step'));
    // show target
    document.getElementById('reg-step-' + n).classList.add('active-step');
    currentRegStep = n;

    // update stepper
    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById('s' + i);
        dot.classList.remove('active', 'completed');
        if (i < n)  dot.classList.add('completed');
        if (i === n) dot.classList.add('active');
    }

    // progress bar
    const pct = { 1: '33.33%', 2: '66.66%', 3: '100%' };
    document.getElementById('progress-fill').style.width = pct[n];
}

// ROLE SELECTION
function selectRole(role) {
    document.getElementById('reg-role').value = role;
    document.getElementById('chip-student').classList.toggle('active', role === 'Student');
    document.getElementById('chip-teacher').classList.toggle('active', role === 'Teacher');
}

// STEP 1 → 2
function regStep1Next() {
    const name    = document.getElementById('reg-name').value.trim();
    const email   = document.getElementById('reg-email').value.trim();
    const pass    = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    if (!name || !email || !pass || !confirm) {
        flashError('Please fill in all fields.'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        flashError('Please enter a valid email address.'); return;
    }
    if (pass.length < 6) {
        flashError('Password must be at least 6 characters.'); return;
    }
    if (pass !== confirm) {
        flashError('Passwords do not match.'); return;
    }

    document.getElementById('otp-email-label').textContent = email;
    goRegStep(2);
    startOTPTimer();
    // focus first otp box
    setTimeout(() => document.querySelector('.otp-box').focus(), 400);
}

// STEP 2 → 3
function regStep2Next() {
    const boxes = document.querySelectorAll('.otp-box');
    const code  = Array.from(boxes).map(b => b.value).join('');
    if (code.length < 6) {
        flashError('Please enter the full 6-digit code.'); return;
    }
    // TODO: verify code with backend

    // build summary
    const name  = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const role  = document.getElementById('reg-role').value;
    document.getElementById('account-summary').innerHTML =
        `<strong>Name:</strong> ${name}<br>
         <strong>Email:</strong> ${email}<br>
         <strong>Role:</strong> ${role}`;

    goRegStep(3);

    // trigger SVG animation
    setTimeout(() => {
        document.getElementById('success-ring').classList.add('animate');
        document.getElementById('check-mark').classList.add('animate');
    }, 100);

    clearInterval(otpTimerInterval);
}

// OTP INPUTS — auto-advance & backspace
document.addEventListener('DOMContentLoaded', () => {
    const boxes = document.querySelectorAll('.otp-box');
    boxes.forEach((box, idx) => {
        box.addEventListener('input', () => {
            box.value = box.value.replace(/\D/g,'').slice(-1);
            if (box.value) {
                box.classList.add('filled');
                if (idx < boxes.length - 1) boxes[idx+1].focus();
            } else {
                box.classList.remove('filled');
            }
        });
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !box.value && idx > 0) {
                boxes[idx-1].focus();
            }
        });
        box.addEventListener('paste', (e) => {
            const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g,'');
            if (pasted.length === 6) {
                boxes.forEach((b, i) => {
                    b.value = pasted[i] || '';
                    if (b.value) b.classList.add('filled');
                });
                boxes[5].focus();
                e.preventDefault();
            }
        });
    });
});

// OTP COUNTDOWN
let otpTimerInterval;
function startOTPTimer() {
    clearInterval(otpTimerInterval);
    let seconds = 120;
    const el = document.getElementById('otp-countdown');
    function tick() {
        const m = String(Math.floor(seconds / 60)).padStart(2,'0');
        const s = String(seconds % 60).padStart(2,'0');
        el.textContent = `${m}:${s}`;
        if (seconds <= 0) clearInterval(otpTimerInterval);
        seconds--;
    }
    tick();
    otpTimerInterval = setInterval(tick, 1000);
}

function resendOTP(e) {
    e.preventDefault();
    document.querySelectorAll('.otp-box').forEach(b => { b.value=''; b.classList.remove('filled'); });
    document.querySelector('.otp-box').focus();
    startOTPTimer();
    flashSuccess('A new code has been sent!');
}

// ---------- FLASH MESSAGES ----------
function flashError(msg) {
    showToast(msg, '#ef4444');
}
function flashSuccess(msg) {
    showToast(msg, '#22c55e');
}

function showToast(msg, color) {
    let toast = document.getElementById('ms-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'ms-toast';
        toast.style.cssText = `
            position:fixed; bottom:32px; left:50%; transform:translateX(-50%) translateY(20px);
            background:${color}; color:#fff;
            padding:12px 24px; border-radius:12px;
            font-size:13px; font-weight:600;
            box-shadow:0 8px 24px rgba(0,0,0,0.2);
            z-index:9999; opacity:0;
            transition:all 0.3s cubic-bezier(0.22,1,0.36,1);
            white-space:nowrap;
        `;
        document.body.appendChild(toast);
    }
    toast.style.background = color;
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
    }, 3000);
}

// Shake keyframe (injected)
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-8px)}
    40%{transform:translateX(8px)}
    60%{transform:translateX(-5px)}
    80%{transform:translateX(5px)}
}`;
document.head.appendChild(style);