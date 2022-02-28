import instance from '../../utils/request/request'
import {LoginVM}from '../../model/login/login'
class LoginApi {
    Login(value:LoginVM){
        return instance.post('/Login/Login',value)
    }
    LogOut(){
        return instance.delete('/Login/LogOut')
    }
}
export default new LoginApi()