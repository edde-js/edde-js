import {HashMap} from "../collection";
import {State} from "./state";
import {ToString} from "../utils";
import {UuidGenerator} from "../crypto";
import {Inject} from "../container";

@ToString('edde-js/state/state-manager')
export class StateManager {
	@Inject(UuidGenerator)
	protected uuidGenerator: UuidGenerator;
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

	/**
	 * register a random state
	 */
	public random(): State {
		return this.state(this.uuidGenerator.uuid4());
	}

	/**
	 * when a required state does not exist, an error is thrown
	 *
	 * @param name
	 */
	public require(name: ToString): State {
		return this.states.require(name.toString(), `Requested unknown state [${name.toString()}].`);
	}

	/**
	 * request a state and return temporary state; when a new state will be available, update will be executed
	 *
	 * @param name
	 */
	public request(name: ToString): State {
		// messageBus.packet()->message(messageBus.createMessage('state', '...'))
		return this.state(name);
	}

	public push(states: Object): StateManager {
		new HashMap(<any>states).each((name, state) => this.state(name).push(state));
		return this;
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
