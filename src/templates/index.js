import Handlebars from "handlebars";
import path from "path";
import fs from "fs/promises";

const templatesDirPath = path.join(process.cwd(), "src", "templates", "html");

export const verifyEmailTemplate = Handlebars.compile(
  await fs.readFile(path.join(templatesDirPath, "verifyEmail.html"), "utf8")
);
