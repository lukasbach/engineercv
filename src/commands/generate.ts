import { Command, Option } from "commander";

interface Options {}

export const generateCommand = new Command("generate");

generateCommand.argument("<name>", "Glob to the YAML entrypoint files");

// generateCommand.option("-f, --files", "Flag");
// generateCommand.option("-s, --str <string>", "String");
generateCommand.addOption(
  new Option("--number <number>").argParser((v) => parseInt(v, 10)),
);

generateCommand.action((name, _options: Options) => {});
