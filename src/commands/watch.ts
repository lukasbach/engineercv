import { Command, Option } from "commander";
import * as fs from "fs";
import { generate } from "../generate/generate.js";
import { logger } from "../cli/logging.js";

export const watchCommand = new Command("watch");

watchCommand.argument("<name>", "Glob to the YAML entrypoint files");

watchCommand.addOption(
  new Option("--number <number>").argParser((v) => parseInt(v, 10)),
);

const watch = (
  files: string[],
  onChange: (changedFiles: string[]) => Promise<void>,
): (() => void) => {
  const watchers = files.map((file) => {
    const fn = async () => {
      await onChange([file]);
    };
    fs.watchFile(file, { interval: 1000 }, fn);
    return () => fs.unwatchFile(file, fn);
  });
  return () => {
    watchers.forEach((fn) => fn());
  };
};

watchCommand.action(async (globPattern) => {
  let trackedFiles: string[] = [];
  let unwatch: (() => void) | null = null;
  const onChange = async (changedFiles: string[]) => {
    logger.info("Generating...");
    logger.debug("Changed files:", changedFiles);
    unwatch?.();
    const output = await generate(globPattern);
    trackedFiles = output.trackedFiles;
    unwatch = watch(trackedFiles, onChange);
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
  onChange([]);
});
