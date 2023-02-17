
import aws from 'aws-sdk';

export const createFolder = (folder:string)=>{

    const spaceEndpoint = new aws.Endpoint(process.env.S3_ENDPOINT||'');
    const s3 = new aws.S3({
        endpoint:spaceEndpoint,
        accessKeyId:process.env.AWS_ACCESS_KEY_ID||'',
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||'',
    });
    let params={
        Bucket:process.env.SPACE_DO||'',
        Key: `${folder}/`,
    }
    s3.putObject(params,(err,data)=>{
        if (err) console.log(err, err.stack)
        else console.log(data)
    })

}