import { Resolver } from "@nestjs/graphql";
import { Run as GQLRun } from "../../types/graphql";
import { RunService } from "./run.service";

@Resolver("User")
export class RunResolver {
  constructor(private readonly runService: RunService) {}
}
