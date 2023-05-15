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
exports.deleteFolder = exports.createFolder = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const createFolder = (folder) => {
    const spaceEndpoint = new aws_sdk_1.default.Endpoint(process.env.S3_ENDPOINT || '');
    const s3 = new aws_sdk_1.default.S3({
        endpoint: spaceEndpoint,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    });
    let params = {
        Bucket: process.env.SPACE_DO || '',
        Key: `${folder}/`,
    };
    s3.putObject(params, (err, data) => {
        if (err)
            console.log('error en el folder', err, err.stack);
        else
            console.log(data);
    });
};
exports.createFolder = createFolder;
const deleteFolder = (folder) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const key = `${folder}`;
    //console.log(key)
    const spaceEndpoint = new aws_sdk_1.default.Endpoint(process.env.S3_ENDPOINT || '');
    const s3 = new aws_sdk_1.default.S3({
        endpoint: spaceEndpoint,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        signatureVersion: 'v4'
    });
    let params = {
        Bucket: process.env.SPACE_DO || '',
        Prefix: key
    };
    const listedObjects = yield s3.listObjects(params).promise();
    if (((_a = listedObjects.Contents) === null || _a === void 0 ? void 0 : _a.length) === 0) {
        return;
    }
    //console.log(listedObjects.Contents);
    (_b = listedObjects.Contents) === null || _b === void 0 ? void 0 : _b.forEach(item => {
        s3.deleteObject({ Bucket: process.env.SPACE_DO || '', Key: item.Key || '' }, (err, data) => {
            console.log(err);
            //console.log(data);
        });
    });
    s3.deleteObject({ Bucket: process.env.SPACE_DO || '', Key: key || '' }, (err, data) => {
        console.log(err);
        //console.log(data);
    });
});
exports.deleteFolder = deleteFolder;
//# sourceMappingURL=createFolder.js.map