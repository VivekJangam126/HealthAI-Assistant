document.addEventListener('DOMContentLoaded', () => {
    // Forms & controls
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');

    const loginTabBtn = document.getElementById('login-tab-btn');
    const registerTabBtn = document.getElementById('register-tab-btn');
    const forgotPasswordBtn = document.getElementById('forgot-password-btn');
    const backToLoginBtn = document.getElementById('back-to-login');

    const googleBtn = document.querySelector('.google-btn');
    const githubBtn = document.querySelector('.github-btn');

    const loginError = document.getElementById('login-error-message');
    const registerError = document.getElementById('register-error-message');
    const forgotMessage = document.getElementById('forgot-password-message');

    // Ensure password strength bar exists
    const pwdStrengthWrap = document.getElementById('password-strength');
    if (pwdStrengthWrap && !pwdStrengthWrap.querySelector('.password-strength-bar')) {
        const bar = document.createElement('div');
        bar.className = 'password-strength-bar';
        pwdStrengthWrap.appendChild(bar);
    }

    // Tab switching
    function switchTab(tab) {
        [loginForm, registerForm, forgotPasswordForm].forEach(f => f.classList.add('hidden'));
        loginTabBtn.classList.remove('active-tab'); registerTabBtn.classList.remove('active-tab');

        if (tab === 'login') {
            loginForm.classList.remove('hidden');
            loginTabBtn.classList.add('active-tab');
        } else if (tab === 'register') {
            registerForm.classList.remove('hidden');
            registerTabBtn.classList.add('active-tab');
        } else if (tab === 'forgot') {
            forgotPasswordForm.classList.remove('hidden');
        }
        // clear messages
        [loginError, registerError, forgotMessage].forEach(el => el && el.classList.add('hidden'));
    }

    loginTabBtn.addEventListener('click', () => switchTab('login'));
    registerTabBtn.addEventListener('click', () => switchTab('register'));
    forgotPasswordBtn.addEventListener('click', () => switchTab('forgot'));
    backToLoginBtn.addEventListener('click', () => switchTab('login'));

    // Password visibility toggles (icon-only)
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.closest('.password-input-group').querySelector('input');
            if (!input) return;
            if (input.type === 'password') {
                input.type = 'text';
                // set "open" icon
                btn.innerHTML = `
                    <svg class="eye-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>`;
            } else {
                input.type = 'password';
                // set "closed" (slashed) icon
                btn.innerHTML = `
                    <svg class="eye-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M10.58 10.58A3 3 0 0114 14m-4-4a3 3 0 104.24 4.24" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c2.02 0 3.9.6 5.43 1.62" />
                    </svg>`;
            }
        });
    });

    // Password strength (register)
    const registerPassword = document.getElementById('register-password');
    const strengthBar = document.querySelector('.password-strength-bar');
    registerPassword?.addEventListener('input', (e) => {
        const s = calcStrength(e.target.value);
        if (strengthBar) {
            strengthBar.style.width = s + '%';
            strengthBar.style.backgroundColor = s < 50 ? '#ef4444' : (s < 75 ? '#fbbf24' : '#10b981');
        }
    });

    function calcStrength(pw) {
        let score = 0;
        if (!pw) return 0;
        if (pw.length >= 8) score += 30;
        if (/[A-Z]/.test(pw)) score += 20;
        if (/[0-9]/.test(pw)) score += 25;
        if (/[^A-Za-z0-9]/.test(pw)) score += 25;
        return Math.min(100, score);
    }

    // Social auth buttons: redirect to server endpoints
    googleBtn?.addEventListener('click', () => { window.location.href = '/auth/google'; });
    githubBtn?.addEventListener('click', () => { window.location.href = '/auth/github'; });

    // Login submit — call backend /api/auth/login
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        if (!email || !password) return showFormMessage(loginError, 'Please enter email and password');

        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const prevText = submitBtn?.textContent;
        try {
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Signing in...'; }

            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // ensure cookie (dsms_token) is set
                body: JSON.stringify({ email, password })
            });

            const data = await res.json().catch(() => ({}));
            if (res.ok && data?.success) {
                // redirect to dashboard as provided by server
                window.location.href = data.redirect || '/HTML/dashboard.html';
                return;
            }

            // Show server-provided error if present
            const errMsg = data?.error || data?.message || 'Invalid credentials';
            showFormMessage(loginError, errMsg);
        } catch (err) {
            console.error('Login request failed', err);
            showFormMessage(loginError, 'Login request failed — please try again');
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = prevText; }
        }
    });

    // Register submit — call backend /api/auth/register
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;

        if (!name || !email || !password) return showFormMessage(registerError, 'All fields are required');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showFormMessage(registerError, 'Enter a valid email');
        if (password.length < 8) return showFormMessage(registerError, 'Password must be at least 8 characters');

        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const prevText = submitBtn?.textContent;
        try {
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Creating account...'; }

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // ensure cookie (dsms_token) is set
                body: JSON.stringify({ fullName: name, email, password })
            });

            const data = await res.json().catch(() => ({}));
            if (res.ok && data?.success) {
                window.location.href = data.redirect || '/HTML/dashboard.html';
                return;
            }

            const errMsg = data?.error || data?.message || 'Registration failed';
            showFormMessage(registerError, errMsg);
        } catch (err) {
            console.error('Register request failed', err);
            showFormMessage(registerError, 'Registration request failed — please try again');
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = prevText; }
        }
    });

    // Forgot password submit
    forgotPasswordForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('reset-email').value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showFormMessage(forgotMessage, 'Enter a valid email', true);

        try {
            const res = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (res.ok) {
                showFormMessage(forgotMessage, 'If an account exists, a reset link was sent', false);
                setTimeout(() => switchTab('login'), 3000);
            } else {
                const data = await res.json().catch(()=>({message:'Request failed'}));
                showFormMessage(forgotMessage, data.message || 'Request failed', true);
            }
        } catch (err) {
            // fallback: simulate success
            showFormMessage(forgotMessage, 'If an account exists, a reset link was sent', false);
            setTimeout(() => switchTab('login'), 3000);
        }
    });

    // Helpers
    function showFormMessage(el, msg, isError = true) {
        if (!el) return;
        el.textContent = msg;
        el.classList.remove('hidden');
        if (isError) {
            el.classList.remove('success-message');
            el.classList.add('error-message');
        } else {
            el.classList.remove('error-message');
            el.classList.add('success-message');
        }
    }

    // initialize default tab
    switchTab('login');
});