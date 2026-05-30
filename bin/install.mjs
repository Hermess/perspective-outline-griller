#!/usr/bin/env node

import { copyFile, mkdir, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageName = "perspective-outline-griller";
const skillFiles = [
  "SKILL.md",
  "ADAPTER-FORMAT.md",
  "OUTLINE-FORMAT.md",
  "TEST-SCENARIOS.md"
];

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

function usage() {
  return [
    "Perspective Outline Griller installer",
    "",
    "Usage:",
    "  npx -y github:Hermess/perspective-outline-griller",
    "  npx -y github:Hermess/perspective-outline-griller -- --target ~/.codex/skills",
    "  npx -y github:Hermess/perspective-outline-griller -- --dest ./perspective-outline-griller",
    "",
    "Options:",
    "  --target, --dir <path>  Skills root directory. Default: ~/.codex/skills",
    "  --dest <path>           Exact destination directory.",
    "  --name <name>           Folder name under target. Default: perspective-outline-griller",
    "  --dry-run               Print what would be copied.",
    "  --help                  Show this help."
  ].join("\n");
}

function expandHome(inputPath) {
  if (!inputPath) {
    return inputPath;
  }

  if (inputPath === "~") {
    return os.homedir();
  }

  if (inputPath.startsWith("~/")) {
    return path.join(os.homedir(), inputPath.slice(2));
  }

  return inputPath;
}

function readValue(args, index, flag) {
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a path value.`);
  }
  return value;
}

function parseArgs(args) {
  const options = {
    target: path.join(os.homedir(), ".codex", "skills"),
    dest: null,
    name: packageName,
    dryRun: false,
    help: false
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--target" || arg === "--dir") {
      options.target = readValue(args, index, arg);
      index += 1;
      continue;
    }

    if (arg === "--dest") {
      options.dest = readValue(args, index, arg);
      index += 1;
      continue;
    }

    if (arg === "--name") {
      options.name = readValue(args, index, arg);
      index += 1;
      continue;
    }

    if (!arg.startsWith("--") && options.target === path.join(os.homedir(), ".codex", "skills")) {
      options.target = arg;
      continue;
    }

    throw new Error(`Unknown option: ${arg}`);
  }

  return options;
}

async function assertSourceFiles() {
  for (const file of skillFiles) {
    const source = path.join(packageRoot, file);
    const fileStat = await stat(source);
    if (!fileStat.isFile()) {
      throw new Error(`Expected package file is not a file: ${source}`);
    }
  }
}

async function install(options) {
  const destination = path.resolve(
    expandHome(options.dest ?? path.join(options.target, options.name))
  );

  await assertSourceFiles();

  if (options.dryRun) {
    console.log(`Would install ${packageName} to ${destination}`);
    for (const file of skillFiles) {
      console.log(`- ${file}`);
    }
    return;
  }

  await mkdir(destination, { recursive: true });

  for (const file of skillFiles) {
    await copyFile(path.join(packageRoot, file), path.join(destination, file));
  }

  console.log(`Installed ${packageName}`);
  console.log(`Target: ${destination}`);
  console.log("Files:");
  for (const file of skillFiles) {
    console.log(`- ${file}`);
  }
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));

    if (options.help) {
      console.log(usage());
      return;
    }

    await install(options);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    console.error("");
    console.error(usage());
    process.exitCode = 1;
  }
}

await main();
