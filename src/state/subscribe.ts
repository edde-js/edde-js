import {ToString} from "../utils";
import {SubscribeObject, SubscribersName} from "./types";

export module Subscribe {
	function Subscribe(name: string, state: ToString) {
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

	/**
	 * Subscribe to a value, state should be evaluated as target object.toString().
	 */
	export function This(name: string): (target: any, property: string) => void {
		return Subscribe(name, '$this');
	}

	/**
	 * Subscribe to a concrete value and state
	 */
	export function Local(name: string): (target: any, property: string) => void {
		return Subscribe(name, '$local');
	}

	/**
	 * Subscribe to a concrete value and state
	 */
	export function State(name: string, state: ToString): (target: any, property: string) => void {
		return Subscribe(name, state);
	}
}
