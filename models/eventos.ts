import { DataTypes } from "sequelize";
import db from "../db/connection";

const Evento = db.define('Eventos',{
    id:{
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey:true
    },
    evento:{
        type:DataTypes.STRING
    },
    precio:{
        type:DataTypes.FLOAT
    },
    fecha:{
        type:DataTypes.DATE
    },
    descripcion:{
        type:DataTypes.STRING
    },/*
    actividad:{
        type:DataTypes.INTEGER
    },*/
    direccion:{
        type:DataTypes.STRING
    },
    provincia:{
        type:DataTypes.STRING
    },
    localidad:{
        type:DataTypes.STRING
    },
    codigo_postal:{
        type:DataTypes.STRING
    },
    pais:{
        type:DataTypes.STRING
    },
    pdf:{
        type:DataTypes.STRING
    },
    online:{
        type:DataTypes.BOOLEAN
    },
    imagen:{
        type:DataTypes.STRING
    },
    telefono:{
        type:DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING
    },
    twitter:{
        type:DataTypes.STRING
    },
    facebook:{
        type:DataTypes.STRING
    },
    instagram:{
        type:DataTypes.STRING
    },
    you_tube:{
        type:DataTypes.STRING
    },
    web:{
        type:DataTypes.STRING
    }

});

export default Evento;