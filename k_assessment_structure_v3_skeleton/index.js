const prompt = require("prompt-sync")({ sigint: true });

// Game elements/assets constants
const GRASS = "░";
const HOLE = "O";
const CARROT = "^";
const PLAYER = "*";

// WIN / LOSE / OUT / QUIT messages constants
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const BLUE= '\x1b[94m';
const RESET = '\x1b[0m';
const WIN = `${GREEN}🎉 👍 You found the carrot!${RESET}`;  // TODO: customise message when player wins
const LOST = `${RED}😭 You fell into a hole!${RESET}`;  // TODO: customise message when player lose
const OUT = `${RED}😵 You have stepped out of the field!${RESET}`;  // TODO: customise message when player is out of bounds (lose)
const QUIT = `${GREEN}Thank you. You quit the game.${RESET}`;    

// const ROWS = 8;  // the game map will have 8 rows
// const COLS = 5;  // the game map will have 5 cols
let ROWS
let COLS
const PERCENTAGE = .2;  // % of holes for the map

class Field {

    // TODO: create the constructor
    constructor(field = [[]]) {  /* this.field is a property of the class Field */
        this.field = field;
        this.gamePlay = false;
        this.playerMove=[0,0] //initialize row and column value 
    }

    static welcomeMsg(msg) {  // static Method to show game's welcome message
        console.log(msg)
    }

    static generateField(rows, cols, percentage) {  // static method that generates and return a 2d map
        const map = [[]];
        for (let i = 0; i < rows; i++) {
            map[i] = [];
            for (let j = 0; j < cols; j++) {
                map[i][j] = Math.random() > percentage ? GRASS : HOLE;  //in each row, grass 80%, hole 20%
            }
        }
        return map;
    }

    printField() {  // print the game field (used to update during gameplay)       
        // this.field.forEach((row)=>{
        //     console.log(row.join('|')) //print field at the bottom of the screen
        // })
        console.table(this.field)
    }

    updateGame(input) {  // TODO: Refer to details in the method's codeblock
        const userInput = String(input.toLowerCase());

        //r=newRow, c=newCol
        let [r,c]=this.playerMove

        // move player based on input
        switch(userInput){
            case 'w':r-=1;break
            case 's':r+=1;break
            case 'a':c-=1;break
            case 'd':c+=1;break
            default:
        }

        /*  
        TODO: if the user exits out of the field
        end the game - set the gamePlay = false;
        inform the user that he step OUT of the game
        */
        if(r<0 || c<0 || r>ROWS-1 || c>COLS-1){ //ROWS=8, COLS=5 / index row=7, index col=4
            console.log(OUT)
            this.endGame()
            return
        }

        /*   
        TODO: if the user arrives at the carrot
        end the game - set gamePlay = false;
        inform the user that he WIN the game 
        */
       if(this.field[r][c]===CARROT){
            console.log(WIN)
            this.endGame()
            return
       }

        /* 
        TODO: if the user arrives at the hole
        end the game - set the gamePlay = false;
        inform the user that he LOST the game
        */
        if(this.field[r][c]===HOLE){
            console.log(LOST)
            this.endGame()
            return
       }

        /*  
        TODO: if the user ends the game
        end the game - set the gamePlay = false;
        inform the user that he QUIT the game
        */
        if(userInput==='q'){
            this.quitGame()
            return
        }

        /* 
        TODO: otherwise, move player on the map: this.field[rowindex][colindex] = CARROT;
        update this.field to show the user had moved to the new area on map
        */ 
        this.field[this.playerMove[0]][this.playerMove[1]]=GRASS //current player position change to grass 
        this.field[r][c]=PLAYER //update new position(row,col) change it to player *
        this.playerMove=[r,c] //update new move position(row,col)value
        // console.log(this.playerMove)  
    }

    plantCarrot(){
        const x=Math.floor(Math.random() * ROWS-1)+1
        const y=Math.floor(Math.random() * COLS-1)+1
        this.field[x][y]=CARROT
    }

    startGame() {
        this.gamePlay=true
        this.field[0][0]=PLAYER
        
        this.plantCarrot()
        
        while(this.gamePlay){  
            this.printField()
            let flagInvalid=false

            console.log(`${GREEN}w(up) | s(down) | a(left) | d(right) | q(quit)${RESET}`)
            const input=prompt('Which way: ')

            switch (input.toLowerCase()) {
                case 'w':console.log(`${GREEN}Up${RESET}`);break
                case 's':console.log(`${GREEN}Down${RESET}`);break
                case 'a':console.log(`${GREEN}Left${RESET}`);break
                case 'd':console.log(`${GREEN}Right${RESET}`);break
                case 'q':console.log(`${RED}Quit${RESET}`);break   
                default:console.log(`${RED}Invalid key${RESET}`);flagInvalid=!flagInvalid  // true
            }

            if(!flagInvalid){ 
                this.updateGame(input)
            }
        }
    }

    endGame() {
        this.gamePlay = false;  // set property gamePlay to false
        process.exit();
    }

    quitGame() {
        console.log(QUIT);
        this.endGame();
    }

    static promptInt(text){
        let num
        while(true){
            num=parseInt(prompt(text))
            if(!isNaN(num)){
                return num
            }
            console.log(`${RED}Invalid! Input must be a number!${RESET}`)
        }
    }

}

// Instantiate a new instance of Field Class
ROWS=Field.promptInt('Enter number of rows: ')
COLS=Field.promptInt('Enter number of cols: ')

const createField = Field.generateField(ROWS, COLS, PERCENTAGE);
const gameField = new Field(createField);


Field.welcomeMsg(`${GREEN}Welcome to Find Your Hat!\n**************************************************\n${RESET}`);
gameField.startGame();
