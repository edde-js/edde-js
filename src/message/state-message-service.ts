import {ToString} from "../utils";
import {AbstractMessageService} from "./message-service";
import {Message} from "./message";
import {IMessageService} from "./types";
import {ReactorManager} from "../reactor";
import {Inject} from "../container";

@ToString('message-bus.state-message-service')
export class StateMessageService extends AbstractMessageService {
	@Inject(ReactorManager)
	protected reactorManager: ReactorManager;

	public onStateMessage(message: Message): IMessageService {
		if (message.hasTarget()) {
			const patch: any = {};
			patch[<string>message.getTarget()] = message.getAttrs().toObject();
			this.reactorManager.patch(patch);
		}
		return this;
	}
}
