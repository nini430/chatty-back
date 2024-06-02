import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import { forgotEmailHandler, resetPasswordHandler } from '../password';
import * as authService from '@services/db/auth.service';
import * as emailQueue from '@queues/email.queue';

jest.mock('@queues/base.queue.ts');
jest.mock('@queues/email.queue.ts');
jest.mock('@services/db/auth.service.ts');

jest.useFakeTimers();


describe('password', ()=>{
  describe('Forget password', ()=>{
    beforeEach(()=>{
      jest.resetAllMocks();
    });

    afterEach(()=>{
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it('should throw when email is invalid', ()=>{
      const request = authMockRequest({}, {
        email: ''
      }, null) as any;
      const response = authMockResponse();
      forgotEmailHandler(request, response).catch(error=>{
        expect(error.serializeErrors().message).toBe('email field is required');
      });
    });

    it('should throw if the user with this email doesnt exist', ()=>{
      const request = authMockRequest({}, {email:'nini@gmail.com'}, null) as any;
      const response = authMockResponse();

      jest.spyOn(authService, 'getUserByEmail').mockResolvedValue(null);
      forgotEmailHandler(request, response).catch((error)=>{
        expect(error.serializeErrors().message).toBe('Invalid credentials');
      });
    });

    it('should return correct response', async()=>{
      const request = authMockRequest({}, {email:'manny@me.com'}, null) as any;
      const response = authMockResponse();

      jest.spyOn(authService, 'getUserByEmail').mockResolvedValue(authMock);
      await forgotEmailHandler(request, response);
      expect(emailQueue.startEmailQueue).toHaveBeenCalled();
      expect(response.json).toHaveBeenCalledWith({
        message: 'Password reset email has been sent'
      });
    });


});

describe('reset password', ()=>{
  it('throw if password is empty', ()=>{
    const request = authMockRequest({}, {password: ''}, null) as any;
    const response = authMockResponse();

    resetPasswordHandler(request, response).catch(error=>{
      expect(error.serializeErrors().message).toBe('Password is a required field');
    });
  });

  it('throw if password and confirm password arenot the same', ()=>{
    const request = authMockRequest({}, {password:'nini', confirmPassword: 'miranda'}, null) as any;
    const response = authMockResponse();

    resetPasswordHandler(request, response).catch(error=>{
      expect(error.serializeErrors().message).toBe('passwords don\'t match');
    });
  });

  it('show throw when reset token is expired', ()=>{
    const request = authMockRequest({}, {password:'niniko', confirmPassword: 'niniko'}, null, {token: '123'}) as any;
    const response = authMockResponse();

    jest.spyOn(authService, 'getUserByResetPasswordToken').mockResolvedValue(null);

    resetPasswordHandler(request, response).catch(error=>{
      expect(error.serializeErrors().message).toBe('Reset password link expired');

    });
  });
  it('should return correct json response', async()=>{
    const request = authMockRequest({}, {password:'niniko', confirmPassword:'niniko'}, null, {params: '123'}) as any;
    const response = authMockResponse();

    jest.spyOn(authService,'getUserByResetPasswordToken').mockResolvedValue(authMock);

    await resetPasswordHandler(request, response);

    expect(response.json).toHaveBeenCalledWith({
      message: 'Password reset successfull'
    });

  });

});
});