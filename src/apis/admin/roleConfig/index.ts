import Role from '../../../model/role/role';
import instance from '../../../utils/request/request';

class RoleConfig {
    GetUserMenuList(name:string){
        return instance.get('Role/GetRoleMenuList',{data:name});
    }
    UpdateRole(role:Role){
        return instance.put("Role/UpdateRole",role)
    }
    CreateRole(role:Role){
        return instance.post('Role/CreateRole',role)
    }
    DeleteRole(id:string){
        return instance.delete('Role/DeleteRole?id='+id)
    }
    GetRoleUserInfo(id:string|undefined,pageNo:number|1,pageSize:number|20){
        return instance.get('Role/GetRoleUserInfo?id='+id+'&pageNo='+pageNo+'&pageSize='+pageSize)
    }
    UpdateRoleIndex(role:Role[]){
        return instance.put("Role/UpdateRoleIndex",role)
    }
    GetRoleUserInfoNotExit(id:string|undefined,name:string|undefined,pageNo:number|undefined,pageSize:number|undefined){
        return instance.get(`Role/GetRoleUserInfoNotExit?id=${id}&name=${name}&pageNo=${pageNo}&pageSize=${pageSize}`)
    }
}
export default new RoleConfig();