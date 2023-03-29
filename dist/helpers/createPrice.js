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
exports.deleteProductEvento = exports.updateProductEvento = exports.createProductEvento = exports.createPriceEvento = void 0;
const stripe_1 = __importDefault(require("stripe"));
//import Evento from '../models/eventos';
const stripe = new stripe_1.default('sk_test_51MdWNyH0fhsN0DplHuBpE5C4jNFyPTVJfYz6kxTFeMmaQ94Uqjou6MuH8SwpB82nc56vnTHAyoZjazLTX8Iigk5z000zusfDjr', {
    apiVersion: '2022-11-15'
});
const createPriceEvento = (idProductEvent, precio, moneda) => __awaiter(void 0, void 0, void 0, function* () {
    let currency = 'eur';
    if (moneda === 2) {
        currency = 'usd';
    }
    try {
        const price = yield stripe.prices.create({
            unit_amount: precio * 100,
            currency,
            product: idProductEvent
        });
        return price.id;
    }
    catch (error) {
        console.log(error);
    }
});
exports.createPriceEvento = createPriceEvento;
const createProductEvento = (evento) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield stripe.products.create({
            name: evento.evento,
            description: evento.descripcion,
        });
        return product.id;
    }
    catch (error) {
        throw new Error('Error al crear el producto para el evento ' + evento.id);
    }
});
exports.createProductEvento = createProductEvento;
const updateProductEvento = (evento) => __awaiter(void 0, void 0, void 0, function* () {
    if (evento.idProductEvent) {
        try {
            const existeProd = yield stripe.products.retrieve(evento.idProductEvent);
            if (existeProd) {
                const product = yield stripe.products.update(evento.idProductEvent, {
                    name: evento.evento,
                    description: evento.descripcion,
                });
            }
        }
        catch (error) {
            throw new Error('Error al actualizar el producto evento ' + evento.id);
        }
    }
});
exports.updateProductEvento = updateProductEvento;
const deleteProductEvento = (idProductEvento) => __awaiter(void 0, void 0, void 0, function* () {
    if (idProductEvento) {
        console.log(idProductEvento);
        try {
            const existeProd = yield stripe.products.retrieve(idProductEvento);
            if (existeProd) {
                const product = yield stripe.products.del(idProductEvento);
            }
        }
        catch (error) {
            throw new Error('Error al eliminar el producto evento ' + idProductEvento);
        }
    }
});
exports.deleteProductEvento = deleteProductEvento;
//# sourceMappingURL=createPrice.js.map