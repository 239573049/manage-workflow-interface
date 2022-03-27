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
        return (
            <div>
                <div>
                </div>
                <div>

                </div>
            </div>
        )
    }
}
export default UserConfig