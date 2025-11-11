# 🎡 Spin the Wheel - Quick Start Guide

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## 🎮 Features Overview

### Core Functionality

#### 1. **Item Management**
- **Manual Input**: Type item names into the input field and click the + button
- **Image Upload (OCR)**: Click "Upload Image (OCR)" to extract text from screenshots or images
- **Edit Items**: Click the edit icon to modify any item
- **Delete Items**: Click the trash icon to remove items
- **Duplicate Detection**: Automatically detects and alerts when adding duplicate items

#### 2. **Game Modes**

##### Reward Mode 🎁
- Celebrate each selection with confetti animations
- Items remain on the wheel (unless "Remove after spin" is enabled)
- Perfect for random selection without elimination

##### Elimination Mode ❌
- Each selected item is automatically removed from the wheel
- Continue until only one item remains
- Final winner gets a special celebration animation
- Great for tournaments or finding the last person standing

#### 3. **Wheel Controls**
- Click the **SPIN** button to spin the wheel
- Beautiful animation with realistic physics
- Random selection algorithm ensures fairness
- **Undo & Spin Again** button appears after each spin to restore the last item

#### 4. **Coin Toss** 🪙
- Quick heads/tails decision maker
- 3D flip animation
- Located in the sidebar below the item list
- Perfect for simple yes/no decisions

#### 5. **Settings** ⚙️
- **Game Mode Selection**: Switch between Reward and Elimination modes
- **Remove After Spin**: Toggle whether items are removed after each spin (Reward mode only)
- **Sound Effects**: Enable/disable audio feedback
- Access via the gear icon in the top-right corner

### 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Powered by Framer Motion for buttery-smooth transitions
- **Color-Coded Items**: Each item gets a unique color for easy identification
- **Toast Notifications**: Non-intrusive feedback for actions
- **Confetti Effects**: Celebration animations in Reward mode
- **Modern Gradient Design**: Beautiful purple/blue gradient theme

### 🖼️ OCR Image Upload Tips

The OCR feature works best with:
- Clear, high-contrast text
- Screenshots of lists
- Text documents or notes
- Printed text (not handwritten)

**Supported formats**: JPG, PNG, WebP, and other common image formats

### 🎯 Use Cases

1. **Random Selection**: Pick a random winner from a list
2. **Decision Making**: Can't decide where to eat? Add restaurants and spin!
3. **Games**: Create custom game wheels for party games
4. **Tournaments**: Use elimination mode to find the ultimate winner
5. **Classroom**: Random student selection for activities
6. **Team Building**: Random team assignments or ice breakers

### ⌨️ Tips & Tricks

- **Bulk Import**: Upload a screenshot of a list to quickly add multiple items
- **Quick Edit**: Double-click an item to edit it quickly
- **Undo Feature**: Made a mistake? Use the "Undo & Spin Again" button
- **Coin Toss**: Use for quick binary decisions without setting up the wheel
- **Mobile Friendly**: Works great on phones for on-the-go decisions

## 🛠️ Technical Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Zustand** - Lightweight state management
- **Framer Motion** - Animation library
- **Tesseract.js** - OCR text extraction
- **React Toastify** - Toast notifications
- **React Confetti** - Celebration effects
- **Lucide React** - Beautiful icons

## 📱 Browser Support

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## 🎨 Customization

The app uses CSS custom properties for easy theming. You can modify colors in `src/index.css`:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --border-radius: 12px;
  --shadow-md: 0 4px 15px rgba(0, 0, 0, 0.15);
}
```

## 🐛 Troubleshooting

**OCR not working?**
- Ensure the image contains clear, readable text
- Try images with higher contrast
- Check browser console for errors

**Wheel not spinning?**
- Make sure you have at least one item added
- Check if the wheel is already spinning

**Audio not playing?**
- Check if sound is enabled in settings
- Some browsers require user interaction before playing audio
- Check system volume settings

## 📄 License

MIT License - Feel free to use and modify!

---

**Enjoy spinning! 🎉**
