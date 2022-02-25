import React from 'react'
import { Layout,Row,Col} from 'antd';

const { Header, Content, Footer } = Layout;

class Login extends React.Component {
    render() {
        return (
            <div style={}>
                <Layout>
                    <Header>
                        1
                    </Header>
                    <Content>
                        
                        <Row>
                        <Col span={12} offset={6}>
                            col-12 col-offset-6
                        </Col>
                        </Row>
                    </Content>
                    <Footer>
                        
                    </Footer>
                </Layout>
            </div>
        )
    }
}

export default Login;