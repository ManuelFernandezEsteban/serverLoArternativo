"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const Herramientas = connection_1.default.define('Herramientas', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    categoria: {
        type: sequelize_1.DataTypes.STRING(20)
    },
    ActividadeId: {
        type: sequelize_1.DataTypes.INTEGER
    },
    updatedAt: {
        type: sequelize_1.DataTypes.STRING(80)
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE
    },
});
//UsaHerramientas.belongsTo(Herramientas)
exports.default = Herramientas;
//# sourceMappingURL=herramientas.js.map