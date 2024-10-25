"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Game {
    constructor() {
        this.players = new Map();
    }
    addPlayer(id, name) {
        const player = { id, name, location: 'start' };
        this.players.set(id, player);
    }
    removePlayer(id) {
        this.players.delete(id);
    }
    movePlayer(id, location) {
        const player = this.players.get(id);
        if (player) {
            player.location = location;
        }
    }
}
exports.default = Game;
