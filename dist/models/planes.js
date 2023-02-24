"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const especialista_1 = __importDefault(require("./especialista"));
const Plan = connection_1.default.define('Planes', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(20)
    },
    precio: {
        type: sequelize_1.DataTypes.FLOAT
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
    paranoid: true // soft delete
});
Plan.hasMany(especialista_1.default);
especialista_1.default.belongsTo(Plan);
exports.default = Plan;
//# sourceMappingURL=planes.js.map