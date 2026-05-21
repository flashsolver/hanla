/**
 * HANLAH (All-Ages) - Game Engine
 * 
 * This file handles the core game lifecycle, input management, 
 * and validation logic. It is written in vanilla JavaScript 
 * for maximum compatibility and ease of modification.
 */

class Hanlah {
    constructor() {
        // --- State Management ---
        this.wordLength = 5;       // Number of letters in the secret word
        this.secretWord = "";       // The current word to guess
        this.guesses = [];          // List of submitted guesses
        this.currentGuess = "";     // Current word being typed
        this.gameOver = false;      // Prevents input when game is finished
        this.themes = ['gamified', 'realistic'];
        
        // Initialize theme from storage or default to 'gamified'
        this.currentTheme = localStorage.getItem('hanlah-theme') || 'gamified';
        
        // --- DOM Elements ---
        this.screens = {
            start: document.getElementById('start-screen'),
            game: document.getElementById('game-screen')
        };
        this.board = document.getElementById('board');
        this.keyboard = document.getElementById('keyboard');
        this.modal = document.getElementById('message-modal');
        this.toast = document.getElementById('toast');
        this.activeInput = document.getElementById('active-input');
        
        // Theme Selectors
        this.themeSelectStart = document.getElementById('theme-select');
        this.themeSelectGame = document.getElementById('theme-select-game');
        
        // Apply initial theme and setup listeners
        this.applyTheme(this.currentTheme);
        this.init();
    }

    /**
     * Set up all global event listeners and initial UI state.
     */
    init() {
        // Difficulty Selection: 3, 4, or 5 letters
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.wordLength = parseInt(btn.dataset.length);
                this.startGame();
            });
        });

        // Theme Selection Sync (Start Screen)
        if (this.themeSelectStart) {
            this.themeSelectStart.value = this.currentTheme;
            this.themeSelectStart.addEventListener('change', (e) => this.setTheme(e.target.value));
        }

        // Theme Selection Sync (Game Screen)
        if (this.themeSelectGame) {
            this.themeSelectGame.value = this.currentTheme;
            this.themeSelectGame.addEventListener('change', (e) => this.setTheme(e.target.value));
        }

        // Native Input Event: Fires on typing (Mobile/Desktop)
        this.activeInput.addEventListener('input', (e) => {
            if (this.gameOver) return;
            const val = e.target.value.toUpperCase();
            const filtered = val.replace(/[^A-Z]/g, '').slice(0, this.wordLength);
            this.currentGuess = filtered;
            this.activeInput.value = filtered;
            this.updateTiles();
        });

        // Enter key for Native Input
        this.activeInput.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            if (e.key === 'Enter') this.submitGuess();
        });

        // Click anywhere to focus hidden input (Desktop only)
        document.getElementById('game-screen').addEventListener('click', () => this.focusInput());

        // Modal and Navigation Buttons
        document.getElementById('back-btn').addEventListener('click', () => this.showScreen('start'));
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.hideModal();
            this.startGame();
        });

        // Hardware Keyboard Support
        window.addEventListener('keydown', (e) => this.handlePhysicalInput(e));
        
        // Populate the virtual keyboard UI
        this.createVirtualKeyboard();
    }

    /**
     * Logic for focusing hidden input while avoiding triggering mobile native keyboards.
     */
    focusInput() {
        if (this.gameOver) return;
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        if (!isTouch) this.activeInput.focus();
    }

    /**
     * Theme management: Saves preference and updates the UI.
     */
    setTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        localStorage.setItem('hanlah-theme', theme);
        
        // Sync both dropdowns
        if (this.themeSelectStart) this.themeSelectStart.value = theme;
        if (this.themeSelectGame) this.themeSelectGame.value = theme;
    }

    /**
     * Updates the DOM attribute to trigger CSS theme shifts.
     */
    applyTheme(theme) {
        document.body.dataset.theme = theme;
    }

    /**
     * Initializes a fresh game session.
     */
    startGame() {
        this.gameOver = false;
        this.guesses = [];
        this.currentGuess = "";
        this.activeInput.value = "";
        this.secretWord = this.getRandomWord();
        
        this.renderBoard();
        this.resetKeyboardColors();
        this.showScreen('game');
        
        setTimeout(() => this.focusInput(), 500);
    }

    /**
     * Fetches a random word based on the chosen length.
     */
    getRandomWord() {
        const list = WORDS[this.wordLength];
        return list[Math.floor(Math.random() * list.length)].toUpperCase();
    }

    /**
     * Transitions between game screens (start vs game).
     */
    showScreen(screenName) {
        Object.values(this.screens).forEach(s => s.classList.remove('active'));
        this.screens[screenName].classList.add('active');
    }

    /**
     * Generates the empty tile grid for the board.
     */
    renderBoard() {
        this.board.innerHTML = "";
        this.board.style.gridTemplateColumns = `repeat(${this.wordLength}, 1fr)`;
        
        for (let i = 0; i < 6 * this.wordLength; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            this.board.appendChild(tile);
        }
    }

    /**
     * Builds the interactive virtual keyboard.
     */
    createVirtualKeyboard() {
        const rows = [
            "QWERTYUIOP",
            "ASDFGHJKL",
            "ENTER,Z,X,C,V,B,N,M,BACK"
        ];

        rows.forEach((row, index) => {
            const rowEl = document.getElementById(`row-${index + 1}`);
            if (!rowEl) return;
            const keys = row.split(row.includes(',') ? ',' : '');
            
            keys.forEach(key => {
                const btn = document.createElement('button');
                btn.classList.add('key');
                btn.textContent = key === "BACK" ? "⌫" : key;
                if (key === "ENTER" || key === "BACK") btn.classList.add('large');
                btn.dataset.key = key;
                
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleInput(key);
                });
                rowEl.appendChild(btn);
            });
        });
    }

    /**
     * Resets visual feedback on the keyboard for a new game.
     */
    resetKeyboardColors() {
        document.querySelectorAll('.key').forEach(key => {
            key.classList.remove('correct', 'present', 'absent');
        });
    }

    /**
     * Maps physical key presses to game actions.
     */
    handlePhysicalInput(e) {
        if (this.gameOver || document.activeElement === this.activeInput) return;
        const key = e.key.toUpperCase();
        
        if (key === "ENTER") this.handleInput("ENTER");
        else if (key === "BACKSPACE") this.handleInput("BACK");
        else if (/^[A-Z]$/.test(key)) this.handleInput(key);
    }

    /**
     * Centralized input handler for physical, virtual, and native keyboards.
     */
    handleInput(key) {
        if (this.gameOver || !this.screens.game.classList.contains('active')) return;

        if (key === "ENTER") {
            this.submitGuess();
        } else if (key === "BACK") {
            if (this.currentGuess.length > 0) {
                this.currentGuess = this.currentGuess.slice(0, -1);
                this.activeInput.value = this.currentGuess;
                this.updateTiles();
            }
        } else if (this.currentGuess.length < this.wordLength) {
            this.currentGuess += key;
            this.activeInput.value = this.currentGuess;
            this.updateTiles();
        }
    }

    /**
     * Updates the board tiles to match the current guess buffer.
     */
    updateTiles() {
        const rowStart = this.guesses.length * this.wordLength;
        const tiles = this.board.querySelectorAll('.tile');
        
        for (let i = 0; i < this.wordLength; i++) {
            const tile = tiles[rowStart + i];
            tile.textContent = this.currentGuess[i] || "";
            if (this.currentGuess[i]) {
                tile.dataset.state = "toggled";
            } else {
                delete tile.dataset.state;
            }
        }
    }

    /**
     * Triggers the guess processing if length is valid.
     */
    submitGuess() {
        if (this.currentGuess.length < this.wordLength) {
            this.showToast("Too short!");
            this.shakeRow();
            return;
        }
        this.processGuess();
    }

    /**
     * Validates guess, animates tiles, and checks win/loss.
     */
    async processGuess() {
        const guess = this.currentGuess;
        const result = this.calculateResult(guess, this.secretWord);
        const rowStart = this.guesses.length * this.wordLength;
        const tiles = Array.from(this.board.querySelectorAll('.tile')).slice(rowStart, rowStart + this.wordLength);

        this.gameOver = true;   
        this.activeInput.blur(); 

        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];
            tile.classList.add('flip');
            await new Promise(r => setTimeout(r, 200));
            tile.classList.remove('flip');
            tile.classList.add(result[i]);
            this.updateKeyboardKey(guess[i], result[i]);
        }

        this.guesses.push(guess);
        this.currentGuess = "";
        this.activeInput.value = "";
        this.gameOver = false;

        if (guess === this.secretWord) {
            this.endGame(true);
        } else if (this.guesses.length === 6) {
            this.endGame(false);
        } else {
            this.focusInput();
        }
    }

    /**
     * Core Algorithm: Calculates Green/Yellow/Gray states for a guess.
     */
    calculateResult(guess, secret) {
        const result = new Array(this.wordLength).fill('absent');
        const secretArr = secret.split('');
        const guessArr = guess.split('');

        for (let i = 0; i < this.wordLength; i++) {
            if (guessArr[i] === secretArr[i]) {
                result[i] = 'correct';
                secretArr[i] = null;
                guessArr[i] = null;
            }
        }

        for (let i = 0; i < this.wordLength; i++) {
            if (guessArr[i] && secretArr.includes(guessArr[i])) {
                result[i] = 'present';
                secretArr[secretArr.indexOf(guessArr[i])] = null;
            }
        }

        return result;
    }

    /**
     * Highlights keys on the virtual keyboard.
     */
    updateKeyboardKey(letter, state) {
        const key = document.querySelector(`.key[data-key="${letter}"]`);
        if (!key) return;

        if (state === 'correct') {
            key.classList.remove('present', 'absent');
            key.classList.add('correct');
        } else if (state === 'present' && !key.classList.contains('correct')) {
            key.classList.remove('absent');
            key.classList.add('present');
        } else if (state === 'absent' && !key.classList.contains('correct') && !key.classList.contains('present')) {
            key.classList.add('absent');
        }
    }

    /**
     * Shake animation for invalid input.
     */
    shakeRow() {
        const rowStart = this.guesses.length * this.wordLength;
        const tiles = Array.from(this.board.querySelectorAll('.tile')).slice(rowStart, rowStart + this.wordLength);
        tiles.forEach(t => t.classList.add('shake'));
        setTimeout(() => {
            tiles.forEach(t => t.classList.remove('shake'));
        }, 500);
    }

    /**
     * Displays a brief pop-up message.
     */
    showToast(msg) {
        this.toast.textContent = msg;
        this.toast.classList.add('show');
        setTimeout(() => this.toast.classList.remove('show'), 2000);
    }

    /**
     * Shows the final outcome and results.
     */
    endGame(win) {
        this.gameOver = true;
        const title = win ? "Great Job! 🎉" : "Nice Try!";
        const message = win ? `You found the word in ${this.guesses.length} tries!` : `The word was ${this.secretWord}.`;
        
        setTimeout(() => {
            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-message').textContent = message;
            this.modal.classList.add('active');
        }, 1000);
    }

    hideModal() {
        this.modal.classList.remove('active');
    }
}

// Global initialization
new Hanlah();
