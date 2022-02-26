import Abstract from '../../utils/request/request'
import {LoginVM}from '../../model/login/login'
class LoginApi extends Abstract{
    Login(value:LoginVM){
        return this.post({url:'/Login/Login',data:value})
    }
}
export default new LoginApi()