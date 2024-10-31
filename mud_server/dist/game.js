"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = __importDefault(require("./room"));
const player_1 = __importDefault(require("./player"));
class Game {
    constructor() {
        this.players = new Map;
        this.rooms = new Map;
    }
    // Players
    addPlayer(id, name) {
        var _a;
        const player = new player_1.default(id, name);
        (_a = this.players) === null || _a === void 0 ? void 0 : _a.set(id, player);
    }
    removePlayer(id) {
        this.players.delete(id);
    }
    movePlayer(id, direction) {
        const player = this.players.get(id);
        if (player) {
            const currentRoom = this.rooms.get(player.location);
            const nextRoom = currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.exits.get(direction);
            if (nextRoom) {
                player.location = nextRoom.id;
            }
        }
    }
    //Rooms
    generateRandomDescription() {
        const descriptions = [
            "A dark, musty room with cobwebs in the corners.",
            "A bright room filled with sunlight and the scent of flowers.",
            "A damp cave with the sound of dripping water echoing off the walls."
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }
    oppositeDirection(direction) {
        const oppositeDirections = {
            "north": "south",
            "south": "north",
            "east": "west",
            "west": "east"
        };
        return oppositeDirections[direction] || "";
    }
    createRoomsDFS(numRows, numCols) {
        const rooms = new Map();
        let id = 0;
        // Initialize rooms
        for (let i = 0; i < numRows * numCols; i++) {
            rooms.set(id, new room_1.default(id, this.generateRandomDescription()));
            id++;
        }
        // DFS to create paths
        const stack = [];
        const visited = Array(numRows * numCols).fill(false);
        const directions = ["north", "south", "east", "west"];
        const dirOffsets = {
            "north": [-1, 0],
            "south": [1, 0],
            "east": [0, 1],
            "west": [0, -1]
        };
        function isValid(x, y) {
            return x >= 0 && y >= 0 && x < numRows && y < numCols;
        }
        function getIndex(x, y) {
            return x * numCols + y;
        }
        const dfs = (x, y) => {
            visited[getIndex(x, y)] = true;
            stack.push([x, y]);
            while (stack.length > 0) {
                const [cx, cy] = stack.pop();
                const shuffledDirections = directions.sort(() => Math.random() - 0.5);
                for (const direction of shuffledDirections) {
                    const [dx, dy] = dirOffsets[direction];
                    const nx = cx + dx;
                    const ny = cy + dy;
                    if (isValid(nx, ny) && !visited[getIndex(nx, ny)]) {
                        visited[getIndex(nx, ny)] = true;
                        stack.push([nx, ny]);
                        const currentRoom = rooms.get(getIndex(cx, cy));
                        const nextRoom = rooms.get(getIndex(nx, ny));
                        if (currentRoom && nextRoom) {
                            currentRoom.exits.set(direction, nextRoom);
                            nextRoom.exits.set(this.oppositeDirection(direction), currentRoom);
                        }
                    }
                }
            }
        };
        dfs(0, 0);
        return rooms;
    }
    // Game
    initializeGame() {
        this.rooms = this.createRoomsDFS(10, 10);
    }
}
exports.default = Game;
