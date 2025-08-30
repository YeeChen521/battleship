import {Ship} from "./ship.js";
const SIZE = 10;

export class Gameboard{

    constructor(){
        this.board = [];
        this.missedShots = [];
        this.ships = [];
        this.initialize();
    }

    // initialize a 10*10 board
    initialize(){
        for(let i = 0 ; i<SIZE; i++){
            this.board[i] = [];
            this.missedShots[i] = [];
            for(let j = 0;j<SIZE ; j++){
                this.board[i][j] = null;
                this.missedShots[i][j] = false;
            }
        }
    }

    placeShip(ship, startCoord, isVertical) {
    if (!this.canPlaceShip(ship, startCoord, isVertical)) return false;

    let shipLength = ship.length;
    ship.position = []; 

    for (let i = 0; i < shipLength; i++) {
        let x = isVertical ? startCoord[0] + i : startCoord[0];
        let y = isVertical ? startCoord[1] : startCoord[1] + i;

        this.board[x][y] = ship;
        ship.position.push([x, y]);
    }
    console.log("Ship positions:", ship.position);
    this.ships.push(ship); 
    return true;
    }

    canPlaceShip(ship, startCoord, isVertical) {
        const [startX, startY] = startCoord;
        
        if (startX < 0 || startX >= SIZE || startY < 0 || startY >= SIZE) {
            return false;
        }

        const shipLength = ship.length;

        if (isVertical) {
            if (startX + shipLength > SIZE) {
                return false;
            }
        } else {
            if (startY + shipLength > SIZE) {
                return false;
            }
        }

        for (let i = 0; i < shipLength; i++) {
            const checkX = isVertical ? startX + i : startX;
            const checkY = isVertical ? startY : startY + i;
            
            if (this.board[checkX][checkY] !== null) {
                return false;
            }
        }

        for (let i = 0; i < shipLength; i++) {
            const shipX = isVertical ? startX + i : startX;
            const shipY = isVertical ? startY : startY + i;
            
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) continue; 
                    
                    const adjX = shipX + dx;
                    const adjY = shipY + dy;
                    
                    if (adjX >= 0 && adjX < SIZE && adjY >= 0 && adjY < SIZE) {
                        if (this.board[adjX][adjY] !== null) {
                            return false; 
                        }
                    }
                }
            }
        }

        return true;
    }

    randomlyPlaceShips() {
        this.ships = []; 

        const ships = [
            new Ship(5),
            new Ship(4),
            new Ship(3),
            new Ship(3),
            new Ship(2),
        ];

        let placed = 0;
        let attempts = 0;
        const maxAttempts = 1000; 

        while (placed < ships.length && attempts < maxAttempts) {
            let row = Math.floor(Math.random() * SIZE);
            let col = Math.floor(Math.random() * SIZE);
            let isVertical = Math.random() < 0.5; 

            console.log(`Attempting to place ship ${placed + 1} at (${row}, ${col}) ${isVertical ? 'vertically' : 'horizontally'}`);

            if (this.placeShip(ships[placed], [row, col], isVertical)) {
                console.log(`Successfully placed ship ${placed + 1}`);
                console.log("Ship positions:", ships[placed].position);
                placed++;
            }else {
                console.log(`Failed to place ship ${placed + 1} at (${row}, ${col})`);
            }
            attempts++;
        }

        if (placed < ships.length) {
            console.error(`Could not place all ships! Only placed ${placed} out of ${ships.length} ships after ${attempts} attempts.`);
            this.initialize();
            if (attempts < maxAttempts) {
                console.log("Retrying with fresh board...");
                this.randomlyPlaceShips();
            }
        } else {
            console.log(`Successfully placed all ${ships.length} ships in ${attempts} attempts!`);
        }

        console.log("All ships on COMPUTER board:");
        this.ships.forEach((s, idx) => {
        console.log(`Ship ${idx + 1} positions:`, s.position);
        });
    }


    receiveAttack(coord){
        const [x,y] = coord;

        if(this.isAlreadyAttacked(coord)){
            return false;
        }

        if(this.board[x][y] != null){
            console.log(`It's a HIT!`);
            this.board[x][y].hit(coord);
            return "hit";
        }else{
            console.log(`It's a MISS!`);
            this.missedShots[x][y] = true;
            return "miss";
        }
        
    }

    isAlreadyAttacked(coord){
        const [x,y] = coord;

        if(this.missedShots[x][y] || (this.board[x][y] && this.board[x][y].isHit(x,y)) ){
            return true;
        }
        return false;
    }

    allSunk(){
        console.log(`Checking if all ships are sunk. Total ships: ${this.ships.length}`);
        
        if(this.ships.length === 0){
            console.log("No ships found!");
            return false; 
        }
        
        for(let i = 0; i < this.ships.length; i++){
            console.log(
                `Ship ${i + 1}: hits=${this.ships[i].hitPositions.length}, length=${this.ships[i].length}, isSunk=${this.ships[i].isSunk()}`
            );
            if(!this.ships[i].isSunk()){
                return false;
            }
        }
        
        console.log("All ships are sunk!");
        return true;
    }
}

