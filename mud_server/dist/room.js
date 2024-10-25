"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    constructor(id, description) {
        this.id = id;
        this.description = description;
        this.exits = new Map();
        this.items = [];
    }
}
function generateRandomDescription() {
    const descriptions = [
        "A dark, musty room with cobwebs in the corners.",
        "A bright room filled with sunlight and the scent of flowers.",
        "A damp cave with the sound of dripping water echoing off the walls."
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}
function createRooms(numRooms) {
    const rooms = [];
    for (let i = 0; i < numRooms; i++) {
        const room = new Room(i, generateRandomDescription());
        rooms.push(room);
    }
    return rooms;
}
function connectRooms(rooms) {
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
exports.default = Room;
