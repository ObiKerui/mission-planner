import fs from "node:fs";
import path from "node:path";

const [singular, plural] = process.argv.slice(2);

if (!singular || !plural) {
  console.error("Usage: npm run generate:entity -- <singular> <plural>");
  process.exit(1);
}

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const Singular = capitalize(singular);
const Plural = capitalize(plural);

const templateDir = path.join(process.cwd(), "scripts", "templates", "entity");

const outputDir = path.join(process.cwd(), "src/entities", plural);

if (fs.existsSync(outputDir)) {
  console.error(`Entity already exists: ${outputDir}`);
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

const replacements: Record<string, string> = {
  "{{singular}}": singular,
  "{{Singular}}": Singular,
  "{{plural}}": plural,
  "{{Plural}}": Plural,
};

for (const filename of fs.readdirSync(templateDir)) {
  const templatePath = path.join(templateDir, filename);
  const outputPath = path.join(outputDir, filename);

  let content = fs.readFileSync(templatePath, "utf8");

  for (const [placeholder, value] of Object.entries(replacements)) {
    content = content.replaceAll(placeholder, value);
  }

  fs.writeFileSync(outputPath, content);
}

console.log(`Created ${Plural} entity in src/entities/${plural}/`);
