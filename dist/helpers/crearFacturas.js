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
exports.crearFactura = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const stripe_1 = __importDefault(require("stripe"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15'
});
const crearFactura = (idStripe, days = 0, precios, descripcion) => __awaiter(void 0, void 0, void 0, function* () {
    if (idStripe) {
        const date = new Date(Date.now());
        console.log(date);
        const factura = yield stripe.invoices.create({
            collection_method: 'send_invoice',
            customer: idStripe,
            days_until_due: days,
            description: descripcion,
            automatic_tax: { enabled: true },
        });
        precios.forEach((precio) => __awaiter(void 0, void 0, void 0, function* () {
            const lineaFactura = yield stripe.invoiceItems.create({
                customer: idStripe,
                price: precio,
                invoice: factura.id,
                quantity: 1,
            });
        }));
        yield stripe.invoices.finalizeInvoice(factura.id);
        // await stripe.invoices.sendInvoice(factura.id);
        //await stripe.invoices.pay(factura.id);
        console.log(factura.id);
        //return factura.invoice_pdf;
    }
});
exports.crearFactura = crearFactura;
/*
export const crearFacturaComision = async (idStripe:string,days:number=0,idPrice:string)=>{

    if (idStripe) {
        const date = new Date(Date.now());
        console.log(date);
        const factura = await stripe.invoices.create({
            collection_method: 'send_invoice',
            customer: idStripe,
            days_until_due: days

        });
        const lineaFactura = await stripe.invoiceItems.create({
            customer: idStripe,
            price: idPrice,
            invoice: factura.id,
            quantity: 1,
        })

        await stripe.invoices.finalizeInvoice(factura.id);
        await stripe.invoices.sendInvoice(factura.id);
    }

}
*/ 
//# sourceMappingURL=crearFacturas.js.map