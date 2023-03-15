"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const eventos_1 = __importDefault(require("./eventos"));
const Especialista = connection_1.default.define('Especialistas', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false
    },
    apellidos: {
        type: sequelize_1.DataTypes.STRING(80)
    },
    telefono: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING(80),
        allowNull: false,
        unique: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    descripcion_terapia: {
        type: sequelize_1.DataTypes.TEXT
    },
    direccion: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    provincia: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    localidad: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    codigo_postal: {
        type: sequelize_1.DataTypes.STRING(6)
    },
    pais: {
        type: sequelize_1.DataTypes.STRING(30)
    },
    video: {
        type: sequelize_1.DataTypes.STRING(150)
    },
    imagen: {
        type: sequelize_1.DataTypes.STRING(150)
    },
    token_pago: {
        type: sequelize_1.DataTypes.STRING(200)
    },
    twitter: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    facebook: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    instagram: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    you_tube: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    web: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    fecha_pago_actual: {
        type: sequelize_1.DataTypes.DATE
    },
    fecha_fin_suscripcion: {
        type: sequelize_1.DataTypes.DATE
    },
    privacidad: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    condiciones: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE
    },
    resetToken: {
        type: sequelize_1.DataTypes.STRING(255)
    }
}, {
    paranoid: true // soft delete
});
Especialista.hasMany(eventos_1.default);
eventos_1.default.belongsTo(Especialista);
exports.default = Especialista;
//# sourceMappingURL=especialista.js.map