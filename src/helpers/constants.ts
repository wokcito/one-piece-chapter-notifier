export const ADDED_NEW_CHAT_MESSAGE =
	"Agregado correctamente, a partir de ahora recibirás una notificación cuando salga un nuevo capítulo.";

export const NEW_CHAPTER_MESSAGE = (chapter: number) => {
	return `Salió el capítulo ${chapter}\n\n${RIO_PONEGLYPH_URL(chapter)}`;
};

export const RIO_PONEGLYPH_URL = (chapter: number) => {
	return `https://onepiece-fans2.net/manga/es/rioponeglyph-scan/${chapter}`;
};
