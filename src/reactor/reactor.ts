import {Collection, HashMap, HashMapCollection, HashMapKey} from "../collection";
import {ToString} from "../utils";
import {Subscriber} from "./types";

/**
 * Simple map used to keep component state on one place; that means,
 * component could be rebuild to desired state by using this class.
 */
export class Reactor extends HashMap<any> {
	protected name: string;
	protected subscribers: HashMapCollection<Subscriber>;
	protected updates: HashMapCollection<Subscriber>;

	public constructor(name: string) {
		super();
		this.name = name;
		this.subscribers = new HashMapCollection();
		this.updates = new HashMapCollection();
	}

	public getName(): string {
		return this.name;
	}

	/**
	 * subscribe a new handler for a state item
	 *
	 * @param name
	 * @param subscriber
	 */
	public subscribe(name: ToString, subscriber: Subscriber): Reactor {
		this.subscribers.add(name.toString(), subscriber);
		this.updates.add(name.toString(), subscriber);
		return this;
	}

	/**
	 * unsubscribe given property
	 *
	 * @param name
	 * @param subscriber
	 */
	public unsubscribe(name: ToString, subscriber: Subscriber): Reactor {
		this.subscribers.removeBy(name.toString(), item => item === subscriber);
		this.updates.removeBy(name.toString(), item => item === subscriber);
		return this;
	}

	/**
	 * refresh all newly added subscribers
	 */
	public update(): Reactor {
		this.updates.eachCollection((name, subscribers) => {
			if (!this.has(name)) {
				return;
			}
			const value = this.get(<string>name);
			subscribers.each(subscriber => subscriber(value, this));
		});
		this.updates.clear();
		return this;
	}

	public set(name: HashMapKey, value: any): HashMap<any> {
		/**
		 * works quite well for scalar values; states SHOULD contain just scalar values, so we're fine
		 */
		if (this.get(name) === value) {
			return this;
		}
		super.set(name, value);
		this.subscribers.ensure(<string>name, () => new Collection()).each(subscriber => subscriber(value, this));
		return this;
	}

	/**
	 * push a new state object
	 *
	 * @param state
	 */
	public push(state: Object): Reactor {
		this.clear();
		this.patch(state);
		return this;
	}

	/**
	 * append values from the given object
	 *
	 * @param state
	 */
	public patch(state: Object): Reactor {
		this.copy(new HashMap(state));
		return this;
	}
}
