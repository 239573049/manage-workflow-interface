import Abstract from '../../utils/request/request'
class LoginApi extends Abstract{
    GetUserMenuList(){
        return this.get({url:'/Menu/GetUserMenuList'})
    }
}
export default new LoginApi()