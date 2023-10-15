import { Sequelize } from 'sequelize';

import dotenv from 'dotenv';
dotenv.config();

const db = new Sequelize('nativos-tierra-db',
                         'doadmin',
                         'AVNS_agMqg9qsY1lTK5x9UFV',{
    host: 'db-nativos-tierra-do-user-13555636-0.b.db.ondigitalocean.com',
    dialect:'mysql',
    logging:false,
    port:25060
    
}); 
 
export default db;        
