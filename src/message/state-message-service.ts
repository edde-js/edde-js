import {ToString} from "../utils";
import {AbstractMessageService} from "./message-service";
import {Inject} from "../container";
import {ReactorManager} from "../reactor";
import {Message} from "./message";
import {IMessageService} from "./types";

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
