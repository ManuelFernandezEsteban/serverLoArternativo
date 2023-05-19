"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db = new sequelize_1.Sequelize('DB-nativos-tierra', 'nativos-tierra', 'AVNS_UjHl8s8ClOhOFlsZ7Wp', {
    host: 'nativos-tierra-db-do-user-13555636-0.b.db.ondigitalocean.com',
    dialect: 'mysql',
    logging: false,
    port: 25060
});
exports.default = db;
//# sourceMappingURL=connection.js.map