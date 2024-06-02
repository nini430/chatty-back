import { authMockRequest, authMockResponse, authUserPayload } from '@root/mocks/auth.mock';
import { getCurrentUserHandler } from '../current-user';
import * as userService from '@services/db/user.service';
import * as userCache from '@services/redis/user.cache';
import { existingUser } from '@root/mocks/user.mock';


jest.useFakeTimers();

describe('Current user', ()=>{

  beforeEach(()=>{
    jest.resetAllMocks();
  });

  afterEach(()=>{
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('should return null', async()=>{
    const request  = authMockRequest({}, {},  authUserPayload) as any;
    const response = authMockResponse();

    jest.spyOn(userCache, 'getUserCache').mockResolvedValue(null);
    jest.spyOn(userService, 'getUserById').mockResolvedValue([]);

    await getCurrentUserHandler(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      token: '',
      user: null,
      isUser: false
    });
  });

  it('should return correct json response', async()=>{
   const request = authMockRequest({}, {}, authUserPayload) as any;
   const response = authMockResponse();

   jest.spyOn(userCache, 'getUserCache').mockResolvedValue(existingUser);

   await getCurrentUserHandler(request, response);
   expect(response.status).toHaveBeenCalledWith(200);
   expect(response.json).toHaveBeenCalledWith({
    token: request.session.jwt,
    isUser: true,
    user: existingUser
   });
  });
});