import {Message} from "./message";

export class Messages {
	public static collection(target: string | null = null, attrs: {} | null = null): Message {
		return new Message({
			type: 'collection',
			target,
			attrs,
		});
	}

	public static state(target: string | null = null, attrs: {} | null = null): Message {
		return new Message({
			type: 'state',
			target,
			attrs,
		});
	}
}
