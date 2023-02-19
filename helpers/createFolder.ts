
import aws from 'aws-sdk';

export const createFolder = (folder: string) => {

    const spaceEndpoint = new aws.Endpoint(process.env.S3_ENDPOINT || '');
    const s3 = new aws.S3({
        endpoint: spaceEndpoint,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    });
    let params = {
        Bucket: process.env.SPACE_DO || '',
        Key: `${folder}/`,
    }
    s3.putObject(params, (err, data) => {
        if (err) console.log(err, err.stack)
        else console.log(data)
    })

}
export const deleteFolder = async (folder: string) => {

    const key = `${folder}`
    //console.log(key)

    const spaceEndpoint = new aws.Endpoint(process.env.S3_ENDPOINT || '');
    const s3 = new aws.S3({
        endpoint: spaceEndpoint,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        signatureVersion: 'v4'
    });
    let params = {
        Bucket: process.env.SPACE_DO || '',
        Prefix: key       
    }
    const listedObjects = await s3.listObjects(params).promise();

    if (listedObjects.Contents?.length===0){
        return
    }
    //console.log(listedObjects.Contents);
    listedObjects.Contents?.forEach(item=>{
        s3.deleteObject({Bucket:process.env.SPACE_DO || '',Key:item.Key||''},(err,data)=>{
            console.log(err);
            //console.log(data);
        })
    })
    s3.deleteObject({Bucket:process.env.SPACE_DO || '',Key:key||''},(err,data)=>{
        console.log(err);
        //console.log(data);
    })

}