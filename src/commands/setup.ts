import { Command } from "commander";
import { select } from "@inquirer/prompts";
import path from "node:path";
import fsExtra from "fs-extra/esm";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";

export const setupCommand = new Command("setup");

setupCommand.action(async () => {
  const template = await select({
    message: "Which template do you want to use?",
    choices: [
      {
        name: "Modularized repository (recommended)",
        value: "npm",
      },
      {
        name: "Single resume file",
        value: "single",
      },
    ],
  });
  const target = await select({
    message: "Where do you want to create the files?",
    choices: [
      {
        value: path.join(process.cwd()),
      },
      {
        value: path.join(process.cwd(), "resumes"),
      },
    ],
  });
  await fsExtra.copy(
    path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      `../../templates/${template}`,
    ),
    target,
  );

  exec(`code ${target}`);
});
