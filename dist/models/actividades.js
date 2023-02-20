"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const especialista_1 = __importDefault(require("./especialista"));
const eventos_1 = __importDefault(require("./eventos"));
const Actividad = connection_1.default.define('Actividades', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(20)
    },
    imagen: {
        type: sequelize_1.DataTypes.STRING(80)
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE
    }
});
Actividad.hasMany(especialista_1.default);
especialista_1.default.belongsTo(Actividad);
Actividad.hasMany(eventos_1.default);
eventos_1.default.belongsTo(Actividad);
exports.default = Actividad;
//# sourceMappingURL=actividades.js.map