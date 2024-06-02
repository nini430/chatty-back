import { authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import { signoutHandler } from '../signout';


describe('Signout', ()=>{


  it('should return session as null', async()=>{
    const request = authMockRequest({}, {}, null) as any;
    const response = authMockResponse();

    await signoutHandler(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(request.session).toBeNull();
  });

  it('should return correct json response', async()=>{
    const request = authMockRequest({}, {}, null) as any;
    const response = authMockResponse();

    await signoutHandler(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      message: 'User logged out successfully',
      token: '',
      user: {}
    });
  });
});