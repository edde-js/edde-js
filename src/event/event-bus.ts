import {ListenerCollection} from "./listener-collection";
import {IEvent, ListenerObject} from "./types";
import {Collection, HashMap} from "../collection";
import {GetString, ToString} from "../utils";

@ToString('edde-js/event/event-bus')
export class EventBus<T extends IEvent = IEvent> {
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
	public emit(event: T): T {
		this.listener(GetString(event)).emit(event);
		return event;
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
}
