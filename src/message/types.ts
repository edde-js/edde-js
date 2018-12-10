import {Message} from "./message";
import {Packet} from "./packet";
import {ToString} from "../utils";

export interface IMessageHandler {
	message(message: Message, packet: Packet): IMessageHandler;

	createMessage(type: string, namespace: string): Message;
}

@ToString('edde/message/message-service-config')
export class MessageServiceConfig {
	public url: string;
	public deffer: number = 15;
	public timeout: number = 30;
	public buffer: number = 128;
}
