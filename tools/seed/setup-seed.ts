import * as prompts from "prompts";
import { green, red } from "colors";
import { mkdir, rmdir } from "fs/promises";
import { execSync } from "child_process";

(async () => {
  const { confirmed } = await prompts({
    type: "confirm",
    name: "confirmed",
    message:
      "Are you sure you want to create a new seed for the database? The current database state will be used in future seeding.",
  });

  if (!confirmed) {
    console.log(red("Database re-seed cancelled."));
    return;
  }

  await rmdir(__dirname + "/dump");
  await mkdir("./dump");

  execSync(`mongodump -d sprint -o ${__dirname}/dump`);

  console.log(green("New database seed created!"));
})();
