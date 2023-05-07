"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const especialista_1 = __importDefault(require("./especialista"));
const eventos_1 = __importDefault(require("./eventos"));
const herramientas_1 = __importDefault(require("./herramientas"));
const Actividades = connection_1.default.define('Actividades', {
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
Actividades.hasMany(especialista_1.default);
especialista_1.default.belongsTo(Actividades);
Actividades.hasMany(eventos_1.default);
eventos_1.default.belongsTo(Actividades);
Actividades.hasMany(herramientas_1.default);
herramientas_1.default.belongsTo(Actividades);
exports.default = Actividades;
//# sourceMappingURL=actividades.js.map