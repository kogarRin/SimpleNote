export const RESCODE = {
  SUCCESS: 200,
  NOT_FOUND: 404,

  ERROR: 700,
  PARAM_ERROR: 701,
}

export class Res<T> {
    code: number;
    data: T;
    message: string;


    constructor(message:string, data: T, code: number = 200) {
      this.code = code;
      this.data = data;
      this.message = message;
    }
}

