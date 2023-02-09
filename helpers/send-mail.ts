import nodemailer from 'nodemailer';
import { MailInformation } from '../interfaces/mail-information.interface';
import { mailPlanOro, mailRegistro, mailSuscripcion } from './plantilla-mail';

export const correoConfirmacionSuscripcion = async (mailInfo: MailInformation) => {
    const transport = nodemailer.createTransport({
        host: process.env.HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.USER_SMTP, // generated ethereal user
            pass: process.env.PASS_SMTP, // generated ethereal password
        },
    })
    await transport.sendMail({
        from: `Manuel <${process.env.USER_SMTP}>`, // sender address
        to: `${mailInfo.mailDestinatario}`, // list of receivers
        subject: `Hola ${mailInfo.asunto}`, // Subject line
        text: mailInfo.mensaje, // plain text body
        html: mailSuscripcion(mailInfo.nombreDestinatario) // html body
    });

}

export const correoConfirmacionRegistro = async (mailInfo: MailInformation) => {
    const transport = nodemailer.createTransport({
        host: process.env.HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.USER_SMTP, // generated ethereal user
            pass: process.env.PASS_SMTP, // generated ethereal password
        },
    })
    await transport.sendMail({
        from: `Manuel <${process.env.USER_SMTP}>`, // sender address
        to: `${mailInfo.mailDestinatario}`, // list of receivers
        subject: `Hola ${mailInfo.asunto}`, // Subject line
        text: mailInfo.mensaje, // plain text body
        html: mailRegistro(mailInfo.nombreDestinatario) // html body
    });

}

export const correoConfirmacionSuscripcionOro = async (mailInfo: MailInformation) => {
    const transport = nodemailer.createTransport({
        host: process.env.HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.USER_SMTP, // generated ethereal user
            pass: process.env.PASS_SMTP, // generated ethereal password
        },
    })
    await transport.sendMail({
        from: `Manuel <${process.env.USER_SMTP}>`, // sender address
        to: `${mailInfo.mailDestinatario}`, // list of receivers
        subject: `Hola ${mailInfo.asunto}`, // Subject line
        text: mailInfo.mensaje, // plain text body
        html: mailPlanOro(mailInfo.nombreDestinatario) // html body
    });

}