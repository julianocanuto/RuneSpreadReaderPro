# ᚛ Rune Spread Reader Pro ᚛

A modern, interactive React application for Elder Futhark rune divination and spreads. Features bilingual support (Portuguese & English), multiple spread types, and an intuitive gesture-based interface.

## Features

### 🎴 Core Functionality
- **24 Elder Futhark Runes** - Complete rune deck with symbols, meanings, and descriptions
- **Multiple Spread Types**:
  - Single Rune (1 card)
  - Past/Present/Future (3 cards)
  - Situation/Action/Outcome (3 cards)
  - Mind/Body/Spirit (3 cards)
  - Embrace/Release/Focus (3 cards)
  - Five Rune Spread (5 cards)
  - Celtic Cross (10 cards)

### 🎮 Interactive Modes
- **Shuffle Mode** - Gesture-based shuffling with circular motion detection
- **Select Mode** - Click to select runes for your spread
- **Read Mode** - Reveal selected runes one at a time or all at once

### 🌍 Bilingual Support
- Portuguese (pt-BR)
- English (en)
- Real-time language switching with instant UI updates

### 🎨 User Interface
- Dark, mystical theme with gradient backgrounds
- Responsive design for desktop and mobile
- Smooth animations and transitions
- Felt texture overlay for authentic card table feel
- Compact header with spread selector and mode buttons
- Horizontal scrollable revealed runes display

### 📱 Touch & Mouse Support
- Full touch gesture support for mobile devices
- Mouse and trackpad compatibility
- Smooth motion detection for shuffle intensity

## How to Use

### Getting Started
1. Open the application in your React environment
2. The deck initializes with 24 runes centered on the table

### Shuffle Mode (🌀)
- Click and drag with circular motions to shuffle the deck
- The shuffle intensity indicator shows your motion intensity
- Runes scatter and reorder based on your gestures

### Select Mode (👆)
1. Switch to Select mode
2. Click on runes to select them for your spread
3. Selected runes show a ring indicator and order number
4. Maximum selections depend on your chosen spread type

### Read Mode (🔮)
1. After selecting runes, switch to Read mode
2. Click "Reveal" to reveal one rune at a time
3. Click "All" to reveal all selected runes at once
4. Revealed runes appear in the bottom panel with their position, name, and meaning

### Additional Features
- **View Deck** (📖) - Browse all 24 runes with their symbols and meanings
- **Spread Selector** - Choose different spread types from the dropdown
- **Reset** - Clear all selections and return runes to center
- **Spread** - Arrange all runes in a grid pattern
- **Language Toggle** - Switch between Portuguese and English

## Rune Meanings

### First Aett (Fehu - Wunjo)
- **Fehu** (ᚠ) - Wealth, Abundance and prosperity
- **Uruz** (ᚢ) - Strength, Primal strength and courage
- **Thurisaz** (ᚦ) - Thorn, Protection and conflict
- **Ansuz** (ᚨ) - Divine, Wisdom and inspiration
- **Raidho** (ᚱ) - Journey, Travel and life cycles
- **Kenaz** (ᚲ) - Torch, Knowledge and illumination
- **Gebo** (ᚷ) - Gift, Balance and partnership
- **Wunjo** (ᚹ) - Joy, Joy and harmony

### Second Aett (Hagalaz - Sowilo)
- **Hagalaz** (ᚺ) - Hail, Crisis and transformation
- **Nauthiz** (ᚾ) - Need, Constraint and growth
- **Isa** (ᛁ) - Ice, Pause and introspection
- **Jera** (ᛃ) - Harvest, Cycles and rewards
- **Eihwaz** (ᛇ) - Yew, Resilience and transformation
- **Perthro** (ᛈ) - Fate, Mystery and chance
- **Algiz** (ᛉ) - Protection, Divine protection
- **Sowilo** (ᛊ) - Sun, Success and victory

### Third Aett (Tiwaz - Othala)
- **Tiwaz** (ᛏ) - Justice, Honor and courage
- **Berkano** (ᛒ) - Birth, New beginnings
- **Ehwaz** (ᛖ) - Horse, Partnership and trust
- **Mannaz** (ᛗ) - Humanity, Consciousness and friendship
- **Laguz** (ᛚ) - Water, Intuition and flow
- **Ingwaz** (ᛜ) - Fertility, Completion and potential
- **Dagaz** (ᛞ) - Day, Awakening and breakthrough
- **Othala** (ᛟ) - Home, Heritage and ancestry

## Technical Details

### Technologies
- **React** - UI framework
- **Tailwind CSS** - Styling and responsive design
- **JavaScript** - Core logic and gesture detection

### Key Components
- **Shuffle Algorithm** - Motion-based card shuffling with intensity detection
- **Gesture Recognition** - Circular motion detection for shuffle mode
- **State Management** - React hooks for deck state, selections, and reveals
- **Responsive Layout** - Flexbox-based adaptive UI

### Browser Support
- Modern browsers with ES6+ support
- Touch-enabled devices for gesture support
- Tested on desktop and mobile platforms

## Installation

```bash
# Clone the repository
git clone https://github.com/julianocanuto/RuneSpreadReaderPro.git

# Install dependencies
npm install

# Start development server
npm start
```

## Component Structure

The main component [`RuneSpreadReaderPro.jsx`](RuneSpreadReaderPro.jsx:110) exports a single default function that manages:
- Rune deck initialization and positioning
- Mode switching (shuffle/select/read)
- Gesture detection and card shuffling
- Spread type selection and card revelation
- Language switching and translations
- UI rendering and interactions

## License

This project is open source and available under the MIT License.

## Author

Created by Juliano Canuto

---

**Disclaimer**: This application is for entertainment purposes only. Rune readings are not a substitute for professional advice.
