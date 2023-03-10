import { DataTypes } from "sequelize";
import db from "../db/connection";

const Evento = db.define('Eventos',{
    id:{
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey:true,        
    },
    evento:{
        type:DataTypes.STRING(50)
    },
    precio:{
        type:DataTypes.FLOAT
    },
    monedaId:{
        type:DataTypes.INTEGER
    },
    fecha:{ 
        type:DataTypes.DATE
    },
    descripcion:{
        type:DataTypes.TEXT
    },
    direccion:{
        type:DataTypes.STRING(50)
    },
    provincia:{
        type:DataTypes.STRING(50)
    },
    localidad:{
        type:DataTypes.STRING(50)
    },
    codigo_postal:{
        type:DataTypes.STRING(6)
    },
    pais:{
        type:DataTypes.STRING(30)
    },
    pdf:{
        type:DataTypes.STRING(80)
    },
    online:{
        type:DataTypes.BOOLEAN
    },
    imagen:{
        type:DataTypes.STRING(80)
    },
    telefono:{
        type:DataTypes.STRING(20)
    },
    email:{
        type:DataTypes.STRING(50)
    },
    twitter:{
        type:DataTypes.STRING(50)
    },
    facebook:{
        type:DataTypes.STRING(50)
    },
    instagram:{
        type:DataTypes.STRING(50)
    },
    you_tube:{
        type:DataTypes.STRING(50)
    },
    web:{
        type:DataTypes.STRING(50)
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



export default Evento;