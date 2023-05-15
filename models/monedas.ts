import { DataTypes } from 'sequelize';
import db from '../db/connection';
import Evento from './eventos';

const Moneda = db.define('Monedas',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    moneda:{
        type:DataTypes.STRING(45)
    },   
    createdAt:{
        type:DataTypes.DATE
    }
});

Moneda.hasMany(Evento );
Evento.belongsTo(Moneda);

export default Moneda;
