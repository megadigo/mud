"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Game {
    constructor() {
        this.players = new Map();
    }
    addPlayer(id, name) {
        const player = { id, name, location: 0 };
        this.players.set(id, player);
    }
    removePlayer(id) {
        this.players.delete(id);
    }
    movePlayer(room, id, direction) {
        var _a, _b;
        const player = this.players.get(id);
        if (player) {
            const location = (_b = (_a = room[player === null || player === void 0 ? void 0 : player.location].exits.get(direction)) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : player.location;
            player.location = location;
        }
    }
}
exports.default = Game;
