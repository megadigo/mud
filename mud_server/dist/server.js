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
const room_1 = __importDefault(require("./room"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const game = new game_1.default();
const defaultcolor = "\x1b[0m";
const redcolor = "\x1b[31m";
const greencolor = "\x1b[32m";
const bluecolor = "\x1b[34m";
const yellowcolor = "\x1b[33m";
const magentacolor = "\x1b[35m";
const cyancolor = "\x1b[36m";
const whitecolor = "\x1b[37m";
app.get('/', (req, res) => {
    res.send('Welcome to the MUD!');
});
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Player ${socket.id} connected`);
    game.addPlayer(socket.id, `Player ${socket.id}`);
    const numRooms = 10;
    const rooms = room_1.default.createRooms(numRooms);
    room_1.default.connectRooms(rooms);
    socket.on('message', (msg) => {
        let forceLook = false;
        const [command, ...args] = msg.split(' ');
        if (command === 'setName') {
            const name = args.join(' ');
            socket.emit('update', `${bluecolor}Welcome, ${name}! You are at the start.${defaultcolor}`);
        }
        else if (command === 'move' || command === 'look') {
            let roomDescription = "";
            if (command === 'move') {
                const direction = args[0];
                game.movePlayer(rooms, socket.id, direction);
                roomDescription = `${greencolor}You move to ${direction}${defaultcolor}\n`;
                forceLook = true;
            }
            const player = game.players.get(socket.id);
            if (player) {
                const room = rooms[player.location];
                roomDescription += room.fulldescritption;
            }
            socket.emit('update', roomDescription);
        }
        else if (command === 'disconnect') {
            game.removePlayer(socket.id);
            console.log('user disconnected');
        }
        else {
            socket.emit('update', `${redcolor}Unknown command${defaultcolor}`);
        }
    });
}));
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
