import {HashMap, HashMapCollection} from "../collection";
import {ToString} from "../utils";

type Subscriber = (value: any) => void;

/**
 * Simple map used to keep component state on one place; that means,
 * component could be rebuild to desired state by using this class.
 */
export class State extends HashMap<any> {
	protected subscribers: HashMapCollection<Subscriber>;

	public constructor() {
		super();
		this.subscribers = new HashMapCollection();
	}

	/**
	 * subscribe a new handler for a state item
	 *
	 * @param name
	 * @param subscriber
	 */
	public subscribe(name: ToString, subscriber: Subscriber): State {
		this.subscribers.add(name.toString(), subscriber);
		return this;
	}

	/**
	 * subscribe a handler and call it with current state value
	 *
	 * @param name
	 * @param subscriber
	 */
	public restore(name: ToString, subscriber: Subscriber): State {
		this.subscribe(name, subscriber);
		subscriber(this.get(name.toString()));
		return this;
	}
}
