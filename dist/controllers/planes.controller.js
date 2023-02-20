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
exports.getPlanes = exports.getPlan = void 0;
const planes_1 = __importDefault(require("../models/planes"));
const getPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const plan = yield planes_1.default.findByPk(id);
    if (plan) {
        res.json({
            plan
        });
    }
    else {
        res.status(404).json({
            msg: `No existe un plan con id ${id}`
        });
    }
});
exports.getPlan = getPlan;
const getPlanes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const planes = yield planes_1.default.findAll();
    res.json({ planes });
});
exports.getPlanes = getPlanes;
//# sourceMappingURL=planes.controller.js.map