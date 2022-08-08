import { Module } from "@nestjs/common";
import { SleepScoreService } from "./sleep-score.service";

@Module({
  providers: [SleepScoreService],
  exports: [SleepScoreService],
})
export class SleepScoreModule {}
