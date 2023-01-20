import { DataTypes } from 'sequelize';
import db from '../db/connection';
import Especialista from './especialista';
import Evento from './eventos';

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

Actividad.hasMany(Evento);
Evento.belongsTo(Actividad);

export default Actividad;
