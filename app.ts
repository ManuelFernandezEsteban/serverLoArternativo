
import Server from './models/server';
//configarar dotenv
import dotenv from 'dotenv';
dotenv.config();


const server = Server.instance;



server.listen();