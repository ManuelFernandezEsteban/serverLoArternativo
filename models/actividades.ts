import { DataTypes } from 'sequelize';
import db from '../db/connection';
import Especialista from './especialista';
import Evento from './eventos';
import Herramientas from './herramientas';
import UsaHerramientas from './usa_herramientas';

const Actividades = db.define('Actividades',{
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

Actividades.hasMany(Especialista );
Especialista.belongsTo(Actividades);

Actividades.hasMany(Evento);
Evento.belongsTo(Actividades);

Actividades.hasMany(Herramientas);
Herramientas.belongsTo(Actividades);
 

export default Actividades;
