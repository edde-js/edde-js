import {IMessageService} from "./types";
import {Message} from "./message";
import {Packet} from "./packet";
import {Inject} from "../container";
import {UuidGenerator} from "../crypto";
import {HashMap} from "../collection";
import {GetString, Strings} from "../utils";

export abstract class AbstractMessageService implements IMessageService {
	@Inject(UuidGenerator)
	protected uuidGenerator: UuidGenerator;

	public message(message: Message, packet: Packet): IMessageService {
		const method = 'on' + Strings.toCamelCase('-' + message.getType()) + 'Message';
		if (!(<any>this)[method]) {
			throw new Error(`Implement method [${method}] on [${GetString(this)}].`);
		}
		(<any>this)[method].call(this, message, packet);
		return this;
	}

	public createMessage(service: string, type: string, attrs: {} | null = null, uuid: string | null = null): Message {
		return new Message({
			service,
			type,
			uuid: uuid || this.uuidGenerator.uuid4(),
			attrs: new HashMap(<any>attrs)
		});
	}
}
