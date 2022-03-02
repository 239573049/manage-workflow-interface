import React from "react";
import { Input } from 'antd';
interface IState {
    name: string,

}
interface IProps {

}
class UserConfig extends React.Component<IProps, IState>{
    state: IState = {
        name: ""
    }
    render(): React.ReactNode {
        var { name } = this.state
        return (
            <div>
                <div>
                    <span>
                        用户名称：
                        <Input
                            value={name}
                            placeholder="请输入用户名称"
                            style={{width:' 160px'}}
                            maxLength={25}
                        />
                    </span>
                </div>
                <div>

                </div>
            </div>
        )
    }
}
export default UserConfig