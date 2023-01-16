import { DataTypes } from "sequelize";
import db from "../db/connection";

const Tipo = db.define('Tipos_sponsors',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    nombre:{
        type:DataTypes.STRING
    },
});

export default Tipo;