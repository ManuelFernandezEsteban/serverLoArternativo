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
exports.deleteProductEvento = exports.updateProductEvento = exports.createProductEvento = exports.desactivarPrice = exports.createPrice = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15'
});
const createPrice = (idProductEvent, precio, moneda) => __awaiter(void 0, void 0, void 0, function* () {
    let currency = 'eur';
    let priceId = '';
    if (moneda === 2) {
        currency = 'usd';
    }
    try {
        const price = yield stripe.prices.create({
            unit_amount: precio * 100,
            currency,
            tax_behavior: 'inclusive',
            product: idProductEvent
        });
        priceId = price.id;
    }
    catch (error) {
        console.log(error);
    }
    return priceId;
});
exports.createPrice = createPrice;
const desactivarPrice = (idPriceEvent) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const price = yield stripe.prices.update(idPriceEvent, {
            active: false
        });
        return price.id;
    }
    catch (error) {
        console.log(error);
    }
});
exports.desactivarPrice = desactivarPrice;
const createProductEvento = (evento) => __awaiter(void 0, void 0, void 0, function* () {
    //let image = process.env.ImagenEvento||'';
    //console.log(image);
    try {
        const product = yield stripe.products.create({
            name: evento.dataValues.evento,
            description: evento.dataValues.descripcion,
            //images: [image]
        });
        return product.id;
    }
    catch (error) {
        throw new Error('Error al crear el producto para el evento ' + evento.dataValues.id);
    }
});
exports.createProductEvento = createProductEvento;
const updateProductEvento = (evento) => __awaiter(void 0, void 0, void 0, function* () {
    //let image = process.env.ImagenEvento||'';
    //console.log(image);
    if (evento.dataValues.idProductEvent) {
        try {
            const existeProd = yield stripe.products.retrieve(evento.dataValues.idProductEvent);
            if (existeProd) {
                const product = yield stripe.products.update(evento.dataValues.idProductEvent, {
                    name: evento.dataValues.evento,
                    description: evento.dataValues.descripcion,
                    //                  images:[image]
                });
            }
        }
        catch (error) {
            throw new Error(`Error al actualizar el producto evento ${evento.dataValues.id}`);
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