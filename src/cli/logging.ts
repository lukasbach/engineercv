/* eslint-disable no-console */
import chalk from "chalk";

const renderString = (str: string) => {
  return str
    .replaceAll(/\{([^}]+)\}/g, (_, key) => chalk.bold(chalk.cyan(key)))
    .replaceAll(/\[([^\]]+)\]/g, (_, key) => chalk.italic(chalk.yellow(key)))
    .replaceAll(/!!([^(?:!!)]+)!!/g, (_, key) => chalk.bold(chalk.bgRed(key)));
};

const renderArgs = (args: any[]) =>
  args.map((arg) => (typeof arg === "string" ? renderString(arg) : arg));

const debug = (...args: any[]) =>
  process.argv.includes("--verbose") || process.argv.includes("-v")
    ? console.debug(chalk.dim("debug"), "   ", ...renderArgs(args))
    : undefined;

const info = (...args: any[]) =>
  console.info(chalk.blue("info"), "    ", ...renderArgs(args));

const warn = (...args: any[]) =>
  console.warn(chalk.yellow("warn"), "    ", ...renderArgs(args));

const error = (...args: any[]) =>
  console.error(chalk.red("error"), "   ", ...renderArgs(args));

const success = (...args: any[]) =>
  console.log(chalk.green("success"), " ", ...renderArgs(args));

export const logger = {
  debug,
  info,
  warn,
  error,
  success,
};
