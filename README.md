# HANLAH (All-Ages)

A clean, ad-free, and kid-friendly "HANLAH" clone built for families. 

This project was created to provide a safe space for kids to practice spelling and logic without the distraction of inappropriate advertisements or complex tracking found in many online versions. It's designed to work perfectly on mobile phones, tablets, and even large-screen TVs for family gatherings.

## ✨ Features
- **Ad-Free & Private:** Runs entirely in the browser. No tracking, no ads, no data collection.
- **3 Difficulty Levels:** Choose between 3, 4, or 5-letter words.
- **Visual Themes:** Switch between "Realistic Cafe" and "Gamified Sunset" (Default).
- **Family-Friendly Dictionary:** Over 1,200 curated words appropriate for all ages.
- **Adaptive Input:** 
  - **TV/Desktop:** Includes a colourful on-screen keyboard for remote and group play.
- **Responsive Design:** Optimised for everything from small phones to 4K TVs.
- **Zero Install:** Just open `index.html` in any modern web browser.

## 🎮 How to Play
1. Pick a word length to start.
2. Guess the word!
   - **Matcha Green:** Letter is in the right spot.
   - **Honey Yellow:** Letter is in the word, but wrong spot.
   - **Soft Gray:** Letter is not in the word.
3. You have 6 tries to find the secret word.

## 🚀 Getting Started
### Play Locally
1. Clone this repository or download the ZIP file.
2. Open `index.html` in your favorite web browser.

### Host on GitHub Pages
1. Push this code to a public GitHub repository.
2. Go to **Settings > Pages**.
3. Select the `main` branch and `/ (root)` folder, then click **Save**.
4. Your game will be live at `https://your-username.github.io/your-repo-name/`.

## 🛠️ Project Structure
- `index.html`: Main game structure and UI.
- `assets/css/style.css`: Clean & Colourful theming engine and responsive layout.
- `assets/js/game.js`: Core game engine, input management, and logic.
- `assets/js/words.js`: Curated dictionary for all word lengths.

## 🖼️ Background Customisation
The game supports responsive AI-generated backgrounds. To add or change yours:
1. Locate the `assets/images/` folder.
2. Replace or add your images:
   - `cafe-bg-mobile.jpg` (Portrait)
   - `cafe-bg-desktop.jpg` (Landscape)
   - `cafe-sunset-bg-mobile.jpg` (Portrait)
   - `cafe-sunset-bg-desktop.jpg` (Landscape)

## 👨‍👩‍👧‍👦 For Developers / Parents
If you want to customize this for your own kids:
- **Adding Words:** Edit `assets/js/words.js` to add your own custom vocabulary.
- **Styling:** Modify the CSS variables at the top of `assets/css/style.css` to quickly change the game's colours.
- **Logic:** The game engine in `game.js` is written in vanilla JavaScript with clear comments for easy modification.

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).

***
Developed by FlashSolver [Dad].
