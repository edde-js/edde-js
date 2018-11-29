export type ReactProperty = {
	property: string,
	handler: string,
	state: string,
};
export const REACT_PROPERTY = '::natives';
export type ReactObject = { [REACT_PROPERTY]: ReactProperty[] };

export function React(property: string, state: string = '_') {
	return function (target: any, handler: string) {
		const object: ReactObject = target;
		if (!Object.getOwnPropertyDescriptor(object, REACT_PROPERTY)) {
			Object.defineProperty(object, REACT_PROPERTY, {
				value: (object[REACT_PROPERTY] || []).slice(0)
			});
		}
		object[REACT_PROPERTY].push({
			property,
			handler,
			state,
		});
	}
}
