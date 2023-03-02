import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { MailInformation } from '../interfaces/mail-information.interface';



const crearTransporte = ():nodemailer.Transporter<SMTPTransport.SentMessageInfo>=>{
    return nodemailer.createTransport({
        host: process.env.HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.USER_SMTP, // generated ethereal user
            pass: process.env.PASS_SMTP, // generated ethereal password
        },
    })
}


const createMessage = (mailInfo: MailInformation,):any=>{

    return {
        from: `Nativos Tierra <${process.env.USER_SMTP}>`, // sender address
        to: `${mailInfo.mailDestinatario}`, // list of receivers
        subject: `Hola ${mailInfo.asunto}`, // Subject line
        text: mailInfo.mensaje, // plain text body
        html: mailInfo.html // html body
    }
}


export const sendMail = async (mailInfo: MailInformation) => {
    const transport = crearTransporte();
    await transport.sendMail(createMessage(mailInfo));

}
