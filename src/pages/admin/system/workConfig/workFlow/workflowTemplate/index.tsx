import { Button, Form, Input, message, Modal, Table } from "antd";
import React from "react";
import WorkflowTemplateApi from '../../../../../../apis/workflowTemplate'
import WorkflowTemplate from "../../../../../../model/workFlow/workflowTemplate";
import WorkflowNodeTemplate from '../../../../../../model/workFlow/workflowNodeTemplate'
import './index.less'
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
    tabNode:{
        isVisible: boolean,
        initialValue: WorkflowNodeTemplate[] | undefined
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
                                var {tabNode}=this.state;
                                tabNode.isVisible=true
                                this.setState({ tabNode })
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
            initialValue: []
        }
    }
    componentDidMount() {
        this.getWorkflowTemplatePages()
    }
    getWorkflowTemplatePages() {
        var { tabData } = this.state;
        WorkflowTemplateApi.GetWorkflowTemplatePage(tabData.name, tabData.pageNo, tabData.pageSize)
            .then((res: any) => {
                var data = res.data;
                console.log(data);
                tabData.data = data.data
                tabData.count = data.count
                this.setState({ tabData })
            })
    }
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
    onShowOperate() {
        var { operateWorkflowTemplate } = this.state
        operateWorkflowTemplate.isVisible = true;
        operateWorkflowTemplate.initialValue=undefined
        this.setState({ operateWorkflowTemplate })
        console.log(this);

    }
    render(): React.ReactNode {
        var { tabData, operateWorkflowTemplate } = this.state
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
            </div>
        )
    }
}
export default WorkflowTemplateConfig