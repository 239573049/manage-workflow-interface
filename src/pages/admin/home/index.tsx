import { Col, Row } from 'antd'
import React from 'react'
import './index.less'
import * as echarts from 'echarts';

interface IState {
    pending: {
        work: {
            value: number
        },
        message: {
            value: number
        }
        monthly: {
            value: number
        }
        yesterday: {
            value: number
        }
    },
    option:any,
    cake:any
}
interface IProps {

}
class Home extends React.Component<IProps, IState>{
    state: IState = {
        pending: {
            work: {
                value: 20
            },
            message: {
                value: 10
            },
            monthly: {
                value: 99
            },
            yesterday: {
                value: 10
            }
        },
        option:{
            title: {
              text: '表格测试'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            legend: {
              data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                data: ['剩余待处理', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: 'Email',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                  focus: 'series'
                },
                data: [120, 132, 101, 134, 90, 230, 210]
              },
              {
                name: 'Union Ads',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                  focus: 'series'
                },
                data: [220, 182, 191, 234, 290, 330, 310]
              },
              {
                name: 'Video Ads',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                  focus: 'series'
                },
                data: [150, 232, 201, 154, 190, 330, 410]
              },
              {
                name: 'Direct',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                  focus: 'series'
                },
                data: [320, 332, 301, 334, 390, 330, 320]
              },
              {
                name: 'Search Engine',
                type: 'line',
                stack: 'Total',
                label: {
                  show: true,
                  position: 'top'
                },
                areaStyle: {},
                emphasis: {
                  focus: 'series'
                },
                data: [820, 932, 901, 934, 1290, 1330, 1320]
              }
            ]
          },
          cake:{
            tooltip: {
              trigger: 'item'
            },
            legend: {
              top: '5%',
              left: 'center'
            },
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: '40',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: [
                  { value: 20, name: '剩余待处理工作' },
                  { value: 10, name: '剩余未处理信息' },
                  { value: 99, name: '本月处理工作' },
                  { value: 10, name: '昨日处理工作' }
                ]
              }
            ]
          }
    }
    componentDidMount(){
        var chartDom = document.getElementById('main');
        var myChart = echarts.init(chartDom!, 'dark');
        var option=this.state.option
        option && myChart.setOption(option);
        var cake = document.getElementById('cake');
        var mcake = echarts.init(cake!);
        var cakeValue=this.state.cake;
        cakeValue && mcake.setOption(cakeValue);
    }
    render(): React.ReactNode {
        var { pending } = this.state
        return (
            <div className='home'>
                <div>
                <Row gutter={16}>
                    <Col span={6}>
                        <div className="pandect">
                            <div className='message'>
                                <div className='value'>{pending.work.value}</div><br />
                                <div>剩余待处理工作</div>
                            </div>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className="pandect" >
                            <div className='message'>
                                <div className='value'>{pending.message.value}</div><br />
                                <div>剩余未处理信息</div>
                            </div>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className="pandect">
                            <div className='message'>
                                <div className='value'>{pending.monthly.value}</div><br />
                                <div>本月处理工作</div>
                            </div>

                        </div>
                    </Col>
                    <Col span={6}>
                        <div className="pandect">
                            <div className='message'>
                                <div className='value'>{pending.yesterday.value}</div><br />
                                <div>昨日处理工作</div>
                            </div>
                        </div>
                    </Col>
                </Row>
                </div>
                <br />
                <div>

                <Row gutter={16}>
                    <Col span={16}>
                        <div className="chart">
                            <div id='main' style={{height:'100%',width:'100%' }}></div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="chart" >
                            <div id='cake' style={{height:'100%',width:'100%' }}></div>
                        </div>
                    </Col>
                </Row>
                </div>
            </div>
        )
    }
}
export default Home