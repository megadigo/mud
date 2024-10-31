"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants"); // Import the constants
class Room {
    constructor(id, description) {
        this.id = id;
        this.description = description;
        this.exits = new Map();
        this.items = [];
    }
    get fulldescritption() {
        let exits = "";
        this.exits.forEach((value, key) => { exits += key + " "; });
        const fulldescritption = this.description + '\n' + `${constants_1.bluecolor}[${this.id}] ${this.description}\n${constants_1.bluecolor}Exits: ${exits}${constants_1.defaultcolor}`;
        return fulldescritption;
    }
    ;
}
exports.default = Room;
