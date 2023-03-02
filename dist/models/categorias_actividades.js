"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const actividades_1 = __importDefault(require("./actividades"));
const Categoria_actividad = connection_1.default.define('Categorias_actividades', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    categoria: {
        type: sequelize_1.DataTypes.STRING(20)
    },
    updatedAt: {
        type: sequelize_1.DataTypes.STRING(80)
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE
    },
});
actividades_1.default.hasMany(Categoria_actividad);
Categoria_actividad.belongsTo(actividades_1.default);
exports.default = Categoria_actividad;
//# sourceMappingURL=categorias_actividades.js.map