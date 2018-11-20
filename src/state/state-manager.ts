import {HashMap} from "../collection";
import {State} from "./state";

export class StateManager {
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
	public state(name: string): State {
		return this.states.ensure(name, () => new State());
	}

	/**
	 * when a required state does not exist, an error is thrown
	 *
	 * @param name
	 */
	public require(name: string): State {
		return this.states.require(name, `Requested unknown state [${name}].`);
	}

	public static toString() {
		return 'edde-js/state/state-manager';
	}
}
