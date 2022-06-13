import { Module } from "@nestjs/common";
import { RunService } from "./run.service";
import { RunResolver } from "./run.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Run, RunSchema } from "../../db/schema/run.schema";

@Module({
  providers: [RunResolver, RunService],
  imports: [MongooseModule.forFeature([{ name: Run.name, schema: RunSchema }])],
})
export class RunModule {}
