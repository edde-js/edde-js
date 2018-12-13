import {ToString} from "../utils";
import {AbstractMessageService} from "./message-service";
import {Inject} from "../container";
import {StateManager} from "../state";
import {Message} from "./message";
import {Packet} from "./packet";
import {IMessageService} from "./types";

@ToString('message-bus.state-message-service')
export class StateMessageService extends AbstractMessageService {
	@Inject(StateManager)
	protected stateManager: StateManager;

	public onStateMessage(message: Message, packet: Packet): IMessageService {
		if (message.hasTarget()) {
			const patch: any = {};
			patch[<string>message.getTarget()] = message.getAttrs().toObject();
			this.stateManager.patch(patch);
		}
		return this;
	}

	public onCollectionMessage(message: Message, packet: Packet): IMessageService {
		console.log('state collection', message);
//		const patch: any = {};
//		patch[<string>message.getTarget()] = message.getAttrs().toObject();
//		this.stateManager.patch(patch);
		return this;
	}
}
