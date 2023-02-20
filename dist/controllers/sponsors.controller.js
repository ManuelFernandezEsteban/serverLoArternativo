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
exports.getSponsor = exports.getSponsors = void 0;
const sponsors_1 = __importDefault(require("../models/sponsors"));
const getSponsors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tipo } = req.params;
    const sponsors = yield sponsors_1.default.findAll({
        where: {
            tipo: tipo
        }
    });
    res.json({
        sponsors
    });
});
exports.getSponsors = getSponsors;
const getSponsor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const sponsor = yield sponsors_1.default.findByPk(id);
    if (sponsor) {
        res.json({
            sponsor
        });
    }
    else {
        res.status(404).json({
            msg: `No existe un sponsor con id ${id}`
        });
    }
});
exports.getSponsor = getSponsor;
//# sourceMappingURL=sponsors.controller.js.map