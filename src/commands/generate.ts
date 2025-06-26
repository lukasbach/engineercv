import { Command, Option } from "commander";
import { generate } from "../domain/generate/generate.js";

export const generateCommand = new Command("generate");

generateCommand.argument("<name>", "Glob to the YAML entrypoint files");

// generateCommand.option("-f, --files", "Flag");
// generateCommand.option("-s, --str <string>", "String");
generateCommand.addOption(
  new Option("--number <number>").argParser((v) => parseInt(v, 10)),
);

generateCommand.action((globPattern) => generate(globPattern));
