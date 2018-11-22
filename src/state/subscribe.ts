import {ToString} from "../utils";
import {SubscribeObject} from "./types";

export function Subscribe(name: string, state: ToString | null = null): (target: any, property: string) => void {
	return function (target: SubscribeObject, handler: string) {
		if (!Object.getOwnPropertyDescriptor(target, '::subscribers')) {
			Object.defineProperty(target, '::subscribers', {
				value: (target['::subscribers'] || []).slice(0)
			});
		}
		target['::subscribers'].push({
			state,
			name,
			handler,
		});
	}
}
