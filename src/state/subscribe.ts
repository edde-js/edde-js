import {ToString} from "../utils";
import {SubscribeObject, SubscribersName} from "./types";

export function Subscribe(name: string, state: ToString | null = null): (target: any, property: string) => void {
	return function (target: SubscribeObject, handler: string) {
		if (!Object.getOwnPropertyDescriptor(target, SubscribersName)) {
			Object.defineProperty(target, SubscribersName, {
				value: (target[SubscribersName] || []).slice(0)
			});
		}
		target[SubscribersName].push({
			state,
			name,
			handler,
		});
	}
}
