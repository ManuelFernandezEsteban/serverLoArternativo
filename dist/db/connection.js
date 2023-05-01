"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db = new sequelize_1.Sequelize('db-nativos-tierra', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    port: 3306
});
exports.default = db;
//# sourceMappingURL=connection.js.map