import { StatusCodes } from 'http-status-codes';
import { Request, Response} from 'express';
import { config } from '../../../../config';
import crypto from 'crypto';
import { emailSchema, passwordSchema } from '@auth/schemes/password';
import { getUserByEmail, getUserByResetPasswordToken, updateAuthResetToken } from '@services/db/auth.service';
import { BadRequestError } from '@errors/bad-request-error';
import { forgotPasswordTemplate } from '@services/email/templates/forgot-password/forgot-password-template';
import { startEmailQueue } from '@queues/email.queue';
import { IResetPasswordParams } from '@user/interfaces/user.interface';
import PublicIP from 'ip';
import moment from 'moment';
import { resetPasswordTemplate } from '@services/email/templates/reset-password/reset-password-template';
import { JoiValidationError } from '@errors/joi-validation-error';


export const forgotEmailHandler=async(req: Request, res: Response)=>{
  const {error} = await Promise.resolve(emailSchema.validate(req.body));

  if(error?.details) {
    throw new JoiValidationError(error.details?.[0].message);
  }

  const {email} = req.body;

  const existingUser = await getUserByEmail(email);
  if(!existingUser) {
    throw new BadRequestError('Invalid credentials');
  };

  const randomToken = crypto.randomBytes(20).toString('hex');

  await updateAuthResetToken(existingUser.id, randomToken, (Date.now() + 60*60*1000));

  const resetLink = `${config.clientUrl}/reset-password/${randomToken}`;

  const template = forgotPasswordTemplate(existingUser.username, resetLink);
  startEmailQueue('forgetPassword',{receiverEmail: existingUser.email, subject: 'Forget Password', template});

  return res.status(StatusCodes.OK).json({message:'Password reset email has been sent'});

};

export const resetPasswordHandler=async(req: Request, res: Response)=>{
    const {error}= await Promise.resolve(passwordSchema.validate(req.body));
    if(error?.details) {
      throw  new JoiValidationError(error.details?.[0].message);
    }

    const {password, confirmPassword}=req.body;
    const {token}=req.params;

    if(password!==confirmPassword) {
      throw new BadRequestError('Passwords don\'t match');
    }

    const existingUser = await getUserByResetPasswordToken(token);

    if(!existingUser) {
      throw new BadRequestError('Reset password link expired');
    }

    existingUser.password=password;
    existingUser.passwordResetToken = undefined;
    existingUser.passwordResetExpires = undefined;

    await existingUser.save();

    const templateParams: IResetPasswordParams = {
      username: existingUser.username,
      email: existingUser.email,
      date: moment().format('DD/MM/YYYY HH:mm'),
      ipaddress: PublicIP.address()
    };

    const template = resetPasswordTemplate(templateParams);
    startEmailQueue('resetPassword', {receiverEmail: existingUser.email, subject: 'Reset Password',template});

    return res.status(StatusCodes.OK).json({message:'Password reset successfull'});

};
