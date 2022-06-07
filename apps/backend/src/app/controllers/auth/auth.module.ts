import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { HttpModule } from "nestjs-http-promise";

@Module({
  providers: [AuthResolver, AuthService],
  imports: [HttpModule],
})
export class AuthModule {}
