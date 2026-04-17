# 🔐 Advanced Password Strength Checker

A modern, highly interactive, and secure client-side password strength analyzer with real-time feedback, cryptographic password generation, pattern detection, and dark mode support. Built with vanilla HTML, CSS, and JavaScript.

![Password Strength Checker Preview](https://img.shields.io/badge/Status-Ready-brightgreen)
![Tech](https://img.shields.io/badge/Tech-HTML%2FCSS%2FJS-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 📊 **Real-time strength scoring** (0–100) with animated progress bar
- 🔢 **Dynamic entropy calculation** based on actual character pool used
- 🔍 **Pattern & sequence detection** (keyboard walks, repeats, `1234`, `qwerty`)
- 🚫 **Common password blacklist** (client-side subset of leaked passwords)
- ⚡ **Cryptographically secure generator** (`Web Crypto API`)
- 🌓 **Dark/Light mode** with persistent `localStorage` preference
- 📋 **Secure clipboard copy** + toast notifications
- ♿ **Fully accessible** (ARIA live regions, keyboard nav, semantic HTML)
- 📱 **Responsive & mobile-first** design

## 🛠️ Tech Stack

- HTML5 + CSS3 (CSS Variables, Flexbox/Grid, Animations)
- Vanilla JavaScript (ES6+)
- Web Crypto API (`crypto.getRandomValues`)
- Clipboard API & LocalStorage API
- Zero dependencies, no build step required

## 🚀 Quick Start

### Direct Open
```bash
git clone https://github.com/Vipul99999/password-strength-checker.git
cd password-strength-checker
```


## 📖 How to Use

1. **Type a password** → Watch the strength bar, entropy meter, and checklist update in real-time.
2. **Generate a password** → Adjust length (8–64), toggle character types, and click `Generate Strong Password`.
3. **Copy & Share** → Click 📋 to copy to clipboard (requires secure context).
4. **Toggle UI** → Switch themes 🌙/☀️, show/hide password 👁️/🙈.
5. **Review feedback** → Warnings appear for patterns, repeats, or known weak passwords.

## 📈 Scoring & Entropy Logic

### Strength Score (0–100)
| Criteria                          | Points |
|-----------------------------------|--------|
| ≥ 8 characters                    | +15    |
| ≥ 12 characters                   | +10    |
| ≥ 16 characters                   | +5     |
| Contains uppercase                | +15    |
| Contains lowercase                | +15    |
| Contains numbers                  | +15    |
| Contains special characters       | +15    |
| Entropy ≥ 60 bits                 | +10    |
| **Penalty per warning/pattern**   | **-15**|

### Entropy Formula
```
Entropy (bits) = Length × log₂(Pool Size)
```
Pool size is dynamically calculated based on which character sets are actually present in the input. Higher entropy = harder to brute-force.

## 🔒 Security & Privacy

- 🔐 **100% Client-Side**: No passwords are logged, transmitted, or stored.
- 🧮 **Secure RNG**: Uses `crypto.getRandomValues()` instead of `Math.random()` for generation.
- 🌐 **Clipboard Note**: The Clipboard API requires HTTPS or `localhost` in modern browsers.
- ⚠️ **Production Warning**: Always validate password policies server-side. Use `bcrypt`, `Argon2`, or `scrypt` for hashing. Never store plaintext passwords.

## 📁 Project Structure
```
password-strength-checker/
├── index.html      # Semantic UI structure & accessibility hooks
├── style.css       # Theme-aware, responsive styling with CSS variables
└── script.js       # Core logic: validation, generation, entropy, UI updates
```

## 🗺️ Roadmap & Enhancements
- [ ] Integrate [HaveIBeenPwned API](https://haveibeenpwned.com/API/v3) via secure backend proxy
- [ ] Add PWA support (service worker, offline install, manifest)
- [ ] Export/Import compatibility with 1Password/Bitwarden CSV formats
- [ ] Framework versions: React, Vue, Svelte components
- [ ] Custom rule engine (min requirements, banned phrases, dictionary words)

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.
1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License
Distributed under the [MIT License](LICENSE). See `LICENSE` for more information.
 