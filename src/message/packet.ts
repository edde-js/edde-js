import {Collection, HashMap} from "../collection";
import {Message} from "./message";

export class Packet {
	protected packet: HashMap<any>;

	public constructor() {
		this.packet = new HashMap({
			messages: new Collection()
		});
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
			messages: <any>[]
		};
		this.messages().each(message => object.messages.push(message.export()));
		return object;
	}
}
