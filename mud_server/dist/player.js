"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants"); // Import the constants
class Player {
    constructor(id, name) {
        this.id = "";
        this.name = name;
        this.location = 0;
        this.hp = 100;
        this.maxhp = 100;
        this.level = 1;
        this.exp = 0;
        this.gold = 0;
        this.stance = 0;
    }
    SetPlayerName(name) {
        this.name = name;
        return `${constants_1.bluecolor}Welcome, ${this.name}! Let the adventure begins.${constants_1.defaultcolor}`;
    }
}
exports.default = Player;
