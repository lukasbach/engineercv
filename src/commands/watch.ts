import { Command, Option } from "commander";
import * as fs from "fs";
import { generate } from "../domain/generate/generate.js";

export const watchCommand = new Command("watch");

watchCommand.argument("<name>", "Glob to the YAML entrypoint files");

watchCommand.addOption(
  new Option("--number <number>").argParser((v) => parseInt(v, 10)),
);

watchCommand.action(async (globPattern) => {
  let trackedFiles: string[] = [];
  const onChange = async () => {
    console.log("Generating...");
    trackedFiles.forEach((file) => fs.unwatchFile(file, onChange));
    const output = await generate(globPattern);
    trackedFiles = output.trackedFiles;
    trackedFiles.forEach((file) =>
      fs.watchFile(file, { interval: 1000 }, onChange),
    );
    if (output.errors.length > 0) {
      console.error("Errors occurred during generation:");
      output.errors.forEach((error) => {
        console.error(`- ${error.file}: ${error.message}`);
      });
      console.log(`Watching ${trackedFiles.length} files for changes`);
    } else {
      console.log(
        `Generated ${output.files.length} files. Watching ${trackedFiles.length} files for changes`,
      );
    }
  };
  onChange();
});
