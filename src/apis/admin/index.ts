import instance from '../../utils/request/request';

class Admin {
    GetUserMenuList(){
        return instance.get('Menu/GetUserMenuList');
    }
}
export default new Admin();