import {Collection, HashMap, HashMapCollection} from "../collection";
import {ToString} from "../utils";
import {Subscriber} from "./types";

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
		this.call(subscriber, this.get(name.toString()));
		return this;
	}

	public set(name: string | number, value: any): HashMap<any> {
		super.set(name, value);
		this.subscribers.ensure(<string>name, () => new Collection()).each(subscriber => this.call(subscriber, value));
		return this;
	}

	protected call(subscriber: Subscriber, value: any): State {
		subscriber(value);
		return this;
	}
}
