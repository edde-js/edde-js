import {State} from "./state";

export type ReactPropertyCallback<T extends { state: State }> = (object: T) => State;
export type ReactProperty = {
	property: string,
	handler: string,
	callback: ReactPropertyCallback<any>,
};
export const REACT_PROPERTY = '::natives';
export type ReactObject = { [REACT_PROPERTY]: ReactProperty[] };

export function React<T extends { state: State }>(property: string, callback: ReactPropertyCallback<T> = (object => object.state)) {
	return function (target: any, handler: string) {
		const object: ReactObject = target;
		if (!Object.getOwnPropertyDescriptor(object, REACT_PROPERTY)) {
			Object.defineProperty(object, REACT_PROPERTY, {
				value: (object[REACT_PROPERTY] || []).slice(0)
			});
		}
		object[REACT_PROPERTY].push({
			property,
			callback,
			handler
		});
	}
}
