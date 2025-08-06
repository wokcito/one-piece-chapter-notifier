import dotenv from "dotenv";
import { CronJob } from "cron";
import { Bot, RioPoneglyph } from "./services";
import { NEW_CHAPTER_MESSAGE, updateChapter } from "./helpers";

dotenv.config();

const CRON_SCHEDULE = process.env.CRON_SCHEDULE;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHATS = process.env.TELEGRAM_CHATS;
const TELEGRAM_ADMIN_CHAT = process.env.TELEGRAM_ADMIN_CHAT;
const CHATS = TELEGRAM_CHATS.split(",");

const bot = new Bot(TELEGRAM_BOT_TOKEN, CHATS);
const rioPoneglyph = new RioPoneglyph();

async function main() {
	try {
		const LAST_CHAPTER = parseInt(process.env.LAST_CHAPTER);
		const isLastChapter = await rioPoneglyph.isLastChapter(LAST_CHAPTER);

		if (!isLastChapter) {
			bot.sendMessages(NEW_CHAPTER_MESSAGE(LAST_CHAPTER + 1));
			updateChapter();
		}
	} catch (error) {}
}

CronJob.from({
	cronTime: CRON_SCHEDULE,
	onTick: main,
	timeZone: "America/Argentina/Buenos_Aires",
	start: true,
});
