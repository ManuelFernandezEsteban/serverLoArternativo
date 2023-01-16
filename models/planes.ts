import { DataTypes } from "sequelize";
import db from "../db/connection";
import Especialista from "./especialista";


const Plan = db.define('Planes',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    nombre:{
        type:DataTypes.STRING
    },
    precio:{
        type:DataTypes.FLOAT
    },
});

Plan.hasMany(Especialista);
Especialista.belongsTo(Plan);

export default Plan;