import { Module } from "@nestjs/common";
import { ScienceService } from "./science.service";
import { ScienceResolver } from "./science.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Science, ScienceSchema } from "../../db/schema/science.schema";

@Module({
  providers: [ScienceResolver, ScienceService],
  imports: [
    MongooseModule.forFeature([{ name: Science.name, schema: ScienceSchema }]),
  ],
})
export class ScienceModule {}
