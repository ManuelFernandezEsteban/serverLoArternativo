import express, {Application} from 'express';
import cors from 'cors';

import especialistasRoutes from '../routes/especialista.route';
import actividadesRoutes from '../routes/actividades.route';
import planesRoutes from '../routes/planes.route';
import sponsorsRoutes from '../routes/sponsor.route';
import eventosRoutes from '../routes/eventos.route'
import authRoutes from '../routes/auth.route';
import uploadsRoutes from '../routes/uploads.route';
import db from '../db/connection';



class Server{

    private app:Application;
    private port:string;
    private apiPaths={
        especialistas:'/api/especialistas',
        actividades:'/api/actividades',
        planes:'/api/planes',
        sponsors:'/api/sponsors',
        eventos:'/api/eventos',
        auth:'/api/auth',
        uploads:'/api/uploads'
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

        this.app.use(express.static('public'));

    }


    routes(){

        this.app.use(this.apiPaths.especialistas,especialistasRoutes);
        this.app.use(this.apiPaths.actividades,actividadesRoutes);
        this.app.use(this.apiPaths.planes,planesRoutes);
        this.app.use(this.apiPaths.sponsors,sponsorsRoutes);
        this.app.use(this.apiPaths.eventos,eventosRoutes);
        this.app.use(this.apiPaths.auth,authRoutes);
        this.app.use(this.apiPaths.uploads,uploadsRoutes);
    }

    listen(){

        this.app.listen(this.port,()=>{
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        })
    }
    
}

export default Server;