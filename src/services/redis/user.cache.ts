import { IUserDocument } from '@user/interfaces/user.interface';
import { createBaseCache } from './base.cache';
import { ServerError } from '@errors/server-error';
import { parseJson } from '@utils/helpers';

const {log, client}=createBaseCache('userCache');

export const saveUserCache=async(key: string, userUUid: string, createdUser: IUserDocument)=>{
  if(!client.isOpen) {
    await client.connect();
  }
  const createdAt = new Date();

  const {
    username,
    email,
    _id,
    uId,
    avatarColor,
    blocked,
    blockedBy,
    postsCount,
    profilePicture,
    followersCount,
    followingCount,
    notifications,
    work,
    location,
    quote,
    school,
    bgImageId,
    bgImageVersion,
    social,
  }=createdUser;

  const dataToSave={
    '_id': `${_id}`,
    'uId': `${uId}`,
    'username': `${username}`,
    'email': `${email}`,
    'avatarColor': `${avatarColor}`,
    'createdAt': `${createdAt}`,
    'postsCount': `${postsCount}`,
    'blocked': JSON.stringify(blocked),
    'blockedBy': JSON.stringify(blockedBy),
    'profilePicture': `${profilePicture}`,
    'followersCount': `${followersCount}`,
    'followingCount': `${followingCount}`,
    'notifications': JSON.stringify(notifications),
    'social': JSON.stringify(social),
    'work': `${work}`,
    'location': `${location}`,
    'school': `${school}`,
    'quote': `${quote}`,
    'bgImageVersion': `${bgImageVersion}`,
    'bgImageId': `${bgImageId}`
  };

  try{
   await client.ZADD('users', {score: parseInt(userUUid, 10), value: key});
   await client.HSET(`users:${key}`, dataToSave);
  }catch(err) {
    log.error(err);
    throw new ServerError('Server error,try again');
  }


};




export const getUserCache=async(key: string)=>{
  if(!client.isOpen) {
    await client.connect();
  };
  try{
    const response = await client.HGETALL(`users:${key}`) as unknown as IUserDocument;
    if(response) {
      response.createdAt = new Date(parseJson(response.createdAt! as string));
      response.postsCount = parseJson(response.postsCount);
      response.blocked = parseJson(`${response.blocked}`);
      response.blockedBy = parseJson(`${response.blockedBy}`);
      response.notifications = parseJson(`${response.notifications}`);
      response.social = parseJson(`${response.social}`);
      response.followersCount = parseJson(`${response.followersCount}`);
      response.followingCount = parseJson(`${response.followingCount}`);
      response.bgImageId = parseJson(`${response.bgImageId}`);
      response.bgImageVersion = parseJson(`${response.bgImageVersion}`);
      response.profilePicture = parseJson(`${response.profilePicture}`);
      response.work = parseJson(`${response.work}`);
      response.school = parseJson(`${response.school}`);
      response.location = parseJson(`${response.location}`);
      response.quote = parseJson(`${response.quote}`);

      return response;
    }else{
      return null;
    }

  }catch(err) {
    throw new ServerError('Server error, try again');
  }
};
