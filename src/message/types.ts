import {Message} from "./message";
import {Packet} from "./packet";
import {ToString} from "../utils";

export interface IMessageService {
	message(message: Message, packet: Packet): IMessageService;
}

@ToString('edde/message/message-portal-config')
export class MessagePortalConfig {
	public url: string;
	public deffer: number = 15;
	public timeout: number = 30;
	public buffer: number = 128;
}
