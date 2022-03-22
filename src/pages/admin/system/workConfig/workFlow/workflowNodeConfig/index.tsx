import React from "react";
import G6 from '@antv/g6';
import './index.less'
import workflowTemplateApi from "../../../../../../apis/workflowTemplate";
interface IProps {

}
interface IState {
    data: any,
    operation:{
        isTempalte:boolean,
        data:any[]
    }
    presentClickId:string
}

class WorkflowNodeConfig extends React.Component<IProps, IState>{
    state: IState = {
        data: {
            // 点集
            nodes: [
                {
                    id: 'node1',
                    x: 100,
                    y: 200,
                },
                {
                    id: 'node2',
                    x: 300,
                    y: 200,
                },
            ],
            // 边集
            edges: [
                // 表示一条从 node1 节点连接到 node2 节点的边
                {
                    source: 'node1',
                    target: 'node2', //结束
                },
            ],
        },
        operation: {
            isTempalte: true,
            data: []
        },
        presentClickId: ""
    }
    componentDidMount() {
        const graph = new G6.Graph({
            container: 'mountNode', // 指定图画布的容器 id，与第 9 行的容器对应
            // 画布宽高
            width: 800,
            height: 500,
        });
        graph.data(this.state.data);
        // 渲染图
        graph.render();
        this.GetWorkflowTemplatesAll()
    }
    GetWorkflowTemplatesAll(){
        workflowTemplateApi.GetWorkflowTemplatesAll()
            .then((res:any)=>{
                var {operation}= this.state;     
                operation.data=res.data;
                this.setState({operation})
            })
    }
    onClickupperStory(){
        var{operation}=this.state;
        operation.isTempalte=true;
        this.setState({operation})
    }
    onClickTemplate(value:any){
        var{presentClickId,operation}=this.state;
        presentClickId=value.id;
        operation.isTempalte=false;
        this.setState({presentClickId,operation})
    }
    render(): React.ReactNode {
        var {operation,presentClickId}=this.state;
        let head,content;
        if(operation.isTempalte){
            head=<div className="template-head-template">请选择您的模板</div>
            content=
            <div  className="content">
            {operation.data.map((a:any,index:number)=>(
                    <div key={index} onClick={()=>this.onClickTemplate(a)} className={presentClickId===a.id?"present-clickid":""}>{a.name}</div>
               
            ))}
            </div>
        }else{
            head=<div className="template-head-upper-story" onClick={()=>this.onClickupperStory()}>返回上一层</div>
            content=
            <div>
                
            </div>
        }

        return (
            <div className="workflow-node">
                <div className="template">
                    <div className="head">
                        {head}
                    </div>
                    {content}
                </div>
                <div className="nodeconfig">
                    <div id="mountNode"></div>
                </div>
            </div>
        )
    }
}
export default WorkflowNodeConfig