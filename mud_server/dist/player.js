"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants"); // Import the constants
class Player {
    constructor(id, name) {
        this.id = "";
        this.name = name;
        this.location = 0;
    }
    SetPlayerName(name) {
        this.name = name;
        return `${constants_1.bluecolor}Welcome, ${this.name}! Let the adventure begins.${constants_1.defaultcolor}`;
    }
}
exports.default = Player;
