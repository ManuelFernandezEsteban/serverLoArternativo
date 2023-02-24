"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generarJWT = (id) => {
    return jsonwebtoken_1.default.sign({ id: id }, process.env.SECRETPRIVATEKEY || '', { expiresIn: '4h' });
};
exports.generarJWT = generarJWT;
//# sourceMappingURL=generar-JWT.js.map