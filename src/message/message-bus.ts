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
		const resolve: string[] = [];
		message.hasTarget() && resolve.push(<string>message.getTarget());
		resolve.push('message-bus.' + message.getType() + '-message-service');
		resolve.push('message-bus.common-message-service');
		let service = null;
		const loop = new Collection(resolve).each(resolve => {
			try {
				service = this.container.create<IMessageService>(resolve);
				return false;
			} catch (e) {
			}
		});
		if (loop.cancelled) {
			return <IMessageService><unknown>service;
		}
		throw new Error(`Cannot resolve any message service for message type [${message.getType()}]. Please register one message service of [${resolve.join(', ')}] to Container.`);
	}

	public createPacket(): Packet {
		return new Packet();
	}

	public message(message: Message, packet: Packet): IMessageService {
		this.resolve(message).message(message, packet);
		return this;
	}

	public import(object: { messages?: { type: string, target?: string | null, attrs?: {} }[] }): Packet {
		const packet = this.createPacket();
		new Collection(object.messages || []).each(item => {
			packet.message(this.createMessage(item.type, item.target || null, item.attrs || null));
		});
		return packet;
	}
}
