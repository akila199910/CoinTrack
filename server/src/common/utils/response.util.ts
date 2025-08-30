import { ApiResponse } from '../interfaces/response.interface';

export class ResponseUtil {
  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return {
      success: true,
      message,
      data
    };
  }

  static error<T>(message: string, data: T = [] as any): ApiResponse<T> {
    return {
      success: false,
      message,
      data
    };
  }
}
