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
  
  let respond: string = ""; 

  socket.on('message', (msg) => {
    let forceLook = false;
    const [command, ...args] = msg.split(' ');
    if (command === 'setName') {
        // Set player name
        const name = args.join(' ');
        socket.emit('update', `${bluecolor}Welcome, ${name}! You are at the start.${defaultcolor}`);
        
    } else if (command === 'move' || command === 'look') {
        // Move player / Look around
        let roomDescription = "";
        if (command === 'move') {
            const direction = args[0];
            game.movePlayer(socket.id, direction);
            roomDescription = `${greencolor}You move to ${direction}${defaultcolor}\n`;
            forceLook = true;
        }
        const player = game.players.get(socket.id);
        if (player) {
            const room = game.rooms.get(player.location);
            if (room) {
                roomDescription += room.fulldescritption;
            }
        }
        socket.emit('update', roomDescription);

    } else if (command === 'map') {
      socket.emit('update', game.displayRoomsGraphically(socket.id, 10, 10));
      
    } else if (command === 'disconnect') {
        // Disconnect player
        game.removePlayer(socket.id);
        console.log('user disconnected');
    
    } else {
        socket.emit('update', `${redcolor}Unknown command${defaultcolor}`);
    }
  });

});

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