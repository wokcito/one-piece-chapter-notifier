import { getVersion } from "./get-version";

export const START_MESSAGE = `
	Agregado correctamente. A partir de ahora recibirás una notificación cuando salga un nuevo capítulo.
	\n
	\nComandos disponibles:
	\n- /start
	\n- /help`;

export const NEW_CHAPTER_MESSAGE = (chapter: number) =>
	`Salió el capítulo ${chapter}
	\n
	\n${RIO_PONEGLYPH_URL(chapter)}`;

export const HELP_MESSAGE = `Bot version: ${getVersion()}`;

export const RIO_PONEGLYPH_URL = (chapter: number) => {
	return `https://onepiece-fans2.net/manga/es/rioponeglyph-scan/${chapter}`;
};

export const PRODUCTION_PUPPETEER_ARGS = {
	executablePath: "/usr/bin/chromium-browser",
	args: ["--no-sandbox"],
};

export const DEFAULT_PUPPETEER_ARGS = { headless: true };

export const DATABASE_TABLES = [
	`
	CREATE TABLE IF NOT EXISTS "chat" (
		"id" INTEGER NOT NULL UNIQUE,
		"chat_id" TEXT NOT NULL UNIQUE,
		"creation_date" DATE NOT NULL,
		PRIMARY KEY("id")
	);`,
	`
	CREATE TABLE IF NOT EXISTS "uploaded_chapter" (
		"id" INTEGER NOT NULL UNIQUE,
		"chapter_number" INTEGER NOT NULL UNIQUE,
		"creation_date" DATE NOT NULL,
		PRIMARY KEY("id")
	);
	`,
];
