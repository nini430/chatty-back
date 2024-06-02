import fs from 'fs';
import ejs from 'ejs';

export const forgotPasswordTemplate=(username: string, resetLink: string)=>{
  return ejs.render(fs.readFileSync(__dirname+'/forgot-password-template.ejs','utf8'),{
    resetLink,
    username,
    image_url: 'https://w7.pngwing.com/pngs/120/102/png-transparent-padlock-logo-computer-icons-padlock-technic-logo-password-lock.png'
  });
};