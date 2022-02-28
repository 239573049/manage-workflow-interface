export interface Response<T> {
  statusCode: number | undefined;
  message: string | undefined;
  data: T;
}