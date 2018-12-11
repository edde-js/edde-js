import {StateManager} from "./state-manager";
import {Inject} from "../container";
import {AbstractMessageService, IMessageService, Message, Packet} from "../message";
import {ToString} from "../utils";

@ToString('message-bus.state-message-handler')
export class StateMessageService extends AbstractMessageService {
	@Inject(StateManager)
	protected stateManager: StateManager;

	public message(message: Message, packet: Packet): IMessageService {
		const patch: any = {};
		patch[message.getNamespace()] = message.getAttrs().toObject();
		this.stateManager.patch(patch);
		return this;
	}
}
