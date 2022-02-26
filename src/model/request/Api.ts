export interface Response {
  statusCode: number | undefined;
  message: string | undefined;
  <T>(arg: T): T;
}