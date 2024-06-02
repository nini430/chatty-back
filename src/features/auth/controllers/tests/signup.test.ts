import * as cloudinaryUpload from '@utils/cloudinary-upload';
import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import signupHandler from '../signup';
import * as authService from '@services/db/auth.service';
import * as userCache from '@services/redis/user.cache';

jest.useFakeTimers();
jest.mock('@queues/base.queue.ts');
jest.mock('@queues/auth.queue.ts');
jest.mock('@queues/user.queue.ts');
jest.mock('@services/redis/user.cache.ts');
jest.mock('@utils/cloudinary-upload.ts');

describe('signup', () => {

  beforeEach(()=>{
    jest.resetAllMocks();
  });

  afterEach(()=>{
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
 it('username must be provided', ()=>{

  const request = authMockRequest({}, {
    username: '',
    email: 'manny@test.com',
    password: 'qwerty',
    avatarColor: 'red',
    avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
  }, null) as any;
  const response = authMockResponse();

  signupHandler(request, response).catch(error=>{
    expect(error.serializeErrors().message).toBe('username field is required');
  });
 });

 it('should throw when username length is less than minimum', ()=>{
  const request = authMockRequest({}, {
    username: 'my',
    email: 'manny@test.com',
    password: 'qwerty',
    avatarColor: 'red',
    avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
  }, null) as any;

  const response = authMockResponse();

  signupHandler(request, response).catch(error=>{
    expect(error.serializeErrors().message).toBe('invalid username');
  });
 });

 it('should throw when username length is greater than maximum', ()=>{
    const request = authMockRequest({}, {
      username: 'mymymymymymymymymymymymymymyym',
      email: 'manny@test.com',
      password: 'qwerty',
      avatarColor: 'red',
      avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
    }, null) as any;
    const response = authMockResponse();

    signupHandler(request, response).catch((error)=>{
      expect(error.serializeErrors().message).toBe('invalid username');
    });
 });

 it('should throw when email is invalid', ()=>{
  const request = authMockRequest({},{
    username: 'mymy',
    email: 'manny',
    password: 'qwerty',
    avatarColor: 'red',
    avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
  }, null) as any;

  const response = authMockResponse();

  signupHandler(request, response).catch(error=>{
    expect(error.serializeErrors().message).toBe('invalid email');
  });
 });

 it('should throw when email is empty', ()=>{
  const request = authMockRequest({},{
    username: 'mymy',
    email: '',
    password: 'qwerty',
    avatarColor: 'red',
    avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
  }, null) as any;
  const response = authMockResponse();

  signupHandler(request, response).catch(error=>{
    expect(error.serializeErrors().message).toBe('email field is required');
  });
});

it('should throw when password is empty', ()=>{
  const request = authMockRequest({}, {
    username: 'mymy',
    email: 'manny@gmail.com',
    password: '',
    avatarColor: 'red',
    avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
  }, null) as any;
  const response = authMockResponse();

  signupHandler(request, response).catch(error=>{
    expect(error.serializeErrors().message).toBe('password field is required');
  });

});

it('should throw if password is less than minimum length', ()=>{
  const request = authMockRequest({},{
    username: 'mymy',
    email: 'manny@gmail.com',
    password: 'nini',
    avatarColor: 'red',
    avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
  }, null) as any;
  const response = authMockResponse();
  signupHandler(request, response).catch(error=>{
    expect(error.serializeErrors().message).toBe('invalid password');
  });
});

it('should throw if password is greater than maximum length', ()=>{
  const request = authMockRequest({},{
    username: 'mymy',
    email: 'manny@gmail.com',
    password: 'ninijfdsfksdhfkjsdhfkhdfkshfks',
    avatarColor: 'red',
    avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
  }, null) as any;
  const response = authMockResponse();
  signupHandler(request, response).catch(error=>{
    expect(error.serializeErrors().message).toBe('invalid password');
  });
});

it('should return invalid credentials if user already exists', ()=>{
    const request = authMockRequest({}, {

    username: 'mymy',
    email: 'manny@gmail.com',
    password: 'niniko',
    avatarColor: 'red',
    avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
    }, null) as any;
    const response = authMockResponse();
    jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(authMock);
    signupHandler(request, response).catch(error=>{
      expect(error.statusCode).toBe(400);
      expect(error.serializeErrors().message).toBe('Invalid credentials');
    });
});

it('should return  correct api response', async()=>{
  const request = authMockRequest({}, {

    username: 'mymy',
    email: 'manny@gmail.com',
    password: 'niniko',
    avatarColor: 'red',
    avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
    }, null) as any;

    const response = authMockResponse();

    jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValueOnce(null);
    jest.spyOn(cloudinaryUpload, 'upload').mockImplementation(():any=>({public_id:'123', version:'123'}));
    const userSpy = jest.spyOn(userCache, 'saveUserCache');

    await signupHandler(request, response);

    expect(request.session.jwt).toBeDefined();
    expect(response.json).toHaveBeenCalledWith({
      message: 'User created successfully',
      user: userSpy.mock.calls[0][2],
      token: request.session?.jwt
    });
});



 });
