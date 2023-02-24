"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadEventoInfo = exports.uploadEventoImagen = exports.uploadVideoEspecialista = exports.uploadAvatarEspecialista = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const filter = (req, file, cb) => {
    //validar archivo
    let error = null;
    let isValid = false;
    const partesFileName = file.originalname.split('.');
    const type = partesFileName[partesFileName.length - 1];
    if (['jpg', 'jpeg', 'gif', 'svg', 'png', 'gif', 'mp3', 'mp4', 'pdf'].includes(type.toLowerCase())) {
        isValid = true;
    }
    else {
        error = Error('No es un tipo correcto');
        cb(error, isValid);
    }
    cb(null, isValid);
};
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    endpoint: 'fra1.digitaloceanspaces.com',
});
exports.uploadAvatarEspecialista = (0, multer_1.default)({
    fileFilter: filter,
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: 'nativos-tierra-space',
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, callback) => {
            const id = req.especialistaAutenticado;
            const path = `especialistas/${id}/profile`;
            //console.log('file data',file);            
            const partesFileName = file.originalname.split('.');
            const fileName = `${path}/avatar-${id}.${partesFileName[partesFileName.length - 1]}`;
            req.urlAvatar = fileName;
            callback(null, fileName);
        },
    })
}).single('file');
exports.uploadVideoEspecialista = (0, multer_1.default)({
    fileFilter: filter,
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: 'nativos-tierra-space',
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, callback) => {
            const id = req.especialistaAutenticado;
            const path = `especialistas/${id}/profile`;
            //console.log('file data',file);            
            const partesFileName = file.originalname.split('.');
            const fileName = `${path}/video-${id}.${partesFileName[partesFileName.length - 1]}`;
            req.urlVideo = fileName;
            callback(null, fileName);
        },
    })
}).single('file');
exports.uploadEventoImagen = (0, multer_1.default)({
    fileFilter: filter,
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: 'nativos-tierra-space',
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, callback) => {
            const id = req.params.id;
            const path = `eventos/${id}`;
            //console.log('file data',file);            
            const partesFileName = file.originalname.split('.');
            const fileName = `${path}/imagen-${id}.${partesFileName[partesFileName.length - 1]}`;
            req.urlImagenEvento = fileName;
            callback(null, fileName);
        },
    })
}).single('file');
exports.uploadEventoInfo = (0, multer_1.default)({
    fileFilter: filter,
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: 'nativos-tierra-space',
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, callback) => {
            const id = req.params.id;
            const path = `eventos/${id}`;
            //console.log('file data',file);            
            const partesFileName = file.originalname.split('.');
            const fileName = `${path}/info-${id}.${partesFileName[partesFileName.length - 1]}`;
            req.urlInfoEvento = fileName;
            callback(null, fileName);
        },
    })
}).single('file');
//# sourceMappingURL=multer.js.map