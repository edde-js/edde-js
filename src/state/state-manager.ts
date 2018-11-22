import {Collection, HashMap} from "../collection";
import {State} from "./state";
import {PushState} from "./types";
import {ToString} from "../utils";

@ToString('edde-js/state/state-manager')
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
	public state(name: ToString): State {
		return this.states.ensure(name.toString(), () => new State());
	}

	/**
	 * when a required state does not exist, an error is thrown
	 *
	 * @param name
	 */
	public require(name: string): State {
		return this.states.require(name, `Requested unknown state [${name}].`);
	}

	public push(states: PushState[]): StateManager {
		new Collection(states).each(pushState => this.state(pushState.name).push(pushState.state));
		return this;
	}

	public refresh(): StateManager {
		this.states.each((_, state) => state.refresh());
		return this;
	}
}
