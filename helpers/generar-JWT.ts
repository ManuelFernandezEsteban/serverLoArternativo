import jwt from 'jsonwebtoken';

export const generarJWT = (id:string)=>{        

    return jwt.sign({id:id},process.env.SECRETPRIVATEKEY||'', {expiresIn:'4h'});   

}

 