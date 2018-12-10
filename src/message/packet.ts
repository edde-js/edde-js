import {Collection, CollectionCallback} from "../collection";
import {Message} from "./message";

export class Packet {
	protected uuid: string;
	protected messageCollection: Collection<Message>;

	public constructor(uuid: string) {
		this.uuid = uuid;
		this.messageCollection = new Collection();
	}

	public getUuid(): string {
		return this.uuid;
	}

	public message(message: Message): Packet {
		this.messageCollection.add(message);
		return this;
	}

	public messages(callback: CollectionCallback<Message>): Packet {
		this.messageCollection.each(callback);
		return this;
	}
}
