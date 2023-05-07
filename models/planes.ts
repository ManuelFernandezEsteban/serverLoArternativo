import { DataTypes } from "sequelize";
import db from "../db/connection";
import Especialista from "./especialista";
import Sesiones_compra_suscripciones from "./sesiones_compra_suscripcion";
import Suscripciones from "./suscripciones";


const Planes = db.define('Planes',{
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

Planes.hasMany(Especialista);
Especialista.belongsTo(Planes);
Planes.hasMany(Sesiones_compra_suscripciones);
Sesiones_compra_suscripciones.belongsTo(Planes);
Planes.hasMany(Suscripciones);
Suscripciones.belongsTo(Planes);

export default Planes;