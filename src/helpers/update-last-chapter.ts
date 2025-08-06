import path from "node:path";
import fs from "node:fs";

export function updateChapter() {
	const envPath = path.resolve(__dirname, "../../.env");
	let envContent = fs.readFileSync(envPath, "utf-8");

	const updatedChapter = parseInt(process.env.LAST_CHAPTER) + 1;

	envContent = envContent.replace(
		/LAST_CHAPTER=.*/,
		`LAST_CHAPTER=${updatedChapter}`,
	);

	process.env.LAST_CHAPTER = updatedChapter.toString();

	fs.writeFileSync(envPath, envContent);
}
