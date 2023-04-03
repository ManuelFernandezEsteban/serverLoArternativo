"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const sesion_compra_evento_1 = __importDefault(require("./sesion_compra_evento"));
const Evento = connection_1.default.define('Eventos', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    evento: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    precio: {
        type: sequelize_1.DataTypes.FLOAT
    },
    monedaId: {
        type: sequelize_1.DataTypes.INTEGER
    },
    fecha: {
        type: sequelize_1.DataTypes.DATE
    },
    descripcion: {
        type: sequelize_1.DataTypes.TEXT
    },
    direccion: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    provincia: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    localidad: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    codigo_postal: {
        type: sequelize_1.DataTypes.STRING(6)
    },
    pais: {
        type: sequelize_1.DataTypes.STRING(30)
    },
    pdf: {
        type: sequelize_1.DataTypes.STRING(80)
    },
    online: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    imagen: {
        type: sequelize_1.DataTypes.STRING(80)
    },
    telefono: {
        type: sequelize_1.DataTypes.STRING(20)
    },
    email: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    twitter: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    facebook: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    instagram: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    you_tube: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    web: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE
    },
    idProductEvent: {
        type: sequelize_1.DataTypes.STRING(100)
    },
    idPriceEvent: {
        type: sequelize_1.DataTypes.STRING(100)
    }
}, {
    paranoid: true // soft delete
});
Evento.hasMany(sesion_compra_evento_1.default);
sesion_compra_evento_1.default.belongsTo(Evento);
exports.default = Evento;
//# sourceMappingURL=eventos.js.map