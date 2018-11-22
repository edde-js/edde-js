import {BindObject} from "./types";

export function Bind(name: string): (target: any, property: string) => void {
	return function (target: BindObject, handler: string) {
		if (!Object.getOwnPropertyDescriptor(target, '::binds')) {
			Object.defineProperty(target, '::binds', {
				value: (target['::binds'] || []).slice(0)
			});
		}
		target['::binds'].push({
			name,
			handler,
		});
	}
}
