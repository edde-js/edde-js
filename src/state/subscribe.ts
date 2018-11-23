import {ToString} from "../utils";
import {SubscribeObject, SubscribersName} from "./types";

export module Subscribe {
	function Subscribe(name: string, state: ToString | null = null) {
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

	export function To(name: string): (target: any, property: string) => void {
		return Subscribe(name);
	}

	export function State(name: string, state: ToString): (target: any, property: string) => void {
		return Subscribe(name, state);
	}
}
