import {DataTypes, Sequelize} from 'sequelize';
import db from '../db/connection';
import Evento from './eventos';


const Especialista = db.define('Especialistas',{
    
    id:{
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey:true
    },
    nombre:{
        type:DataTypes.STRING,
        allowNull:false
    },
    apellidos:{
        type:DataTypes.STRING
    },
    telefono:{
        type:DataTypes.STRING,
        allowNull:false
    },    
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    descripcion_terapia:{
        type:DataTypes.STRING
    },
   /* actividad:{
        type:DataTypes.INTEGER,
        allowNull:false
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
    video:{
        type:DataTypes.STRING
    },
    imagen:{
        type:DataTypes.STRING
    },
    /*
    plan_contratado:{
        type:DataTypes.INTEGER,
        allowNull:false
    },*/
    token_pago:{
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
    },
    fecha_pago_actual:{
        type:DataTypes.DATE
    },
    fecha_fin_suscripcion:{
        type:DataTypes.DATE
    }
},{
    paranoid:true // soft delete
})

Especialista.hasMany(Evento);
Evento.belongsTo(Especialista);



export default Especialista;