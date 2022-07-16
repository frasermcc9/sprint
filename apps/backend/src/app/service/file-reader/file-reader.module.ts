import { Module } from "@nestjs/common";
import { FileReaderService } from "./file-reader.service";

@Module({
  providers: [FileReaderService],
  exports: [FileReaderService],
})
export class FileReaderModule {}
