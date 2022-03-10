import WorkflowInstance from "./workflowInstance";
import WorkflowNodeTemplate from './workflowNodeTemplate'
export default interface WorkflowTemplate{
    id:string|undefined;
    name:string|undefined;
    code:string|undefined;
    remark:string|undefined;
    workflowInstance:WorkflowInstance[]
    WorkflowNodeTemplate:WorkflowNodeTemplate[]
}