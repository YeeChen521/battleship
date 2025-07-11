
export class Player {
    constructor(name){
        this.name = name;
        this.attackedCoord = [];
    }

    attack(coord,gameboard){
        const [x,y] = coord;

        if(gameboard.isAlreadyAttacked(coord)){
            return false;
        }        

        this.attackedCoord.push(coord);
        const result = gameboard.receiveAttack(coord);
        return result;
    }

    randomAttack(gameboard){
        if(this.attackedCoord.length >= 100) return ["miss", [-1,-1]];

        let positionx = Math.floor(Math.random() * 10);
        let positiony = Math.floor(Math.random() * 10);

        while(gameboard.isAlreadyAttacked([positionx,positiony])){
            positionx = Math.floor(Math.random() * 10);
            positiony = Math.floor(Math.random() * 10);
        }

        this.attackedCoord.push([positionx,positiony])
        const result = gameboard.receiveAttack([positionx,positiony]);
        return [result,[positionx,positiony]];
    }

    resetAttacks() {
        this.attackedCoord = [];
    }

}

