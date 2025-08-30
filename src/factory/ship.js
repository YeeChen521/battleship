export class Ship {
    constructor(length){
      this.length = length;
      this.position = [];
      this.hitPositions = [];
    }

    hit(coord) {
        const alreadyHit = this.hitPositions.some(
        (pos) => pos[0] === coord[0] && pos[1] === coord[1]
        );
        if (!alreadyHit) {
        this.hitCount++;
        this.hitPositions.push(coord);
        }
    }

    isHit(x,y){
        return this.hitPositions.some(pos => pos[0] === x && pos[1] === y);
    }

    isSunk(){
        return this.hitPositions.length === this.length;
    }
}