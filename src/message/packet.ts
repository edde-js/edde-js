import {Collection, HashMap} from "../collection";
import {Message} from "./message";

export class Packet {
	protected packet: HashMap<any>;

	public constructor(uuid: string) {
		this.packet = new HashMap({
			uuid: uuid,
			messages: new Collection()
		});
	}

	public getUuid(): string {
		return this.packet.require('uuid');
	}

	public message(message: Message): Packet {
		this.packet.require('messages').add(message);
		return this;
	}

	public messages(): Collection<Message> {
		return this.packet.require('messages');
	}

	public export(): Object {
		const object = {
			uuid: this.getUuid(),
			messages: <any>[]
		};
		this.messages().each(message => object.messages.push(message.export()));
		return object;
	}
}
