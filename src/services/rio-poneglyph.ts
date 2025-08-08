import puppeteer from "puppeteer";
import {
	DEFAULT_PUPPETEER_ARGS,
	PRODUCTION_PUPPETEER_ARGS,
	RIO_PONEGLYPH_URL,
} from "../helpers";

export class RioPoneglyphService {
	constructor() {}

	public async isLastChapter(chapter: number): Promise<boolean> {
		const args =
			process.env.NODE_ENV === "production"
				? { ...DEFAULT_PUPPETEER_ARGS, ...PRODUCTION_PUPPETEER_ARGS }
				: DEFAULT_PUPPETEER_ARGS;
		const browser = await puppeteer.launch(args);
		const page = await browser.newPage();

		const URL = RIO_PONEGLYPH_URL(chapter);
		await page.goto(URL, { waitUntil: "networkidle2" });

		const exists = await page.evaluate(() => {
			const spans = Array.from(document.querySelectorAll("span"));

			return spans.some(
				(span) => span.textContent.trim() === "Siguiente capítulo",
			);
		});

		return !exists;
	}
}
