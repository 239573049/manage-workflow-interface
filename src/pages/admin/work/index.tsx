import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, Select } from "antd";
import moment from "moment";
import React from "react";
import './index.less'

const { RangePicker } = DatePicker;

interface IProps{

}

interface Istate{
    condition: {
        keyword: string | '',
        startTime: string | undefined,
        endTime: string | undefined,
        status: number|'',
        pageNo: number,
        pageSize: number
    },
}

class Work extends React.Component<IProps,Istate>{

    state: Istate={
        condition: {
            keyword: "",
            startTime: undefined,
            endTime: undefined,
            status: 0,
            pageNo: 0,
            pageSize: 0
        }
    }

    onConditionClick(){

    }

    /**
     * 时间更新
     */
     onConditionDateChange(e: any) {
        var { condition } = this.state
        condition.startTime = e ? moment(e[0]).format('YYYY-MM-DD 00:00:00') : '';
        condition.endTime = e ? moment(e[1]).format('YYYY-MM-DD 23:59:59') : '';
        this.setState({
            condition
        })
    }

    render(): React.ReactNode {
        return(
            <div className="title">
                <span>
                        用户名称：<Input onChange={(e) => {
                            var { condition } = this.state
                            condition.keyword = e.target.value
                            this.setState({ condition })
                        }} style={{ width: '200px' }} />
                    </span>
                    <span>
                        <RangePicker onChange={(e) => { this.onConditionDateChange(e) }} />
                        
                    </span>
                    <span>
                        <Button type="primary" icon={<SearchOutlined />} onClick={() => this.onConditionClick()}>
                            搜索
                        </Button></span>
            </div>
        )
    }
}
export default Work