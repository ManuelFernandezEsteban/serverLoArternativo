import { Sequelize } from 'sequelize';

const db = new Sequelize('DB-nativos-tierra',
                         'nativos-tierra',
                         'AVNS_UjHl8s8ClOhOFlsZ7Wp',{
    host: 'nativos-tierra-db-do-user-13555636-0.b.db.ondigitalocean.com',
    dialect:'mysql',
    logging:false,
    port:25060 
    
}); 
 
export default db; 