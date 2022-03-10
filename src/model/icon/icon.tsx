
import {
    StepBackwardOutlined,
    StepForwardOutlined,
    FastBackwardOutlined,
    FastForwardOutlined,
    ShrinkOutlined,
    ArrowsAltOutlined,
    DownOutlined,
    UpOutlined,
    LeftOutlined,
    RightOutlined,


} from '@ant-design/icons';
interface Iicon {
    [propName: string]: JSX.Element;
}

const Icon: Iicon =  {
    StepBackwardOutlined:<StepBackwardOutlined/>,
    StepForwardOutlined:<StepBackwardOutlined/>,

}

export default Icon;