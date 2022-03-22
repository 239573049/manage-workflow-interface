import Axios from "../../utils/request/axios";

class WorkflowTemplateApi extends Axios{
    /**
     * 获取模板列表
     * @param name 
     * @param pageNo 
     * @param pageSize 
     * @returns 
     */
    GetWorkflowTemplatePage(name:string='',pageNo:number=1,pageSize:number=20){
        return this.get(`WorkflowTemplate/GetWorkflowTemplatePage?name=${name}&pageNo=${pageNo}&pageSize=${pageSize}`)
    }
    /**
     * 创建模板
     * @param value 
     * @returns 
     */
    CreateWorkflowTemplate(value:any){
        return this.post("WorkflowTemplate/CreateWorkflowTemplate",value)
    }
    /**
     * 删除模板
     * @param id 
     * @returns 
     */
    DeleteWorkflowTemplate(id:string){
        return this.del('WorkflowTemplate/DeleteWorkflowTemplate?id='+id)
    }
    /**
     * 编辑模板
     * @param value 
     * @returns 
     */
    UpdateWorkflowTemplate(value:any){
        return this.put("WorkflowTemplate/UpdateWorkflowTemplate",value)
    }
    /**
     * 获取模板节点配置
     * @param workflowId 
     * @returns 
     */
    GetWorkflowNodeTemplates(workflowId:string){
        return this.get("WorkflowTemplate/GetWorkflowNodeTemplates?workflowId="+workflowId)
    }
    /**
     * 获取节点已存在角色
     * @param workflowNodeId 
     * @returns 
     */
    GetWorkflowNodeRoleIds(workflowNodeId:string){
        return this.get('WorkflowTemplate/GetWorkflowNodeRoleIds?workflowNodeId='+workflowNodeId)
    }
    /**
     * 创建节点角色
     * @param workflowNodeId 
     * @param roleIds 
     * @returns 
     */
    CreateWorkflowNodeRole(workflowNodeId:string,roleIds:any[]){
        return this.post('WorkflowTemplate/CreateWorkflowNodeRole?workflowNodeId='+workflowNodeId,roleIds)
    }
    /**
     * 删除模板节点
     * @param workflowNodeId 
     * @returns 
     */
    DeleteWorkflowNodeTemplate(workflowNodeId:string){
        return this.del('WorkflowTemplate/DeleteWorkflowNodeTemplate?workflowNodeId='+workflowNodeId)
    }
    /**
     * 创建节点信息
     * @param data 
     * @returns 
     */
    CreateWorkflowNodeTemplate(data:any){
        return this.post('WorkflowTemplate/CreateWorkflowNodeTemplate',data)
    }
    /**
     * 编辑节点信息
     * @param data 
     * @returns 
     */
    UpdateWorkflowNodeTemplate(data:any){
        return this.put("WorkflowTemplate/UpdateWorkflowNodeTemplate",data)
    }
    /***
     * 编辑模板节点审批顺序
     */
    UpdateWorkflowNodeTemplateIndex(data:any){
        return this.put("WorkflowTemplate/UpdateWorkflowNodeTemplateIndex",data)
    }
    /***
     * 获取所有模板
     */
    GetWorkflowTemplatesAll(){
        return this.get("WorkflowTemplate/GetWorkflowTemplatesAll")
    }
}
export default new WorkflowTemplateApi()