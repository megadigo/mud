import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Game from './game';
import Room from './room';
import { defaultcolor, redcolor, greencolor, bluecolor, yellowcolor, magentacolor, cyancolor, whitecolor, MaxMudRow, MaxMudCol } from './constants'; // Import the constants

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
  
  let update: string = ""; 
  let setmud: string = "";

  socket.on('message', (msg) => {
    let forceLook = false;
    const [command, ...args] = msg.split(' ');
    if (command === 'setName') {
        // Set player name
        const name = args.join(' ');
        setmud = "setName " + name;
        update = `${bluecolor}Welcome, ${name}! You are at the start.${defaultcolor}`;
        
    } else if (command === 'move' || command === 'look') {
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
    } else if (command === 'map') {
      update = game.displayRoomsGraphically(socket.id, MaxMudRow,MaxMudCol);

    } else if (command === 'disconnect') {
        // Disconnect player
        game.removePlayer(socket.id);
        console.log('user disconnected');
    
    } else {
      update = `${redcolor}Unknown command${defaultcolor}`;
    }

    if(setmud !== ""){
      socket.emit('setmud', setmud);
    }
    if(update !== ""){
      socket.emit('update', update);
    }

    setmud = "";
    update = "";
    
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
  console.log(game.displayRoomsGraphically('', MaxMudRow, MaxMudCol)); // Adjust numRows and numCols as needed

});