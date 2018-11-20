import {ToString} from "../utils";
import {SubscribeObject} from "./types";

export function Subscribe(state: ToString, name: string): (target: any, property: string) => void {
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
