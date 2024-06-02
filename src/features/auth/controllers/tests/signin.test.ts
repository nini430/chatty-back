import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import { signinHandler } from '../signin';
import * as authService from '@services/db/auth.service';
import * as userService from '@services/db/user.service';
import { mergedAuthAndUserData } from '@root/mocks/user.mock';


jest.useFakeTimers();

describe('signin', ()=>{
  beforeEach(()=>{
    jest.resetAllMocks();
  });


  afterEach(()=>{
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should throw if username is not available', ()=>{
    const request = authMockRequest({}, {
      username:'',
      password:'niniko'
    }, null) as any;
    const response = authMockResponse();

    signinHandler(request, response).catch(error=>{
      expect(error.serializeErrors().message).toBe('username field is required');
    });
  });

  it('should throw if username is less than minimum', ()=>{
    const request = authMockRequest({}, {
      username:'n',
      password:'niniko'
    }, null) as any;
    const response = authMockResponse();

    signinHandler(request, response).catch(error=>{
      expect(error.serializeErrors().message).toBe('invalid username');
    });
  });


  it('should throw if username is greater than maximum', ()=>{
    const request = authMockRequest({}, {
      username:'nkfjdsjhfksjhfksjhfkshfksjh',
      password:'niniko'
    }, null) as any;
    const response = authMockResponse();

    signinHandler(request, response).catch(error=>{
      expect(error.serializeErrors().message).toBe('invalid username');
    });
  });

  it('should throw when password is unavailable', ()=>{
    const request = authMockRequest({}, {
      username:'nkfjds',
      password:''
    }, null) as any;
    const response = authMockResponse();
    signinHandler(request, response).catch(error=>{
      expect(error.serializeErrors().message).toBe('Password is a required field');
    });
  });

  it('should throw when password length is less than minimum', ()=>{
    const request = authMockRequest({}, {
      username:'nkfjds',
      password:'n'
    }, null) as any;
    const response = authMockResponse();
    signinHandler(request, response).catch(error=>{
      expect(error.serializeErrors().message).toBe('Invalid password');
    });
  });

  it('should throw when password greater than', ()=>{
    const request = authMockRequest({}, {
      username:'nkfjds',
      password:'nsdjfhsfhksjfhkhkfhsdfk'
    }, null) as any;
    const response = authMockResponse();
    signinHandler(request, response).catch(error=>{
      expect(error.serializeErrors().message).toBe('Invalid password');
    });
  });

  it('should throw when username is invalid', ()=>{
    const request = authMockRequest({}, {
      username:'nkfjds',
      password:'nsdjf'
    }, null) as any;
    const response = authMockResponse();
    jest.spyOn(authService, 'getUserByUsername').mockResolvedValue(null);
    signinHandler(request, response).catch(error=>{
      expect(error.statusCode).toBe(400);
      expect(error.serializeErrors().message).toBe('Invalid credentials');
    });
  });

  it('should throw when password is invalid', ()=>{
    const request = authMockRequest({}, {
      username:'nkfjds',
      password:'nsdjf'
    }, null) as any;
    const response = authMockResponse();
    authMock.comparePassword = ()=> Promise.resolve(false);
    jest.spyOn(authService, 'getUserByUsername').mockResolvedValue(authMock as any);
    signinHandler(request, response).catch(error=>{
      expect(error.statusCode).toBe(400);
      expect(error.serializeErrors().message).toBe('Invalid credentials');
    });
  });

  it('should display correct json response', async()=>{
    const request = authMockRequest({}, {
      username:'nkfjds',
      password:'nsdjf'
    }, null) as any;
    const response = authMockResponse();
    authMock.comparePassword = ()=>Promise.resolve(true);
    jest.spyOn(authService, 'getUserByUsername').mockResolvedValue(authMock as any);
    jest.spyOn(userService, 'getUserByAuthId').mockResolvedValue(mergedAuthAndUserData);
    await signinHandler(request, response);
    expect(request.session.jwt).toBeDefined();
    expect(response.json).toHaveBeenCalledWith({
      token: request.session.jwt,
      message: 'User logged in successfully',
      data: mergedAuthAndUserData,
    });

  });
});