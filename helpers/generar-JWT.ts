import jwt from 'jsonwebtoken';

export const generarJWT = (id:number)=>{        

    return jwt.sign({id:id.toString()},process.env.SECRETPRIVATEKEY||'', {expiresIn:'4h'});   

}

