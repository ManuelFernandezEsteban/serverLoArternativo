"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const NewsLetter = connection_1.default.define('Newsletter', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(255)
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255)
    },
    privacidad: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    ip: {
        type: sequelize_1.DataTypes.STRING(255)
    },
    info_comercial: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE
    }
});
exports.default = NewsLetter;
//# sourceMappingURL=newsletter.js.map