import {AbstractMessageService} from "./message-service";
import {Message} from "./message";
import {Inject} from "../container";
import {ReactorManager} from "../reactor";
import {ToString} from "../utils";
import {Collection} from "../collection";

@ToString('message-bus.states-message-service')
export class StatesMessageService extends AbstractMessageService {
	@Inject(ReactorManager)
	protected reactorManager: ReactorManager;

	public onStatesMessage(message: Message) {
		new Collection<{ uuid: string }>(message.getAttrs().require('states')).each(state => {
			this.reactorManager.reactor(state.uuid).patch(state);
		});
	}
}
