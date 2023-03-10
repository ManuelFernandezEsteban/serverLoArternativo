import { DataTypes } from 'sequelize';
import db from '../db/connection';
import Especialista from './especialista';
import Evento from './eventos';
import Herramientas from './herramientas';
import UsaHerramientas from './usa_herramientas';

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

Actividad.hasMany(Herramientas);
Herramientas.belongsTo(Actividad);
 

export default Actividad;
