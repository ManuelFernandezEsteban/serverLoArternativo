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
const especialista_route_1 = __importDefault(require("../routes/especialista.route"));
const actividades_route_1 = __importDefault(require("../routes/actividades.route"));
const planes_route_1 = __importDefault(require("../routes/planes.route"));
const sponsor_route_1 = __importDefault(require("../routes/sponsor.route"));
const eventos_route_1 = __importDefault(require("../routes/eventos.route"));
const auth_route_1 = __importDefault(require("../routes/auth.route"));
const newsletter_routes_1 = __importDefault(require("../routes/newsletter.routes"));
const contacto_routes_1 = __importDefault(require("../routes/contacto.routes"));
const uploads_route_1 = __importDefault(require("../routes/uploads.route"));
const landing_routes_1 = __importDefault(require("../routes/landing.routes"));
const connection_1 = __importDefault(require("../db/connection"));
class Server {
    constructor() {
        this.landingPaths = {
            landing: '/landing/'
        };
        this.apiPaths = {
            especialistas: '/api/especialistas',
            actividades: '/api/actividades',
            planes: '/api/planes',
            sponsors: '/api/sponsors',
            eventos: '/api/eventos',
            auth: '/api/auth',
            newsletter: '/api/newsletter',
            contacto: '/api/contacto',
            uploads: '/api/uploads',
            new_password: '/auth/new-password/:tk'
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '8000';
        //conexion a la base de datos
        this.dbConnection();
        //middlewares
        this.middlewares();
        //definir rutas
        this.routes();
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
        //lectura body
        this.app.use(express_1.default.json());
        //Carpeta pública
        this.app.use(express_1.default.static('./public'));
        // 
    }
    routes() {
        this.app.use(this.apiPaths.especialistas, especialista_route_1.default);
        this.app.use(this.apiPaths.actividades, actividades_route_1.default);
        this.app.use(this.apiPaths.planes, planes_route_1.default);
        this.app.use(this.apiPaths.sponsors, sponsor_route_1.default);
        this.app.use(this.apiPaths.eventos, eventos_route_1.default);
        this.app.use(this.apiPaths.auth, auth_route_1.default);
        this.app.use(this.apiPaths.newsletter, newsletter_routes_1.default);
        this.app.use(this.apiPaths.contacto, contacto_routes_1.default);
        this.app.use(this.apiPaths.uploads, uploads_route_1.default);
        this.app.use(this.landingPaths.landing, landing_routes_1.default);
        /* this.app.use(this.apiPaths.new_password,(req,res)=>{
             this.app.use(express.static('public/new-password/index.html'));
         })*/
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map