import {EventHandler, EventListener, IEvent} from "./types";
import {Collection} from "../collection";

/**
 * Collection of listeners for exactly one event type.
 */
export class ListenerCollection<T extends IEvent> {
	/**
	 * collection of listeners
	 */
	protected listeners: Collection<EventListener<T>>;
	/**
	 * actual maximum weight for weightless listeners
	 */
	protected weight: number;

	public constructor() {
		this.listeners = new Collection();
		this.weight = -1;
	}

	/**
	 * add a new listener to the collection; listener respects weight
	 *
	 * if a listener does not have a weight, it's added at the end of the list
	 *
	 * higher weight is executed first
	 *
	 * @param handler
	 * @param weight
	 * @param context
	 * @param cancellable
	 */
	public add(handler: EventHandler<T>, weight: number | null = null, context: Object | null = null, cancellable: boolean = true): ListenerCollection<T> {
		this.listeners.add({
			handler,
			weight: weight || 0,
			context,
			cancellable
		});
		this.listeners.sort((alpha, beta): number => beta.weight - alpha.weight);
		return this;
	}

	/**
	 * emit an event to all listeners; internally uses some rules like
	 * event cancellation
	 *
	 * @param event
	 */
	public emit(event: T): ListenerCollection<T> {
		this.listeners.each(listener => {
			if ((listener.cancellable && event.isCancelled()) !== true) {
				listener.handler.call(listener.context || listener.handler, event);
			}
		});
		return this;
	}

	/**
	 * return number of registered handlers
	 */
	public getCount(): number {
		return this.listeners.getCount();
	}
}
