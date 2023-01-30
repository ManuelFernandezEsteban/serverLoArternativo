import { DataTypes } from "sequelize";
import db from "../db/connection";
import Especialista from "./especialista";


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

export default Plan;