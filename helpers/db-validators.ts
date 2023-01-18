import Actividad from '../models/actividades';
import Especialista from '../models/especialista';
import Plan from '../models/planes';

export const esActividadValida = async (ActividadeId:number=0)=>{
    const existeActividad = await Actividad.findByPk(ActividadeId);
    if (!existeActividad){
        throw new Error('No existe una actividad con id ' +ActividadeId)
    }
}

export const esPlanValido = async (PlaneId:number=0)=>{
    const existePlan = await Plan.findByPk(PlaneId);
    if (!existePlan){
        throw new Error('No existe un plan con id ' + PlaneId )
    }
}


export const existeEmail = async (email:string='')=>{

    const existe = await Especialista.findOne({
        where: {
            email: email
        }
    });
    if (existe) {

        throw new Error('Ya existe un usuario registrado con el email ' + email )

    }

} 

export const existeUsuario = async (id:number=0)=>{

    const existeEspecialista = await Especialista.findByPk(id);

    if (!existeEspecialista) {
        throw new Error('No existe un especialista con el id ' + id);
       
    }
}





//exports = {esActividadValida,esPlanValido}