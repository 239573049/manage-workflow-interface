import React from 'react'
import { Layout, Menu, Popover, message, Card, Avatar, Tabs } from 'antd';
import { UserInfo } from '../../model/userInfo/userInfo';
import './index.less'
import AdminApi from '../../apis/admin/index'
import { Response } from '../../model/request/Api'
import LoginApi from '../../apis/login/index';
import PANE from '../menu';
const { Header, Content, Footer, Sider } = Layout;
const { TabPane } = Tabs;
const { SubMenu } = Menu;

interface IState {
  menu: any[],
  panes: {
    title: string, content: string, key: string
  }[],
  activeKey: string;
  collapsed: boolean,
  searchValue: string;
  user: null | UserInfo
}
interface IProps {

}

class Admin extends React.Component<IProps, IState> {
  state: IState = {
    menu: [],
    panes: [],
    activeKey: "",
    collapsed: false,
    searchValue: "",
    user: new UserInfo()
  };
  onChange = (activeKey: string) => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey: any, action: "add" | "remove") => {
    if (action === "remove" && this.state.panes.length === 1) {
      message.warning("标签页不能小于一个");
      return;
    } else if (action === "remove") {
      this.remove(targetKey);
    }
  };

  add = (title: string, content: string, key: string) => {
    const panes = this.state.panes
      const activeKey = panes && panes.find(a => a.key === key);
    if (activeKey ) {
      this.setState({ activeKey:activeKey.key });
    } else {
      panes.push({ title: title, content: content, key: key });
      this.setState({ panes:[...panes], activeKey:key });
    }
  };

  remove = (targetKey: string) => {
    let { activeKey } = this.state;
    let lastIndex = 0;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = panes[0].key;
      }
    }
    this.setState({ panes, activeKey });
  };
  /**
   * 获取当前账号权限菜单
   */
  getMenu() {
    AdminApi.GetUserMenuList()
      .then(res => {
        var data = res.data as Response<any[]>
        if (data.statusCode === 200) {
          var menu=data.data[0];
          this.add(menu.title,menu.component,menu.key)
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
    console.log(item);
    this.add(item.title, item.component, item.key)
  }
  getMenuNodes = (menuList: any[]) => {
    return menuList.map(item => {
      if (item.children.length === 0) {
        return (
          <Menu.Item key={item.key} onClick={() => { this.menuOnClick(item) }}>
            {item.title}
          </Menu.Item>
        )
      } else {
        return (
          // 第三种方法直接使用React.createElement
          <SubMenu key={item.key}  title={item.title}>
            {this.getMenuNodes(item.children)}
          </SubMenu>
        )
      }
    })
  }

  onCollapse = (collapsed: any) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };
  logOut() {
    window.sessionStorage.removeItem("user")
    window.sessionStorage.removeItem("token")
    LoginApi.LogOut()
      .then(res => {
        message.success("退出登录成功")
        window.location.href = "/"
      })
  }


  render(): React.ReactNode {
    const { collapsed, menu, user } = this.state;
    const content = (
      <div className='user-info-content'>
        <div className='card-user'>个人信息</div>
        <div className='card-user'>消息提醒</div>
        <div className='card-user' onClick={this.logOut} >退出登录</div>
      </div>
    );
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse} theme="light">
          <Menu
            style={{ width: "100%" }}
            mode="inline"
            theme="light"
          >
            {menu}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} >
            <div
              className='headPortraits'>
              <span>
                <Popover content={content} >
                  <Avatar size="large" src={user?.headPortraits|| ''} /></Popover>
              </span>
              <span>
                {user?.name || ''}
              </span>
            </div>
          </Header>
          <Content style={{ margin: '0 16px',height:'100%'}}>
            <Tabs
              hideAdd
              onChange={this.onChange}
              activeKey={this.state.activeKey}
              type="editable-card"
              onEdit={this.onEdit}
              style={{height:'100%'}}
            >
              {this.state.panes.map(pane => (
                <TabPane tab={pane.title} key={pane.key} style={{height:'100%'}}>
                  <Card hoverable  style={{height:'740px',overflow:"auto"}}>
                  {PANE[pane.content]}
                  </Card>
                </TabPane>
              ))}x
            </Tabs>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Token ©2022 </Footer>
        </Layout>
      </Layout>
    )
  }
}
export default Admin