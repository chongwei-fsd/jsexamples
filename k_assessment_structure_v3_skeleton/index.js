const prompt = require("prompt-sync")({ sigint: true });

// Game elements/assets constants
const GRASS = "░";
const HOLE = "O";
const CARROT = "^";
const PLAYER = "*";

// WIN / LOSE / OUT / QUIT messages constants
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const BLUE = '\x1b[94m';
const RESET = '\x1b[0m';
const WIN = `${GREEN}🎉 👍 You found the carrot!${RESET}`;
const LOST = `${RED}😭 You fell into a hole!${RESET}`;
const OUT = `${RED}😵 You have stepped out of the field!${RESET}`;
const QUIT = `${GREEN}Thank you. You quit the game.${RESET}`;

let ROWS;
let COLS;
const PERCENTAGE = .2;

class Field {

    constructor(field = [[]]) {
        this._field = field;
        this._gamePlay = false;
        this._playerRow = 0;
        this._playerCol = 0;
        this._newRow = 0;
        this._newCol = 0;
    }

    // Getters and setters for player position and game state
    get playerRow() {
        return this._playerRow;
    }

    set playerRow(value) {
        this._playerRow=value
    }

    get playerCol() {
        return this._playerCol;
    }

    set playerCol(value) {
      this._playerCol=value
    }

    get gamePlay() {
        return this._gamePlay;
    }

    set gamePlay(value) {
        this._gamePlay = value;
    }

    get field() {
        return this._field;
    }

    set field(value) {
        this._field = value;
    }

    static welcomeMsg(msg) {
        console.log(msg);
    }

    static generateField(rows, cols, percentage) {
        const map = [[]];
        for (let i = 0; i < rows; i++) {
            map[i] = [];
            for (let j = 0; j < cols; j++) {
                map[i][j] = Math.random() > percentage ? GRASS : HOLE;
            }
        }
        return map;
    }

    printField() {
        console.table(this.field);
    }

    updateGame(input) {
        const userInput = String(input.toLowerCase());

        // Move player based on input
        switch (userInput) {
            case 'w': this._newRow = this.playerRow - 1; break;
            case 's': this._newRow = this.playerRow + 1; break;
            case 'a': this._newCol = this.playerCol - 1; break;
            case 'd': this._newCol = this.playerCol + 1; break;
            default:
        }

        // Check out-of-bounds
        if (this._newRow < 0 || this._newCol < 0 || this._newRow >= ROWS || this._newCol >= COLS) {
            console.log(OUT);
            this.endGame();
            return;
        }

        // Check for carrot
        if (this.field[this._newRow][this._newCol] === CARROT) {
            console.log(WIN);
            this.endGame();
            return;
        }

        // Check for hole
        if (this.field[this._newRow][this._newCol] === HOLE) {
            console.log(LOST);
            this.endGame();
            return;
        }

        // Quit game
        if (userInput === 'q') {
            this.quitGame();
            return;
        }

        // Move player on the map
        this.field[this.playerRow][this.playerCol] = GRASS;
        this.field[this._newRow][this._newCol] = PLAYER;
        this.playerRow = this._newRow;
        this.playerCol = this._newCol;
    }

    plantCarrot() {
        const x = Math.floor(Math.random() * ROWS);
        const y = Math.floor(Math.random() * COLS);
        this.field[x][y] = CARROT;
    }

    startGame() {
        this.gamePlay = true;
        this.field[0][0] = PLAYER;
        this.plantCarrot();

        while (this.gamePlay) {
            this.printField();
            let flagInvalid = false;

            console.log(`${GREEN}w(up) | s(down) | a(left) | d(right) | q(quit)${RESET}`);
            const input = prompt('Which way: ');

            switch (input.toLowerCase()) {
                case 'w': console.log(`${GREEN}Up${RESET}`); break;
                case 's': console.log(`${GREEN}Down${RESET}`); break;
                case 'a': console.log(`${GREEN}Left${RESET}`); break;
                case 'd': console.log(`${GREEN}Right${RESET}`); break;
                case 'q': console.log(`${RED}Quit${RESET}`); break;
                default: console.log(`${RED}Invalid key${RESET}`); flagInvalid = true;
            }

            if (!flagInvalid) {
                this.updateGame(input);
            }
        }
    }

    endGame() {
        this.gamePlay = false;
        process.exit();
    }

    quitGame() {
        console.log(QUIT);
        this.endGame();
    }

    static fieldSize(text) {
        let num;
        while (true) {
            num = prompt(text);
            if (!isNaN(num) && num >= 5 && num <= 10 && num.trim() !== "") {
                return parseInt(num, 10);
            }
            console.log(`${RED}Invalid! Input must be a number (between 5-10) & no space!${RESET}`);
        }
    }
}

// Prompt user to enter rows and cols (5-10) for field size
ROWS = Field.fieldSize('Enter number of rows: ');
COLS = Field.fieldSize('Enter number of cols: ');

// Instantiate a new instance of Field Class
const createField = Field.generateField(ROWS, COLS, PERCENTAGE);
const gameField = new Field(createField);

Field.welcomeMsg(`${GREEN}Welcome to Find Your Hat!\n**************************************************\n${RESET}`);
gameField.startGame();
