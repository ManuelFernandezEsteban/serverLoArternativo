import { DataTypes} from "sequelize";
import db from '../db/connection';

const Sesiones_compra_suscripciones = db.define('Sesiones_compra_suscripciones',{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    EspecialistaId: {
        type: DataTypes.STRING(255)
    },
    planeId: {
        type: DataTypes.INTEGER
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

export default Sesiones_compra_suscripciones; 