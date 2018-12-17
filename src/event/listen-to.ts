import {ToString} from "../utils";
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

export function ListenTo(event: Function | ToString, weight: number | null = null, context: Object | null = null, cancellable: boolean = true): (target: any, property: string) => void {
	return function (target: ListenerObject, handler: string) {
		if (!Object.getOwnPropertyDescriptor(target, '::listeners')) {
			Object.defineProperty(target, '::listeners', {
				value: (target['::listeners'] || []).slice(0)
			});
		}
		target['::listeners'].push({
			event,
			handler,
			weight: weight || 0,
			context,
			cancellable
		});
	}
}
