import WorkflowInstance from "./workflowInstance";

export default interface WorkflowNodeInstance{
    id:string;
    workflowInstanceId:string;
    name:string|undefined;
    Code:number;
    templateNodeId:string;
    prevTemplateNodeId:string|undefined;
    nextTemplateNodeId:string|undefined;
    prevNodeId:string|undefined;
    nextNodeId:string|undefined;
    remark:string|undefined;
    auditPersonId:string|undefined;
    auditPersonName:string|undefined;
    auditDate:Date|undefined;
    nodeStatus:number;
    workflowInstance:WorkflowInstance
}