import * as prompts from "prompts";
import { green, red } from "colors";
import { mkdir, rm } from "fs/promises";
import { execSync } from "child_process";

const PROMPT_MESSAGE =
  "Are you sure you want to create a new seed for the database? The current database state will be used in future seeding. This information IS committed to the repo, so ensure there are no sensitive information in the database.";

(async () => {
  const { confirmed } = await prompts({
    type: "confirm",
    name: "confirmed",
    message: PROMPT_MESSAGE,
  });

  if (!confirmed) {
    console.log(red("Database re-seed cancelled."));
    return;
  }

  await rm(__dirname + "/dump", { force: true, recursive: true });
  await mkdir("./dump");

  execSync(`mongodump -d sprint -o ${__dirname}/dump`);

  console.log(green("New database seed created!"));
})();
