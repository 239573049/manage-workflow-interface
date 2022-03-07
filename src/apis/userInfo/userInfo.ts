import { UserInfo } from "../../model/userInfo/userInfo";
import instance from "../../utils/request/request";
class UserApi{
    GetUserInfoPaging(code:string,startTime:string|undefined,endTime:string|undefined,statue:number,pageNo:number,pageSize:number){
        return instance.get(`UserInfo/GetUserInfoPaging?code=${code}&startTime=${startTime}&endTime=${endTime}&statue=${statue}&pageNo=${pageNo}&pageSize=${pageSize}`)
    }
    CreateUserInfo(userInfo:UserInfo){
        return instance.post('UserInfo/CreateUserInfo',userInfo)
    }
    DeleteUserInfo(userId:string){
        return instance.delete(`USerInfo/DeleteUserInfo?userId=${userId}`)
    }
    UpdateUserInfo(userInfo:UserInfo){
        return instance.put('UserInfo/UpdateUserInfo',userInfo)
    }
}
export default new UserApi()