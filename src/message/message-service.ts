import {IMessageService} from "./types";
import {Message} from "./message";
import {Packet} from "./packet";
import {GetString, Strings} from "../utils";

export abstract class AbstractMessageService implements IMessageService {
	public message(message: Message, packet: Packet): IMessageService {
		const method = 'on' + Strings.toCamelCase('-' + message.getType()) + 'Message';
		if (!(<any>this)[method]) {
			throw new Error(`Implement method [${method}] on [${GetString(this)}].`);
		}
		(<any>this)[method].call(this, message, packet);
		return this;
	}
}
