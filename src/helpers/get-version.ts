import fs from "node:fs";
import path from "node:path";

export function getVersion(): string {
	const packageJsonPath = path.join(process.cwd(), "package.json");
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
	return packageJson.version;
}
