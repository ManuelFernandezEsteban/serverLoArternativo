"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailRecuperacionPassword = exports.mailConsulta = exports.mailPlanOro = exports.mailRegistro = exports.mailSuscripcion = void 0;
const mailSuperior = `
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
        height: 100vh;
    }
    
    header{
        width: 100%;
        height: 150px;    
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: #7BACD5;
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
        background-color: #7BACD5;
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
        position: fixed;
        bottom: 0;
        height: 80px;
        background-color: #7BACD5;
    }
    h1,p,a{
        margin: 10px;
    }
        
    </style>
    <title>Recuperación Password</title>
</head>

<body>

    <header>
        <span>Nativos Tierra</span>
    </header>

    <main>
        <div class="wrapper">
            <h1>Nativos Tierra</h1>`;
const mailInferior = `
<p>
                Un cordial saludo del equipo de Nativos Tierra.
            </p>
        </div>
    </main>


    <footer>
        Info legal, etc.
    </footer>

</body>

</html>`;
const mailSuscripcion = (nombre) => {
    const mensaje = `
            ${mailSuperior}
            <p>Hola ${nombre}</p>
            <p>Desde el portal web Nativos Tierra queremos agradecerte que te unas a nuestra
                newsletter, recibiras en tu buzón de correo electrónico nuestra revista cada x días
                con toda la información de los eventos y nuestros especialistas.
            </p>
            ${mailInferior}
`;
    return mensaje;
};
exports.mailSuscripcion = mailSuscripcion;
const mailRegistro = (nombre) => {
    const mensaje = `
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
};
exports.mailRegistro = mailRegistro;
const mailPlanOro = (nombre) => {
    const mensaje = `
            ${mailSuperior}
                    <p>Hola ${nombre}</p>
                    <p>Desde el portal web Nativos Tierra queremos agradecerte que te suscribas a nuestro plan ORO,
                    desde ahora podras publicar dos eventos al mes y estos serán publicados en nuestra newsletter,
                    ademas de todas las ventajas que ya conoces.
                    </p>
            ${mailInferior}        
        `;
    return mensaje;
};
exports.mailPlanOro = mailPlanOro;
const mailConsulta = (nombre, texto) => {
    const mensaje = `
            ${mailSuperior}
                    <p>Hola Nativos Tierra, ${nombre} tiene para ti el sguiente mensaje:</p>
                    <p>
                        ${texto}
                    </p>                   
            ${mailInferior}    
        `;
    return mensaje;
};
exports.mailConsulta = mailConsulta;
const mailRecuperacionPassword = (nombre, link) => {
    const mensaje = `
            ${mailSuperior}
                    <p>Hola ${nombre}, pulse en el link para establecer una nueva contraseña</p>
                    <p>El link expira en 10 minutos desde que recibió el mail</p>
                    <a href="${link}">Restablecer contraseña</a>
             ${mailInferior}  
        `;
    return mensaje;
};
exports.mailRecuperacionPassword = mailRecuperacionPassword;
//# sourceMappingURL=plantilla-mail.js.map