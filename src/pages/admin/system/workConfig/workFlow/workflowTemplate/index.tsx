import { Button, Form, Input, message, Modal, Table } from "antd";
import React from "react";
import WorkflowTemplateApi from '../../../../../../apis/workflowTemplate'
import WorkflowTemplate from "../../../../../../model/workFlow/workflowTemplate";
import WorkflowNodeTemplate from '../../../../../../model/workFlow/workflowNodeTemplate'
import './index.less'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import WorkflowApprovalRole from "../../../../../../model/workFlow/WorkflowApprovalRole";
import roleApi from "../../../../../../apis/admin/roleConfig/index";
const { confirm } = Modal;
interface IState {
    tabData: {
        name: string,
        count: number,
        pageNo: number,
        pageSize: number,
        data: any[]
    },
    operateWorkflowTemplate: {
        isVisible: boolean,
        state: 'add' | 'put',
        initialValue: WorkflowTemplate | undefined
    },
    tabNode: {
        isVisible: boolean,
        workflowTemplateId: string | undefined,
        initialValue: WorkflowNodeTemplate[] | undefined
    }
    workflowApprovalRole: {
        isVisible: boolean,
        workflowNodeTemplateId: string | undefined,
        initialValue: WorkflowApprovalRole[] | undefined,
        role: any[],
        selectionRoleids: any[],
        selectRoleIds: any[]
    },
    addWorkflowNodeTemplate: {
        isVisible: boolean,
        workflowTemplateId: string | undefined,
        state: 'add' | 'put'
        initialValue: WorkflowNodeTemplate
    }
}
interface IProps {

}

class WorkflowTemplateConfig extends React.Component<IProps, IState>{

    contentTab = [
        {
            title: '型号',
            dataIndex: 'key',
        },
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '编号',
            dataIndex: 'code',
        },
        {
            title: '描述',
            dataIndex: 'remark',
        },
        {
            title: '操作',
            render: (value: any, workflowTemplate: WorkflowTemplate) => {
                return (
                    <div className="condition">
                        <span>
                            <Button onClick={() => {
                                var { operateWorkflowTemplate } = this.state;
                                operateWorkflowTemplate.state = 'put'
                                operateWorkflowTemplate.isVisible = true;
                                operateWorkflowTemplate.initialValue = value
                                this.setState({ operateWorkflowTemplate })
                            }}>编辑</Button>
                        </span>
                        <span>
                            <Button onClick={() => {
                                var { tabNode, addWorkflowNodeTemplate } = this.state;
                                tabNode.isVisible = true;
                                tabNode.workflowTemplateId = workflowTemplate.id;
                                addWorkflowNodeTemplate.workflowTemplateId = workflowTemplate.id;
                                this.GetWorkflowNodeTemplates(workflowTemplate.id!)
                                this.setState({ tabNode, addWorkflowNodeTemplate })
                            }}>节点配置</Button>
                        </span>
                        <span>
                            <Button onClick={() => this.deleteWorkFlowTemplate(workflowTemplate)}>删除</Button>
                        </span>
                    </div>
                )
            }
        },
    ]
    workNodeRole = [
        {
            title: '排序',
            dataIndex: 'index',
        },
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '编号',
            dataIndex: 'code',
        },
        {
            title: '备注',
            dataIndex: 'remark',
        },
    ];
    state: IState = {
        operateWorkflowTemplate: {
            isVisible: false,
            state: 'add',
            initialValue: undefined
        },
        tabData: {
            name: '',
            count: 0,
            pageNo: 1,
            pageSize: 20,
            data: []
        },
        tabNode: {
            isVisible: false,
            workflowTemplateId: '',
            initialValue: []
        },
        workflowApprovalRole: {
            isVisible: false,
            workflowNodeTemplateId: "",
            initialValue: [],
            role: [],
            selectionRoleids: [],
            selectRoleIds: []
        },
        addWorkflowNodeTemplate: {
            isVisible: false,
            workflowTemplateId: undefined,
            state: "add",
            initialValue: {

                index: undefined,
                id: undefined,
                workflowTemplateId: undefined,
                code: undefined,
                prevNodeId: undefined,
                nextNodeId: undefined,
                remark: undefined,
                workflowTemplate: undefined,
                WorkflowApprovalRole: []

            }
        }
    }
    /**
     * 获取角色
     */
    GetUserMenuList() {
        var { workflowApprovalRole } = this.state
        roleApi.GetUserMenuList('')
            .then((res: any) => {
                if (res.code === 200) {
                    workflowApprovalRole.role = res.data;
                    this.GetWorkflowNodeRoleIds(workflowApprovalRole.workflowNodeTemplateId!)
                    this.setState({ workflowApprovalRole })
                }
            })
    }
    componentDidMount() {
        this.getWorkflowTemplatePages()
    }
    /**
     * 获取模板节点数据
     * @param workflowId 
     */
    GetWorkflowNodeTemplates(workflowId: string) {
        var { tabNode } = this.state
        WorkflowTemplateApi.GetWorkflowNodeTemplates(workflowId)
            .then((res: any) => {
                console.log(res);
                tabNode.initialValue = res;
                this.setState({ tabNode })
            })
    }
    /**
     * 获取模板分页数据
     */
    getWorkflowTemplatePages() {
        var { tabData } = this.state;
        WorkflowTemplateApi.GetWorkflowTemplatePage(tabData.name, tabData.pageNo, tabData.pageSize)
            .then((res: any) => {
                tabData.data = res.data
                tabData.count = res.count
                this.setState({ tabData })
            })
    }
    /**
     * 创建|编辑 模板
     * @param value 
     */
    createWorkflowTemplate(value: any) {
        var { operateWorkflowTemplate } = this.state
        if (operateWorkflowTemplate.state === 'add') {
            WorkflowTemplateApi.CreateWorkflowTemplate(value)
                .then((res: any) => {
                    operateWorkflowTemplate.isVisible = false
                    this.setState({ operateWorkflowTemplate })
                    this.getWorkflowTemplatePages()
                })
        } else {
            WorkflowTemplateApi.UpdateWorkflowTemplate(value)
                .then((res: any) => {
                    operateWorkflowTemplate.isVisible = false
                    this.setState({ operateWorkflowTemplate })
                    this.getWorkflowTemplatePages()
                })
        }
    }
    /**
     * 删除模板
     * @param workflowTemplate 
     */
    deleteWorkFlowTemplate(workflowTemplate: WorkflowTemplate) {
        confirm({
            title: '删除模板',
            content: '是否删除模板，删除以后无法找回数据！！！',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                WorkflowTemplateApi.DeleteWorkflowTemplate(workflowTemplate.id!)
                    .then((res) => {
                        message.success("删除模板成功")
                        this.getWorkflowTemplatePages()
                    })
            },
        });
    }
    /**
     * 显示添加模板
     */
    onShowOperate() {
        var { operateWorkflowTemplate } = this.state
        operateWorkflowTemplate.isVisible = true;
        operateWorkflowTemplate.initialValue = undefined
        this.setState({ operateWorkflowTemplate })
        console.log(this);

    }
    /**
     * 节点拖动逻辑处理
     * @param result 
     * @returns 
     */
    onDragEnd = (result: any) => {
        const sourceIndex = result.source.index;
        if (result.destination == null) return;
        const destinationIndex = result.destination.index;
        if (sourceIndex === destinationIndex) {
            return;
        }
        const { tabNode } = this.state;
        const [draggedItem] = tabNode.initialValue!.splice(sourceIndex, 1);
        tabNode.initialValue!.splice(destinationIndex, 0, draggedItem);
        var destination = tabNode.initialValue![sourceIndex];
        destination.code = sourceIndex + 1;
        draggedItem.code = destinationIndex + 1;
        console.log(tabNode.initialValue);
        WorkflowTemplateApi.UpdateWorkflowNodeTemplateIndex(tabNode.initialValue)
            .then((res: any) => {
                if (res.code === 200) {
                    tabNode.initialValue = res.data;
                    this.setState({ tabNode });
                }
            })
    }
    /**
     * 打开编辑节点角色弹框
     * @param data 
     */
    updateWorkNodeRole(data: WorkflowNodeTemplate) {
        var { workflowApprovalRole } = this.state
        workflowApprovalRole.isVisible = true;
        workflowApprovalRole.workflowNodeTemplateId = data.id
        this.GetUserMenuList();
        this.setState({ workflowApprovalRole })
    }
    /**
     * 编辑模板
     * @param data 
     */
    updateWorkNode(data: WorkflowNodeTemplate) {
        var { addWorkflowNodeTemplate } = this.state;
        addWorkflowNodeTemplate.state = "put";
        addWorkflowNodeTemplate.initialValue = data;
        addWorkflowNodeTemplate.isVisible = true;
        addWorkflowNodeTemplate.workflowTemplateId = data.workflowTemplateId;
        this.setState({ addWorkflowNodeTemplate })
    }
    deleteWorkNode(data: WorkflowNodeTemplate) {
        var { addWorkflowNodeTemplate } = this.state;
        confirm({
            title: '删除用户',
            content: '您的操作将删除模板节点配置，请确认是否删除',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                WorkflowTemplateApi.DeleteWorkflowNodeTemplate(data.id!)
                    .then((res: any) => {
                        if (res.code === 200) {
                            message.success("删除成功")
                            this.GetWorkflowNodeTemplates(addWorkflowNodeTemplate.workflowTemplateId!)
                        } else {
                            message.error(res.message);
                        }
                    })
            },
        });
    }
    /**
     * 获取节点选择的角色id
     */
    GetWorkflowNodeRoleIds(workflowNodeId: string) {
        var { workflowApprovalRole } = this.state
        WorkflowTemplateApi.GetWorkflowNodeRoleIds(workflowNodeId)
            .then((res: any) => {
                var roles = workflowApprovalRole.role.filter(a => res.includes(a.id)).map(a => workflowApprovalRole.role.indexOf(a) + 1)//获取选择的序号
                workflowApprovalRole.selectionRoleids = roles;
                console.log(workflowApprovalRole.selectionRoleids);
                this.setState({ workflowApprovalRole })
            })
    }
    /**
     * 节点选择角色变化数据
     * @param data 
     * @param d 
     */
    onWorkNodeRoleSelectChange = (data: any[], d: any) => {
        var { workflowApprovalRole } = this.state
        workflowApprovalRole.selectionRoleids = data;
        workflowApprovalRole.selectRoleIds = d.map((a: any) => a.id);
        this.setState({ workflowApprovalRole })
    }
    /**
     * 添加节点角色
     */
    onClickWorkNodeRole() {
        var { workflowApprovalRole } = this.state
        WorkflowTemplateApi.CreateWorkflowNodeRole(workflowApprovalRole.workflowNodeTemplateId!, workflowApprovalRole.selectRoleIds)
            .then((res: any) => {
                workflowApprovalRole.isVisible = false;
                workflowApprovalRole.initialValue = undefined;
                workflowApprovalRole.selectionRoleids = [];
                workflowApprovalRole.workflowNodeTemplateId = ''
                this.setState({ workflowApprovalRole })
            })
    }
    saveWorkflowNode(value: any) {
        var { addWorkflowNodeTemplate } = this.state;
        addWorkflowNodeTemplate.initialValue!.remark = value.remark;
        if (addWorkflowNodeTemplate.state === 'add') {
            WorkflowTemplateApi.CreateWorkflowNodeTemplate(addWorkflowNodeTemplate.initialValue)
                .then((res: any) => {
                    if (res.statusCode === 200) {
                        message.success("添加成功")
                    }
                    addWorkflowNodeTemplate.isVisible = false;
                    this.setState({ addWorkflowNodeTemplate })
                    this.GetWorkflowNodeTemplates(addWorkflowNodeTemplate.workflowTemplateId!)
                })
        } else {
            WorkflowTemplateApi.UpdateWorkflowNodeTemplate(addWorkflowNodeTemplate.initialValue)
                .then((res: any) => {
                    if (res.statusCode === 200) {
                        message.success("编辑成功")
                    }
                    addWorkflowNodeTemplate.isVisible = false;
                    this.setState({ addWorkflowNodeTemplate })
                    this.GetWorkflowNodeTemplates(addWorkflowNodeTemplate.workflowTemplateId!)
                })
        }
    }
    render(): React.ReactNode {
        var { tabData, operateWorkflowTemplate, tabNode, workflowApprovalRole, addWorkflowNodeTemplate } = this.state
        const rowSelection = {
            selectedRowKeys: workflowApprovalRole.selectionRoleids,
            onChange: this.onWorkNodeRoleSelectChange,
        };
        return (
            <div className="workcontent">
                <div className="condition">
                    <span>
                        <span>
                            模板名称：<Input style={{ width: '200px' }} />
                        </span>
                        <span><Button onClick={() => { this.getWorkflowTemplatePages() }}>搜索</Button></span>
                        <span><Button onClick={() => { this.onShowOperate() }}>添加模板</Button></span>
                    </span>
                </div>
                <div className="content">
                    <Table
                        columns={this.contentTab}
                        pagination={{ position: ["bottomRight"], pageSize: tabData.pageSize, current: tabData.pageNo, total: tabData.count }}
                        dataSource={tabData.data}
                    />
                </div>

                <Modal
                    footer={[]}
                    onCancel={() => this.setState({ operateWorkflowTemplate: { isVisible: false, state: 'add', initialValue: undefined } })
                    }
                    destroyOnClose
                    title={operateWorkflowTemplate.state === "add" ? "添加模板" : "编辑模板"} visible={operateWorkflowTemplate.isVisible}>
                    <Form
                        initialValues={operateWorkflowTemplate.initialValue}
                        onFinish={(value: any) => { this.createWorkflowTemplate(value) }}
                    >
                        <Form.Item name='name' label="模板名称">
                            <Input />
                        </Form.Item>
                        <Form.Item name='code' label="模板编号">
                            <Input />
                        </Form.Item>
                        <Form.Item name='remark' label="模板备注">
                            <Input />
                        </Form.Item>
                        <Form.Item name='id'>
                            <Button style={{ width: '100%' }} htmlType="submit">{operateWorkflowTemplate.state === "add" ? "添加模板" : "编辑模板"}</Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    footer={[
                        <Button
                            type="primary"
                            onClick={() => {
                                addWorkflowNodeTemplate.isVisible = true;
                                addWorkflowNodeTemplate.state = 'add';
                                addWorkflowNodeTemplate.initialValue.workflowTemplateId = addWorkflowNodeTemplate.workflowTemplateId
                                this.setState({ addWorkflowNodeTemplate })
                            }}>添加节点</Button>
                    ]}
                    onCancel={() => { tabNode.isVisible = false; tabNode.workflowTemplateId = ''; this.setState({ tabNode }) }
                    }
                    destroyOnClose
                    width={800}
                    title="添加模板节点" visible={tabNode.isVisible}>
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <div className="myModal">
                            <Droppable droppableId="droppable">
                                {(provided) => (
                                    <div
                                        className="modalList workflow-approval-role"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}>
                                        {tabNode.initialValue?.map((item, index) => (
                                            <Draggable draggableId={item.id!} index={index} key={item.id}>
                                                {(provided) => (
                                                    <div>
                                                        <div
                                                            className="work-node-config"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}>
                                                            <span className="node-span">
                                                                审批顺序：
                                                                {item.code}
                                                            </span>
                                                            <span className="node-span">
                                                                备注：
                                                                {item.remark}
                                                            </span>
                                                            <Button type="primary" className="nodebutton" onClick={() => this.updateWorkNodeRole(item)}>编辑角色</Button>
                                                            <Button type="primary" className="nodebutton" onClick={() => this.deleteWorkNode(item)}>删除模板</Button>
                                                            <Button type="primary" className="nodebutton" onClick={() => this.updateWorkNode(item)}>编辑模板</Button>
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

                </Modal>

                <Modal
                    onCancel={() => { workflowApprovalRole.isVisible = false; workflowApprovalRole.workflowNodeTemplateId = ''; this.setState({ workflowApprovalRole }) }
                    }
                    destroyOnClose
                    onOk={() => { this.onClickWorkNodeRole() }}
                    title="模板节点" visible={workflowApprovalRole.isVisible}>
                    <Table
                        pagination={false}
                        key="id"
                        rowSelection={rowSelection} columns={this.workNodeRole} dataSource={workflowApprovalRole.role} />
                </Modal>

                <Modal
                    footer={null}
                    onCancel={() => {
                        addWorkflowNodeTemplate.isVisible = false;
                        addWorkflowNodeTemplate.initialValue.id = undefined;
                        addWorkflowNodeTemplate.initialValue.remark = undefined;
                        addWorkflowNodeTemplate.initialValue.workflowTemplateId = undefined;
                        this.setState({ addWorkflowNodeTemplate })
                    }
                    }
                    destroyOnClose
                    onOk={() => { this.onClickWorkNodeRole() }}
                    title={addWorkflowNodeTemplate.state === "add" ? "添加节点" : "编辑节点"} visible={addWorkflowNodeTemplate.isVisible}>
                    <Form
                        name="addWorkflowNodeTemplate"
                        initialValues={addWorkflowNodeTemplate.initialValue}
                        onFinish={this.saveWorkflowNode.bind(this)}
                    >
                        <Form.Item
                            label="备注"
                            name="remark"
                            rules={[{ required: true, message: '请填写备注' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item >
                            <Button type="primary" name="id" htmlType="submit" style={{ width: '100%' }}>
                                保存
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}
export default WorkflowTemplateConfig