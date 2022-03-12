import Axios from "../../utils/request/axios";

class WorkflowTemplateApi extends Axios{
    GetWorkflowTemplatePage(name:string='',pageNo:number=1,pageSize:number=20){
        return this.get(`WorkflowTemplate/GetWorkflowTemplatePage?name=${name}&pageNo=${pageNo}&pageSize=${pageSize}`)
    }
    CreateWorkflowTemplate(value:any){
        return this.post("WorkflowTemplate/CreateWorkflowTemplate",value)
    }
    DeleteWorkflowTemplate(id:string){
        return this.del('WorkflowTemplate/DeleteWorkflowTemplate?id='+id)
    }
    UpdateWorkflowTemplate(value:any){
        return this.put("WorkflowTemplate/UpdateWorkflowTemplate",value)
    }
}
export default new WorkflowTemplateApi()