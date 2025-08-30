import {Player} from "./factory/player.js";
import {Gameboard} from  "./factory/gameboard.js";
import { Ship } from "./factory/ship.js";


function createBoard(board,player,pboard,computer){
    const grid = document.getElementById("attackBoard");
    const log = document.getElementById("log");
    log.innerHTML = "";
    const p = document.createElement("p");
    log.appendChild(p);

    const SIZE = 10;
    grid.innerHTML = "";
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${SIZE}, 30px)`
    grid.style.gridTemplateRows = `repeat(${SIZE},30px)`;
    grid.style.width = `${SIZE * 30}px`; // for 10 cells × 30px = 300px
    grid.style.height = `${SIZE * 30}px`; // optional

    for(let i=0; i <10 ;i++){
        for(let j = 0; j<10; j++){
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.x = i;
            cell.dataset.y = j;
            cell.style.width = "30px";
            cell.style.height = "30px";


            cell.addEventListener("click", (e) => {
                const x = parseInt(e.target.dataset.x);
                const y = parseInt(e.target.dataset.y);
                console.log(`Attacking cell (${x}, ${y}), cell contains:`, board.board[x][y]);

                const result = player.attack([x,y],board);
                if(result === "hit"){
                    p.textContent = `You have succesfully attack (${x},${y})/ Hit!!`;
                    cell.classList.add("hit")
                }else if(result === "miss"){
                     p.textContent = `You have succesfully attack (${x},${y}). Miss!!!`;
                     cell.classList.add("miss");
                }else{
                    p.textContent = `You have already attack (${x},${y}) before`;
                }

                if(board.allSunk()){
                    p.textContent = "All enemy ships sunk! You win!";
                    return;
                }

                const [computerResult, coord] = computer.randomAttack(pboard);
                if (computerResult && coord) {
                    const playerBoardGrid = document.getElementById("playerBoard");
                    const playerCell = playerBoardGrid.querySelector(
                        `.cell[data-x='${coord[0]}'][data-y='${coord[1]}']`
                    );

                    if (computerResult === "hit") {
                        p.textContent += ` Enemy hit your ship at (${coord[0]}, ${coord[1]})!`;
                        if (playerCell) playerCell.classList.add("hit");
                    } else if (computerResult === "miss") {
                        p.textContent += " Enemy missed!";
                        if (playerCell) playerCell.classList.add("miss");
                    }
                }

                
                if(pboard.allSunk()){
                    p.textContent = " All your ships are sunk! Computer wins!";
                }
        
            })  

            grid.appendChild(cell);
        }
    }
}


function placeShipUI(board) {
  const dialog = document.getElementById("placeShip");
  dialog.showModal();
  const guide = document.getElementById("guide");

  let currentShipIndex = 0;
  const shipTypes = [
    { name: "carrier", length: 5 },
    { name: "battleship", length: 4 },
    { name: "destroyer", length: 3 },
    { name: "submarine", length: 3 }, 
    { name: "patrol boat", length: 2 },
  ];

  const shipInstances = shipTypes.map(s => new Ship(s.length));

  const p = document.createElement("p");
  p.textContent = `Place your ${shipTypes[currentShipIndex].name}`;
  guide.appendChild(p);

  const direction = document.getElementById("direction");
  direction.addEventListener("click", () => {
    direction.textContent = direction.textContent === "Horizontal" ? "Vertical" : "Horizontal";
  });

  const placegrid = document.createElement("div");
  placegrid.id = "placegrid";
  const SIZE = 10;
  placegrid.innerHTML = "";
  placegrid.style.display = "grid";
  placegrid.style.gridTemplateColumns = `repeat(${SIZE}, 30px)`;
  placegrid.style.gridTemplateRows = `repeat(${SIZE}, 30px)`;
dialog.appendChild(placegrid);
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = i;
      cell.dataset.y = j;

      cell.addEventListener("click", (e) => {
        const x = parseInt(e.target.dataset.x);
        const y = parseInt(e.target.dataset.y);

        const isVertical = direction.textContent === "Vertical";
        const placed = board.placeShip(shipInstances[currentShipIndex], [x, y], isVertical);

        if (!placed) {
          alert("Invalid position! Try again.");
          return;
        }

        const shipLength = shipTypes[currentShipIndex].length;

        for (let k = 0; k < shipLength; k++) {
          let cellSelector;
          if (!isVertical) {
            cellSelector = `.cell[data-x='${x}'][data-y='${y + k}']`;
          } else {
            cellSelector = `.cell[data-x='${x + k}'][data-y='${y}']`;
          }
          const targetCell = placegrid.querySelector(cellSelector);
          if (targetCell) {
            targetCell.classList.add("ship");
          }
        }

        currentShipIndex++;

        if (currentShipIndex === shipTypes.length) {
          p.textContent = "All ships placed!";
          dialog.close();
          const playerBoard = document.getElementById("playerBoard");
          playerBoard.appendChild(placegrid);
        } else {
          p.textContent = `Place your ${shipTypes[currentShipIndex].name}`;
        }
      });

      placegrid.appendChild(cell);
    }
  }
}


window.onload = () => {
    const human = new Player("human");
    const computer = new Player("computer");

    const pgameboard = new Gameboard();
    placeShipUI(pgameboard,human);

    const cgameboard = new Gameboard();
    cgameboard.randomlyPlaceShips();

    createBoard(cgameboard,human,pgameboard,computer);

    const reset = document.getElementById("reset");
    reset.addEventListener("click", () => {
        pgameboard.initialize();
        cgameboard.initialize();
        human.resetAttacks();
        computer.resetAttacks();

        document.getElementById("playerBoard").innerHTML = "";

        document.getElementById("guide").innerHTML = "";
        placeShipUI(pgameboard,human);
        cgameboard.randomlyPlaceShips();
        createBoard(cgameboard,human,pgameboard,computer);
    })

}