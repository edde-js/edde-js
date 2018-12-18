import {ToString} from "../utils";
import {AbstractMessageService, Message, MessagePortal} from "../message";
import {Inject} from "../container";
import {ReactorManager} from "./reactor-manager";
import {Collection} from "../collection";

@ToString('edde/reactor/sync-message-service-config')
export class SyncMessageServiceConfig {
	/**
	 * how ofter sync should be executed (milliseconds)
	 */
	public timeout: number = 750;
	public target: string | null;
}

@ToString('engine.sync.sync-message-service')
export class SyncMessageService extends AbstractMessageService {
	@Inject(MessagePortal)
	protected messagePortal: MessagePortal;
	@Inject(ReactorManager)
	protected reactorManager: ReactorManager;
	@Inject(SyncMessageServiceConfig)
	protected config: SyncMessageServiceConfig;

	public onPongMessage(message: Message) {
		new Collection(message.getAttrs().require('sync')).each(item => this.reactorManager.patch(item));
		setTimeout(this.onSync.bind(this), this.config.timeout = message.getAttrs().get('timeout', () => this.config.timeout));
	}

	protected onSync() {
		const sync: string[] = [];
		this.reactorManager.reactors().each(name => sync.push(name));
		this.messagePortal.send(new Message('ping', this.config.target, {
			sync,
			timeout: this.config.timeout
		}));
	}

	/**
	 * start sync based on ReactorManager
	 */
	public start(): SyncMessageService {
		if (this.config.timeout <= 0) {
			return this;
		}
		this.onSync();
		return this;
	}
}
