import { defaultcolor, redcolor, greencolor, bluecolor, yellowcolor, magentacolor, cyancolor, whitecolor } from './constants'; // Import the constants

class Player {
    id: string;
    name: string;
    location: number;

    constructor(id: string,name: string) {
        this.id = "";
        this.name = name;
        this.location = 0;
    }

    SetPlayerName(name: string): string {
        this.name = name;
        return `${bluecolor}Welcome, ${this.name}! You are at the start.${defaultcolor}`;
    }
    
}
export default Player;


