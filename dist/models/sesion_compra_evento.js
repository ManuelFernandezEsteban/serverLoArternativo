"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const Sesiones_compra_eventos = connection_1.default.define('Sesiones_compra_eventos', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    ClienteId: {
        type: sequelize_1.DataTypes.STRING(255)
    },
    EventoId: {
        type: sequelize_1.DataTypes.STRING(255)
    },
    completada: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    checkout_stripe: {
        type: sequelize_1.DataTypes.STRING(255)
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
exports.default = Sesiones_compra_eventos;
//# sourceMappingURL=sesion_compra_evento.js.map