import Room from './room';
import Player from './player';
import { defaultcolor, redcolor, greencolor, bluecolor, yellowcolor, magentacolor, cyancolor, whitecolor } from './constants'; // Import the constants

class Game {

  players: Map<string, Player>;
  rooms : Map<number, Room>; 
  constructor() {
    this.players = new  Map<string, Player>;
    this.rooms = new Map<number, Room>;
  }

  // Players
  addPlayer(id: string, name: string) {
    const player: Player = new Player(id, name);
    this.players?.set(id, player);
  }

  removePlayer(id: string) {
    this.players.delete(id);
  }

  movePlayer(id: string, direction: string): string {
    let response = "";
    const player = this.players.get(id);
    if (player) {
      const currentRoom = this.rooms.get(player.location) ;
      const nextRoom = currentRoom?.exits.get(direction);
      if (nextRoom) {
          player.location = nextRoom.id;
          response = `${greencolor}You move to ${direction}${defaultcolor}\n`;
      } else {
        response = `${redcolor}Wrong direction${defaultcolor}\n`;
      }
    }
    return response;
  }

  //Rooms
  generateRandomDescription(): string {
      const descriptions = [
          "A dark, musty room with cobwebs in the corners.",
          "A bright room filled with sunlight and the scent of flowers.",
          "A damp cave with the sound of dripping water echoing off the walls."
      ];
      return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  oppositeDirection(direction: string): string {
    const oppositeDirections: { [key: string]: string } = {
        "north": "south",
        "south": "north",
        "east": "west",
        "west": "east"
    };
    return oppositeDirections[direction] || "";
  }

  createRoomsDFS(numRows: number, numCols: number): Map<number, Room> {
    const rooms = new Map<number, Room>();
    let id = 0;

    // Initialize rooms
    for (let i = 0; i < numRows * numCols; i++) {
        rooms.set(id, new Room(id, this.generateRandomDescription()));
        id++;
    }

    // DFS to create paths
    const stack: [number, number][] = [];
    const visited: boolean[] = Array(numRows * numCols).fill(false);
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

    function getIndex(x: number, y: number): number {
        return x * numCols + y;
    }

    const dfs = (x: number, y: number) => {
        visited[getIndex(x, y)] = true;
        stack.push([x, y]);

        while (stack.length > 0) {
            const [cx, cy] = stack.pop()!;
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
  initializeGame() : void {
    this.rooms = this.createRoomsDFS(10,10);
  } 

  displayRoomsGraphically(playerid: string, numRows: number, numCols: number): string {
    const grid: string[][] = Array.from({ length: numRows * 2 - 1 }, () => Array(numCols * 2 - 1).fill(' '));

    let player = this.players.get(playerid);
    this.rooms.forEach(room => {
        const x = Math.floor(room.id / numCols) * 2;
        const y = (room.id % numCols) * 2;
        grid[x][y] = player?.location === room.id ? '■':'□'; // Use filled square for rooms

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

 
  
export default Game;