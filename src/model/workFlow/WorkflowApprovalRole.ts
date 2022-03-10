import Role from '../role/role'
import WorkflowNodeTemplate from './workflowNodeTemplate'
export default interface WorkflowApprovalRole{
    id:string;
    workflowNodeTemplateId:string;
    roleId:string;
    role:Role
    workflowNodeTemplate:WorkflowNodeTemplate
}