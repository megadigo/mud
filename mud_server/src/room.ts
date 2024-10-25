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
}

function generateRandomDescription(): string {
    const descriptions = [
        "A dark, musty room with cobwebs in the corners.",
        "A bright room filled with sunlight and the scent of flowers.",
        "A damp cave with the sound of dripping water echoing off the walls."
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function createRooms(numRooms: number): Room[] {
    const rooms: Room[] = [];
    for (let i = 0; i < numRooms; i++) {
        const room = new Room(i, generateRandomDescription());
        rooms.push(room);
    }
    return rooms;
}

function connectRooms(rooms: Room[]): void {
    const directions = ["north", "south", "east", "west"];
    rooms.forEach(room => {
        directions.forEach(direction => {
            if (Math.random() > 0.5) {
                const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
                room.exits.set(direction, randomRoom);
            }
        });
    });
}



export default Room;