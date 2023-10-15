import { Sequelize } from 'sequelize';

import dotenv from 'dotenv';
dotenv.config();

const db = new Sequelize('db-nativos-tierra',
                         'nativos-tierra-user',
                         'AVNS_Y22MnA65e9xC4n64LLL',{
    host: 'nativos-tierra-db-do-user-13555636-0.b.db.ondigitalocean.com',
    dialect:'mysql',
    logging:false,
    port:25060
    
}); 
 
export default db;        
