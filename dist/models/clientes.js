"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const sesion_compra_evento_1 = __importDefault(require("./sesion_compra_evento"));
const Cliente = connection_1.default.define('Clientes', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    apellidos: {
        type: sequelize_1.DataTypes.STRING(100)
    },
    email: {
        type: sequelize_1.DataTypes.STRING(100)
    },
    telefono: {
        type: sequelize_1.DataTypes.STRING(20)
    },
    aceptaPD: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    aceptaComercial: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE
    }
}, {
    paranoid: true
});
Cliente.hasMany(sesion_compra_evento_1.default);
sesion_compra_evento_1.default.belongsTo(Cliente);
exports.default = Cliente;
//# sourceMappingURL=clientes.js.map