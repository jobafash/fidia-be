import {ApolloError} from 'apollo-server-errors'

export class AppError extends ApolloError {
    constructor(message: string, code: number) {
      super(message, String(code))
  
      Object.defineProperty(this, 'name', { value: 'MyError' });
    }
  }