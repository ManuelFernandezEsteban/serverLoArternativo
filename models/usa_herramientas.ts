import { DataTypes } from "sequelize";
import db from '../db/connection';
import Especialista from "./especialista";
import Actividad from './actividades';
import Herramientas from './herramientas';


const UsaHerramientas = db.define('UsaHerramientas',{
    createdAt:{
        type:DataTypes.DATE
    },
    updatedAt:{
        type:DataTypes.DATE
    },
    EspecialistaId:{
        type:DataTypes.STRING,
        primaryKey:true,
        
    },
    HerramientaId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        references:{ 
            model:Herramientas,
            key:'id'
        }
       
    },
    ActividadeId:{
        type:DataTypes.INTEGER,
       
    }  
})
Especialista.hasMany(UsaHerramientas);
UsaHerramientas.belongsTo(Especialista);

Actividad.hasMany(UsaHerramientas);
UsaHerramientas.belongsTo(Actividad);

Herramientas.hasMany(UsaHerramientas);
UsaHerramientas.belongsTo(Herramientas);


export default UsaHerramientas;  