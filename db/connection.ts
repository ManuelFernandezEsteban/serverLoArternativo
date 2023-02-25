import { Sequelize } from 'sequelize';



const db = new Sequelize('loalternativo',
                         'loalternativo',
                         'pzOc5s[p3kZxdTDx',{
    host: 'localhost',
    dialect:'mysql',
    logging:false,
    port:3306 
    
}); 
 
export default db;      