import { DataTypes } from "sequelize";
import db from "../db/connection";
import Especialista from "./especialista";
import Sesiones_compra_suscripcion from './sesiones_compra_suscripcion';
import Sesiones_compra_suscripciones from "./sesiones_compra_suscripcion";


const Plan = db.define('Planes',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    nombre:{
        type:DataTypes.STRING(20)
    },
    precio:{
        type:DataTypes.FLOAT
    },
    priceId:{
        type:DataTypes.STRING(255)
    },
    createdAt:{
        type:DataTypes.DATE
    },
    updatedAt:{
        type:DataTypes.DATE
    },
    deletedAt:{
        type:DataTypes.DATE
    }

},{
    paranoid:true // soft delete
});

Plan.hasMany(Especialista);
Especialista.belongsTo(Plan);
Plan.hasMany(Sesiones_compra_suscripciones);
Sesiones_compra_suscripciones.belongsTo(Plan);

export default Plan;