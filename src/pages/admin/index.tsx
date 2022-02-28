import React from 'react'
import { Layout, Menu, Image, Popover, message } from 'antd';
import { UserInfo } from '../../model/userInfo/userInfo';
import './index.less'
import AdminApi from '../../apis/admin/index'
import { Response } from '../../model/request/Api'
import { LoginVM } from '../../model/login/login';
import Work from './work';
import Home from './home/index'
import User from './user/index'
import WorkConfig from './system/workConfig';
import Error404 from '../error404';
import RoleConfig from './system/roleConfig/index'
import UserConfig from './system/userConfig/index';
import LoginApi from '../../apis/login/index'
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;


class Admin extends React.Component {
  /**
   * 获取当前账号权限菜单
   */
  getMenu() {
    AdminApi.GetUserMenuList()
      .then(res => {
        var data = res.data as Response<LoginVM>
        console.log(data.data);
        if (data.statusCode === 200) {
          this.setState({
            menu: this.getMenuNodes(data.data as never)
          })
        }
      })
  }
  getUserInfo() {
    var user = JSON.parse(window.sessionStorage.getItem("user")!) as UserInfo
    this.setState({
      user: user
    })
  }

  componentWillMount() {
    this.getMenu()
    this.getUserInfo()
  }
  /**
   * 获取点击菜单进行模块展示
   * @param item 
   */
  menuOnClick(item: any) {
    let components = <Error404 />
    switch (item.component) {
      case "User":
        components = <User />
        break;
      case "Home":
        components = <Home />
        break;
      case "Work":
        components = <Work />
        break;
      case "WorkConfig":
        components = <WorkConfig />
        break;
      case "RoleConfig":
        components = <RoleConfig />
        break;
      case "UserConfig":
        components = <UserConfig />
        break;
    }
    this.setState({
      component: components
    })
  }
  getMenuNodes = (menuList: any[]) => {
    return menuList.map(item => {
      if (item.children.length === 0) {
        return (
          <Menu.Item key={item.key} icon="" onClick={() => { this.menuOnClick(item) }}>
            {item.title}
          </Menu.Item>
        )
      } else {
        return (
          // 第三种方法直接使用React.createElement
          <SubMenu key={item.key} icon="" title={item.title}>
            {this.getMenuNodes(item.children)}
          </SubMenu>
        )
      }
    })
  }
  state = {
    menu: [],
    collapsed: false,
    searchValue: "",
    component: <Home />,
    user: new UserInfo()
  };

  onCollapse = (collapsed: any) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };
  logOut(){
    window.sessionStorage.removeItem("user")
    window.sessionStorage.removeItem("token")
    LoginApi.LogOut()
      .then(res=>{
        message.success("退出登录成功")
        window.location.href="/"
      })
  }

  render(): React.ReactNode {
    const { collapsed, menu, component, user } = this.state;
    const content = (
      <div>
        <p className="information">个人信息</p>
        <p className="information">消息提醒</p>
        <p onClick={this.logOut} className="information">退出登录</p>
      </div>
    );
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <Menu
            style={{ width: "100%" }}
            mode="inline"
            theme="dark"
          >
            {menu}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} >
            <div
              className='headPortraits'>
                <Popover content={content} >
              <Image
                width={50}
                preview={false}
                src={user.headPortraits}
              /></Popover>
            </div>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            {component}
          </Content>
          <Footer style={{ textAlign: 'center' }}>Token ©2022 </Footer>
        </Layout>
      </Layout>
    )
  }
}
export default Admin