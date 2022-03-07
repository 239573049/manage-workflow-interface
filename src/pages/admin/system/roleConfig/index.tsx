import React from "react";
import { FormOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import RoleConfigApi from '../../../../apis/admin/roleConfig/index'
import './index.less'
import Role from '../../../../model/role/role'
import { Button, Form, Input, message, Modal, Table, Tabs } from "antd";
import Paging from '../../../../model/paging/paging'
import { UserInfo } from "../../../../model/userInfo/userInfo";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import roleConfig from "../../../../apis/admin/roleConfig/index";
const { TabPane } = Tabs;
const { confirm } = Modal;
interface IState {
    data: Search,
    role_list: Role[],
    isUpdateRoleVisible: boolean,
    updateRole: Role | undefined,
    pitch: string,
    userInfoList: Paging<UserInfo> | undefined,
    userInfoSelection: [],
    roleModal: {
        initialValue: Role | undefined,
        state: string | 'add' | 'put',
        isVisible: boolean| undefined,
    },
    updateInfoModalTitle: string,
    TabOperationData: any,
    addRoleUserInfoSearch: {
        id: string | undefined,
        name: string | undefined,
        pageNo: number | undefined,
        pageSize: number | undefined
    }
}
interface IProps {

}
class Search {
    name: string | undefined;
}
/***
 * 用户表格表头
 */
const UserInfoTab = [
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
];

class RoleConfig extends React.Component<IProps, IState>{
    state: IState = {
        data: new Search(),
        role_list: [],
        isUpdateRoleVisible: false,
        updateRole: undefined,
        pitch: '',
        userInfoList: undefined,
        userInfoSelection: [],
        updateInfoModalTitle: '',
        TabOperationData: undefined,
        addRoleUserInfoSearch: {
            id: undefined,
            name: undefined,
            pageNo: undefined,
            pageSize: undefined
        },
        roleModal: {
            initialValue: undefined,
            state: "add",
            isVisible: false
        }
    }
    /**
     * 自定义Tab按钮
     */
    sort = <div><span><Button onClick={() => { this.GetRoleUserInfoNotExit() }}>添加用户</Button></span><span> <Button onClick={() => { this.deleteRoleUserInfo() }}>删除用户</Button></span></div>
    deleteRoleUserInfo() {
        var { userInfoSelection } = this.state;
        console.log(userInfoSelection);

    }
    /**
     * 渲染前
     */
    componentWillMount() {
        this.GetUserMenuList(true)
    }
    /**
     * 获取角色不存在的用户
     */
    GetRoleUserInfoNotExit() {
        var { addRoleUserInfoSearch, pitch } = this.state;

        if (pitch === '') {
            message.warning('请先选择角色')
            return;
        }
        RoleConfigApi.GetRoleUserInfoNotExit(pitch, addRoleUserInfoSearch?.name ?? '', addRoleUserInfoSearch?.pageNo ?? 1, addRoleUserInfoSearch?.pageSize ?? 20)
            .then(res => {
                if (res.data.statusCode === 200) {
                    var data = res.data.data;
                    console.log(data);
                }

            })
    }
    /**
     * 获取角色列表
     */
    GetUserMenuList(initial: boolean = false) {
        RoleConfigApi.GetUserMenuList(this.state.data.name ?? "")
            .then((res) => {
                if (initial && res.data.statusCode === 200 && res.data.data.length > 0) {
                    this.updateRolePitch(res.data.data[0])
                }
                this.setState({
                    role_list: [...res.data.data]
                })

            })
    }
    GetRoleUserInfo(id: string | undefined, pageNo: number | 1, pageSize: number | 20) {
        RoleConfigApi.GetRoleUserInfo(id, pageNo, pageSize)
            .then(res => {
                var data = res.data;
                if (data.statusCode === 200) {
                    var json = data.data as Paging<UserInfo>
                    this.setState({
                        userInfoList: json
                    })
                }

            })
    }
    /**
     * 编辑添加角色
     */
    updateRole(role: Role | undefined, state: string | 'add' | 'put') {
        var { roleModal } = this.state;
        roleModal.initialValue = role;
        roleModal.state = state;
        roleModal.isVisible = true;
        this.setState({ roleModal })
    }
    /**
     * 删除角色
     * @param role 
     */
    deleteRole(role: Role | undefined) {
        if (role) {
            confirm({
                title: '删除用户',
                content: '是否删除角色' + role.name,
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                onOk: () => {
                    RoleConfigApi.DeleteRole(role.id!)
                        .then(res => {
                            if (res.data.statusCode === 200) {
                                message.success("删除成功")
                            } else {
                                message.error(res.data.message);
                            }
                            this.GetUserMenuList()
                        })
                },
            });

        }
    }
    /**
     * 编辑添加角色
     */
    updateRoleOK(value:any) {
        var { roleModal } = this.state;
        if (roleModal.state === 'add') {
            RoleConfigApi.CreateRole(value)
                .then(res => {
                    message.success("添加成功")
                    this.GetUserMenuList()
                    roleModal.isVisible=false
                    this.setState({ roleModal })
                })
        } else {
            RoleConfigApi.UpdateRole(roleModal.initialValue!)
                .then(res => {
                    message.success("编辑成功")
                    this.GetUserMenuList()
                    roleModal.isVisible=false
                    this.setState({ roleModal })
                })
        }

    }
    /**
     * 记录编辑id
     */
    updateRolePitch(value: Role) {
        if (value) {
            this.GetRoleUserInfo(value.id, 1, 20)
            this.setState({
                pitch: value.id!
            })
        }
    }
    roleTab(value:any) {
        console.log(value);
    }
    onUserInfoSelectChange = (userInfoSelection: any) => {
        this.setState({ userInfoSelection });
    };
    /**
     * 拖动逻辑处理
     */
    onDragEnd = (result: any) => {
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;
        if (sourceIndex === destinationIndex) {
            return;
        }
        const userList = this.state.role_list;
        const [draggedItem] = userList.splice(sourceIndex, 1);
        userList.splice(destinationIndex, 0, draggedItem);
        var destination = userList[sourceIndex];
        destination.index = sourceIndex;
        draggedItem.index = destinationIndex;
        //更新数据
        roleConfig.UpdateRoleIndex([draggedItem, destination])
        this.setState({
            role_list: userList,
        });
    };

    render(): React.ReactNode {
        var { role_list, pitch, userInfoSelection, userInfoList, roleModal } = this.state;
        const rowSelection = {
            userInfoSelection,
            onChange: this.onUserInfoSelectChange,
        };
        return (
            <div className="role-container">
                <div className="role-list-div">
                    <div className="role-list-title">
                        <span>角色架构 </span>
                        <Button style={{ width: '70px' }} onClick={() => { this.updateRole(undefined, 'add') }}>添加</Button>
                    </div><br />
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <div className="myModal">
                            <Droppable droppableId="mymodal" direction="horizontal">
                                {(provided) => (
                                    <div
                                        className="modalList"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}>
                                        {role_list.map((item, index) => (
                                            <Draggable draggableId={item.id!} index={index} key={item.key}>
                                                {(provided) => (
                                                    <div
                                                        className="modal"
                                                        key={item.name}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}>
                                                        <div key={item.key} className={pitch === item.id ? "role-list-div-list-pitch" : "role-list-div-list-notpitch"} onClick={() => { this.updateRolePitch(item) }}>
                                                            <span className="role-list-div-list role-list-div-role-title">
                                                                <UserOutlined />
                                                                {item.name}
                                                            </span>
                                                            <span className="role-list-div-role-edit">
                                                                <DeleteOutlined onClick={() => this.deleteRole(item)} />
                                                            </span>
                                                            <span className="role-list-div-role-edit">
                                                                <FormOutlined onClick={() => { this.updateRole(item, 'put') }} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </DragDropContext>
                </div>
                <div className="role-list-data role-tab-div">
                    <Tabs defaultActiveKey="1" onChange={(value:any) => this.roleTab(value)} className="role-tab-div" tabBarExtraContent={this.sort}>
                        <TabPane tab="用户角色" key="1" className="role-tab-div" >
                            {<Table rowSelection={rowSelection} columns={UserInfoTab} dataSource={userInfoList?.data} />}
                        </TabPane>
                    </Tabs>
                </div>

                <Modal title={roleModal.state === 'add' ? "添加角色" : "编辑角色"}
                    onCancel={() => this.setState({ roleModal:{isVisible:false,state:'add',initialValue:undefined} })
                    } 
                    destroyOnClose
                    visible={roleModal.isVisible} footer={[]}>
                    <Form name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={roleModal.initialValue}
                        onFinish={(value: any) => this.updateRoleOK(value)}>
                        <Form.Item
                            label="角色名称："
                            name="name"
                            rules={[{ required: true, message: '请输入角色名称！' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="角色编号："
                            name="code"
                            rules={[{ required: true, message: '请输入角色编号！' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="角色备注："
                            name="remark"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name='id'>
                            <Button type="primary" htmlType="submit" style={{ float: 'right' }}>{roleModal.state === 'add' ? "确认添加" : "确认编辑"}</Button>
                        </Form.Item>
                    </Form>
                </Modal>

            </div>

        )
    }
}
export default RoleConfig