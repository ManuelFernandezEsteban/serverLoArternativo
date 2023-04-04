import { DataTypes} from "sequelize";
import db from '../db/connection';
import Sesiones_compra_eventos from "./sesion_compra_evento";
import Compras_eventos_por_finalizar from "./compras_eventos_por_finalizar";

const Cliente = db.define('Clientes',{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(50)
    },
    apellidos: {
        type: DataTypes.STRING(100)
    },
    email: {
        type: DataTypes.STRING(100)
    },
    telefono: {
        type: DataTypes.STRING(20)
    },
    direccion:{
        type:DataTypes.STRING(50)
    },
    provincia:{
        type:DataTypes.STRING(50)
    },
    poblacion:{
        type:DataTypes.STRING(50)
    },
    codigo_postal:{
        type:DataTypes.STRING(6)
    },
    pais:{
        type:DataTypes.STRING(30)
    },
    privacidad: {
        type:DataTypes.BOOLEAN
    },
    aceptaComercial: {
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
    }
},
{
    paranoid: true
})

Cliente.hasMany(Sesiones_compra_eventos);
Sesiones_compra_eventos.belongsTo(Cliente);
Cliente.hasMany(Compras_eventos_por_finalizar);
Compras_eventos_por_finalizar.belongsTo(Cliente);


export default Cliente;