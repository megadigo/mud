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

    static generateRandomDescription(): string {
        const descriptions = [
            "A dark, musty room with cobwebs in the corners.",
            "A bright room filled with sunlight and the scent of flowers.",
            "A damp cave with the sound of dripping water echoing off the walls."
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
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

    static createRoomsDFS(numRows: number, numCols: number): Room[][] {
        const rooms: Room[][] = [];
        let id = 0;

        // Initialize rooms
        for (let i = 0; i < numRows; i++) {
            const row: Room[] = [];
            for (let j = 0; j < numCols; j++) {
                row.push(new Room(id++, this.generateRandomDescription()));
            }
            rooms.push(row);
        }

        // DFS to create paths
        const stack: [number, number][] = [];
        const visited: boolean[][] = Array.from({ length: numRows }, () => Array(numCols).fill(false));
        const directions = ["north", "south", "east", "west"];
        const dirOffsets: { [key: string]: [number, number] } = {
            "north": [-1, 0],
            "south": [1, 0],
            "east": [0, 1],
            "west": [0, -1]
        };

        function isValid(x: number, y: number): boolean {
            return x >= 0 && y >= 0 && x < numRows && y < numCols;
        }

        function dfs(x: number, y: number) {
            visited[x][y] = true;
            stack.push([x, y]);

            while (stack.length > 0) {
                const [cx, cy] = stack.pop()!;
                const shuffledDirections = directions.sort(() => Math.random() - 0.5);

                for (const direction of shuffledDirections) {
                    const [dx, dy] = dirOffsets[direction];
                    const nx = cx + dx;
                    const ny = cy + dy;

                    if (isValid(nx, ny) && !visited[nx][ny]) {
                        rooms[cx][cy].exits.set(direction, rooms[nx][ny]);
                        rooms[nx][ny].exits.set(Room.oppositeDirection(direction), rooms[cx][cy]);
                        visited[nx][ny] = true;
                        stack.push([nx, ny]);
                    }
                }
            }
        }

        // Start DFS from a random room
        const startX = Math.floor(Math.random() * numRows);
        const startY = Math.floor(Math.random() * numCols);
        dfs(startX, startY);

        return rooms;
    }
    
}

export default Room;