"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const Suscripciones = connection_1.default.define('Suscripciones', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    EspecialistaId: {
        type: sequelize_1.DataTypes.STRING(255)
    },
    planeId: {
        type: sequelize_1.DataTypes.INTEGER
    },
    id_stripe_subscription: {
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
exports.default = Suscripciones;
//# sourceMappingURL=suscripciones.js.map