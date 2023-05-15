import { DataTypes } from 'sequelize';
import db from '../db/connection';
import Especialista from './especialista';
import UsaHerramientas from './usa_herramientas';

const Herramientas = db.define('Herramientas',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    categoria:{
        type:DataTypes.STRING(20)
    },
    ActividadeId:{
        type:DataTypes.INTEGER
    },
    updatedAt:{
        type:DataTypes.STRING(80)
    },
    createdAt:{
        type:DataTypes.DATE
    },
    
});

//UsaHerramientas.belongsTo(Herramientas)

export default Herramientas; 