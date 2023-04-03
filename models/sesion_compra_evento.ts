import { DataTypes} from "sequelize";
import db from '../db/connection';

const Sesiones_compra_eventos = db.define('Sesiones_compra_eventos',{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    ClienteId: {
        type: DataTypes.STRING(255)
    },
    EventoId: {
        type: DataTypes.STRING(255)
    },
    completada: {
        type: DataTypes.BOOLEAN
    },
    checkout_stripe: {
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

export default Sesiones_compra_eventos;