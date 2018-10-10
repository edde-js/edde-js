import {ToString} from "@edde-js/utils";
import {ListenerObject} from "./types";

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
