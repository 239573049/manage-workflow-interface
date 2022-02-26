import {UserInfo} from '../userInfo/userInfo'
export interface LoginVM{
    accountNumber:string|undefined;
    password:string|undefined;
    remember:boolean;
}

export interface LoginUserInfo{
    token:string|undefined;
    userInfo:UserInfo;
}