import Room from './room';
import Player from './player';
import { defaultcolor, redcolor, greencolor, bluecolor, yellowcolor, magentacolor, cyancolor, whitecolor } from './constants'; // Import the constants

class Game {

  players: Map<string, Player>;
  rooms : Room[][]; 
  constructor() {
    this.players = new  Map<string, Player>;
    this.rooms = [];
  }

  // Players
  addPlayer(id: string, name: string) {
    const player: Player = new Player(id, name);
    this.players.set(id, player);
  }

  removePlayer(id: string) {
    this.players.delete(id);
  }

  movePlayer(room: Room[], id: string, direction: string) {
    const player = this.players.get(id);
    if (player) {
      const location: number = room[player?.location].exits.get(direction)?.id ?? player.location;
      player.location = location;
    }
  }

  //Rooms


  createRooms() {
    const numRoomsCol = 10;
    const numRoomsRow = 10;
    this.rooms = Room.createRoomsDFS(numRoomsRow,numRoomsCol);
  }

}
  
export default Game;
  