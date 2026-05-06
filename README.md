# 🧮 CALCULUS — The Fun Calculator

A beautiful, dark-themed calculator web app with interactive mini-tools built with vanilla HTML, CSS, and JavaScript. No frameworks, no dependencies — just pure frontend goodness.

## ✨ Features

### 🖩 Calculator
- Full arithmetic operations (+, −, ×, ÷)
- Percentage and sign toggle
- Expression history chips
- **Keyboard support** — just type!
- Error handling (divide by zero, etc.)

### 🍕 Tip Splitter
- Enter a bill amount, choose tip % (10–25%)
- Adjust number of people with a stepper
- Instantly see tip/person, total/person, and grand total

### ⚖️ BMI Meter
- Metric (cm/kg) and Imperial (ft+in/lbs) modes
- Animated BMI bar with marker
- Category labels: Underweight, Normal, Overweight, Obese

### 🪙 Coin Flip
- Smooth 3D CSS flip animation
- Tracks heads/tails statistics
- Reset button to start fresh

## 🎨 Design Highlights
- Dark theme with lime-green accent (`#c8ff57`)
- Custom animated cursor (desktop)
- Animated dot-grid background
- Smooth tab transitions
- Toast notifications
- Keyboard support for the calculator
- Fully responsive for mobile

## 📁 File Structure

```
calculator-site/
├── index.html   # Structure & markup
├── style.css    # All styles & animations
├── app.js       # Calculator logic + mini-tools
└── README.md    # You're reading this!
```

## 🚀 Getting Started

No build steps needed. Just open `index.html` in any modern browser, or serve it with:

```bash
# Using Python
python3 -m http.server 8080

# Using Node/npx
npx serve .

# Using VS Code
# Install "Live Server" extension, then right-click index.html → Open with Live Server
```

Then visit `http://localhost:8080`

## 🌐 Deploy to GitHub Pages

1. Push this folder to a GitHub repo
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)` folder
4. Your site will be live at `https://yourusername.github.io/your-repo/`

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Markup | HTML5 |
| Styles | CSS3 (custom properties, grid, animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts (Syne, Syne Mono, DM Sans) |

## 📜 License

MIT — free to use, modify, and share.
