import Room from './room';

interface Player {
  id: string;
  name: string;
  location: number;
}
  
class Game {
  players: Map<string, Player>;

  constructor() {
    this.players = new Map();
  }

  addPlayer(id: string, name: string) {
    const player: Player = { id, name, location: 0 };
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
}
  
export default Game;
  