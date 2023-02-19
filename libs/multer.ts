import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import { Request } from 'express';


const filter = (req:Request,file:any,cb:any)=>{
    //validar archivo
    let error = null;
    let isValid=false;
    const partesFileName = file.originalname.split('.');
    const type = partesFileName[partesFileName.length-1];
    if ( ['jpg','jpeg','gif','svg','png','gif','mp3','mp4','pdf'].includes(type.toLowerCase())){
        isValid = true;                   
    }else{
        error= Error('No es un tipo correcto');
        cb(error,isValid);
    }
    cb(null,isValid);
}

const s3 =new aws.S3({
    accessKeyId:process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||'',
    endpoint:'fra1.digitaloceanspaces.com',                                               
})


export const uploadAvatarEspecialista = multer({
    fileFilter:filter,
    storage:multerS3({
        s3:s3,
        bucket:'nativos-tierra-space',        
        contentType:multerS3.AUTO_CONTENT_TYPE,
        acl:'public-read',
    
        key:(req:Request, file, callback):any => {
            
            const id = req.especialistaAutenticado;
            const path = `especialistas/${id}/profile`;
            
            //console.log('file data',file);            
            const partesFileName = file.originalname.split('.');
            const fileName = `${path}/avatar-${id}.${partesFileName[partesFileName.length-1]}`;
            req.urlAvatar=fileName;
            callback(null,fileName);
        },
    })
}).single('file')


export const uploadVideoEspecialista = multer({
    fileFilter:filter,
    storage:multerS3({
        s3:s3,
        bucket:'nativos-tierra-space',        
        contentType:multerS3.AUTO_CONTENT_TYPE,
        acl:'public-read',
    
        key:(req:Request, file, callback):any => {
            
            const id = req.especialistaAutenticado;
            const path = `especialistas/${id}/profile`;
            
            //console.log('file data',file);            
            const partesFileName = file.originalname.split('.');
            const fileName = `${path}/video-${id}.${partesFileName[partesFileName.length-1]}`;
            req.urlVideo=fileName;
            callback(null,fileName);
        },
    })
}).single('file')

export const uploadEventoImagen = multer({
    fileFilter:filter,
    storage:multerS3({
        s3:s3,
        bucket:'nativos-tierra-space',        
        contentType:multerS3.AUTO_CONTENT_TYPE,
        acl:'public-read',
    
        key:(req:Request, file, callback):any => {
            
            const id = req.params.id
            const path = `eventos/${id}`;
            
            //console.log('file data',file);            
            const partesFileName = file.originalname.split('.');
            const fileName = `${path}/imagen-${id}.${partesFileName[partesFileName.length-1]}`;
            req.urlImagenEvento=fileName;
            callback(null,fileName);
        },
    })
}).single('file')

export const uploadEventoInfo = multer({
    fileFilter:filter,
    storage:multerS3({
        s3:s3,
        bucket:'nativos-tierra-space',        
        contentType:multerS3.AUTO_CONTENT_TYPE,
        acl:'public-read',
    
        key:(req:Request, file, callback):any => {
            
            const id = req.params.id
            const path = `eventos/${id}`;
            
            //console.log('file data',file);            
            const partesFileName = file.originalname.split('.');
            const fileName = `${path}/info-${id}.${partesFileName[partesFileName.length-1]}`;
            req.urlInfoEvento=fileName;
            callback(null,fileName);
        },
    })
}).single('file')




