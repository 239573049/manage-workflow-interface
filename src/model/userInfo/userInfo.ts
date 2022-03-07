import type { Department } from '../management/management';
/**
 * 用户登录信息
 */
class LoginUserInfo {
  token: string | undefined;
  userInfo: UserInfo | undefined;
}
/**
 * 用户信息
 */
class UserInfo {
  key:number|undefined;
  id: string | undefined;
  name: string | undefined;
  accountNumber: string | undefined;
  password: string | undefined;
  wXOpenId: string | undefined;
  headPortraits: string | undefined;
  sex: number | undefined;
  sexName: string | undefined;
  mobileNumber: number | undefined;
  eMail: string | undefined;
  departmen?: Department[] | undefined;
}
export { LoginUserInfo, UserInfo };
