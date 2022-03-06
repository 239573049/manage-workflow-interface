import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './index.css';
import { ConfigProvider } from 'antd';
moment.locale('zh-cn');
ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <App />'
    </ConfigProvider>,
  document.getElementById('root')
);
reportWebVitals();
