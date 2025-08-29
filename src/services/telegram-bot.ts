import { Context, Telegraf } from "telegraf";
import { START_MESSAGE, HELP_MESSAGE, Database } from "../helpers";

export class BotService {
	private telegraf: Telegraf = null;
	private chatsId: Set<string> = new Set();
	private adminChatId: string;

	constructor(token: string, adminChatId: string) {
		this.loadChats();

		this.telegraf = new Telegraf(token);
		this.telegraf.launch();

		this.adminChatId = adminChatId;

		// handlers
		this.telegraf.start((ctx) => this.start(ctx));
		this.telegraf.help((ctx) => this.help(ctx));
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
					(${chatId}, (SELECT datetime('now', '-3 hours')));`,
			)
			.run();

		this.loadChats();
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

	private start(ctx: Context) {
		const chatId = ctx.message.chat.id.toString();

		if (!this.chatsId.has(chatId)) {
			this.addChat(chatId);

			this.sendMessage(chatId, START_MESSAGE);
			this.sendMessage(
				this.adminChatId,
				`The bot has one more subscriber!`,
			);
		}
	}

	private help(ctx: Context) {
		const chatId = ctx.message.chat.id.toString();
		this.sendMessage(chatId, HELP_MESSAGE);
	}
}
