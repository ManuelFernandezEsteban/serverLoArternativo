import express, {Application} from 'express';
import cors from 'cors';
import path from 'path';

import especialistasRoutes from '../routes/especialista.route';
import actividadesRoutes from '../routes/actividades.route';
import planesRoutes from '../routes/planes.route';
import sponsorsRoutes from '../routes/sponsor.route';
import eventosRoutes from '../routes/eventos.route'
import authRoutes from '../routes/auth.route';
import newsletterRoutes from '../routes/newsletter.routes';
import contactoRoutes from '../routes/contacto.routes';
import uploadsRoutes from '../routes/uploads.route';
import landingRoutes from '../routes/landing.routes'
import db from '../db/connection';



class Server{

    private app:Application;
    private port:string;
    private landingPaths={
        landing:'/landing/'
    }
    private apiPaths={
        especialistas:'/api/especialistas',
        actividades:'/api/actividades',
        planes:'/api/planes',
        sponsors:'/api/sponsors',
        eventos:'/api/eventos',
        auth:'/api/auth',
        newsletter:'/api/newsletter',
        contacto:'/api/contacto',
        uploads:'/api/uploads',
        new_password:'/auth/new-password/:tk'
    }

    constructor(){
        this.app=express();
        this.port=process.env.PORT || '8000';

        //conexion a la base de datos

        this.dbConnection();

        //middlewares

        this.middlewares();

        //definir rutas
        this.routes();

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

        //lectura body
        this.app.use(express.json());

        //Carpeta pública

        //this.app.use(express.static('public'));

    }


    routes(){

        this.app.use(this.apiPaths.especialistas,especialistasRoutes);
        this.app.use(this.apiPaths.actividades,actividadesRoutes);
        this.app.use(this.apiPaths.planes,planesRoutes);
        this.app.use(this.apiPaths.sponsors,sponsorsRoutes);
        this.app.use(this.apiPaths.eventos,eventosRoutes);
        this.app.use(this.apiPaths.auth,authRoutes);
        this.app.use(this.apiPaths.newsletter,newsletterRoutes);
        this.app.use(this.apiPaths.contacto,contactoRoutes);
        this.app.use(this.apiPaths.uploads,uploadsRoutes);
        this.app.use(this.landingPaths.landing,landingRoutes);
        this.app.use(this.apiPaths.new_password,(req,res)=>{
            let root = path.join(__dirname,'./public/new-password/index.html');            
            res.sendFile(root);
        })
    }

    listen(){

        this.app.listen(this.port,()=>{
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        })
    }
    
}

export default Server;