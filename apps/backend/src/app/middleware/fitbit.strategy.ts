import { PassportStrategy } from "@nestjs/passport";
import decodeJwt from "jwt-decode";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-custom";
import { HttpService } from "nestjs-http-promise";
import { Request } from "express";
import { FitbitUser } from "./fitbit.types";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserCollection } from "../db/schema/user.schema";
import { AccountStage } from "../types/graphql";

interface JWT {
  aud: string;
  sub: string;
  iss: string;
  typ: string;
  scopes: string;
  exp: number;
  iat: number;
}

@Injectable()
export class FitbitStrategy extends PassportStrategy(Strategy, "fitbit-auth") {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(User.name) private readonly userModel: UserCollection,
  ) {
    super();
  }

  async validate(request: Request): Promise<any> {
    const bearer = request?.headers?.authorization?.split(" ")[1];

    if (!bearer) {
      throw new UnauthorizedException("No authorization header");
    }

    console.log("Bearer: ", bearer);

    const jwt: JWT = decodeJwt(bearer);

    if (typeof jwt?.sub !== "string") {
      throw new UnauthorizedException("No sub in jwt");
    }

    const userId = jwt.sub;

    try {
      const { data } = await this.httpService.axiosRef({
        method: "get",
        url: `https://api.fitbit.com/1/user/${userId}/profile.json`,
        headers: {
          Authorization: `Bearer ${bearer}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const castedUser = data.user as FitbitUser;

      // move encodedId to id for easier access
      castedUser.id = castedUser.encodedId;

      await this.userModel.createIfNotExists({
        id: castedUser.id,
        firstName: castedUser.firstName,
        lastName: castedUser.lastName,
        stage: AccountStage.INITIAL,
      });

      return castedUser;
    } catch (e) {
      throw new UnauthorizedException("Token is invalid");
    }
  }
}
