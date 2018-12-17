import {ToString} from "../utils";

export const SCOPED_EVENT_PROPERTY = '::scoped-event';
export type ScopedEventProperty = {
	scope: ToString;
	event: ToString;
	handler: string;
	weight: number;
	context: Object | null;
	cancellable: boolean;
};
export type ScopedEventObject = {
	[SCOPED_EVENT_PROPERTY]: ScopedEventProperty[];
};

export function ScopedEvent(scope: ToString, event: Function | ToString, weight: number | null = null, context: Object | null = null, cancellable: boolean = true): (target: any, property: string) => void {
	return function (target: ScopedEventObject, handler: string) {
		if (!Object.getOwnPropertyDescriptor(target, SCOPED_EVENT_PROPERTY)) {
			Object.defineProperty(target, SCOPED_EVENT_PROPERTY, {
				value: (target[SCOPED_EVENT_PROPERTY] || []).slice(0)
			});
		}
		target[SCOPED_EVENT_PROPERTY].push({
			scope,
			event,
			handler,
			weight: weight || 0,
			context,
			cancellable
		});
	}
}
