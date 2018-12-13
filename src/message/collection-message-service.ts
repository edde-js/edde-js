import {AbstractMessageService} from "./message-service";
import {Message} from "./message";
import {IMessageService} from "./types";
import {ToString} from "../utils";
import {ReactorManager} from "../reactor";
import {Inject} from "../container";
import {MessagePortal} from "./message-portal";

@ToString('message-bus.collection-message-service')
export class CollectionMessageService extends AbstractMessageService {
	@Inject(ReactorManager)
	protected reactorManager: ReactorManager;
	@Inject(MessagePortal)
	protected messagePortal: MessagePortal;

	public onCollectionMessage(message: Message): IMessageService {
		const target = message.getTarget();
		this.messagePortal.send(new Message('list', target, {
			'list': message.getAttrs().require('collection'),
		}));
		return this;
	}
}
