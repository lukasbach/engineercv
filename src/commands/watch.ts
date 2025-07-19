import { Command, Option } from "commander";
import * as fs from "fs";
import { generate } from "../generate/generate.js";
import { logger } from "../cli/logging.js";

export const watchCommand = new Command("watch");

watchCommand.argument("<name>", "Glob to the YAML entrypoint files");

watchCommand.addOption(
  new Option("--number <number>").argParser((v) => parseInt(v, 10)),
);

watchCommand.action(async (globPattern) => {
  let trackedFiles: string[] = [];
  const onChange = async () => {
    logger.info("Generating...");
    trackedFiles.forEach((file) => fs.unwatchFile(file, onChange));
    const output = await generate(globPattern);
    trackedFiles = output.trackedFiles;
    trackedFiles.forEach((file) =>
      fs.watchFile(file, { interval: 1000 }, onChange),
    );
    if (output.errors.length > 0) {
      logger.error("Errors occurred during generation:");
      output.errors.forEach((error) => {
        logger.error(`- [${error.file}]: ${error.message}`);
      });
      logger.info(`Watching {${trackedFiles.length}} files for changes`);
    } else {
      logger.success(
        `Generated {${output.files.length}} files. Watching {${trackedFiles.length}} files for changes`,
      );
    }
  };
  onChange();
});
