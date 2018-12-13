import {AbstractMessageService} from "./message-service";
import {Message} from "./message";
import {IMessageService} from "./types";
import {ToString} from "../utils";
import {Inject} from "../container";
import {MessagePortal} from "./message-portal";
import {Collection} from "../collection";
import {Messages} from "./messages";

@ToString('message-bus.collection-message-service')
export class CollectionMessageService extends AbstractMessageService {
//	@Inject(ReactorManager)
//	protected reactorManager: ReactorManager;
	@Inject(MessagePortal)
	protected messagePortal: MessagePortal;

	public onCollectionMessage(message: Message): IMessageService {
		const target = message.getTarget();
		new Collection<string>(message.getAttrs().require('collection')).each(uuid => {
//			if (this.reactorManager.has(uuid)) {
//				return;
//			}
			this.messagePortal.send(Messages.select(target, {
				'uuid': uuid,
			}));
		});
		return this;
	}
}
