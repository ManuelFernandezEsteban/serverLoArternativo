import { DataTypes } from "sequelize";
import db from "../db/connection";

const Tipo = db.define('Tipos_sponsors',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    nombre:{
        type:DataTypes.STRING(20)
    },
    createdAt:{
        type:DataTypes.DATE
    },
    updatedAt:{
        type:DataTypes.DATE
    }
});

export default Tipo; 