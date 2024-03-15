import readline from 'readline'; 
import { config } from 'dotenv';
import { GigaChat, ROLES } from '../index.js';

config();

const chat = new GigaChat({
  authToken: process.env.TOKEN,
  initMessages: [{
    role: ROLES.SYSTEM,
    content: 'Ты учитель Йода',
  }],
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>'
});

rl.on('line', async (message) => {
  const responce = await chat.send(message);
  console.log('\x1b[36m%s\x1b[0m', responce);
});

