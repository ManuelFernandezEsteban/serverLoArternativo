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
        type:DataTypes.STRING(20)
    },
    imagen:{
        type:DataTypes.STRING(80)
    },
    createdAt:{
        type:DataTypes.DATE
    }
});

Actividad.hasMany(Especialista );
Especialista.belongsTo(Actividad);

Actividad.hasMany(Evento);
Evento.belongsTo(Actividad);

export default Actividad;
