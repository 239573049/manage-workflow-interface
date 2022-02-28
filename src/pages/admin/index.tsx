import React from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './index.less'
import AdminApi from '../../apis/admin/index'
import { Link } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class Admin extends React.Component {

  getMenuNodes = (menuList: any[]) => {
    return menuList.map(item => {
      // 第一种方法使用变量
      // const icon = React.createElement(Icon[item.icon])
      if (!item.children) {
        return (
          <Menu.Item key={item.key} icon="">
            <Link to={item.key}>
              <span>{item.title}</span>
            </Link>
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

  constructor(props: any) {
    super(props);
    AdminApi.GetUserMenuList()
      .then((res) => {
        if (res.statusCode === 200) {
          var data = res.data as never;
          this.setState({
            menu: this.getMenuNodes(data)
          })

        }
      })
  }
  state = {
    meno: [],
    collapsed: false,
    searchValue: "",

  };

  onCollapse = (collapsed: any) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };


  render(): React.ReactNode {
    const { collapsed } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <Menu
            style={{ width: "100%" }}
            mode="inline"
            theme="dark"
          >
            {this.state.meno}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              Bill is a cat.
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    )
  }
}
export default Admin