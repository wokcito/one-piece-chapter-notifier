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
		Database.instance
			.prepare(
				`INSERT INTO chat
					(chat_id, creation_date)
				VALUES
					(${chatId}, (SELECT datetime('now')))`,
			)
			.run();

		this.loadChats();
	}

	private start(ctx: Context) {
		const chat = ctx.message.chat.id.toString();

		if (!this.chatsId.has(chat)) {
			this.addChat(chat);
			this.sendMessage(chat, ADDED_NEW_CHAT_MESSAGE);
		}
	}

	private loadChats(): void {
		const chatsId = Database.instance
			.prepare<unknown[], string>("SELECT chat_id FROM chat")
			.all();

		this.chatsId.clear();
		chatsId.forEach((chatId) => this.chatsId.add(chatId));
	}
}
