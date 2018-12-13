import {AbstractMessageService} from "./message-service";
import {Message} from "./message";
import {Packet} from "./packet";
import {IMessageService} from "./types";
import {ToString} from "../utils";
import {Inject} from "../container";
import {ReactorManager} from "../reactor";

@ToString('message-bus.collection-message-service')
export class CollectionMessageService extends AbstractMessageService {
	@Inject(ReactorManager)
	protected reactorManager: ReactorManager;

	public onCollectionMessage(message: Message, packet: Packet): IMessageService {
		console.log('state collection', message);
//		const patch: any = {};
//		patch[<string>message.getTarget()] = message.getAttrs().toObject();
//		this.stateManager.patch(patch);
		return this;
	}
}
