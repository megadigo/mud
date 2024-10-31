import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Game from './game';
import Room from './room';
import { defaultcolor, redcolor, greencolor, bluecolor, yellowcolor, magentacolor, cyancolor, whitecolor } from './constants'; // Import the constants

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const game = new Game();

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the MUD!');
});

io.on('connection', async (socket) => {
  console.log(`Player ${socket.id} connected`);
  game.addPlayer(socket.id, `Player ${socket.id}`);
  game.createRooms();
  
  let respond: string = ""; 

  socket.on('message', (msg) => {
    let forceLook = false;
    const [command, ...args] = msg.split(' ');
    if (command === 'setName') {
      // Set player name
      let respond = game.players.get(socket.id)?.SetPlayerName(args[0]);
        
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
        respond = roomDescription;

    } else if (command === 'disconnect') {
      // Disconect player
      var player = game.players.get(socket.id);
      game.removePlayer(socket.id);
      respond = `User ${player?.name} disconnected`
      console.log(respond);
      
    } else {
      respond = 'update', `${redcolor}Unknown command${defaultcolor}`;
    }
    socket.emit('update', respond);
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});