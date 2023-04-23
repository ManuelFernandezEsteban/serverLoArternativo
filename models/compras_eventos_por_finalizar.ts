import { DataTypes} from "sequelize";
import db from '../db/connection';

const Compras_eventos_no_finalizadas = db.define('Compras_eventos_no_finalizadas',{
    id:{
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey:true,        
    },
    ClienteId: {
        type: DataTypes.STRING(255)
    },
    EventoId: {
        type: DataTypes.STRING(255)
    },
    EspecialistaId: {
        type: DataTypes.STRING(255)
    },
    payment_intent: {
        type: DataTypes.STRING(255)
    },
    ok_cliente:{
        type:DataTypes.BOOLEAN
    },    
    ok_especialista:{
        type:DataTypes.BOOLEAN
    },
    pagada:{
        type:DataTypes.BOOLEAN
    },
    token_seguridad:{
        type: DataTypes.STRING(255)
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
},
{
    paranoid: true
})

export default Compras_eventos_no_finalizadas; 