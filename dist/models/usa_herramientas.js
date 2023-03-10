"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const especialista_1 = __importDefault(require("./especialista"));
const actividades_1 = __importDefault(require("./actividades"));
const herramientas_1 = __importDefault(require("./herramientas"));
const UsaHerramientas = connection_1.default.define('UsaHerramientas', {
    createdAt: {
        type: sequelize_1.DataTypes.DATE
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE
    },
    EspecialistaId: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    HerramientaId: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: herramientas_1.default,
            key: 'id'
        }
    },
    ActividadeId: {
        type: sequelize_1.DataTypes.INTEGER,
    }
});
especialista_1.default.hasMany(UsaHerramientas);
UsaHerramientas.belongsTo(especialista_1.default);
actividades_1.default.hasMany(UsaHerramientas);
UsaHerramientas.belongsTo(actividades_1.default);
herramientas_1.default.hasMany(UsaHerramientas);
UsaHerramientas.belongsTo(herramientas_1.default);
exports.default = UsaHerramientas;
//# sourceMappingURL=usa_herramientas.js.map