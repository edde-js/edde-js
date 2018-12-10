import {IMessageHandler} from "./types";
import {Message} from "./message";
import {Packet} from "./packet";
import {Inject} from "../container";
import {UuidGenerator} from "../crypto";

export abstract class AbstractMessageHandler implements IMessageHandler {
	@Inject(UuidGenerator)
	protected uuidGenerator: UuidGenerator;

	public createMessage(type: string, namespace: string, uuid: string | null = null): Message {
		return new Message({
			type,
			namespace,
			uuid: uuid || this.uuidGenerator.uuid4(),
		});
	}

	public abstract message(message: Message, packet: Packet): IMessageHandler;
}
