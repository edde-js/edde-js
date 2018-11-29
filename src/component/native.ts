import {Html} from "../dom";

export type NativePropertyCallback<T> = (object: T) => Html;
export type NativeProperty = {
	event: string,
	callback: NativePropertyCallback<any>,
	handler: string,
};
export const NATIVE_PROPERTY = '::natives';
export type NativeObject = { [NATIVE_PROPERTY]: NativeProperty[] };

export function Native<T>(event: string, callback?: NativePropertyCallback<T>) {
	return function (target: any, handler: string) {
		const object: NativeObject = target;
		if (!Object.getOwnPropertyDescriptor(object, NATIVE_PROPERTY)) {
			Object.defineProperty(object, NATIVE_PROPERTY, {
				value: (object[NATIVE_PROPERTY] || []).slice(0)
			});
		}
		object[NATIVE_PROPERTY].push({
			event,
			callback: callback || (component => component.root),
			handler
		});
	}
}
