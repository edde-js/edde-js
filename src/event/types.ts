import {ToString} from "../utils";
/**
 * event handler callback definition
 */
export type EventHandler<T> = (event: T) => void;
/**
 * event listener metadata
 */
export type EventListener<T> = {
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
