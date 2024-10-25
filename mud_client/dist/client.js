"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// client.ts
const socket_io_client_1 = require("socket.io-client");
const readline = __importStar(require("readline"));
const socket = (0, socket_io_client_1.io)('http://localhost:3000'); // Ensure this URL is correct
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
socket.on('message', (data) => {
    console.log('Message from server:', data);
    rl.prompt();
});
socket.on('disconnect', () => {
    console.log('Disconnected from server');
    rl.prompt();
});
socket.on('connect_error', (error) => {
    console.error('Error from server', error);
    rl.prompt();
});
socket.on('update', (data) => {
    console.log(data);
    rl.prompt();
});
socket.on('error', (error) => {
    console.error(error);
    rl.prompt();
});
