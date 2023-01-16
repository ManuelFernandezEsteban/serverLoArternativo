import { DataTypes } from "sequelize";
import db from "../db/connection";
import Tipo from "./tipo";

const Sponsor = db.define('Sponsors',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    nombre:{
        type:DataTypes.STRING
    },
    imagen:{
        type:DataTypes.STRING
    },
    tipo:{
        type:DataTypes.INTEGER
    }
});


export default Sponsor;