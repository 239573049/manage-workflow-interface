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
}
export default new RoleConfig();