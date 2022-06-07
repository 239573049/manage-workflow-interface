import { UserInfo } from "../../model/userInfo/userInfo";
import instance from "../../utils/request/request";
class UserApi{
    GetUserInfoPaging(keyword:string|'',startTime:string|undefined,endTime:string|undefined,status:number|'',pageNo:number,pageSize:number){
        return instance.get(`UserInfo/GetUserInfoPaging?keyword=${keyword}&startTime=${startTime}&endTime=${endTime}&status=${status}&pageNo=${pageNo}&pageSize=${pageSize}`)
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