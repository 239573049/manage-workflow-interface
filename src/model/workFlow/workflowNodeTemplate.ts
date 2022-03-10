import WorkflowTemplate from "./workflowTemplate";
import WorkflowApprovalRole from './WorkflowApprovalRole'
export default interface WorkflowNodeTemplateDto{
    id:string;
    workflowTemplateId:string;
    code:number;
    prevNodeId:string|undefined;
    nextNodeId:string|undefined;
    remark:string|undefined;
    workflowTemplate:WorkflowTemplate
    WorkflowApprovalRole:WorkflowApprovalRole[]
}