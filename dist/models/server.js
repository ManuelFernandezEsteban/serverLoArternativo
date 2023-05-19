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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const especialista_route_1 = __importDefault(require("../routes/especialista.route"));
const actividades_route_1 = __importDefault(require("../routes/actividades.route"));
const monedas_routes_1 = __importDefault(require("../routes/monedas.routes"));
const planes_route_1 = __importDefault(require("../routes/planes.route"));
const sponsor_route_1 = __importDefault(require("../routes/sponsor.route"));
const eventos_route_1 = __importDefault(require("../routes/eventos.route"));
const auth_route_1 = __importDefault(require("../routes/auth.route"));
const newsletter_routes_1 = __importDefault(require("../routes/newsletter.routes"));
const contacto_routes_1 = __importDefault(require("../routes/contacto.routes"));
const uploads_route_1 = __importDefault(require("../routes/uploads.route"));
const landing_routes_1 = __importDefault(require("../routes/landing.routes"));
const herramientas_routes_1 = __importDefault(require("../routes/herramientas.routes"));
const checkout_routes_1 = __importDefault(require("../routes/checkout.routes"));
const stripe_webhook_route_1 = __importDefault(require("../routes/stripe-webhook.route"));
const clientes_routes_1 = __importDefault(require("../routes/clientes.routes"));
const validar_compras_route_1 = __importDefault(require("../routes/validar-compras.route"));
const subscriptions_routes_1 = __importDefault(require("../routes/subscriptions.routes"));
const connection_1 = __importDefault(require("../db/connection"));
class Server {
    constructor() {
        this.allowedExt = [
            '.js',
            '.ico',
            '.css',
            '.png',
            '.jpg',
            '.woff2',
            '.woff',
            '.ttf',
            '.svg',
        ];
        this.landingPaths = {
            landing: '/landing/'
        };
        this.apiPaths = {
            especialistas: '/api/especialistas',
            actividades: '/api/actividades',
            monedas: '/api/monedas',
            planes: '/api/planes',
            sponsors: '/api/sponsors',
            eventos: '/api/eventos',
            auth: '/api/auth',
            newsletter: '/api/newsletter',
            contacto: '/api/contacto',
            uploads: '/api/uploads',
            herramientas: '/api/herramientas',
            new_password: '/auth/new-password/:tk',
            checkout: '/api/checkout',
            webhook_stripe: '/stripe-webhooks',
            clientes: '/api/clientes',
            validar_compras: '/api/validar-compras',
            subscriptions: '/api/subscriptions'
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '8000';
        this.server = new http_1.default.Server(this.app);
        this.io = new socket_io_1.default.Server(this.server, { cors: { origin: true, credentials: true } });
        /* this.io = require('socket.io')(this.server,{
             cors:{
                 origin:process.env.URL_SOCKET_ORIGIN_DEV,
                 methods:["GET","POST"]
             }
         });*/
        //APLICAR HELMET
        //this.app.use(helmet());
        //conexion a la base de datos
        this.dbConnection();
        //middlewares
        this.middlewares();
        //definir rutas
        this.routes();
        //definir sockets
        //this.sockets();
    }
    static get instance() {
        return this._instance || (this._instance = new this);
    }
    //TODO: Conectar la base de datos
    dbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_1.default.authenticate();
                console.log('Database online');
            }
            catch (err) {
                console.log(err);
                //throw new Error(err);
            }
        });
    }
    middlewares() {
        //cors   
        this.app.use((0, cors_1.default)());
        //Carpeta pública
        this.app.use(express_1.default.static('./public/app'));
        // 
    }
    routes() {
        this.app.use(this.apiPaths.especialistas, express_1.default.json(), especialista_route_1.default);
        this.app.use(this.apiPaths.actividades, express_1.default.json(), actividades_route_1.default);
        this.app.use(this.apiPaths.monedas, express_1.default.json(), monedas_routes_1.default);
        this.app.use(this.apiPaths.planes, express_1.default.json(), planes_route_1.default);
        this.app.use(this.apiPaths.sponsors, express_1.default.json(), sponsor_route_1.default);
        this.app.use(this.apiPaths.eventos, express_1.default.json(), eventos_route_1.default);
        this.app.use(this.apiPaths.auth, express_1.default.json(), auth_route_1.default);
        this.app.use(this.apiPaths.newsletter, express_1.default.json(), newsletter_routes_1.default);
        this.app.use(this.apiPaths.contacto, express_1.default.json(), contacto_routes_1.default);
        this.app.use(this.apiPaths.uploads, express_1.default.json(), uploads_route_1.default);
        this.app.use(this.apiPaths.herramientas, express_1.default.json(), herramientas_routes_1.default);
        this.app.use(this.landingPaths.landing, express_1.default.json(), landing_routes_1.default);
        this.app.use(this.apiPaths.checkout, express_1.default.json(), checkout_routes_1.default);
        this.app.use(this.apiPaths.clientes, express_1.default.json(), clientes_routes_1.default);
        this.app.use(this.apiPaths.webhook_stripe, stripe_webhook_route_1.default);
        this.app.use(this.apiPaths.validar_compras, express_1.default.json(), validar_compras_route_1.default);
        this.app.use(this.apiPaths.subscriptions, express_1.default.json(), subscriptions_routes_1.default);
        this.app.get('*', (req, res) => {
            if (this.allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
                res.sendFile(path_1.default.resolve(`public/app/${req.url}`));
            }
            else {
                res.sendFile(path_1.default.resolve('public/app/index.html'));
            }
        });
    }
    /* sockets(){
 
         
         console.log('Escuchando conexiones');
 
         this.io.on('connection',cliente =>{
             console.log('cliente conectado ',cliente.id)
             //desconectar
             socketController.desconectar(cliente);
             socketController.listenSesionCompra(cliente,this.io);
             socketController.eviarCompraFinalizada(this.io,'');
         })
 
 
     }*/
    listen() {
        this.server.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map