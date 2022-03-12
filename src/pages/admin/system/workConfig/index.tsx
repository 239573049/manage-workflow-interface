import { Tabs } from "antd";
import React from "react";
import './index.less'
import WorkflowTemplate from "./workFlow/workflowTemplate";
const { TabPane } = Tabs;
interface IState {
}
interface IProps {

}

class WorkConfig extends React.Component<IProps, IState>{
    state: IState = {
    }
    onTabChange(key:any){
        console.log(key);
        
    }
    render(): React.ReactNode {
        return (
            <Tabs onChange={(key:any)=>this.onTabChange(key)} type="card">
                <TabPane tab="工作流模板配置" key="1">
                    <WorkflowTemplate/>
                </TabPane>    
            </Tabs>
        )
    }
}
export default WorkConfig