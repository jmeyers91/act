import { readFileSync } from "fs";
import path from "path";
import Handlebars, { TemplateDelegate } from "handlebars";

const templateRoot = path.resolve(__dirname, "..", "templates");

export const clientTemplate = loadTemplate("client");
export const serverTemplate = loadTemplate("server");

function loadTemplate(name: string): TemplateDelegate {
  const templatePath = path.join(templateRoot, `${name}.hbs`);
  const templateSrc = readFileSync(templatePath, "utf8");
  return Handlebars.compile(templateSrc);
}
