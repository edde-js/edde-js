import {ToString} from "../utils";
import {Container, Inject} from "../container";
import {Packet} from "./packet";
import {Message} from "./message";
import {IMessageHandler} from "./types";
import {AbstractMessageHandler} from "./message-handler";
import {Collection} from "../collection";

@ToString('edde/message/message-bus')
export class MessageBus extends AbstractMessageHandler {
	@Inject(Container)
	protected container: Container;

	public packet(packet: Packet): Packet {
		const response = this.createPacket();
		packet.messages(message => this.message(message, response));
		return packet;
	}

	public resolve(message: Message): IMessageHandler {
		return this.container.create<IMessageHandler>(message.getNamespace() + '.' + message.getType() + '-message-handler');
	}

	public createPacket(uuid?: string): Packet {
		return new Packet(uuid || this.uuidGenerator.uuid4());
	}

	public message(message: Message, packet: Packet): IMessageHandler {
		this.resolve(message).message(message, packet);
		return this;
	}

	public import(object: { uuid: string, messages: { type: string, namespace: string, uuid: string }[] }): Packet {
		const packet = this.createPacket(object.uuid);
		new Collection(object.messages).each(item => {
			const message = this.createMessage(item.type, item.namespace, item.uuid);
			packet.message(message);
		});
		return packet;
	}
}
