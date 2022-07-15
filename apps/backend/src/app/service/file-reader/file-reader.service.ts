import { Injectable } from "@nestjs/common";
import { readFile } from "fs/promises";

@Injectable()
export class FileReaderService {
  async readAndParse<T = unknown>(filePath: string) {
    return JSON.parse(await readFile(filePath, "utf8")) as T;
  }
}
