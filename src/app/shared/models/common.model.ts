export class ApiResponseModel<T> {
  data!: T;
  success!: boolean;
  message!: string;
  Errors!: any;
  timestamp!: string;
  traceId!: string;
  statusCode!: string;
  statusMessage!: string;
}
