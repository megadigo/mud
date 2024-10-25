// src/game.ts
interface Player {
    id: string;
    name: string;
    location: string;
  }
  
  class Game {
    players: Map<string, Player>;
  
    constructor() {
      this.players = new Map();
    }
  
    addPlayer(id: string, name: string) {
      const player: Player = { id, name, location: 'start' };
      this.players.set(id, player);
    }
  
    removePlayer(id: string) {
      this.players.delete(id);
    }
  
    movePlayer(id: string, location: string) {
      const player = this.players.get(id);
      if (player) {
        player.location = location;
      }
    }
  }
  
  export default Game;
  