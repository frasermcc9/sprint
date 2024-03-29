import { PassportStrategy } from "@nestjs/passport";
import decodeJwt from "jwt-decode";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-custom";
import { HttpService } from "nestjs-http-promise";
import { Request } from "express";
import { FitbitUser } from "./fitbit.types";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserCollection } from "../db/schema/user.schema";
import { AccountStage, InRun } from "../types/graphql";
import LRU = require("lru-cache");
import { calculateMaxHr } from "@sprint/common";
import { NOMEM } from "dns";

interface JWT {
  aud: string;
  sub: string;
  iss: string;
  typ: string;
  scopes: string;
  exp: number;
  iat: number;
}

type FitbitUserAndToken = FitbitUser & {
  token: string;
};

@Injectable()
export class FitbitStrategy extends PassportStrategy(Strategy, "fitbit-auth") {
  private userCache = new LRU<string, FitbitUserAndToken>({
    max: 500,
  });

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(User.name) private readonly userModel: UserCollection,
  ) {
    super();
  }

  async validate(request: Request): Promise<FitbitUser> {
    const bearer = request?.headers?.authorization?.split(" ")[1];

    if (!bearer) {
      throw new UnauthorizedException("No authorization header");
    }

    const jwt: JWT = decodeJwt(bearer);

    if (typeof jwt?.sub !== "string") {
      throw new UnauthorizedException("No sub in jwt");
    }

    if (jwt.exp < Date.now() / 1000) {
      throw new UnauthorizedException("JWT expired");
    }

    if (jwt.iss !== "Fitbit") {
      throw new UnauthorizedException("Invalid issuer");
    }

    const cachedUser = this.userCache.get(jwt.sub);
    const isCacheValid = cachedUser?.token === bearer;

    const userId = jwt.sub;

    try {
      const castedUser = isCacheValid
        ? cachedUser
        : ((
            await this.httpService.axiosRef({
              method: "get",
              url: `https://api.fitbit.com/1/user/${userId}/profile.json`,
              headers: {
                Authorization: `Bearer ${bearer}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
            })
          )?.data?.user as FitbitUser | null);

      if (!castedUser || !castedUser.encodedId) {
        throw new UnauthorizedException("No user found");
      }

      // move encodedId to id for easier access
      castedUser.id = castedUser.encodedId;
      castedUser.token = bearer;

      if (!isCacheValid) {
        this.userCache.set(userId, {
          ...castedUser,
          token: bearer,
        });
      }
      const maxHr = calculateMaxHr(castedUser.dateOfBirth ?? "");

      const dbUser = await this.userModel.createIfNotExistsAndMerge({
        id: castedUser.id,
        firstName: castedUser.firstName ?? "",
        lastName: castedUser.lastName ?? "",
        stage: AccountStage.INITIAL,
        maxHR: maxHr,
        dob: castedUser.dateOfBirth ?? "",
        avatarUrl: castedUser.avatar,
        emblem: "Level1",
        createdAtUTS: Date.now(),
        utcOffset: (castedUser.offsetFromUTCMillis ?? 0) / 1000 / 60 / 60,
        xp: 0,
        trackedVariables: [],
        sleepTrackStreak: 0,
        unlockedEmblems: ["Level1"],
        inRun: InRun.NO,
        runTrackStreak: 0,
      });

      (request as Record<string, any>).dbUser = dbUser;

      return castedUser;
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException("Token is invalid");
    }
  }
}
