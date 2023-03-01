"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const eventos_1 = __importDefault(require("./eventos"));
const Moneda = connection_1.default.define('Monedas', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    moneda: {
        type: sequelize_1.DataTypes.STRING(45)
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE
    }
});
Moneda.hasMany(eventos_1.default);
eventos_1.default.belongsTo(Moneda);
exports.default = Moneda;
//# sourceMappingURL=monedas.js.map