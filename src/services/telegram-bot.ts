import { Context, Telegraf } from "telegraf";
import { updateChats, ADDED_NEW_CHAT_MESSAGE } from "../helpers";

export class Bot {
	private telegraf: Telegraf = null;
	private chats: Set<string> = new Set();

	constructor(token: string, chats: string[]) {
		for (const chat of chats) {
			if (chat.length > 0) this.addChat(chat);
		}

		this.telegraf = new Telegraf(token);
		this.telegraf.launch();

		// handlers
		this.telegraf.start((ctx) => this.start(ctx));
	}

	public sendMessages(message: string) {
		for (const chat of this.chats) {
			this.sendMessage(chat, message);
		}
	}

	public sendMessage(chat: string, message: string) {
		this.telegraf.telegram.sendMessage(chat, message);
	}

	private addChat(chat: string) {
		this.chats.add(chat);
		updateChats(Array.from(this.chats));
	}

	private start(ctx: Context) {
		const chat = ctx.message.chat.id.toString();

		if (!this.chats.has(chat)) {
			this.addChat(chat);
			this.sendMessage(chat, ADDED_NEW_CHAT_MESSAGE);
		}
	}
}
