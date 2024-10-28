const defaultcolor = "\x1b[0m";
const redcolor = "\x1b[31m";
const greencolor = "\x1b[32m";
const bluecolor = "\x1b[34m";
const yellowcolor = "\x1b[33m";
const magentacolor = "\x1b[35m";
const cyancolor = "\x1b[36m";
const whitecolor = "\x1b[37m";

class Room {
    id: number;
    description: string;
    exits: Map<string, Room>;
    items: string[];

    get fulldescritption(): string {
        let exits = "";
        this.exits.forEach((value, key) => {exits += key + " "});
        const fulldescritption = this.description + '\n' + `${bluecolor}[${this.id}] ${this.description}\n${bluecolor}Exits: ${exits}${defaultcolor}`;
        return fulldescritption
    };


    constructor(id: number, description: string) {
        this.id = id;
        this.description = description;
        this.exits = new Map();
        this.items = [];
    }

    static generateRandomDescription(): string {
        const descriptions = [
            "A dark, musty room with cobwebs in the corners.",
            "A bright room filled with sunlight and the scent of flowers.",
            "A damp cave with the sound of dripping water echoing off the walls."
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }
    
    static createRooms(numRooms: number): Room[] {
        const rooms: Room[] = [];
        for (let i = 0; i < numRooms; i++) {
            const room = new Room(i, this.generateRandomDescription());
            rooms.push(room);
        }
        return rooms;
    }
    static oppositeDirection(direction: string): string {
        const oppositeDirections: { [key: string]: string } = {
            "north": "south",
            "south": "north",
            "east": "west",
            "west": "east"
        };
        return oppositeDirections[direction];
    }
    static connectRooms(rooms: Room[]): void {
        const directions = ["north", "south", "east", "west"];
        rooms.forEach(room => {
            directions.forEach(direction => {
                if (Math.random() > 0.5) {
                    let room2connect : number ;
                    do {
                        room2connect = Math.floor(Math.random() * rooms.length);
                    } while (room2connect === room.id);
                    const randomRoom = rooms[room2connect];
                    if(!room.exits.has(direction)) {
                        room.exits.set(direction, randomRoom);
                    }
                    rooms[room2connect].exits.set(this.oppositeDirection(direction), room);

                }
            });
        });
    }

    
}

export default Room;