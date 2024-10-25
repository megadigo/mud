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