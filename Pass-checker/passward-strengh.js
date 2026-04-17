//Reusable Password Strength Checker Library 
class PasswordStrengthChecker {
  static defaults = {
    minLength: 8,
    showEntropy: true,
    showChecklist: true,
    preventSubmitIfWeak: true,
    messages: {
      empty: 'Enter a password',
      weak: 'Weak',
      fair: 'Fair',
      good: 'Good',
      strong: 'Strong',
      veryStrong: 'Excellent'
    },
    colors: {
      weak: '#ef4444',
      fair: '#f97316',
      good: '#eab308',
      strong: '#22c55e',
      veryStrong: '#0ea5e9'
    }
  };

  constructor(inputEl, options = {}) {
    this.input = typeof inputEl === 'string' ? document.querySelector(inputEl) : inputEl;
    if (!this.input || this.input.type !== 'password') throw new Error('Target must be a password input');
    this.form = this.input.closest('form') || document.body;
    this.opts = { ...PasswordStrengthChecker.defaults, ...options };
    this.checks = { length: false, uppercase: false, lowercase: false, number: false, special: false, entropy: false };
    this.init();
  }

  init() {
    this.createUI();
    this.bindEvents();
    this.evaluate(this.input.value);
  }

  createUI() {
    const wrapper = document.createElement('div');
    wrapper.className = 'psc-wrapper';
    wrapper.innerHTML = `
      <div class="psc-meter">
        <div class="psc-bar"></div>
      </div>
      <div class="psc-header">
        <span class="psc-label">${this.opts.messages.empty}</span>
        <span class="psc-entropy"></span>
      </div>
      <ul class="psc-checklist" style="display: ${this.opts.showChecklist ? 'block' : 'none'}">
        <li data-key="length">⚪ Min ${this.opts.minLength} characters</li>
        <li data-key="uppercase">⚪ Uppercase letter (A-Z)</li>
        <li data-key="lowercase">⚪ Lowercase letter (a-z)</li>
        <li data-key="number">⚪ Number (0-9)</li>
        <li data-key="special">⚪ Special character (!@#$%^&*)</li>
        ${this.opts.showEntropy ? '<li data-key="entropy">⚪ High entropy (≥ 60 bits)</li>' : ''}
      </ul>
      <button type="button" class="psc-toggle" aria-label="Toggle password visibility">👁️</button>
      <div class="psc-feedback" aria-live="polite"></div>
    `;

    this.input.insertAdjacentElement('afterend', wrapper);
    this.wrapper = wrapper;
    this.bar = wrapper.querySelector('.psc-bar');
    this.label = wrapper.querySelector('.psc-label');
    this.entropyEl = wrapper.querySelector('.psc-entropy');
    this.checklist = wrapper.querySelector('.psc-checklist');
    this.toggleBtn = wrapper.querySelector('.psc-toggle');
    this.feedbackEl = wrapper.querySelector('.psc-feedback');
  }

  bindEvents() {
    this.input.addEventListener('input', () => this.evaluate(this.input.value));
    this.toggleBtn.addEventListener('click', () => {
      const isPass = this.input.type === 'password';
      this.input.type = isPass ? 'text' : 'password';
      this.toggleBtn.textContent = isPass ? '🙈' : '👁️';
      this.input.focus();
    });

    if (this.opts.preventSubmitIfWeak) {
      this.form.addEventListener('submit', (e) => {
        const score = this.getScore();
        if (score < 50) {
          e.preventDefault();
          this.feedbackEl.textContent = '⚠️ Password is too weak to submit.';
          this.feedbackEl.style.color = 'var(--psc-danger)';
          this.input.focus();
        }
      });
    }
  }

  evaluate(pwd) {
    this.checks.length = pwd.length >= this.opts.minLength;
    this.checks.uppercase = /[A-Z]/.test(pwd);
    this.checks.lowercase = /[a-z]/.test(pwd);
    this.checks.number = /[0-9]/.test(pwd);
    this.checks.special = /[^A-Za-z0-9]/.test(pwd);
    this.checks.entropy = this.calcEntropy(pwd) >= 60;

    this.updateChecklist();
    this.updateMeter(pwd);
  }

  updateChecklist() {
    this.checklist.querySelectorAll('li').forEach(li => {
      const key = li.dataset.key;
      const passed = this.checks[key];
      li.className = passed ? 'psc-pass' : 'psc-fail';
      li.innerHTML = passed ? `<span class="psc-icon">✓</span> ${li.textContent.slice(2)}` : `<span class="psc-icon">✕</span> ${li.textContent.slice(2)}`;
    });
  }

  updateMeter(pwd) {
    const score = this.getScore();
    const entropy = this.calcEntropy(pwd);

    this.entropyEl.textContent = this.opts.showEntropy && pwd.length ? `${entropy.toFixed(0)} bits` : '';

    let level, color, width;
    if (pwd.length === 0) {
      this.label.textContent = this.opts.messages.empty;
      this.bar.style.width = '0%';
      this.bar.style.background = 'var(--psc-muted)';
      this.feedbackEl.textContent = '';
      return;
    }

    if (score <= 20) { level = 'weak'; width = '20%'; }
    else if (score <= 40) { level = 'fair'; width = '40%'; }
    else if (score <= 60) { level = 'good'; width = '60%'; }
    else if (score <= 80) { level = 'strong'; width = '80%'; }
    else { level = 'veryStrong'; width = '100%'; }

    this.label.textContent = this.opts.messages[level];
    this.bar.style.width = width;
    this.bar.style.background = this.opts.colors[level];

    const warnings = this.getWarnings(pwd);
    this.feedbackEl.textContent = warnings.length > 0 ? warnings.join(' • ') : '✅ Password meets security standards.';
    this.feedbackEl.style.color = warnings.length > 0 ? 'var(--psc-warning)' : 'var(--psc-success)';
  }

  getScore() {
    let score = 0;
    if (this.checks.length) score += 20;
    if (this.input.value.length >= 12) score += 10;
    if (this.input.value.length >= 16) score += 5;
    if (this.checks.uppercase) score += 15;
    if (this.checks.lowercase) score += 15;
    if (this.checks.number) score += 15;
    if (this.checks.special) score += 15;
    if (this.checks.entropy) score += 5;
    return Math.min(100, Math.max(0, score));
  }

  calcEntropy(pwd) {
    let pool = 0;
    if (/[a-z]/.test(pwd)) pool += 26;
    if (/[A-Z]/.test(pwd)) pool += 26;
    if (/[0-9]/.test(pwd)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) pool += 32;
    return pwd.length > 0 ? pwd.length * Math.log2(pool || 1) : 0;
  }

  getWarnings(pwd) {
    const w = [];
    if (/(.)\1{2,}/.test(pwd)) w.push('🔁 Repeated characters detected');
    if (/^(?:[a-z]+|[A-Z]+|[0-9]+)$/.test(pwd)) w.push('📉 Only one character type');
    if (/^(?:password|123456|qwerty|abc123|letmein|admin)/i.test(pwd)) w.push('🚫 Common/leaked password');
    return w;
  }

  destroy() {
    this.wrapper.remove();
    this.input.removeEventListener('input', () => {});
    this.toggleBtn.removeEventListener('click', () => {});
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) module.exports = PasswordStrengthChecker;