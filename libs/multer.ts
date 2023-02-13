import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import { Request } from 'express';

export const upload = multer({
    fileFilter:(req:Request,file,cb)=>{
        //validar archivo
        let error = null;
        let isValid=true;
/*        console.log('file data',file);
        if (file.fieldname.toLowerCase() in ['jpg','jpeg','gif','svg','png','gif',]){
            isValid = true;                   
        }*/
        cb(null,isValid);
    },
    storage:multerS3({
        s3:new aws.S3({
            accessKeyId:process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||'',
            endpoint:'fra1.digitaloceanspaces.com',            
                       
        }),
        bucket:'nativos-tierra-space',        
        contentType:multerS3.AUTO_CONTENT_TYPE,
        acl:'public-read',
        key:(req:Request, file, callback):any => {
            console.log('file data',file);
            const fileName = file.originalname;
            callback(null,fileName);
        },
    })
}).single('file');

































/*
const {S3_ENDPOINT} = process.env;
const spEndPoint = new aws.Endpoint(process.env.S3_ENDPOINT||'')

export const s3 = new aws.S3({
    endpoint:spEndPoint      
});

export const upload =  multer({
    storage:multerS3({
        s3:s3,
        bucket:'nativos-tierra-space',
        acl:'public-read',
        metadata:(req,file,cb)=>{
            cb(null,{
                fieldname:file.fieldname
            })
        },
        key:(req,file,cb)=>{
            console.log(file);
            cb(null,file.originalname);
        }

    })
}).single('upload');

export default {s3,upload}
*/