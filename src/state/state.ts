import {Collection, HashMap, HashMapCollection} from "../collection";
import {ToString} from "../utils";
import {SubscribeProperty, Subscriber, SubscribesName} from "./types";

/**
 * Simple map used to keep component state on one place; that means,
 * component could be rebuild to desired state by using this class.
 */
export class State extends HashMap<any> {
	protected subscribers: HashMapCollection<Subscriber>;
	protected updates: HashMapCollection<Subscriber>;

	public constructor() {
		super();
		this.subscribers = new HashMapCollection();
		this.updates = new HashMapCollection();
	}

	/**
	 * subscribe a new handler for a state item
	 *
	 * @param name
	 * @param subscriber
	 */
	public subscribe(name: ToString, subscriber: Subscriber): State {
		this.subscribers.add(name.toString(), subscriber);
		this.updates.add(name.toString(), subscriber);
		return this;
	}

	/**
	 * "forget" all registered methods of the given object; strange name because
	 * of potential API collision for subscribe one method and unsubscribe object
	 *
	 * @param object
	 * @param property
	 */
	public forget(object: Object, property: string = SubscribesName): State {
		new Collection((<any>object)[property]).each((subscribeProperty: SubscribeProperty) => {
			this.subscribers.deleteBy(item => item === (<any>object)[subscribeProperty.handler]);
			this.updates.deleteBy(item => item === (<any>object)[subscribeProperty.handler]);
		});
		return this;
	}

	/**
	 * refresh all newly added subscribers
	 */
	public update(): State {
		this.updates.eachCollection((name, subscribers) => {
			const value = this.get(<string>name);
			subscribers.each(subscriber => this.call(subscriber, value));
		});
		this.updates.clear();
		return this;
	}

	public set(name: string | number, value: any): HashMap<any> {
		super.set(name, value);
		this.subscribers.ensure(<string>name, () => new Collection()).each(subscriber => this.call(subscriber, value));
		return this;
	}

	/**
	 * push a new state object
	 *
	 * @param state
	 */
	public push(state: Object): State {
		this.clear();
		this.copy(new HashMap(state));
		return this;
	}

	protected call(subscriber: Subscriber, value: any): State {
		subscriber(value, this);
		return this;
	}
}
