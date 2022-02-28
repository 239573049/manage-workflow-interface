import { Form, Input, Button, Checkbox, Layout, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import React from 'react'
import {LoginVM,LoginUserInfo} from '../../model/login/login'
import {Response} from '../../model/request/Api'
import LoginApi from '../../apis/login/index'
import './index.less'
import {encryptByDES} from '../../utils/des/des'
const { Footer,  Content } = Layout;
class Login extends React.Component{
    onFinish = (values: LoginVM) => {
        values.password=encryptByDES(values.password!)
        LoginApi.Login(values)
            .then((res)=>{
                var response=res.data as Response<LoginUserInfo>;
                if(response.statusCode===200){
                    window.sessionStorage.setItem("token",response.data.token!)
                    window.sessionStorage.setItem("user",JSON.stringify(response.data.userInfo))
                    window.location.href="/admin"
                }
            })
    };

    render(): React.ReactNode {
        return (
            <div className='Login_div'>
                
            <Layout>
                <Content>
                    <Row>
                        <Col xs={2} sm={4} md={6} lg={8} xl={10}>
    
                        </Col>
                        <Col xs={20} sm={16} md={12} lg={8} xl={4}>
    
                            <div className='Login ContentLogin'>
                                <div className='Title'>Token管理系统</div>
                                <Form
                                    name="normal_login"
                                    className="login-form"
                                    initialValues={{
                                        remember: true,
                                    }}
                                    onFinish={this.onFinish}
                                >
                                    <Form.Item
                                        name="accountNumber"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入您的账号',
                                            },
                                        ]}
                                    >
                                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入您的密码',
                                            },
                                        ]}
                                    >
                                        <Input
                                            prefix={<LockOutlined className="site-form-item-icon" />}
                                            type="password"
                                            placeholder="Password"
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Form.Item name="remember" valuePropName="checked" noStyle>
                                            <Checkbox>记住密码</Checkbox>
                                        </Form.Item>
                                        <a className="login-form-forgot" href="">
                                            忘记密码
                                        </a>
                                    </Form.Item>
    
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" className="login-form-button">
                                            登录
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Col>
                        <Col xs={2} sm={4} md={6} lg={8} xl={10}>
    
                        </Col>
                    </Row>
                </Content>
                <Footer>
    
                </Footer>
            </Layout>
            </div>
        );
    }
}

export default Login