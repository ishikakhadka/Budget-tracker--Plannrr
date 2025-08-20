import { AxiosResponse } from "axios";

export interface IResponse extends AxiosResponse {
  data: {
    message: string;
  };
}
