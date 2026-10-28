import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { reviewProtocol } from "./engine.mjs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node src/cli.mjs <input.json>");
  process.exitCode = 2;
} else {
  try {
    const raw = await readFile(resolve(file), "utf8");
    let input;
    try {
      input = JSON.parse(raw);
    } catch {
      console.error(JSON.stringify({
        status: "error",
        error: { code: "INVALID_JSON", message: "Input file is not valid JSON." }
      }, null, 2));
      process.exitCode = 2;
    }
    if (input !== undefined) {
      const result = reviewProtocol(input);
      console.log(JSON.stringify(result, null, 2));
      if (result.status === "invalid") process.exitCode = 1;
    }
  } catch (error) {
    const missing = error && typeof error === "object" && error.code === "ENOENT";
    console.error(JSON.stringify({
      status: "error",
      error: {
        code: missing ? "FILE_NOT_FOUND" : "INPUT_READ_ERROR",
        message: missing ? "Input file could not be found." : "Input file could not be read."
      }
    }, null, 2));
    process.exitCode = 2;
  }
}
