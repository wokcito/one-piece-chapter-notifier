import { Database } from "../helpers";

export class ChatperService {
	constructor() {}

	public setChapterAsUploaded(chapter: number): void {
		Database.instance
			.prepare(
				`INSERT INTO uploaded_chapter
					(chapter_number, creation_date)
				VALUES
					(${chapter}, (SELECT datetime('now')));`,
			)
			.run();
	}

	public getLastChapter(): number {
		return Database.instance
			.prepare<
				unknown[],
				{ last_chapter: number }
			>("SELECT MAX(chapter_number) AS last_chapter FROM uploaded_chapter;")
			.get()?.last_chapter;
	}
}
