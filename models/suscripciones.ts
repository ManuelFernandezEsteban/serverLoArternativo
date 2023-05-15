import { DataTypes} from "sequelize";
import db from '../db/connection';

const Suscripciones = db.define('Suscripciones',{
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
    id_stripe_subscription: {
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

export default Suscripciones; 