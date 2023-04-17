import express, {Application, Request} from 'express';
import cors from 'cors';
import socketIO from 'socket.io'
import http from 'http';
import path from 'path';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();

import especialistasRoutes from '../routes/especialista.route';
import actividadesRoutes from '../routes/actividades.route';
import monedasRoutes from '../routes/monedas.routes';
import planesRoutes from '../routes/planes.route';
import sponsorsRoutes from '../routes/sponsor.route';
import eventosRoutes from '../routes/eventos.route'
import authRoutes from '../routes/auth.route';
import newsletterRoutes from '../routes/newsletter.routes';
import contactoRoutes from '../routes/contacto.routes';
import uploadsRoutes from '../routes/uploads.route';
import landingRoutes from '../routes/landing.routes';
import herramientas from '../routes/herramientas.routes';
import checkoutRoutes from '../routes/checkout.routes';
import stripe_webhook from '../routes/stripe-webhook.route';
import clientesRoutes from '../routes/clientes.routes';
import validarCompras from '../routes/validar-compras.route'
import subscription from '../routes/subscriptions.routes';
import db from '../db/connection';
import * as socketController  from '../sockets/controller';



class Server{

    private static _instance:Server;

    allowedExt = [
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

    private server: http.Server;  
    public io: socketIO.Server;
    
    private app:Application;
    private port:string;
    private landingPaths={
        landing:'/landing/'
    }
    private apiPaths={
        especialistas:'/api/especialistas',
        actividades:'/api/actividades',
        monedas:'/api/monedas',
        planes:'/api/planes',
        sponsors:'/api/sponsors',
        eventos:'/api/eventos',
        auth:'/api/auth',
        newsletter:'/api/newsletter',
        contacto:'/api/contacto',
        uploads:'/api/uploads',
        herramientas:'/api/herramientas',
        new_password:'/auth/new-password/:tk',
        checkout:'/api/checkout',
        webhook_stripe:'/stripe-webhooks',
        clientes:'/api/clientes',
        validar_compras:'/api/validar-compras',
        subscriptions:'/api/subscriptions'
    }

    private constructor(){
        this.app=express();
        this.port=process.env.PORT || '8000';
        this.server=new http.Server(this.app);
        this.io = new socketIO.Server( this.server, { cors: { origin: true, credentials: true } } );


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

    public static get instance(){
        return this._instance || (this._instance=new this);

    }
    //TODO: Conectar la base de datos

    async dbConnection (){

        try {

            await db.authenticate();
            console.log('Database online');
            
        } catch (err) {
            console.log(err)
            //throw new Error(err);
            
        }

    }

    middlewares(){

        //cors   
        this.app.use(cors());

        //Carpeta pública
        this.app.use(express.static('./public/app'));
        // 

    }  


    routes(){      

        this.app.use(this.apiPaths.especialistas,express.json(),especialistasRoutes);
        this.app.use(this.apiPaths.actividades,express.json(),actividadesRoutes);
        this.app.use(this.apiPaths.monedas,express.json(),monedasRoutes);
        this.app.use(this.apiPaths.planes,express.json(),planesRoutes);
        this.app.use(this.apiPaths.sponsors,express.json(),sponsorsRoutes);
        this.app.use(this.apiPaths.eventos,express.json(),eventosRoutes);
        this.app.use(this.apiPaths.auth,express.json(),authRoutes);
        this.app.use(this.apiPaths.newsletter,express.json(),newsletterRoutes); 
        this.app.use(this.apiPaths.contacto,express.json(),contactoRoutes);
        this.app.use(this.apiPaths.uploads,express.json(),uploadsRoutes);
        this.app.use(this.apiPaths.herramientas,express.json(),herramientas)
        this.app.use(this.landingPaths.landing,express.json(),landingRoutes);
        this.app.use(this.apiPaths.checkout, express.json(),checkoutRoutes);        
        this.app.use(this.apiPaths.clientes,express.json() ,clientesRoutes);
        this.app.use(this.apiPaths.webhook_stripe,stripe_webhook);
        this.app.use(this.apiPaths.validar_compras,express.json(),validarCompras);
        this.app.use(this.apiPaths.subscriptions,express.json(),subscription);
        this.app.get('*', (req, res) => {
            if (this.allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
              res.sendFile(path.resolve(`public/app/${req.url}`));
            } else {
              res.sendFile(path.resolve('public/app/index.html'));
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
  
    listen(){

        this.server.listen(this.port,()=>{
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        })
    }
     
}
 
export default Server;
