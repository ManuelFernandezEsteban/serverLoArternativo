import { DataTypes } from "sequelize";
import db from "../db/connection";
import Tipo from "./tipo";

const Sponsor = db.define('Sponsors',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    nombre:{
        type:DataTypes.STRING(50)
    },
    imagen:{
        type:DataTypes.STRING(80)
    },
    tipo:{
        type:DataTypes.INTEGER
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


export default Sponsor;