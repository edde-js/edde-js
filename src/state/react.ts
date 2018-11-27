export type ReactProperty = {
	property: string;
	handler: string
};
export const ReactsProperty = '::reacts';

export function React(property: string) {
	return function (target: any, handler: string) {
		if (!Object.getOwnPropertyDescriptor(target, ReactsProperty)) {
			Object.defineProperty(target, ReactsProperty, {
				value: (target[ReactsProperty] || []).slice(0)
			});
		}
		target[ReactsProperty].push({
			property,
			handler,
		});
	}
}
