import instance from './instance';
import { AxiosRequest,AxiosResponse } from './types';
import {Response} from '../../model/request/Api'
const header = {
  'Content-Type': 'application/json;charset=UTF-8',
};

class Abstract {
  private apiAxios({
    baseURL = 'https://localhost:8088/api',
    headers = header,
    method,
    url,
    data,
    params,
  }: AxiosRequest): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      instance({
        baseURL,
        headers,
        method,
        url,
        params,
        data,
      })
        .then((res) => {
          if (res.status === 200) {
            if (res.data.success) {
              resolve(res.data);
            } else {
              resolve(res.data);
            }
          } else {
            resolve(res.data);
          }
        })
        .catch((err) => {
          const message = err?.data?.message || err?.message;
          reject({ status: false, message, data: null });
        });
    });
  }

  /**
   * GET类型的网络请求
   */
  protected get({ url, data, params }: AxiosRequest) {
    return this.apiAxios({ method: 'GET', url, data, params });
  }

  /**
   * POST类型的网络请求
   */
  protected post({ url, data, params }: AxiosRequest) {
    return this.apiAxios({ method: 'POST', url, data, params });
  }

  /**
   * PUT类型的网络请求
   */
  protected put({ url, data, params }: AxiosRequest) {
    return this.apiAxios({ method: 'PUT', url, data, params });
  }

  /**
   * DELETE类型的网络请求
   */
  protected delete({ url, data, params }: AxiosRequest) {
    return this.apiAxios({ method: 'DELETE', url, data, params });
  }
}

export default Abstract;
