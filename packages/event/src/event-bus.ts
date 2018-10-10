import {Collection, HashMap} from "@edde-js/collection";
import {ToString} from "@edde-js/utils";
import {ListenerCollection} from "./listener-collection";
import {AbstractEvent} from "./event";
import {ListenerObject} from "./types";

export class EventBus<T extends AbstractEvent = AbstractEvent> {
	protected listenerCollections: HashMap<ListenerCollection<T>>;

	public constructor() {
		this.listenerCollections = new HashMap();
	}

	/**
	 * return listener collection for the given event
	 *
	 * @param event
	 */
	public listener(event: ToString): ListenerCollection<T> {
		return this.listenerCollections.ensure(event.toString(), () => new ListenerCollection());
	}

	/**
	 * emit the given event
	 *
	 * @param event
	 */
	public event(event: T): EventBus<T> {
		/**
		 * event.constructor is necessary as toString is static method accessed
		 * from an instance
		 */
		this.listener(event.constructor).event(event);
		return this;
	}

	/**
	 * subscribe all events defined on the given instance
	 *
	 * @param instance
	 */
	public subscribe<T>(instance: T): T {
		new Collection((<ListenerObject><any>instance)['::listeners'] || []).each(listenerProperty => {
			const context: any = listenerProperty.context || instance;
			this.listener(listenerProperty.event).add(
				context[listenerProperty.handler],
				listenerProperty.weight,
				context,
				listenerProperty.cancellable
			);
		});
		return instance;
	}

	public static toString() {
		return 'edde-js/event/event-bus';
	}
}
