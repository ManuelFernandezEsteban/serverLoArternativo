import { Sequelize } from 'sequelize';

import dotenv from 'dotenv';
dotenv.config();

const db = new Sequelize('db-nativos-tierra',
                         'root',
                         '',{
    host: 'localhost',
    dialect:'mysql',
    logging:false,
    port:3306
    
}); 
 
export default db;        