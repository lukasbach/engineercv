#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { Command } from "commander";
import { generateCommand } from "./commands/generate.js";
import { watchCommand } from "./commands/watch.js";

const program = new Command();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

let cliVersion: string;
try {
  cliVersion = JSON.parse(
    fs.readFileSync(path.join(dirname, "../package.json"), {
      encoding: "utf-8",
    }),
  ).version;
} catch (e) {
  cliVersion = "unknown";
}

program
  .version(cliVersion)
  .option("-v, --verbose", "Enable verbose logging")
  .addCommand(generateCommand)
  .addCommand(watchCommand);

program.parse();
