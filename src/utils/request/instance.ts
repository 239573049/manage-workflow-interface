import type { AxiosRequestConfig, Method } from 'axios';
import axios from 'axios';
import type { LoginUserInfo } from '../../model/login/login';
import { message } from 'antd';
// 定义接口
interface PendingType {
  url?: string;
  method?: Method;
  params: any;
  data: any;
  cancel: Function;
}
// 取消重复请求
const pending: PendingType[] = [];
const CancelToken = axios.CancelToken;
// axios 实例
const instance = axios.create({
  timeout: 10000,
  responseType: 'json',
});

// 移除重复请求
const removePending = (config: AxiosRequestConfig) => {
  // eslint-disable-next-line @typescript-eslint/no-for-in-array
  for (const key in pending) {
    const item: number = +key;
    const list: PendingType = pending[key];
    // 当前请求在数组中存在时执行函数体
    if (
      list.url === config.url &&
      list.method === config.method &&
      JSON.stringify(list.params) === JSON.stringify(config.params) &&
      JSON.stringify(list.data) === JSON.stringify(config.data)
    ) {
      // 执行取消操作
      list.cancel('操作太频繁，请稍后再试');
      // 从数组中移除记录
      if (pending.length > 1) {
        pending.splice(item, 1);
      }
    }
  }
};

// 添加请求拦截器
instance.interceptors.request.use(
  (request) => {
    const user = window.sessionStorage.getItem('user') as unknown as LoginUserInfo;
    if (user != null) {
      request.headers = {
        Authorization: user.token!,
      };
    }
    removePending(request);
    request.cancelToken = new CancelToken((c) => {
      pending.push({
        url: request.url,
        method: request.method,
        params: request.params,
        data: request.data,
        cancel: c,
      });
    });
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);
// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    removePending(response.config);
    const errorCode = response?.data?.errorCode;
    switch (errorCode) {
      case '401':
        message.error('请先登录！');
        window.location.href = '/';
        break;
      default:
        break;
    }
    return response;
  },
  (error) => {
    const response = error.response;
    // 根据返回的http状态码做不同的处理
    switch (response?.status) {
      case 400:
        //  页面找不到
        break;
      case 401:
        // token失效
        break;
      case 403:
        // 没有权限
        break;
      case 500:
        // 服务端错误
        break;
      case 503:
        // 服务端错误
        break;
      default:
        // 接口异常
        break;
    }
    // 超时重新请求
    const config = error.config;
    // 全局的请求次数,请求的间隙
    const [RETRY_COUNT, RETRY_DELAY] = [0, 1000];
    if (config && RETRY_COUNT) {
      // 设置用于跟踪重试计数的变量
      config.__retryCount = config.__retryCount || 0;
      // 检查是否已经把重试的总数用完
      if (config.__retryCount >= RETRY_COUNT) {
        return Promise.reject(response || { message: error.message });
      }
      // 增加重试计数
      config.__retryCount++;
      // 创造新的Promise来处理指数后退
      const backoff = new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, RETRY_DELAY || 1);
      });
      // instance重试请求的Promise
      return backoff.then(() => {
        return instance(config);
      });
    }
    return Promise.reject(response || { message: error.message });
  },
);
export default instance;
