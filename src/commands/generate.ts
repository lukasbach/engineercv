import { Command, Option } from "commander";
import { generate } from "../domain/generate/generate.js";
import { logger } from "../cli/logging.js";

export const generateCommand = new Command("generate");

generateCommand.argument("<name>", "Glob to the YAML entrypoint files");

// generateCommand.option("-f, --files", "Flag");
// generateCommand.option("-s, --str <string>", "String");
generateCommand.addOption(
  new Option("--number <number>").argParser((v) => parseInt(v, 10)),
);

generateCommand.action(async (globPattern) => {
  const { errors } = await generate(globPattern);
  if (errors.length > 0) {
    logger.error("Errors occurred during generation:");
    errors.forEach((error) => {
      logger.error(`- [${error.file}]: ${error.message}`);
    });
    process.exit(1);
  } else {
    logger.success("Generation completed successfully.");
    process.exit(0);
  }
});
