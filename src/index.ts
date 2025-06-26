#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { Command } from "commander";
import { generateCommand } from "./commands/generate.js";

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

program.version(cliVersion).addCommand(generateCommand);

program.parse();
