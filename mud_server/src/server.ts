import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Game from './game';
import Room from './room';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const game = new Game();

const defaultcolor = "\x1b[0m";
const redcolor = "\x1b[31m";
const greencolor = "\x1b[32m";
const bluecolor = "\x1b[34m";
const yellowcolor = "\x1b[33m";
const magentacolor = "\x1b[35m";
const cyancolor = "\x1b[36m";
const whitecolor = "\x1b[37m";

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the MUD!');
});

io.on('connection', async (socket) => {
  console.log(`Player ${socket.id} connected`);
  game.addPlayer(socket.id, `Player ${socket.id}`);

  const numRooms = 10;
  const rooms = Room.createRooms(numRooms);
  Room.connectRooms(rooms);

  socket.on('message', (msg) => {
    let forceLook = false;
    const [command, ...args] = msg.split(' ');
    if (command === 'setName') {
      // Set player name
        const name = args.join(' ');
        socket.emit('update', `${bluecolor}Welcome, ${name}! You are at the start.${defaultcolor}`);
        
    } else if (command === 'move'|| command === 'look') {
      // Move player / Look around
        let roomDescription = "";
        if(command === 'move') {
          const direction = args[0];
          game.movePlayer(rooms,socket.id, direction);
          roomDescription = `${greencolor}You move to ${direction}${defaultcolor}\n`;
          forceLook = true;
        }
        const player = game.players.get(socket.id);
        if (player) {
          const room = rooms[player.location];
          roomDescription += room.fulldescritption;
        }
        socket.emit('update', roomDescription);

    } else if (command === 'disconnect') {
      // Disconect player
      game.removePlayer(socket.id);
      console.log('user disconnected');
    
    } else {
      socket.emit('update', `${redcolor}Unknown command${defaultcolor}`);
    
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});