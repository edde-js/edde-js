import {Message} from "./message";

export class Messages {
	public static query(target: string | null = null, attrs: {} | null = null): Message {
		return new Message('query', target, attrs);
	}

	public static collection(target: string | null = null, attrs: {} | null = null): Message {
		return new Message('collection', target, attrs);
	}

	public static state(target: string | null = null, attrs: {} | null = null): Message {
		return new Message('state', target, attrs);
	}
}
