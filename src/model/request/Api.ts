export interface Response {
  statusCode: number | undefined;
  message: string | undefined;
  <T>(data: T): T;
}