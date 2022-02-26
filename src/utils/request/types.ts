
export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';

export interface AxiosRequest {
  baseURL?: string;
  url: string;
  data?: any;
  params?: any;
  method?: Method;
  show?: any,
  headers?: any;
  timeout?: number;
  responseType?: ResponseType;
}

export interface AxiosResponse {
  <T>(data: T): T;
  statusCode:number;
  message:string;
}

export interface CustomResponse {
  readonly status: boolean;
  readonly message: string;
  data: any;
  origin?: any;
}

