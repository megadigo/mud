"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = __importDefault(require("./room"));
const player_1 = __importDefault(require("./player"));
const monster_1 = __importDefault(require("./monster"));
const constants_1 = require("./constants"); // Import the constants
class Game {
    constructor() {
        this.players = new Map;
        this.rooms = new Map;
        this.monsters = new Map;
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
        let response = "";
        const player = this.players.get(id);
        if (player) {
            const currentRoom = this.rooms.get(player.location);
            const nextRoom = currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.exits.get(direction);
            if (nextRoom) {
                player.location = nextRoom.id;
                response = `${constants_1.greencolor}You move to ${direction}${constants_1.defaultcolor}\n`;
            }
            else {
                response = `${constants_1.redcolor}Wrong direction${constants_1.defaultcolor}\n`;
            }
        }
        return response;
    }
    //Monsters
    startMonsterMovement() {
        this.monsters.set("1", new monster_1.default("1", Math.floor(Math.random() * constants_1.MaxMudRow * constants_1.MaxMudCol)));
        this.monsters.set("2", new monster_1.default("2", Math.floor(Math.random() * constants_1.MaxMudRow * constants_1.MaxMudCol)));
        this.monsters.set("3", new monster_1.default("3", Math.floor(Math.random() * constants_1.MaxMudRow * constants_1.MaxMudCol)));
        this.monsters.set("4", new monster_1.default("4", Math.floor(Math.random() * constants_1.MaxMudRow * constants_1.MaxMudCol)));
        this.monsters.set("5", new monster_1.default("5", Math.floor(Math.random() * constants_1.MaxMudRow * constants_1.MaxMudCol)));
        setInterval(() => {
            for (const id of this.monsters.keys()) {
                this.moveMonster(id);
                this.checkMonsterKillsPlayer();
            }
        }, 5000); // Move the monster every 5 seconds
    }
    moveMonster(id) {
        const directions = ["north", "south", "east", "west"];
        const dirOffsets = {
            "north": [-1, 0],
            "south": [1, 0],
            "east": [0, 1],
            "west": [0, -1]
        };
        const monster = this.monsters.get(id);
        const currentRoom = monster ? this.rooms.get(monster.location) : undefined;
        if (currentRoom) {
            const shuffledDirections = directions.sort(() => Math.random() - 0.5);
            for (const direction of shuffledDirections) {
                const [dx, dy] = dirOffsets[direction];
                const nx = Math.floor(currentRoom.id / constants_1.MaxMudCol) + dx;
                const ny = (currentRoom.id % constants_1.MaxMudCol) + dy;
                const newLocation = nx * constants_1.MaxMudCol + ny;
                if (currentRoom.exits.has(direction)) {
                    monster ? monster.location = newLocation : undefined;
                    break;
                }
            }
        }
    }
    checkMonsterKillsPlayer() {
        this.players.forEach((player) => {
            this.monsters.forEach((monster, id) => {
                if (player.location === monster.location) {
                    console.log(`${player.name} was killed by the monster!`);
                    this.removePlayer(player.id);
                }
            });
        });
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
        this.rooms = this.createRoomsDFS(constants_1.MaxMudRow, constants_1.MaxMudCol);
        this.startMonsterMovement();
    }
    displayRoomsGraphically(playerid, numRows, numCols) {
        const grid = Array.from({ length: numRows * 2 - 1 }, () => Array(numCols * 2 - 1).fill(' '));
        let player = this.players.get(playerid);
        this.rooms.forEach(room => {
            const x = Math.floor(room.id / numCols) * 2;
            const y = (room.id % numCols) * 2;
            grid[x][y] = `${constants_1.defaultcolor}□${constants_1.defaultcolor}`; // Use empty square for rooms
            // Place other players on the grid
            this.players.forEach((player, id) => {
                if (id !== playerid) {
                    const x = Math.floor(player.location / numCols) * 2;
                    const y = (player.location % numCols) * 2;
                    grid[x][y] = `${constants_1.bluecolor}■${constants_1.defaultcolor}`; // Use star for other players
                }
            });
            // Place the current player on the grid
            const currentPlayer = this.players.get(playerid);
            if (currentPlayer) {
                const x = Math.floor(currentPlayer.location / numCols) * 2;
                const y = (currentPlayer.location % numCols) * 2;
                grid[x][y] = `${constants_1.greencolor}■${constants_1.defaultcolor}`; // Use filled square for the current player
            }
            // Place the monster on the grid
            for (const monster of this.monsters.values()) {
                const mx = Math.floor(monster.location / numCols) * 2;
                const my = (monster.location % numCols) * 2;
                grid[mx][my] = `${constants_1.redcolor}▲${constants_1.defaultcolor}`; // Use 'M' for the monster
            }
            room.exits.forEach((connectedRoom, direction) => {
                const [dx, dy] = direction === 'north' ? [-1, 0] :
                    direction === 'south' ? [1, 0] :
                        direction === 'east' ? [0, 1] :
                            direction === 'west' ? [0, -1] : [0, 0];
                if (dx !== 0 || dy !== 0) {
                    grid[x + dx][y + dy] = direction === 'north' || direction === 'south' ? '|' : '-';
                }
            });
        });
        return (grid.map(row => row.join('')).join('\n'));
    }
}
exports.default = Game;
