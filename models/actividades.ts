import { DataTypes } from 'sequelize';
import db from '../db/connection';
import Especialista from './especialista';

const Actividad = db.define('Actividades',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    nombre:{
        type:DataTypes.STRING
    },
    imagen:{
        type:DataTypes.STRING
    },
});

Actividad.hasMany(Especialista );
Especialista.belongsTo(Actividad);

export default Actividad;
