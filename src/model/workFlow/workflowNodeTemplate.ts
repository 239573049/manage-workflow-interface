import WorkflowTemplate from "./workflowTemplate";
import WorkflowApprovalRole from './WorkflowApprovalRole'
export default interface WorkflowNodeTemplateDto{
    index: any|undefined;
    id:string|undefined;
    workflowTemplateId:string|undefined;
    code:number|undefined;
    prevNodeId:string|undefined;
    nextNodeId:string|undefined;
    remark:string|undefined;
    workflowTemplate:WorkflowTemplate|undefined
    WorkflowApprovalRole:WorkflowApprovalRole[]
}