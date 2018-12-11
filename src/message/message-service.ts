import {IMessageService} from "./types";
import {Message} from "./message";
import {Packet} from "./packet";
import {Inject} from "../container";
import {UuidGenerator} from "../crypto";
import {HashMap} from "../collection";

export abstract class AbstractMessageService implements IMessageService {
	@Inject(UuidGenerator)
	protected uuidGenerator: UuidGenerator;

	public createMessage(service: string, type: string, attrs: {} | null = null, uuid: string | null = null): Message {
		return new Message({
			service,
			type,
			uuid: uuid || this.uuidGenerator.uuid4(),
			attrs: new HashMap(<any>attrs)
		});
	}

	public abstract message(message: Message, packet: Packet): IMessageService;
}
