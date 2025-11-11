# 🎡 Spin the Wheel

A beautiful, modern web app for making decisions with style! Features spinning wheel animations, OCR image upload, game modes, and more.

## ✨ Features

- **Smart Item Management**: Add items manually, extract text from images using OCR, or import from CSV files
- **Multiple Import Methods**:
  - Manual text input
  - Image upload with OCR (supports multiple images)
  - CSV file import
- **Duplicate Detection**: Automatically detects and alerts for duplicate items
- **Game Modes**:
  - 🎁 **Reward Mode**: Celebrate wins with confetti and animations
  - ❌ **Elimination Mode**: Remove items as they're selected, find the last one standing
- **Navigation**: Easy switching between Spin Wheel and Coin Toss features
- **Coin Toss**: Quick heads/tails decision maker with animations
- **Beautiful UI**: Responsive design with smooth animations and sound effects
- **Customizable**: Control whether items are removed after spinning

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Build

```bash
npm run build
```

## 🎮 How to Use

1. **Adding Items**:
   - Type item names manually in the input field
   - Upload one or more images with text (OCR will extract the text)
   - Import a CSV file with item names (one per line or comma-separated)
2. Choose your game mode (Reward or Elimination) in Settings
3. Click the navigation tabs to switch between Spin Wheel and Coin Toss
4. Spin the wheel and watch the magic happen!
5. Use the coin toss feature for quick yes/no decisions

### CSV Import Format

The CSV importer accepts two formats:

**Format 1: One item per line**
```csv
Option 1
Option 2
Option 3
```

**Format 2: Comma-separated**
```csv
Option 1, Option 2, Option 3
```

A sample CSV file (`sample-items.csv`) is included in the project.

## 🛠️ Technologies

- React 18
- Vite
- Framer Motion (animations)
- Zustand (state management)
- Tesseract.js (OCR)
- React Toastify (notifications)
- React Confetti (celebrations)

## 📄 License

MIT
