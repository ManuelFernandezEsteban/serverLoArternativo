const mailSuperior: string = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <style>
    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        font-family: Roboto, monospace;
    }
    body{
        min-height: 100vh;
    }
    
    header{
        width: 100%;
        height: 150px;    
        display: flex;
        justify-content: flex-start;
        align-items: space-between;
        background: linear-gradient(180deg, rgba(2, 0, 36, 1) 0%, $blueColor 0%,rgba(30,84,95,0.01) 100%);
        padding: 40px;
        gap: 40px;
    }
    header > span{
        font-size: 2rem;
        
    }
    a{
        text-decoration:none;
        text-align:center;
        padding:5px;
        background-color: rgba(30,84,95,0.01);
        cursor:pointer;
        border-radius:4px;
    }
    header > img{
        width: 100px;
        height: 100px;
    }
    .wrapper{
       width: 100%;         
       padding: 40px;      
    }
    
    footer{
        width: 100%;
        padding: 40px;               
        background: linear-gradient(180deg, rgba(2, 0, 36, 1) 0%, $blueColor 0%,rgba(30,84,95,0.01) 100%);
    }
    h1,p,a{
        margin: 10px;
    }
        
    </style>
    <title>Nativos Tierra</title>
</head>

<body>

    <header>
        <img src="cid:logo" alt="logo nativos tierra">
        <span>Nativos Tierra</span>
    </header>

    <main>
        <div class="wrapper">
            <h1>Nativos Tierra</h1>`;  


const mailInferior: string = `
<p>
                Un cordial saludo del equipo de Nativos Tierra.
            </p>
        </div>
    </main>


    <footer>
    Este correo electrónico y, en su caso, cualquier fichero anexo al mismo se dirige exclusivamente a su destinatario y puede contener información privilegiada o confidencial. Si no es Ud. el destinatario indicado, queda notificado de que la utilización, divulgación y/o copia sin autorización está prohibida en virtud de la legislación vigente. Si ha recibido este mensaje por error, le rogamos que nos lo comunique inmediatamente por esta misma vía y proceda a su destrucción.
    Si no desea continuar recibiendo comunicaciones electrónicas de NATIVOS TIERRA comuníquelo a bajas@nativostierra.com
    </footer>

</body>

</html>`;


export const mailSuscripcion = (nombre: string): string => {
    const mensaje =
        `
            ${mailSuperior}
            <p>Hola ${nombre}</p>
            <p>Desde el portal web Nativos Tierra queremos agradecerte que te unas a nuestra
                newsletter, recibiras en tu buzón de correo electrónico nuestra revista cada x días
                con toda la información de los eventos y nuestros especialistas.
            </p>
            ${mailInferior}
`;

    return mensaje;
}
export const mailRegistro = (nombre: string): string => {
    const mensaje =
        `
            ${mailSuperior}
                <p>Hola ${nombre}</p>
                <p>Desde el portal web Nativos Tierra queremos agradecerte que te unas a nuestra
                    familia de especialistas, desde ahora apareceras en nuestro directorio, si lo deseas 
                    puedes pasarte al plan ORO y beneficiarte de todas las ventajas que conlleva, como la difusión
                    de tu eventos en nuestra newsletter.
                </p>
                ${mailInferior}
    `;

    return mensaje;
}

export const mailPlanOro = (nombre: string): string => {
    const mensaje =
        `
            ${mailSuperior}
                    <p>Hola ${nombre}</p>
                    <p>Desde el portal web Nativos Tierra queremos agradecerte que te suscribas a nuestro plan ORO,
                    desde ahora podras publicar dos eventos al mes y estos serán publicados en nuestra newsletter,
                    ademas de todas las ventajas que ya conoces.
                    </p>
            ${mailInferior}        
        `;

    return mensaje;
}


export const mailConsulta = (nombre: string, texto: string): string => {
    const mensaje =
        `
            ${mailSuperior}
                    <p>Hola Nativos Tierra, ${nombre} tiene para ti el sguiente mensaje:</p>
                    <p>
                        ${texto}
                    </p>                   
            ${mailInferior}    
        `;

    return mensaje;
}

export const mailRecuperacionPassword = (nombre: string, link: string): string => {
    const mensaje =
        `
            ${mailSuperior}
                    <p>Hola ${nombre}, pulse en el link para establecer una nueva contraseña</p>
                    <p>El link expira en 10 minutos desde que recibió el mail</p>
                    <a href="${link}">Restablecer contraseña</a>
             ${mailInferior}  
        `;

    return mensaje; 
}

export const mailCompraCliente = (especialista:any,evento:any,cliente:any,link:string): string => {
    const mensaje =
        `
            ${mailSuperior}
                    <p>Hola ${cliente.nombre}, le enviamos este mail con la información del evento adquirido.</p>
                    <ul>
                        <li>Evento: ${evento.evento}</li>
                        <li>Fecha: ${evento.fecha}</li>
                        <li>Descripción: ${evento.descripcion}</li>
                        <li>Dirección: ${evento.direccion}</li>
                        <li>Localidad: ${evento.localidad} Provincia: ${evento.provincia} CP: ${evento.codigo_postal}</li>
                        <li>Pais: ${evento.pais}</li> 
                        <li>Teléfono: ${evento.telefono} Email:${evento.email}</li>
                        <li>Especialista: ${especialista.nombre} ${especialista.apellidos}</li>
                    </ul>
                    <p>Una vez haya realizado el evento le rogamos que pulse el siguiente enlace</p>
                    ${link}
             ${mailInferior}  
        `;

    return mensaje;
}

export const mailCompraEspecialista = (especialista:any,evento:any,cliente:any,link:string): string => {
    const mensaje =
        `
            ${mailSuperior}
                    <p>Hola ${especialista.nombre}, le enviamos este mail con la información del cliente que ha adquirido su evento ${evento.evento}.</p>
                    <ul>
                        <li>Evento: ${evento.evento}</li>
                        <li>Fecha: ${evento.fecha}</li>
                        <li>Especialista: ${cliente.nombre} ${cliente.apellidos}</li>
                        <li>Teléfono: ${cliente.telefono} Email:${cliente.email}</li>                        
                        <li>Dirección: ${cliente.direccion}</li>
                        <li>Localidad: ${cliente.localidad} Provincia: ${cliente.provincia} CP: ${cliente.codigo_postal}</li>
                        <li>Pais: ${cliente.pais}</li>                        
                    </ul>
                    <p>Una vez haya realizado el evento le rogamos que pulse el siguiente enlace</p>
                    <a href="${link}">Evento realizado</a>
             ${mailInferior}  
        `;

    return mensaje;
}

export const mailTransferenciaEspecialista = (especialista:any,evento:any,cliente:any,cantidad:number,moneda:string): string => {    
    
    const mensaje =
        `
            ${mailSuperior}
                    <p>Hola ${especialista.nombre}, le enviamos este mail con la información de la transferencia enviada a su cuenta por la realizacion del evento ${evento.evento}.</p>
                    <ul>
                        <li>Evento: ${evento.evento}</li>
                        <li>Fecha: ${evento.fecha}</li>
                        <li>Precio evento: ${evento.precio} ${moneda}</li>
                        <li>Cliente: ${cliente.nombre} ${cliente.apellidos}</li>
                        <li>Importe transferencia: ${cantidad/100} ${moneda} </li>                        
                    </ul>                    
             ${mailInferior}  
        `;

    return mensaje;
}