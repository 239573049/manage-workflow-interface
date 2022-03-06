import React from "react";
import { SearchOutlined } from '@ant-design/icons';
import { Input, Select, DatePicker, Button, Table, Modal, Form, InputNumber, message } from 'antd'
import './index.less'
import UserInfoApi from '../../../apis/userInfo/userInfo'
import moment from "moment";
import { UserInfo } from "../../../model/userInfo/userInfo";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { encryptByDES } from '../../../utils/des/des'
const { Option } = Select;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
interface IState {
    condition: {
        code: string | undefined,
        startTime: string | undefined,
        endTime: string | undefined,
        statue: number,
        pageNo: number,
        pageSize: number
    },
    userInfoData: {
        data: UserInfo[],
        count: number
    },
    modalModel: {
        state: string | 'add' | 'put',
        initialValue: any,
        isAddUserInfo: boolean
    }
}
interface IProps {

}

class UserAdmin extends React.Component<IProps, IState> {
    state = {
        condition: {
            code: '',
            startTime: '',
            endTime: '',
            statue: -1,
            pageNo: 1,
            pageSize: 10
        },
        userInfoData: {
            data: [],
            count: 1,
        },
        modalModel: {
            state: 'add',
            initialValue:new UserInfo(),
            isAddUserInfo: false
        }
    }

    /***
     * 用户表格表头
     */
    UserInfoTab = [
        {
            title: '序号',
            dataIndex: 'key',
        },
        {
            title: '账号',
            dataIndex: 'accountNumber',
        },
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '性别',
            dataIndex: 'sexName',
        },
        {
            title: '账号状态',
            dataIndex: 'statueName',
        },
        {
            title: '手机号',
            dataIndex: 'mobileNumber',
        },
        {
            title: '邮箱',
            dataIndex: 'eMail',
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (value: any, user: UserInfo) => {
                return (
                    <div>
                        <span>
                            <Button onClick={()=>{
                                var modalModel={state:'put',isAddUserInfo:true,initialValue:user}
                                this.setState({modalModel})
                            }}>编辑</Button>
                        </span>
                        <span>
                            <Button onClick={() => this.showDeleteConfirm(user)}>删除</Button>
                        </span>
                    </div>
                )
            }
        },

    ];
    showDeleteConfirm = (data: UserInfo) => {
        confirm({
            title: '删除用户',
            icon: <ExclamationCircleOutlined />,
            content: '是否删除用户' + data.name,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => this.deleteUserInfo(data),
        });
    }
    componentWillMount() {
        this.UserApi()
    }

    userstatueChange(e: number) {
        var { condition } = this.state
        condition.statue = e;
        this.setState({
            condition
        })
    }

    UserApi() {
        var { condition } = this.state
        UserInfoApi.GetUserInfoPaging(condition.code, condition.startTime, condition.endTime, condition.statue, condition.pageNo, condition.pageSize)
            .then(res => {
                var data = res.data.data;
                this.setState({ userInfoData: { data: data.data, count: data.count } })
            })
    }

    onConditionClick() {
        this.UserApi()
    }
    /**
     * 时间更新
     */
    onConditionDateChange(e: any) {
        var { condition } = this.state
        condition.startTime = e ? moment(e[0]).format('YYYY-MM-DD 00:00:00') : '';
        condition.endTime = e ? moment(e[1]).format('YYYY-MM-DD 23:59:59') : '';
        this.setState({
            condition
        })
    }
    /**
     * 删除用户
     * @param e 
     */
    deleteUserInfo
        (e: UserInfo) {
        UserInfoApi.DeleteUserInfo(e.id!)
            .then(res => {
                message.success('删除成功')
                return this.UserApi()
            }).catch(err => {
                var data = err.data;
                message.error(data.message)
            })
    }
    /**
     * 添加账号
     */
    onAddUserInfoClick(value: any) {
        value.password = encryptByDES(value.password);
        UserInfoApi.CreateUserInfo(value)
            .then(res => {
                var data = res.data;
                if (data.statusCode === 200) {
                    message.success('添加成功')
                    var {modalModel}=this.state;
                    modalModel.isAddUserInfo=false
                    this.setState({ modalModel })
                    this.UserApi()
                } else {
                    message.error(data.message)
                }
            }).catch(err => {
                var data = err.data;
                message.error(data.message)
            })
    }
    onFormUserInfo(value:any){
        var {modalModel}=this.state;
        if(modalModel.state==='add'){
            this.onAddUserInfoClick(value)
        }else if(modalModel.state==='put'){
            
        }
    }
    /**
     * 表格页面更新
     */
    onTabChange(pagination: any, filters: any, sorter: any) {
        console.log(pagination);
        var { condition } = this.state
        condition.pageNo = pagination.current
        condition.pageSize = pagination.pageSize
        this.setState({ condition })
        this.UserApi()
    }
    render(): React.ReactNode {
        var { UserInfoTab } = this;
        var { userInfoData, modalModel, condition } = this.state
        return (
            <div>
                <div className="condition">
                    <span>
                        用户名称：<Input onChange={(e) => {
                            var { condition } = this.state
                            condition.code = e.target.value
                            this.setState({ condition })
                        }} style={{ width: '200px' }} />
                    </span>
                    <span>
                        用户色状态：
                        <Select defaultValue={-1} style={{ width: 120 }} onChange={(e) => { this.userstatueChange(e) }}>
                            <Option value={-1}>全部</Option>
                            <Option value={0}>启用</Option>
                            <Option value={1}>禁用</Option>
                        </Select>
                    </span>
                    <span>
                        <RangePicker onChange={(e) => { this.onConditionDateChange(e) }} />
                    </span>
                    <span>
                        <Button type="primary" icon={<SearchOutlined />} onClick={() => this.onConditionClick()}>
                            搜索
                        </Button></span>
                    <span>
                        <Button type="primary" onClick={() => {
                            var modalModel = {state:'add',initialValue:null,isAddUserInfo:true};
                            this.setState({ modalModel })
                        }}>
                            添加用户
                        </Button>
                    </span>
                </div>
                <div>
                    <Table
                        scroll={{ y: 530 }}
                        onChange={(pagination: any, filters: any, sorter: any) => { this.onTabChange(pagination, filters, sorter) }}
                        pagination={{ position: ['bottomRight'], pageSize: condition.pageSize, current: condition.pageNo, total: userInfoData.count }} columns={UserInfoTab} dataSource={userInfoData.data} />
                </div>
                <Modal title={modalModel.state==='add'?'添加用户':'编辑用户'} visible={modalModel.isAddUserInfo}
                    footer={[

                    ]}
                    destroyOnClose
                    onCancel={() => {
                        var { modalModel } = this.state
                        modalModel.isAddUserInfo = false
                        this.setState({ modalModel })
                    }} >
                    <div>
                        <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            initialValues={modalModel.initialValue}
                            onFinish={(value: any) => { this.onFormUserInfo(value) }}
                        >
                            <Form.Item
                                label="账号："
                                name="accountNumber"
                                rules={[{ required: true, message: '请输入账号！' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                style={modalModel.state==='put'?{}:{display:'none'}}
                                label="密码："
                                name="password"
                                rules={[{ required: true, message: '请输入密码！' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="昵称："
                                name="name"
                                rules={[{ required: true, message: '请输入昵称！' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="性别："
                                name="sex"
                            >
                                <Select defaultValue={'1'} placeholder="选择性别">
                                    <Option value="1">男性</Option>
                                    <Option value="2">女性</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="手机号："
                                name="mobileNumber"
                            >
                                <InputNumber min={1} max={19999999999} style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item
                                label="邮箱："
                                name="eMail"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item >
                                <Button type="primary" htmlType="submit" style={{ float: 'right' }}>{modalModel.state==='add'?"添加账号":"编辑账号"}</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
            </div>
        )
    }
}
export default UserAdmin