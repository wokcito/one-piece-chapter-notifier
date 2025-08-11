import { Database, NO_CHAPTER_RELEASED_THIS_WEEK } from "../helpers";

export class ChatperService {
	constructor() {}

	public setChapterAsUploaded(chapter: number): void {
		Database.instance
			.prepare(
				`INSERT INTO uploaded_chapter
					(chapter_number, creation_date)
				VALUES
					(${chapter}, (SELECT datetime('now', '-3 hours')));`,
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

	public isTheChapterAlreadyReleased(): boolean {
		const result = Database.instance
			.prepare<unknown[], { chapters_released_this_week: number }>(
				`SELECT EXISTS (
					SELECT 1
					FROM uploaded_chapter
					WHERE creation_date >= datetime('now', '-2 days')
				) AS chapters_released_this_week;`,
			)
			.get()?.chapters_released_this_week;

		return result > NO_CHAPTER_RELEASED_THIS_WEEK;
	}
}
