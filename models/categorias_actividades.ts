import { DataTypes } from 'sequelize';
import db from '../db/connection';
import Actividades from './actividades';

const Categoria_actividad = db.define('Categorias_actividades',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    categoria:{
        type:DataTypes.STRING(20)
    },
    updatedAt:{
        type:DataTypes.STRING(80)
    },
    createdAt:{
        type:DataTypes.DATE
    },
    
});

Actividades.hasMany(Categoria_actividad ); 
Categoria_actividad.belongsTo(Actividades);

export default Categoria_actividad; 