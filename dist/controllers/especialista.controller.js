"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCuentaConectada = exports.crearCuentaConectada = exports.deleteEspecialista = exports.putEspecialista = exports.postEspecialista = exports.getEspecialista = exports.getEspecialistas = exports.getEspecialistasPagination = void 0;
const sequelize_1 = require("sequelize");
const actividades_1 = __importDefault(require("../models/actividades"));
const especialista_1 = __importDefault(require("../models/especialista"));
const planes_1 = __importDefault(require("../models/planes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generar_JWT_1 = require("../helpers/generar-JWT");
const send_mail_1 = require("../helpers/send-mail");
const plantilla_mail_1 = require("../helpers/plantilla-mail");
const createFolder_1 = require("../helpers/createFolder");
const usa_herramientas_1 = __importDefault(require("../models/usa_herramientas"));
const dotenv_1 = __importDefault(require("dotenv"));
const stripe_1 = __importDefault(require("stripe"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15'
});
const getEspecialistasPagination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { especialidad } = req.params;
    let { limit = 5, desde = 0 } = req.query;
    if (limit) {
        if (isNaN(parseInt(limit))) {
            limit = 5;
        }
    }
    if (desde) {
        if (isNaN(parseInt(desde))) {
            desde = 0;
        }
    }
    const { count, rows } = yield especialista_1.default.findAndCountAll({
        attributes: { exclude: ['password'] },
        include: [actividades_1.default, planes_1.default, usa_herramientas_1.default],
        where: {
            actividadeId: especialidad
        },
        order: ['createdAt', 'DESC'],
        group: 'PlaneId',
        offset: Number(desde),
        limit: Number(limit)
    });
    const especialistas = rows;
    res.json({
        especialistas,
        count
    });
});
exports.getEspecialistasPagination = getEspecialistasPagination;
const getEspecialistas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { especialidad } = req.params;
    const { rows, count } = yield especialista_1.default.findAndCountAll({
        attributes: { exclude: ['password'] },
        include: [actividades_1.default, planes_1.default, usa_herramientas_1.default],
        where: {
            actividadeId: especialidad,
        },
        //group:['planeId']
        order: [
            ['planeId', 'DESC'],
            ['createdAt', 'ASC'],
        ],
    });
    const especialistas = rows;
    res.json({
        especialistas,
        count
    });
});
exports.getEspecialistas = getEspecialistas;
const getEspecialista = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const especialista = yield especialista_1.default.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [actividades_1.default, planes_1.default, usa_herramientas_1.default],
    });
    if (especialista) {
        //especialista.set({password:''});
        res.json({
            especialista
        });
    }
    else {
        res.status(404).json({
            msg: `No existe un usuario con id ${id}`
        });
    }
});
exports.getEspecialista = getEspecialista;
const postEspecialista = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        //Encriptar contraseña y guardar especialista
        const salt = bcryptjs_1.default.genSaltSync();
        const especialista = yield especialista_1.default.create(body);
        yield especialista.set({ password: bcryptjs_1.default.hashSync(body.password, salt) });
        yield especialista.save();
        //especialista.set({ password: '' });
        const token = (0, generar_JWT_1.generarJWT)(especialista.dataValues.id);
        const herramientas = body.UsaHerramientas;
        if (herramientas) {
            if (herramientas.length > 0) {
                herramientas.forEach((herramienta) => __awaiter(void 0, void 0, void 0, function* () {
                    const usaHerrmienta = yield usa_herramientas_1.default.create({
                        EspecialistaId: especialista.dataValues.id,
                        HerramientaId: herramienta,
                        ActividadeId: especialista.dataValues.ActividadeId
                    });
                    yield especialista.save();
                }));
            }
        }
        (0, createFolder_1.createFolder)(`especialistas/${especialista.dataValues.id}`);
        (0, createFolder_1.createFolder)(`especialistas/${especialista.dataValues.id}/profile`);
        yield (0, send_mail_1.sendMail)({
            asunto: 'Registro como especialista en el Portal Web Nativos Tierra',
            nombreDestinatario: body.nombre,
            mailDestinatario: body.email,
            mensaje: `Hola, ${body.nombre} su resgistro ha sido completado`,
            html: (0, plantilla_mail_1.mailRegistro)(especialista.nombre)
        });
        res.json({
            token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error,
        });
    }
});
exports.postEspecialista = postEspecialista;
const putEspecialista = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { id } = req.params;
    const idEspecilistaAutenticado = req.especialistaAutenticado;
    if (idEspecilistaAutenticado !== id) {
        return res.status(500).json({
            msg: 'El token no es válido',
        });
    }
    try {
        const especialista = yield especialista_1.default.findByPk(id);
        if (especialista) {
            if (body.email) {
                const existeEmail = yield especialista_1.default.findOne({
                    where: {
                        email: body.email,
                        [sequelize_1.Op.not]: {
                            id: id
                        }
                    }
                });
                if (existeEmail) {
                    return res.status(400).json({
                        msg: 'Ya existe un especialista con el email ' + body.email
                    });
                }
            }
            try {
                const herramientasAEliminar = yield usa_herramientas_1.default.destroy({
                    where: {
                        EspecialistaId: id
                    }
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error
                });
            }
            yield especialista.update(body);
            yield especialista.save();
            const herramientas = body.UsaHerramientas;
            if (herramientas) {
                if (herramientas.length > 0) {
                    herramientas.forEach((herramienta) => __awaiter(void 0, void 0, void 0, function* () {
                        const usaHerrmienta = yield usa_herramientas_1.default.create({
                            EspecialistaId: especialista.id,
                            HerramientaId: herramienta,
                            ActividadeId: especialista.ActividadeId
                        });
                        yield especialista.save();
                    }));
                }
            }
            res.json({ especialista });
        }
        else {
            return res.status(404).json({
                msg: `El id ${id} no se encuentra en la BD`
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error,
        });
    }
});
exports.putEspecialista = putEspecialista;
const deleteEspecialista = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //soft delete
    const { id } = req.params;
    const especialista = yield especialista_1.default.findByPk(id);
    try {
        if (!especialista) {
            return res.status(404).json({
                msg: 'No existe un especialista con el id ' + id
            });
        }
        yield especialista.destroy();
        res.json({
            id
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error,
        });
    }
});
exports.deleteEspecialista = deleteEspecialista;
/*
export const patchEspecialista = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req;
    const { PlaneId } = body;

    try {
        const especialista = await Especialista.findByPk(id);
        if (!especialista) {
            return res.status(404).json({
                msg: 'No existe un especialista con el id ' + id
            })
        } else {
            //Plata
            if (PlaneId === 1) {
                await especialista.update({ PlaneId: PlaneId });

            } else {
                //oro
                let fecha_fin = new Date(Date.now());
                fecha_fin.setMonth(fecha_fin.getMonth() + 1)

                await sendMail({
                    asunto: 'Registro como especialista en el Portal Web Nativos Tierra',
                    nombreDestinatario: especialista.nombre,
                    mailDestinatario: especialista.email,
                    mensaje: `Hola, ${especialista.nombre} su resgistro ha sido completado`,
                    html: mailPlanOro(especialista.nombre)
                })

                await especialista.update({
                    PlaneId: PlaneId,
                    fecha_pago_actual: new Date(Date.now()),
                    fecha_fin_suscripcion: fecha_fin
                })

            }
        }
        res.json({
            especialista
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error,
        })
    }
}
*/
const crearCuentaConectada = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { callbackUrl } = req.body;
    const link = yield crearConnectedAccount(id, callbackUrl);
    res.json({
        link
    });
});
exports.crearCuentaConectada = crearCuentaConectada;
const crearConnectedAccount = (especialistaId, callbackUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const especialista = yield especialista_1.default.findByPk(especialistaId);
        if (especialista) {
            const account = yield stripe.accounts.create({
                type: 'express',
                country: 'ES',
                email: especialista.email,
                capabilities: {
                    card_payments: {
                        requested: true,
                    },
                    transfers: {
                        requested: true,
                    },
                },
                default_currency: 'eur',
            });
            console.log(account.id);
            yield especialista.update({ cuentaConectada: account.id });
            console.log(especialista.id);
            const accountLink = yield stripe.accountLinks.create({
                account: account.id,
                refresh_url: callbackUrl,
                return_url: callbackUrl,
                type: 'account_onboarding',
            });
            return { accountLink, account: account.id };
        }
    }
    catch (error) {
        console.log(error);
    }
});
const getCuentaConectada = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (id) {
        const cuenta = yield stripe.accounts.retrieve(id);
        res.json({
            cuenta
        });
    }
    else {
        return res.status(400).json({
            msg: 'No tiene cuenta conectada'
        });
    }
});
exports.getCuentaConectada = getCuentaConectada;
//# sourceMappingURL=especialista.controller.js.map