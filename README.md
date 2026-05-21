# HANLAH (All-Ages)

A clean, ad-free, and kid-friendly "HANLAH" clone built for families. 

## Features
- **3 Difficulty Levels:** 3, 4, or 5-letter words.
- **Family-Friendly:** Hand-picked dictionary safe for all ages.
- **Visual Themes:** Switch between "Realistic Cafe" and "Gamified Sunset" (Default).
- **Responsive:** Optimized for Phones, Tablets, and TVs.
- **Custom Keyboard:** Virtual on-screen keyboard for easy touch and remote navigation.

## How to Play
1. Pick a word length to start.
2. Guess the word!
   - **Matcha Green:** Letter is in the right spot.
   - **Honey Yellow:** Letter is in the word, but wrong spot.
   - **Soft Gray:** Letter is not in the word.
3. You have 6 tries to find the secret word.

## Project Structure
- `index.html`: Main game structure.
- `assets/css/style.css`: Clean & Colorful theming engine.
- `assets/js/game.js`: Core game logic and input management.
- `assets/js/words.js`: Curated dictionary.

## Background Customization
The game supports responsive AI-generated backgrounds. To add yours:
1. Create `assets/images/` folder.
2. Add your images:
   - `cafe-bg-mobile.jpg` (Portrait)
   - `cafe-bg-desktop.jpg` (Landscape)
   - `cafe-sunset-bg-mobile.jpg` (Portrait)
   - `cafe-sunset-bg-desktop.jpg` (Landscape)

## License
MIT License - Open for modification and sharing.
