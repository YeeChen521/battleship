# Battleship Game

A browser-based implementation of the classic Battleship board game where you play against a computer opponent.

## Features

- Interactive ship placement with drag and drop interface
- Computer opponent with random attack strategy
- Visual feedback for hits and misses
- Game state tracking and win/loss detection
- Reset functionality to start new games

## Game Rules

1. Place your ships on your board:
   - Carrier (5 spaces)
   - Battleship (4 spaces)
   - Destroyer (3 spaces)
   - Submarine (3 spaces)
   - Patrol Boat (2 spaces)

2. Ships can be placed horizontally or vertically
3. Take turns attacking the opponent's grid
4. First player to sink all enemy ships wins

## Project Structure

```
├── package.json         # Project configuration
├── babel.config.js     # Babel configuration
└── src/
    ├── factory/        # Game logic classes
    │   ├── gameboard.js
    │   ├── player.js
    │   └── ship.js
    ├── index.html      # Main game page
    ├── script.js       # Game initialization
    └── style.css       # Game styling
```

## Development

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YeeChen521/battleship.git
```

2. Install dependencies:
```bash
npm install
```

## Technologies Used

- JavaScript (ES6+)
- HTML5
- CSS3
