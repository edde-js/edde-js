import {Collection, HashMap} from "../collection";
import {State} from "./state";
import {States, SubscribeObject, SubscribersName} from "./types";
import {GetString, ToString} from "../utils";

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

	public remember(object: Object): StateManager {
		new Collection((<SubscribeObject>object)[SubscribersName] || []).each(subscribeProperty => {
			this.state(subscribeProperty.state ? subscribeProperty.state.toString() : GetString(object)).subscribe(subscribeProperty.name, (<any>object)[subscribeProperty.handler].bind(object));
		});
		return this;
	}

	/**
	 * unsubscribe an object from all known states
	 *
	 * @param object
	 */
	public forget(object: Object): StateManager {
		this.states.each((_, state) => state.forget(object));
		return this;
	}

	public push(states: States): StateManager {
		new HashMap(states).each((name, state) => this.state(name).push(state));
		return this;
	}

	public patch(states: States): StateManager {
		new HashMap(states).each((name, state) => this.state(name).patch(state));
		return this;
	}

	public update(): StateManager {
		this.states.each((_, state) => state.update());
		return this;
	}
}
