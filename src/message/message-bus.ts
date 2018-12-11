import {ToString} from "../utils";
import {Container, Inject} from "../container";
import {Packet} from "./packet";
import {Message} from "./message";
import {IMessageService} from "./types";
import {AbstractMessageService} from "./message-service";
import {Collection} from "../collection";

@ToString('edde/message/message-bus')
export class MessageBus extends AbstractMessageService {
	@Inject(Container)
	protected container: Container;

	public packet(packet: Packet): Packet {
		const response = this.createPacket();
		packet.messages().each(message => this.message(message, response));
		return response;
	}

	public resolve(message: Message): IMessageService {
		try {
			return this.container.create<IMessageService>(message.getService());
		} catch (e) {
			try {
				return this.container.create<IMessageService>('message-bus.' + message.getType() + '-message-service');
			} catch (e) {
				return this.container.create<IMessageService>('message-bus.common-message-service');
			}
		}
	}

	public createPacket(uuid?: string): Packet {
		return new Packet(uuid || this.uuidGenerator.uuid4());
	}

	public message(message: Message, packet: Packet): IMessageService {
		this.resolve(message).message(message, packet);
		return this;
	}

	public import(object: { uuid: string, messages?: { service: string, type: string, uuid: string, attrs?: {} }[] }): Packet {
		const packet = this.createPacket(object.uuid);
		new Collection(object.messages || []).each(item => {
			packet.message(this.createMessage(item.service, item.type, item.attrs, item.uuid));
		});
		return packet;
	}
}
