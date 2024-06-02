import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import Logger from 'bunyan';
import { config, createLogger } from '../../../config';
import sendGridMail from '@sendgrid/mail';

interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}


const log: Logger = createLogger('emailoptions');

sendGridMail.setApiKey(config.sendgridApiKey!);

const developmentEmailSender=async(receiverEmail: string, subject: string, body: string): Promise<void>=>{
  const transporter: Mail = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.senderEmail,
      pass: config.senderPassword,
    },
  });

  const mailOptions : IMailOptions = {
    from: `Chatty-App:<${config.senderEmail}>`,
    to: receiverEmail,
    subject,
    html: body
  };

  try{
    await transporter.sendMail(mailOptions);
    log.info('dev email send successfully');
  }catch(err) {
    log.error('Error sending Email');
  }
};

const productionEmailSender=async(receiverEmail: string,  subject: string, body: string): Promise<void>=>{
    const mailOptions : IMailOptions = {
      from: `Chatty-App:<${config.senderEmail}>`,
      to: receiverEmail,
      subject,
      html: body
    };

    try{
      await sendGridMail.send(mailOptions);
      log.info('Prod email send successfully');
    }catch(err) {
      log.error('Error sending Email');
    }
};

export const sendEmail=async(receiverEmail: string, subject: string, body: string): Promise<void>=>{
    if(config.env==='development' || config.env==='test') {
      developmentEmailSender(receiverEmail, subject, body);
    }else{
      productionEmailSender(receiverEmail, subject, body);
    }
};
