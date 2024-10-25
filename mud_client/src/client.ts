// client.ts
import { io } from 'socket.io-client';
import * as readline from 'readline';

const socket = io('http://localhost:3000'); // Ensure this URL is correct

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

rl.on('line', (line) => {
  const command = line.trim();
  if (command) {
    socket.emit('message', command);
  }
}).on('close', () => {
  console.log('Exiting...');
  process.exit(0);
});

// events from server
socket.on('connect', () => {
  console.log('Connected to server');
  rl.prompt();
});

socket.on('message', (data: string) => {
  console.log('Message from server:', data);
  rl.prompt();
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  rl.prompt();
});

socket.on('connect_error', (error: Error) => {
  console.error('Error from server', error);
  rl.prompt();
});

socket.on('update', (data: any) => {
  console.log(data);
  rl.prompt();
});

socket.on('error', (error: string) => {
  console.error(error);
  rl.prompt();
});


