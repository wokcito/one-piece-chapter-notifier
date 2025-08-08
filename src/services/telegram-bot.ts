import { Context, Telegraf } from "telegraf";
import { ADDED_NEW_CHAT_MESSAGE, Database } from "../helpers";

export class Bot {
	private telegraf: Telegraf = null;
	private chatsId: Set<string> = new Set();

	constructor(token: string) {
		this.loadChats();

		this.telegraf = new Telegraf(token);
		this.telegraf.launch();

		// handlers
		this.telegraf.start((ctx) => this.start(ctx));
	}

	public sendMessages(message: string) {
		for (const chatId of this.chatsId) {
			this.sendMessage(chatId, message);
		}
	}

	public sendMessage(chatId: string, message: string) {
		this.telegraf.telegram.sendMessage(chatId, message);
	}

	private addChat(chatId: string) {
		if (this.chatsId.has(chatId)) return;

		Database.instance
			.prepare(
				`INSERT INTO chat
					(chat_id, creation_date)
				VALUES
					(${chatId}, (SELECT datetime('now')));`,
			)
			.run();

		this.loadChats();
	}

	private start(ctx: Context) {
		const chatId = ctx.message.chat.id.toString();

		if (!this.chatsId.has(chatId)) {
			this.addChat(chatId);
			this.sendMessage(chatId, ADDED_NEW_CHAT_MESSAGE);
		}
	}

	private loadChats(): void {
		const chatsId = Database.instance
			.prepare<
				unknown[],
				{ chat_id: string }
			>("SELECT chat_id FROM chat;")
			.all();

		this.chatsId.clear();
		chatsId
			.map((chatId) => chatId.chat_id)
			.forEach((chatId) => this.chatsId.add(chatId));
	}
}
