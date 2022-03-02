
import Work from '../admin/work';
import Home from '../admin/home/index'
import User from '../admin/user/index'
import WorkConfig from '../admin/system/workConfig';
import Error404 from '../error404';
import RoleConfig from '../admin/system/roleConfig/index'
import UserConfig from '../admin/system/userConfig/index';
interface IMenu {
    [propName: string]: JSX.Element;
}

const Menu: IMenu =  {
    Work: <Work />, Home: <Home />, User: <User />, WorkConfig: <WorkConfig />, Error404: <Error404 />, RoleConfig: <RoleConfig />, UserConfig: <UserConfig />,
}

export default Menu;