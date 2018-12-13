import {HashMap} from "../collection";
import {State} from "./state";
import {ToString} from "../utils";
import {UuidGenerator} from "../crypto";
import {Inject} from "../container";
import {MessageBus, MessagePortal} from "../message";

@ToString('edde-js/state/state-manager')
export class StateManager {
	@Inject(UuidGenerator)
	protected uuidGenerator: UuidGenerator;
	@Inject(MessagePortal)
	protected messagePortal: MessagePortal;
	@Inject(MessageBus)
	protected messageBus: MessageBus;
	protected states: HashMap<State>;

	public constructor() {
		this.states = new HashMap();
	}

	/**
	 * return a state; it does not exist, new one is created and
	 * set under the given name
	 *
	 * @param name
	 */
	public state(name: ToString): State {
		return this.states.ensure(name.toString(), () => new State(name.toString()));
	}

	public patch(states: Object): StateManager {
		new HashMap(<any>states).each((name, state) => this.state(name).patch(state));
		return this;
	}

	public update(): StateManager {
		this.states.each((_, state) => state.update());
		return this;
	}

	/**
	 * export all states (just for read)
	 */
	public export(): { [index: string]: {} } {
		const object: { [index: string]: {} } = {};
		this.states.each((name, state) => object[name] = state.toObject());
		return object;
	}
}
