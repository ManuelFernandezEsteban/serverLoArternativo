"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const Compras_eventos_por_finalizar = connection_1.default.define('Compras_eventos_no_finalizadas', {
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
    EspecialistaId: {
        type: sequelize_1.DataTypes.STRING(255)
    },
    payment_intent: {
        type: sequelize_1.DataTypes.STRING(255)
    },
    ok_cliente: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    ok_especialista: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    pagada: {
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
exports.default = Compras_eventos_por_finalizar;
//# sourceMappingURL=compras_eventos_por_finalizar.js.map