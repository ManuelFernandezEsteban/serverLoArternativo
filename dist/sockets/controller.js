"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listenSesionCompra = exports.desconectar = void 0;
//escuchar desconexion 
const desconectar = (cliente) => {
    cliente.on('disconnect', () => {
        console.log('cliente desconectado ', cliente.id);
    });
};
exports.desconectar = desconectar;
//escuchar mensajes
const listenSesionCompra = (cliente, io) => {
    cliente.on('sesion-compra', (payload) => {
        console.log(payload, cliente.id);
        //io.emit('sesion_compra_finalizada','52046e5c-219c-4f22-9edd-d48e1723e45d')
    });
};
exports.listenSesionCompra = listenSesionCompra;
//# sourceMappingURL=controller.js.map