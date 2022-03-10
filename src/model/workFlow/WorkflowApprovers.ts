import WorkflowInstance from "./workflowInstance";

export default interface WorkflowApprovers{
    id:string;
    userInfoId:string;
    userName:string;
    workflowInstanceId:string;
    workFlowFormCode:number;
    workflowInstance:WorkflowInstance;
}