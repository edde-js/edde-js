import {ToString} from "../utils";

export interface IEvent {
	cancel(cancel: boolean): IEvent;

	isCancelled(): boolean;
}

/**
 * event handler callback definition
 */
export type EventHandler<T extends IEvent> = (event: T) => void;
/**
 * event listener metadata
 */
export type EventListener<T extends IEvent> = {
	handler: EventHandler<T>;
	weight: number;
	context: Object | null;
	cancellable: boolean;
};
/**
 * listener property descriptor; used for event registration
 */
export type ListenerProperty = {
	event: ToString;
	handler: string;
	weight: number;
	context: Object | null;
	cancellable: boolean;
};
/**
 * just formal type for listener object to keep "magic" property
 * typed
 */
export type ListenerObject = {
	'::listeners': ListenerProperty[];
};
