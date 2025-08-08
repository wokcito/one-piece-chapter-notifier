import { Database } from "../helpers";

export class ChatperService {
	constructor() {}

	public setChapterAsUploaded(chapter: number): void {
		Database.instance
			.prepare(
				`INSERT INTO uploaded_chapter
					(chapter_number, creation_date)
				VALUES
					(${chapter}, (SELECT datetime('now')))`,
			)
			.run();
	}

	public getLastChapter(): number {
		return Database.instance
			.prepare<
				unknown[],
				{ chapter_number: number }
			>("COALESCE((SELECT MAX(chapter_number) FROM uploaded_chapter), 0)")
			.get()?.chapter_number;
	}
}
