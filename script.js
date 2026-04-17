document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const passwordInput = document.getElementById('passwordInput');
    const toggleVisibility = document.getElementById('toggleVisibility');
    const copyBtn = document.getElementById('copyBtn');
    const themeToggle = document.getElementById('themeToggle');
    const strengthBar = document.getElementById('strengthBar');
    const strengthLabel = document.getElementById('strengthLabel');
    const entropyLabel = document.getElementById('entropyLabel');
    const feedbackBox = document.getElementById('feedbackBox');
    const criteriaList = document.querySelectorAll('.criteria-list li');
    const lengthSlider = document.getElementById('lengthSlider');
    const lengthValue = document.getElementById('lengthValue');
    const generateBtn = document.getElementById('generateBtn');
    const toast = document.getElementById('toast');

    // State
    let isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) document.body.classList.add('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';

    // Common passwords (subset for demo)
    const COMMON_PASSWORDS = new Set([
        'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'master',
        'dragon', '111111', 'baseball', 'iloveyou', 'trustno1', 'sunshine', 'letmein'
    ]);

    // Keyboard sequences
    const KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890'];
    const SEQUENTIAL_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        document.body.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    });

    // Visibility Toggle
    toggleVisibility.addEventListener('click', () => {
        const isPass = passwordInput.type === 'password';
        passwordInput.type = isPass ? 'text' : 'password';
        toggleVisibility.textContent = isPass ? '🙈' : '👁️';
    });

    // Copy to Clipboard
    copyBtn.addEventListener('click', async () => {
        if (!passwordInput.value) return showToast('Nothing to copy');
        try {
            await navigator.clipboard.writeText(passwordInput.value);
            showToast('Copied to clipboard!');
        } catch {
            showToast('Copy failed. Try selecting manually.');
        }
    });

    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        toast.setAttribute('aria-hidden', 'false');
        setTimeout(() => {
            toast.classList.remove('show');
            toast.setAttribute('aria-hidden', 'true');
        }, 2000);
    }

    // Password Evaluation
    passwordInput.addEventListener('input', () => evaluate(passwordInput.value));

    function evaluate(pwd) {
        const checks = {
            length: pwd.length >= 8,
            uppercase: /[A-Z]/.test(pwd),
            lowercase: /[a-z]/.test(pwd),
            number: /[0-9]/.test(pwd),
            special: /[^A-Za-z0-9]/.test(pwd)
        };

        // Update checklist
        criteriaList.forEach(li => {
            const key = li.dataset.criteria;
            const passed = checks[key] || (key === 'entropy' && calculateEntropy(pwd) >= 60);
            li.className = passed ? 'valid' : (pwd.length ? 'invalid' : '');
            li.textContent = passed ? `✅ ${li.textContent.slice(2)}` : `❌ ${li.textContent.slice(2)}`;
        });

        // Entropy
        const entropy = calculateEntropy(pwd);
        entropyLabel.textContent = `Entropy: ${pwd.length ? entropy.toFixed(1) : '--'} bits`;

        // Pattern & Common Checks
        const warnings = [];
        if (pwd.length === 0) {
            strengthLabel.textContent = 'Enter a password';
            strengthBar.style.width = '0%';
            strengthBar.style.background = 'var(--text-muted)';
            feedbackBox.textContent = '';
            return;
        }

        if (COMMON_PASSWORDS.has(pwd.toLowerCase())) warnings.push('⚠️ Extremely common password');
        if (/(.)\1{2,}/.test(pwd)) warnings.push('🔁 Contains repeated characters');
        if (detectKeyboardWalk(pwd)) warnings.push('⌨️ Contains keyboard pattern');
        if (detectSequential(pwd)) warnings.push('🔢 Contains sequential characters');

        feedbackBox.textContent = warnings.join('. ') || '✅ Looks solid!';
        feedbackBox.style.color = warnings.length ? 'var(--warning)' : 'var(--success)';
        feedbackBox.style.background = warnings.length ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)';

        // Strength Scoring (0-100)
        let score = 0;
        if (checks.length) score += 15;
        if (pwd.length >= 12) score += 10;
        if (pwd.length >= 16) score += 5;
        if (checks.uppercase) score += 15;
        if (checks.lowercase) score += 15;
        if (checks.number) score += 15;
        if (checks.special) score += 15;
        if (entropy >= 60) score += 10;
        score = Math.max(0, score - warnings.length * 15);

        let level, color, width;
        if (score <= 20) { level = 'Very Weak'; color = 'var(--danger)'; width = '20%'; }
        else if (score <= 40) { level = 'Weak'; color = '#f97316'; width = '40%'; }
        else if (score <= 60) { level = 'Fair'; color = 'var(--warning)'; width = '60%'; }
        else if (score <= 80) { level = 'Good'; color = '#3b82f6'; width = '80%'; }
        else { level = 'Strong'; color = 'var(--success)'; width = '100%'; }

        strengthLabel.textContent = level;
        strengthBar.style.width = width;
        strengthBar.style.background = color;
    }

    function calculateEntropy(pwd) {
        let pool = 0;
        if (/[a-z]/.test(pwd)) pool += 26;
        if (/[A-Z]/.test(pwd)) pool += 26;
        if (/[0-9]/.test(pwd)) pool += 10;
        if (/[^a-zA-Z0-9]/.test(pwd)) pool += 32;
        return pwd.length * Math.log2(pool || 1);
    }

    function detectKeyboardWalk(pwd) {
        const lower = pwd.toLowerCase();
        return KEYBOARD_ROWS.some(row => {
            for (let i = 0; i <= row.length - 4; i++) {
                if (lower.includes(row.substring(i, i + 4))) return true;
            }
            return false;
        });
    }

    function detectSequential(pwd) {
        const lower = pwd.toLowerCase();
        for (let i = 0; i <= SEQUENTIAL_CHARS.length - 4; i++) {
            if (lower.includes(SEQUENTIAL_CHARS.substring(i, i + 4))) return true;
            if (lower.includes(SEQUENTIAL_CHARS.split('').reverse().join('').substring(i, i + 4))) return true;
        }
        return false;
    }

    // Password Generator
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
    });

    generateBtn.addEventListener('click', () => {
        const length = parseInt(lengthSlider.value);
        const useUpper = document.getElementById('useUpper').checked;
        const useLower = document.getElementById('useLower').checked;
        const useNumbers = document.getElementById('useNumbers').checked;
        const useSymbols = document.getElementById('useSymbols').checked;

        let charset = '';
        if (useLower) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useNumbers) charset += '0123456789';
        if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (!charset) {
            showToast('Select at least one character type');
            return;
        }

        // Cryptographically secure generation
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        let pwd = '';
        for (let i = 0; i < length; i++) {
            pwd += charset[array[i] % charset.length];
        }

        passwordInput.value = pwd;
        passwordInput.type = 'text';
        toggleVisibility.textContent = '🙈';
        evaluate(pwd);
        showToast('Password generated!');
    });

    evaluate('');
});