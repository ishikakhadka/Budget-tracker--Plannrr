export interface IError extends Error {
  response: {
    data: {
      message: string;
    };
  };
}
