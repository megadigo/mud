"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const game_1 = __importDefault(require("./game"));
const constants_1 = require("./constants"); // Import the constants
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const game = new game_1.default();
app.get('/', (req, res) => {
    res.send('Welcome to the MUD!');
});
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Player ${socket.id} connected`);
    game.addPlayer(socket.id, `Player ${socket.id}`);
    let update = "";
    let setmud = "";
    socket.on('message', (msg) => {
        let forceLook = false;
        const [command, ...args] = msg.split(' ');
        if (command === 'setName') {
            // Set player name
            const name = args.join(' ');
            setmud = "setName " + name;
            update = `${constants_1.bluecolor}Welcome, ${name}! You are at the start.${constants_1.defaultcolor}`;
        }
        else if (command === 'move' || command === 'look') {
            // Move player / Look around
            if (command === 'move') {
                const direction = args[0];
                update = game.movePlayer(socket.id, direction);
            }
            const player = game.players.get(socket.id);
            if (player) {
                const room = game.rooms.get(player.location);
                if (room) {
                    update += room.fulldescritption;
                }
            }
        }
        else if (command === 'map') {
            update = game.displayRoomsGraphically(socket.id, 10, 10);
        }
        else if (command === 'disconnect') {
            // Disconnect player
            game.removePlayer(socket.id);
            console.log('user disconnected');
        }
        else {
            update = `${constants_1.redcolor}Unknown command${constants_1.defaultcolor}`;
        }
        if (setmud !== "") {
            socket.emit('setmud', setmud);
        }
        if (update !== "") {
            socket.emit('update', update);
        }
        setmud = "";
        update = "";
    });
}));
server.listen(3000, () => {
    console.log('Server is running on port 3000');
    game.initializeGame();
    // Log rooms to console
    game.rooms.forEach(room => {
        let exits = "";
        room.exits.forEach((value, key) => { exits += key + ">" + value.id.toString().padStart(2, '0') + " "; });
        console.log(`Room ${room.id.toString().padStart(2, '0')}: ${exits}`);
    });
    console.log(game.displayRoomsGraphically('', 10, 10)); // Adjust numRows and numCols as needed
});
