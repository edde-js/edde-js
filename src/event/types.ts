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
