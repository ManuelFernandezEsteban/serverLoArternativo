import { Sequelize } from 'sequelize';

import dotenv from 'dotenv';
dotenv.config();

const db = new Sequelize('nativos-tierra-db',
                         'doadmin',
                         'AVNS_D5uJZSMJZOgMrQih1Q0',{
    host: 'nativos-tierra-db-do-user-13555636-0.b.db.ondigitalocean.com',
    dialect:'mysql',
    logging:false,
    port:25060
    
}); 
 
export default db;        
