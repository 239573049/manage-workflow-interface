import React from "react";
import { FormOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import RoleConfigApi from '../../../../apis/admin/roleConfig/index'
import './index.less'
import Role from '../../../../model/role/role'
import { Button, Form, Input, message, Modal, Table, Tabs, Tree } from "antd";
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
    userInfoSelection: [],
    roleModal: {
        initialValue: Role | undefined,
        state: string | 'add' | 'put',
        isVisible: boolean | undefined,
    },
    updateInfoModalTitle: string,
    TabOperationData: any,
    addRoleUserInfoSearch: {
        id: string | undefined,
        name: string | undefined,
        pageNo: number | undefined,
        pageSize: number | undefined
    },
    GetRoleUserInfo: {
        id: string,
        count: number,
        pageNo: number | 1,
        pageSize: number | 20,
        data: UserInfo[]
    },
    addRoleUserInfo: {
        id: string | '',
        name: string | '',
        count: number,
        data: UserInfo[]
        isVisible: boolean,
        pageNo: number | 1,
        pageSize: number | 20
        userInfoSelection: []
    },
    menuTree: {
        expandedKeys: any[],
        checkedKeys: any[],
        defaultSelectedKeys: any[],
        selectedKeys: any[],
        autoExpandParent: boolean,
        menuTreeData: any[]
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
        dataIndex: 'statusName',
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
const RoleUserInfoTab = [
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
    }
];
class RoleConfig extends React.Component<IProps, IState>{
    state: IState = {
        data: new Search(),
        role_list: [],
        isUpdateRoleVisible: false,
        updateRole: undefined,
        pitch: '',
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
        },
        addRoleUserInfo: {
            id: '',
            name: '',
            count: 1,
            data: [],
            pageNo: 1,
            pageSize: 20,
            isVisible: false,
            userInfoSelection: []
        },
        GetRoleUserInfo: {
            id: "",
            count: 0,
            pageNo: 1,
            pageSize: 20,
            data: []
        },
        menuTree: {
            expandedKeys: [],
            checkedKeys: [],
            selectedKeys: [],
            defaultSelectedKeys: [],
            autoExpandParent: true,
            menuTreeData: []
        }
    }
    /**
     * 自定义Tab按钮
     */
    sort = <div><span><Button onClick={() => { this.GetRoleUserInfoNotExit() }}>添加用户</Button></span><span> <Button onClick={() => { this.deleteRoleUserInfo() }}>删除用户</Button></span></div>
    deleteRoleUserInfo() {
        var { userInfoSelection, GetRoleUserInfo, pitch } = this.state;
        var data = GetRoleUserInfo.data.filter(a => userInfoSelection.includes(a.key as never)).map(a => a.id);
        this.CreateRoleUser(data, pitch, false)
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
        var { addRoleUserInfo, pitch } = this.state;
        if (pitch === '') {
            message.warning('请先选择角色')
            return;
        }
        RoleConfigApi.GetRoleUserInfoNotExit(pitch, addRoleUserInfo?.name ?? '', addRoleUserInfo?.pageNo ?? 1, addRoleUserInfo?.pageSize ?? 20)
            .then((res:any) => {
                if (res.code === 200) {
                    var data = res.data;
                    addRoleUserInfo.data = data.data;
                    if (addRoleUserInfo.isVisible === false) {
                        addRoleUserInfo.isVisible = true;
                    }
                    addRoleUserInfo.count = data.count;
                    this.setState({ addRoleUserInfo })
                }

            })
    }
    /**
     * 获取角色列表
     */
    GetUserMenuList(initial: boolean = false) {
        RoleConfigApi.GetUserMenuList(this.state.data.name ?? "")
            .then((res) => {
                var data = res.data
                
                if (initial && data.length > 0) {
                    
                    this.updateRolePitch(data[0])
                }
                this.setState({
                    role_list: [...data]
                })

            })
    }
    /**
     * 获取角色用户信息
     */
    GetRoleUserInfo(id: string = '') {
        var { pitch, GetRoleUserInfo } = this.state;
        pitch = id === '' ? pitch : id;
        RoleConfigApi.GetRoleUserInfo(pitch, GetRoleUserInfo.pageNo, GetRoleUserInfo.pageSize)
            .then((res:any) => {
                var data = res.data;
                if (res.code === 200) {
                    var json = data as Paging<UserInfo>
                    GetRoleUserInfo.data = json.data;
                    GetRoleUserInfo.count = json.count;
                    this.setState({ GetRoleUserInfo })
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
    updateRoleOK(value: any) {
        var { roleModal } = this.state;
        if (roleModal.state === 'add') {
            RoleConfigApi.CreateRole(value)
                .then(res => {
                    message.success("添加成功")
                    this.GetUserMenuList()
                    roleModal.isVisible = false
                    this.setState({ roleModal })
                })
        } else {
            RoleConfigApi.UpdateRole(roleModal.initialValue!)
                .then(res => {
                    message.success("编辑成功")
                    this.GetUserMenuList()
                    roleModal.isVisible = false
                    this.setState({ roleModal })
                })
        }

    }
    /**
     * 记录编辑id
     */
    updateRolePitch(value: Role) {
        if (value) {
            this.setState({
                pitch: value.id!
            })
            console.log(value);
            this.GetRoleUserInfo(value.id!)
            this.GetMenuTreeAll(value.id!)
        }
    }
    roleTab(value: any) {
        console.log(value);
    }
    onUserInfoSelectChange = (userInfoSelection: any) => {
        this.setState({ userInfoSelection });
    };
    onAddRoleUserInfoChange = (userInfoSelection: any) => {
        var { addRoleUserInfo } = this.state;
        addRoleUserInfo.userInfoSelection = userInfoSelection;
        this.setState({ addRoleUserInfo })
    }
    /**
     * 拖动逻辑处理
     */
    onDragEnd = (result: any) => {
        const sourceIndex = result.source.index;
        if (result.destination == null) return;
        const destinationIndex = result.destination.index;
        if (sourceIndex === destinationIndex) {
            return;
        }
        const userList = this.state.role_list;
        const [draggedItem] = userList.splice(sourceIndex, 1);
        userList.splice(destinationIndex, 0, draggedItem);
        var destination = userList[sourceIndex];
        destination.index = sourceIndex;//更新节点位置
        draggedItem.index = destinationIndex;
        //更新数据
        roleConfig.UpdateRoleIndex(userList)
        this.setState({
            role_list: userList,
        });
    };
    onAddRoleUserInfo() {
        var { addRoleUserInfo, pitch } = this.state;
        var data = addRoleUserInfo.data.filter(a => addRoleUserInfo.userInfoSelection.includes(a.key as never)).map(a => a.id)
        this.CreateRoleUser(data, pitch, true)
    }
    /**
     * 更新添加用户至角色页数
     * @param pagination 
     * @param filters 
     * @param sorter 
     */
    onTabAddRoleUserInforPage(pagination: any, filters: any, sorter: any) {
        var { addRoleUserInfo } = this.state;
        addRoleUserInfo.pageNo = pagination.current
        addRoleUserInfo.pageSize = pagination.pageSize
        this.setState({ addRoleUserInfo })
        this.GetRoleUserInfoNotExit()
    }
    /**
     * 更新角色用户页数
     * @param pagination 
     * @param filters 
     * @param sorter 
     */
    onTabAddRoleInforPage(pagination: any, filters: any, sorter: any) {
        var { GetRoleUserInfo } = this.state;
        GetRoleUserInfo.pageNo = pagination.current
        GetRoleUserInfo.pageSize = pagination.pageSize
        this.setState({ GetRoleUserInfo })
        this.GetRoleUserInfo()
    }
    CreateRoleUser(userIds: any[], roleId: string, isAdd: boolean = true) {
        var { addRoleUserInfo } = this.state
        RoleConfigApi.CreateRoleUser(userIds, roleId, isAdd)
            .then(res => {
                message.success("操作成功")
                addRoleUserInfo.isVisible = false
                this.setState({ addRoleUserInfo })
                this.GetRoleUserInfo()
            })
    }
    /**
     * 获取菜单树形结构
     */
    GetMenuTreeAll(id: string | undefined) {
        var { pitch, menuTree } = this.state;
        RoleConfigApi.GetMenuTreeAll(id ?? pitch)
            .then(res => {
                var data = res.data;
                
                menuTree.menuTreeData = [...data.item1];
                menuTree.checkedKeys = [...data.item2];
                this.setState({ menuTree })
            })
    }

    onExpand = (expandedKeysValue: React.Key[]) => {
        console.log('onExpand', expandedKeysValue);
        var { menuTree } = this.state;
        menuTree.expandedKeys = expandedKeysValue;
        menuTree.autoExpandParent = false
        this.setState({ menuTree })
    }

    onCheck = (checkedKeysValue: React.Key[]) => {
        var { menuTree } = this.state;
        menuTree.checkedKeys = checkedKeysValue;
        this.CreateRoleMenu(checkedKeysValue)
        this.setState({ menuTree })
    }

    onSelect = (selectedKeysValue: React.Key[], info: any) => {
        console.log('onSelect', info);
        var { menuTree } = this.state;
        menuTree.selectedKeys = selectedKeysValue;
        this.setState({ menuTree })
    }
    CreateRoleMenu(ids:any[]){
        var {pitch}=this.state
        RoleConfigApi.CreateRoleMenu(ids,pitch)
            .then(res=>{
                message.success('成功')
            })
    }
    render(): React.ReactNode {
        var { role_list, pitch, userInfoSelection, roleModal, addRoleUserInfo, GetRoleUserInfo, menuTree } = this.state;
        const rowSelection = {
            userInfoSelection,
            onChange: this.onUserInfoSelectChange,
        };
        const addRoleSelection = {
            addRoleUserInfo: addRoleUserInfo.userInfoSelection,
            onChange: this.onAddRoleUserInfoChange
        }
        return (
            <div className="role-container">
                <div className="role-list-div">
                    <div className="role-list-title">
                        <span>角色架构 </span>
                        <Button style={{ width: '70px' }} onClick={() => { this.updateRole(undefined, 'add') }}>添加</Button>
                    </div><br />
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <div className="myModal">
                            <Droppable  droppableId="droppable">
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
                    <Tabs defaultActiveKey="1" onChange={(value: any) => this.roleTab(value)} className="role-tab-div" tabBarExtraContent={this.sort}>
                        <TabPane tab="用户角色" key="1" className="role-tab-div" >
                            {<Table
                                onChange={(pagination: any, filters: any, sorter: any) => { this.onTabAddRoleInforPage(pagination, filters, sorter) }}
                                pagination={{ position: ["bottomRight"], pageSize: GetRoleUserInfo.pageSize, current: GetRoleUserInfo.pageNo, total: GetRoleUserInfo.count }}
                                rowSelection={rowSelection}
                                scroll={{ y: 480 }}
                                columns={UserInfoTab}
                                dataSource={GetRoleUserInfo?.data}
                            />}
                        </TabPane>
                        <TabPane tab="菜单角色" key="2" className="role-tab-div">
                            <Tree
                                checkable
                                defaultExpandAll
                                defaultSelectedKeys={menuTree.defaultSelectedKeys}
                                onExpand={(e: any) => this.onExpand(e)}
                                expandedKeys={menuTree.expandedKeys}
                                autoExpandParent={menuTree.autoExpandParent}
                                onCheck={(e: any) => this.onCheck(e)}
                                checkedKeys={menuTree.checkedKeys}
                                onSelect={(e: any, info: any) => this.onSelect(e, info)}
                                selectedKeys={menuTree.selectedKeys}
                                treeData={menuTree.menuTreeData}
                            />
                        </TabPane>
                    </Tabs>
                </div>

                <Modal title={roleModal.state === 'add' ? "添加角色" : "编辑角色"}
                    onCancel={() => this.setState({ roleModal: { isVisible: false, state: 'add', initialValue: undefined } })
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
                <Modal title='添加用户'
                    destroyOnClose
                    onCancel={() => {
                        addRoleUserInfo.isVisible = false;
                        this.setState({ addRoleUserInfo })
                    }}
                    onOk={() => this.onAddRoleUserInfo()}
                    visible={addRoleUserInfo.isVisible}>
                    <div className="condition">
                        <span>用户名：<Input style={{ width: '200px' }} onChange={(e: any) => {
                            addRoleUserInfo.name = e.target.value;
                            this.setState({ addRoleUserInfo })
                        }} /></span>
                        <span><Button onClick={() => this.GetRoleUserInfoNotExit()}>搜索</Button></span>
                    </div>
                    <div>
                        {<Table
                            onChange={(pagination: any, filters: any, sorter: any) => { this.onTabAddRoleUserInforPage(pagination, filters, sorter) }}
                            pagination={{ position: ['bottomRight'], pageSize: addRoleUserInfo.pageSize, current: addRoleUserInfo.pageNo, total: addRoleUserInfo.count }}
                            rowSelection={addRoleSelection} columns={RoleUserInfoTab} dataSource={addRoleUserInfo.data} scroll={{ y: 450 }} />}
                    </div>
                </Modal>
            </div>

        )
    }
}
export default RoleConfig