import {DataTypes} from 'sequelize';
import db from '../db/connection';
import Evento from './eventos';



const Especialista = db.define('Especialistas',{
    
    id:{
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey:true
    },
    nombre:{
        type:DataTypes.STRING(30),
        allowNull:false
    },
    apellidos:{
        type:DataTypes.STRING(80)
    },
    telefono:{
        type:DataTypes.STRING(20),
        allowNull:false
    },    
    email:{
        type:DataTypes.STRING(80),
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING(200),
        allowNull:false
    },
    descripcion_terapia:{
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
    video:{
        type:DataTypes.STRING(150)
    },
    imagen:{
        type:DataTypes.STRING(150)
    },    
    token_pago:{
        type:DataTypes.STRING(200)
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
    fecha_pago_actual:{
        type:DataTypes.DATE
    },
    fecha_fin_suscripcion:{
        type:DataTypes.DATE
    },
    privacidad:{
        type:DataTypes.BOOLEAN
    },
    condiciones:{
        type:DataTypes.BOOLEAN
    },
    createdAt:{
        type:DataTypes.DATE
    },
    updatedAt:{
        type:DataTypes.DATE
    },
    deletedAt:{
        type:DataTypes.DATE
    },
    resetToken:{
        type:DataTypes.STRING(255)
    },
    no_info_comercial:{
        type:DataTypes.BOOLEAN
    }
},{
    paranoid:true // soft delete
})

Especialista.hasMany(Evento);
Evento.belongsTo(Especialista);



export default Especialista; 