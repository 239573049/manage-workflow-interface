import React from "react";
import { FormOutlined,DeleteOutlined, UserOutlined } from '@ant-design/icons';
import RoleConfigApi from '../../../../apis/admin/roleConfig/index'
import './index.less'
import Role from '../../../../model/role/role'
import { Button, Input, message, Modal, Table, Tabs } from "antd";
const { TabPane } = Tabs;
interface IState {
    data: Search,
    role_list: Role[],
    isUpdateRoleVisible: boolean,
    updateRole: Role | undefined,
    pitch: string,
}
interface IProps {

}
class Search {
    name: string | undefined;
}

const RoleTab = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ];

class RoleConfig extends React.Component<IProps, IState>{
    state: IState = {
        data: new Search(),
        role_list: [],
        isUpdateRoleVisible: false,
        updateRole: undefined,
        pitch: ''
    }
    /**
     * 渲染前
     */
    componentWillMount() {
        this.GetUserMenuList()
    }
    /**
     * 获取角色列表
     */
    GetUserMenuList() {
        RoleConfigApi.GetUserMenuList(this.state.data.name ?? "")
            .then((res) => {
                var role_list = this.state.role_list;
                role_list = []
                res.data.data.forEach((d: Role) => {
                    role_list.push(d);
                });
                console.log(role_list);

                this.setState({
                    role_list: [...role_list]
                })

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
                parentId: undefined,
                index: 0
            }

            this.setState({
                updateRole: role,
                isUpdateRoleVisible: true
            })
        } else {
            this.setState({
                updateRole: role,
                isUpdateRoleVisible: true
            })
        }
    }
    deleteRole(role:Role|undefined){
        if(role){
            RoleConfigApi.DeleteRole(role.id!)
                .then(res=>{
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
            this.setState({
                pitch: value.id!
            })
        }
    }
    roleTab() {

    }
    render(): React.ReactNode {
        var { role_list, isUpdateRoleVisible, updateRole, pitch } = this.state;
        return (
            <div className="role-container">
                <div className="role-list-div">
                    <div  className="role-list-title">
                        <span>角色架构 </span>
                        <Button style={{ width: '70px' }} onClick={() => { this.updateRole(undefined, true) }}>添加</Button>
                    </div><br />
                    {
                        role_list.map(a => (
                            <div className={pitch === a.id ? "role-list-div-list-pitch" : "role-list-div-list-notpitch"} onClick={() => { this.updateRolePitch(a) }}>
                                <span className="role-list-div-list role-list-div-role-title">
                                    <UserOutlined />
                                    {a.name}
                                </span>
                                <span className="role-list-div-role-edit">
                                    <DeleteOutlined onClick={()=>{this.deleteRole(a)}}/>
                                </span>
                                <span className="role-list-div-role-edit">
                                    <FormOutlined onClick={() => { this.updateRole(a, false) }} />
                                </span>
                            </div>
                        ))
                    }
                </div>
                <div className="role-list-data role-tab-div">
                    <Tabs defaultActiveKey="1" onChange={() => { this.roleTab() }} className="role-tab-div" >
                        <TabPane tab="用户角色" key="1" className="role-tab-div">
                        {/* <Table rowSelection={rowSelection} columns={columns} dataSource={data} /> */}
                        </TabPane>
                    </Tabs>
                </div>

                <Modal title="编辑角色"
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