// 에러 베이스
export class BaseError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.message = message;
    this.status = status;
  }
}
