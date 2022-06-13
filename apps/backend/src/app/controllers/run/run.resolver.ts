import { Resolver } from "@nestjs/graphql";
// import { Run as GQLRun } from "../../types/graphql";
import { RunService } from "./run.service";

@Resolver("Run")
export class RunResolver {
  constructor(private readonly runService: RunService) {}
}
