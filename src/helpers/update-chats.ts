import path from "node:path";
import fs from "node:fs";

export function updateChats(chats: string[]) {
	const envPath = path.resolve(__dirname, "../../.env");
	let envContent = fs.readFileSync(envPath, "utf-8");

	envContent = envContent.replace(
		/TELEGRAM_CHATS=.*/,
		`TELEGRAM_CHATS=${chats.length === 0 ? chats[0] : chats.join(",")}`,
	);

	fs.writeFileSync(envPath, envContent);
}
