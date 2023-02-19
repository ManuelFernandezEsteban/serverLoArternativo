import { Request, Response } from "express";
import Especialista from "../models/especialista";
import Evento from "../models/eventos";
import { deleteFolder } from "../helpers/createFolder";

export const avatarEspecialista = async (req:Request,res:Response)=>{   

    const idEspecialista = req.especialistaAutenticado;
    const urlImagen = req.urlAvatar; 

    try {
        const especialista = await Especialista.findByPk(idEspecialista);
        if (especialista){
            const url = `${process.env.BASE_URL}${urlImagen}`
            especialista.update({imagen:url});
        }else{            
            return res.status(500).json({
                error:"Algo no ha ido bien"
            })
        }
    } catch (error) {
        return res.status(500).json({
            error:"Algo no ha ido bien"
        })
    }    
    res.json({        
        msg:'upload success',
    })

}

export const videoEspecialista = async (req:Request,res:Response)=>{   

    const idEspecialista = req.especialistaAutenticado;
    const urlImagen = req.urlVideo; 

    try {
        const especialista = await Especialista.findByPk(idEspecialista);
        if (especialista){
            const url = `${process.env.BASE_URL}${urlImagen}`
            especialista.update({video:url});
        }else{            
            return res.status(500).json({
                error:"Algo no ha ido bien"
            })
        }
    } catch (error) {
        return res.status(500).json({
            error:"Algo no ha ido bien"
        })
    }     
    res.json({        
        msg:'upload success',
    })

} 

export const eventoImagen = async (req:Request,res:Response)=>{   

    const id = req.params.id;
    const urlImagen = req.urlImagenEvento; 

    try {
        
        const evento = await Evento.findByPk(id);
        if (evento){
            const url = `${process.env.BASE_URL}${urlImagen}`
            evento.update({imagen:url});
        }else{            
            return res.status(500).json({
                error:"Algo no ha ido bien"
            })
        }
    } catch (error) {
        return res.status(500).json({
            error:"Algo no ha ido bien"
        })
    }     
    res.json({        
        msg:'upload success',
    })


}

export const eventoInfo = async (req:Request,res:Response)=>{   

    const id = req.params.id;
    const urlImagen = req.urlInfoEvento; 

    try {
        
        const evento = await Evento.findByPk(id);
        if (evento){
            const url = `${process.env.BASE_URL}${urlImagen}`
            evento.update({pdf:url});
        }else{            
            return res.status(500).json({
                error:"Algo no ha ido bien"
            })
        }
    } catch (error) {
        return res.status(500).json({
            error:"Algo no ha ido bien"
        })
    }     
    res.json({        
        msg:'upload success',
    })

}

export const deleteEvento= async (req:Request,res:Response)=>{
    
    await deleteFolder(`eventos/${req.params.id}`)


}