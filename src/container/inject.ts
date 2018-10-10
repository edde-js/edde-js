import {DependencyObject} from "./types";
import {ToString} from "../utils";

export function Inject(factory: Function | ToString): (target: any, property: string) => void {
	return function (target: DependencyObject, property: string) {
		if (!Object.getOwnPropertyDescriptor(target, '::injects')) {
			Object.defineProperty(target, '::injects', {
				value: (target['::injects'] || []).slice(0)
			});
		}
		target['::injects'].push({
			property,
			factory,
		});
	}
}
