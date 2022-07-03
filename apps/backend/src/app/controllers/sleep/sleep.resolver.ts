import { UseGuards } from "@nestjs/common";
import { Resolver } from "@nestjs/graphql";
import { FitbitGuard } from "../../middleware/fitbit.guard";
import { SleepService } from "./sleep.service";

@Resolver("Sleep")
@UseGuards(FitbitGuard)
export class SleepResolver {
  constructor(private readonly sleepService: SleepService) {}
}
