import {Message} from "./message";

export class Messages {
	/**
	 * send a message to query a collection
	 *
	 * @param target
	 * @param attrs
	 */
	public static query(target: string | null = null, attrs: {} | null = null): Message {
		return new Message('query', target, attrs);
	}

	/**
	 * send a message to get exactly one state
	 *
	 * @param target
	 * @param attrs
	 */
	public static select(target: string | null = null, attrs: {} | null = null): Message {
		return new Message('select', target, attrs);
	}
}
