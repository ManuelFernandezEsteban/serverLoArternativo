import { Socket } from "socket.io";
import socketIO from 'socket.io';

//escuchar desconexion 
export const desconectar = (cliente:Socket)=>{

    cliente.on('disconnect',()=>{
        console.log('cliente desconectado ',cliente.id)
    })
}
//escuchar mensajes
export const listenSesionCompra = (cliente:Socket, io:socketIO.Server)=>{

    cliente.on('sesion-compra',(payload)=>{
        console.log(payload,cliente.id);
        //io.emit('sesion_compra_finalizada','52046e5c-219c-4f22-9edd-d48e1723e45d')
    });
   
} 

