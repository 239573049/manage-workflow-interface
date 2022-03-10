import {UserInfo} from '../userInfo/userInfo'
import WorkflowApprovers from './WorkflowApprovers';
import WorkflowTemplate from './workflowTemplate';
import WorkflowNodeInstances from './WorkflowNodeInstance'
export default interface WorkflowInstance{
    id:string|undefined;
    sponsorId:string|undefined;
    sponsorName:string|undefined;
    name:string|undefined;
    code:string|undefined;
    remark:string|undefined;
    workflowTemplateId:string|undefined;
    workFormId:string|undefined;
    workflowStatus:number;
    sponsoredDate:Date|undefined;
    workFlowFormCode:number;
    archiveDate:Date|undefined;
    hasBeenRead:boolean;
    currentRoleCode:string|undefined;
    sponsor:UserInfo|undefined;
    workflowTemplate:WorkflowTemplate;
    workflowApprovers:WorkflowApprovers[];
    workflowNodeInstances:WorkflowNodeInstances[]
}