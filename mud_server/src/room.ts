import { defaultcolor, redcolor, greencolor, bluecolor, yellowcolor, magentacolor, cyancolor, whitecolor } from './constants'; // Import the constants

class Room {

    id: number;
    description: string;
    exits: Map<string, Room>;
    items: string[];

    constructor(id: number, description: string) {
        this.id = id;
        this.description = description;
        this.exits = new Map();
        this.items = [];
    }

    get fulldescritption(): string {
        let exits = "";
        this.exits.forEach((value, key) => {exits += key + " "});
        const fulldescritption = this.description + '\n' + `${bluecolor}[${this.id}] ${this.description}\n${bluecolor}Exits: ${exits}${defaultcolor}`;
        return fulldescritption
    };
}

export default Room;