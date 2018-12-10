import {Message} from "./message";
import {Packet} from "./packet";

export interface IMessageHandler {
	message(message: Message, packet: Packet): IMessageHandler;

	createMessage(type: string, namespace: string): Message;
}
