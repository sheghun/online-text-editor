import { body, validationResult } from "express-validator";
import { RequestHandler } from "express";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";

export const create = [
  body("title").isString().exists(),
  body("files").isArray().exists(),
  body("files.*.name").isString().exists(),
  body("files.*.content").isString().exists(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  },
];

export const run: RequestHandler = async (req, res, next) => {
  if (req.body.code == "") {
    return res.send("no code supplied");
  }
  const filename = path.join("./scripts/", `${Date.now()}.py`);
  await fs.writeFile(filename, req.body.code, { flag: "a" });

  const output = await new Promise((resolve) => {
    exec(`python ${filename}`, (err, stdout, stderr) => {
      if (err) {
        return resolve(stderr);
      }
      return resolve(stdout);
    });
  });

  // Delete file after running
  fs.unlink(filename).then();

  console.log("output", output);
  return res.send(output);
};

export const get: RequestHandler = (req, res, next) => {};
