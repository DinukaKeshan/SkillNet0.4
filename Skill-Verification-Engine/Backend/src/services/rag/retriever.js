import fs from "fs";
import path from "path";

export function retrieveContext(folder) {
  const basePath = path.join(process.cwd(), "src/knowledge", folder);

  if (!fs.existsSync(basePath)) return "";

  return fs
    .readdirSync(basePath)
    .map(file =>
      fs.readFileSync(path.join(basePath, file), "utf-8")
    )
    .join("\n")
    .slice(0, 3000);
}
