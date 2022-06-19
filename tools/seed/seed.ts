import { green } from "colors";
import { execSync } from "child_process";

(async () => {
  execSync(`mongorestore -d sprint ${__dirname}/dump/sprint`);

  console.log(green("Database Seeded!"));
})();
