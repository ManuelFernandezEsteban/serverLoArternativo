import { Sequelize } from 'sequelize';

const db = new Sequelize('loalternativo','loalternativo','drK(,yE@2hfp95)',{
    host:'localhost',
    dialect:'mysql' ,
    logging:true
    
});

export default db;