import {StateManager} from "./state-manager";
import {Inject} from "../container";
import {AbstractMessageHandler} from "../message/message-handler";
import {IMessageHandler, Message, Packet} from "../message";
import {ToString} from "../utils";

@ToString('message-bus.state-message-handler')
export class StateMessageHandler extends AbstractMessageHandler {
	@Inject(StateManager)
	protected stateManager: StateManager;

	public message(message: Message, packet: Packet): IMessageHandler {
		const patch: any = {};
		patch[message.getNamespace()] = message.getAttrs().toObject();
		this.stateManager.patch(patch);
		return this;
	}
}
