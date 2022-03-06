import React from "react";
import { FormOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import RoleConfigApi from '../../../../apis/admin/roleConfig/index'
import './index.less'
import Role from '../../../../model/role/role'
import { Button, Input, message, Modal, Popconfirm, Table, Tabs } from "antd";
import Paging from '../../../../model/paging/paging'
import { UserInfo } from "../../../../model/userInfo/userInfo";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import roleConfig from "../../../../apis/admin/roleConfig/index";
const { TabPane } = Tabs;
interface IState {
    data: Search,
    role_list: Role[],
    isUpdateRoleVisible: boolean,
    updateRole: Role | undefined,
    pitch: string,
    userInfoList: Paging<UserInfo> | undefined,
    userInfoSelection: [],
    updateInfoModalTitle:string,
    TabOperationData:any,
    addRoleUserInfoSearch:{
        id:string|undefined,
        name:string|undefined,
        pageNo:number|undefined,
        pageSize:number|undefined
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
        }
    }
    /**
     * 自定义Tab按钮
     */
    sort=<div><span><Button onClick={()=>{this.GetRoleUserInfoNotExit()}}>添加用户</Button></span><span> <Button onClick={()=>{this.deleteRoleUserInfo()}}>删除用户</Button></span></div>
    deleteRoleUserInfo(){
        var {userInfoSelection} =this.state;
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
    GetRoleUserInfoNotExit(){
        var {addRoleUserInfoSearch,pitch}=this.state;

        if(pitch===''){
            message.warning('请先选择角色')
            return;
        }
        RoleConfigApi.GetRoleUserInfoNotExit(pitch,addRoleUserInfoSearch?.name??'',addRoleUserInfoSearch?.pageNo??1,addRoleUserInfoSearch?.pageSize??20)
            .then(res=>{
                if(res.data.statusCode===200){
                    var data=res.data.data;
                    console.log(data);
                }

            })
    }
    /**
     * 获取角色列表
     */
    GetUserMenuList(initial:boolean=false) {
        RoleConfigApi.GetUserMenuList(this.state.data.name ?? "")
            .then((res) => {
                if(initial&&res.data.statusCode === 200&&res.data.data.length>0){
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
    updateRole(role: Role | undefined, isAdd: boolean) {
        if (isAdd) {
            let role: Role = {
                code: '', isAdd: true, name: '', remark: '',
                id: undefined,
                key: undefined,
                parentId: undefined,
                index: 0
            }

            this.setState({
                updateRole: role,
                updateInfoModalTitle:'添加角色',
                isUpdateRoleVisible: true
            })
        } else {
            this.setState({
                updateInfoModalTitle:'编辑角色',
                updateRole: role,
                isUpdateRoleVisible: true
            })
        }
    }
    /**
     * 删除角色
     * @param role 
     */
    deleteRole(role: Role | undefined) {
        if (role) {
            RoleConfigApi.DeleteRole(role.id!)
                .then(res => {
                    if (res.data.statusCode === 200) {
                        message.success("删除成功")
                    } else {
                        message.error(res.data.message);
                    }
                    this.GetUserMenuList()
                })
        }
    }
    /**
     * 编辑添加角色
     */
    updateRoleOK() {
        var role = this.state.updateRole;
        if (role) {
            if (role.isAdd) {
                RoleConfigApi.CreateRole(role)
                    .then(res => {
                        if (res.data.statusCode === 200) {
                            message.success("添加成功")
                        } else {
                            message.error(res.data.message);
                        }
                        this.GetUserMenuList()
                        this.setState({ isUpdateRoleVisible: false, updateRole: undefined })
                    })
            } else {
                RoleConfigApi.UpdateRole(role)
                    .then(res => {
                        if (res.data.statusCode === 200) {
                            message.success("编辑成功")
                        } else {
                            message.error(res.data.message);
                        }
                        this.setState({ isUpdateRoleVisible: false, updateRole: undefined })
                    })
            }
        }
    }
    /**
     * 编辑角色窗口关闭
     */
    updateRoleCancel() {
        this.setState({
            updateRole: undefined,
            isUpdateRoleVisible: false
        })
    }
    /**
     * 编辑角色备注
     *  */
    updateRoleRemark(e: any) {
        var role = this.state.updateRole;
        if (role) {
            role.remark = e.target.value;
        }
        this.setState({ updateRole: role })
    }
    /**
     * 编辑角色编码
     * @param e 
     */
    updateRoleCode(e: any) {
        var role = this.state.updateRole;
        if (role) {
            role.code = e.target.value;
        }
        this.setState({ updateRole: role })
    }
    /**
     * 编辑角色名称
     */
    updateRoleName(e: any) {
        var role = this.state.updateRole;
        if (role) {
            role.name = e.target.value;
        }
        this.setState({ updateRole: role })
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
    roleTab() {

    }
    onUserInfoSelectChange = (userInfoSelection: any) => {
        this.setState({ userInfoSelection });
    };
    /**
     * 拖动逻辑处理
     */
    onDragEnd = (result:any) => {
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;
        if (sourceIndex === destinationIndex) {
          return;
        }
        const userList = this.state.role_list;
        const [draggedItem] = userList.splice(sourceIndex, 1);
        userList.splice(destinationIndex, 0, draggedItem);
        var destination=userList[sourceIndex];
        destination.index=sourceIndex;
        draggedItem.index=destinationIndex;
        //更新数据
       roleConfig.UpdateRoleIndex([draggedItem,destination])
        this.setState({
          role_list: userList,
        });
    };

    render(): React.ReactNode {
        var { role_list, isUpdateRoleVisible, updateRole, pitch, userInfoSelection, userInfoList,updateInfoModalTitle } = this.state;
        const rowSelection = {
            userInfoSelection,
            onChange: this.onUserInfoSelectChange,
        };
        return (
            <div className="role-container">
                <div className="role-list-div">
                    <div className="role-list-title">
                        <span>角色架构 </span>
                        <Button style={{ width: '70px' }} onClick={() => { this.updateRole(undefined, true) }}>添加</Button>
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
                                                                <Popconfirm title="确定删除这个角色吗？" okText="确定" cancelText="取消" onConfirm={() => { this.deleteRole(item) }}>
                                                                    <DeleteOutlined />
                                                                </Popconfirm>
                                                            </span>
                                                            <span className="role-list-div-role-edit">
                                                                <FormOutlined onClick={() => { this.updateRole(item, false) }} />
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
                    <Tabs defaultActiveKey="1" onChange={() => { this.roleTab() }} className="role-tab-div" tabBarExtraContent={this.sort}>
                        <TabPane tab="用户角色" key="1" className="role-tab-div" >
                            {<Table rowSelection={rowSelection} columns={UserInfoTab} dataSource={userInfoList?.data} />}
                        </TabPane>
                    </Tabs>
                </div>

                <Modal title={updateInfoModalTitle}
                    visible={isUpdateRoleVisible} onOk={() => { this.updateRoleOK() }} onCancel={() => { this.updateRoleCancel() }}>
                    <div>
                        角色名称：<Input maxLength={6} value={updateRole?.name} placeholder="角色名称" style={{ width: '85%' }} onChange={(e) => { this.updateRoleName(e); }} />
                    </div><br />
                    <div>
                        角色编号：<Input maxLength={6} value={updateRole?.code} placeholder="角色编号" style={{ width: '85%' }} onChange={(e) => { this.updateRoleCode(e); }} />
                    </div><br />
                    <div>
                        角色备注：<Input maxLength={8} value={updateRole?.remark} placeholder="角色备注" style={{ width: '85%' }} onChange={(e) => { this.updateRoleRemark(e); }} />
                    </div>
                </Modal>
            </div>

        )
    }
}
export default RoleConfig