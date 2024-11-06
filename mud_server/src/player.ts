import { defaultcolor, redcolor, greencolor, bluecolor, yellowcolor, magentacolor, cyancolor, whitecolor } from './constants'; // Import the constants

class Player {
    id: string;
    name: string;
    hp: number;
    maxhp: number;
    level: number;
    exp: number;
    gold: number;
    stance: number;
    location: number;

    constructor(id: string,name: string) {
        this.id = "";
        this.name = name;
        this.location = 0;
        this.hp = 100;
        this.maxhp = 100;
        this.level = 1;
        this.exp = 0;
        this.gold = 0;
        this.stance = 0;
    }

    SetPlayerName(name: string): string {
        this.name = name;
        return `${bluecolor}Welcome, ${this.name}! Let the adventure begins.${defaultcolor}`;
    }
    
}
export default Player;


