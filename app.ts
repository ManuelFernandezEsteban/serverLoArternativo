import dotenv from 'dotenv';
import Server from './models/server';
//configarar dotenv
dotenv.config();


const server = new Server();

server.listen();