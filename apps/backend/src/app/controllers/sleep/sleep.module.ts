import { Module } from "@nestjs/common";
import { SleepService } from "./sleep.service";
import { SleepResolver } from "./sleep.resolver";
import { HttpModule } from "nestjs-http-promise";

@Module({
  providers: [SleepResolver, SleepService],
  imports: [HttpModule],
})
export class SleepModule {}
