import { Axios, AxiosResponse } from "axios";

export interface ILoginResponse extends AxiosResponse {
  data: {
    accessToken: string;
    userDetails: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      address: string;
      dob: string;
      role: string;
      gender: string;
      _id: string;
    };
  };
}
