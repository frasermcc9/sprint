import { Injectable } from "@nestjs/common";
import { HttpService } from "nestjs-http-promise";
import { stringify } from "qs";

export interface AuthResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  user_id: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  buildAuthLink({
    clientId = process.env.FITBIT_OAUTH_CLIENT_ID,
    redirectUrl = process.env.FRONTEND_HOST + "/get_token",
  }: {
    clientId: string;
    redirectUrl: string;
  }) {
    return (
      `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUrl,
      )}&scope=` +
      encodeURIComponent(
        `activity heartrate location nutrition profile settings sleep social weight`,
      ) +
      `&expires_in=` +
      encodeURIComponent("604800")
    );
  }

  async exchangeCode({
    code,
    clientId = process.env.FITBIT_OAUTH_CLIENT_ID,
    clientSecret = process.env.FITBIT_OAUTH_CLIENT_SECRET,
  }: {
    code: string;
    clientId: string;
    clientSecret: string;
  }): Promise<AuthResponse> {
    const authData = clientId + ":" + clientSecret;
    const buff = Buffer.from(authData);
    const base64data = buff.toString("base64");

    try {
      const { data } = await this.httpService.axiosRef({
        url: "https://api.fitbit.com/oauth2/token",
        method: "post",
        headers: {
          Authorization: `Basic ${base64data}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: stringify({
          code,
          grant_type: "authorization_code",
          redirect_uri: process.env.FRONTEND_HOST + "/get_token",
          client_id: clientId,
        }),
      });

      return data;
    } catch (e) {
      console.log(e.toJSON());
    }
  }

  async refresh({
    clientId,
    clientSecret,
    token,
  }: {
    token: string;
    clientId: string;
    clientSecret: string;
  }) {
    const authData = clientId + ":" + clientSecret;
    const buff = Buffer.from(authData);
    const base64data = buff.toString("base64");

    try {
      const { data } = await this.httpService.axiosRef({
        url: "https://api.fitbit.com/oauth2/token",
        method: "post",
        headers: {
          Authorization: `Basic ${base64data}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: stringify({
          refresh_token: token,
          grant_type: "refresh_token",
          client_id: clientId,
        }),
      });

      return data;
    } catch (e) {
      console.log(e.toJSON());
    }
  }
}
