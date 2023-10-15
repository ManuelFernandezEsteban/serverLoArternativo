"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const Especialistas_Categoria = connection_1.default.define('Especialistas_Categorias', {
    createdAt: {
        type: sequelize_1.DataTypes.DATE
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE
    },
    EspecialistaId: {
        type: sequelize_1.DataTypes.STRING
    },
    CategoriasActividadeId: {
        type: sequelize_1.DataTypes.INTEGER
    },
});
/*Especialista.hasMany(Especialistas_Categoria);
Especialistas_Categoria.belongsTo(Especialista);

Categoria_actividad.hasMany(Especialistas_Categoria);
Especialistas_Categoria.belongsTo(Categoria_actividad);*/
exports.default = Especialistas_Categoria;
//# sourceMappingURL=especialistas_categorias.js.map