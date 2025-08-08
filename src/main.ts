import dotenv from "dotenv";
import { CronJob } from "cron";
import { BotService, ChatperService, RioPoneglyphService } from "./services";
import { NEW_CHAPTER_MESSAGE } from "./helpers";

dotenv.config();

const CRON_SCHEDULE = process.env.CRON_SCHEDULE;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ADMIN_CHAT = process.env.TELEGRAM_ADMIN_CHAT;

const botService = new BotService(TELEGRAM_BOT_TOKEN);
const rioPoneglyphService = new RioPoneglyphService();
const chapterService = new ChatperService();

async function main() {
	try {
		const LAST_CHAPTER = chapterService.getLastChapter();
		const isLastChapter =
			await rioPoneglyphService.isLastChapter(LAST_CHAPTER);

		if (!isLastChapter) {
			const NEW_CHAPTER = LAST_CHAPTER + 1;

			chapterService.setChapterAsUploaded(NEW_CHAPTER);
			botService.sendMessages(NEW_CHAPTER_MESSAGE(NEW_CHAPTER));
		}
	} catch (error) {
		console.log(error);
	}
}

CronJob.from({
	cronTime: CRON_SCHEDULE,
	onTick: main,
	timeZone: "America/Argentina/Buenos_Aires",
	start: true,
});
