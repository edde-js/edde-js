export type SubscribeProperty = {
	property: string,
	handler: string,
	state: string,
};
export const SUBSCRIBE_PROPERTY = '::subscribes';
export type SubscribeObject = { [SUBSCRIBE_PROPERTY]: SubscribeProperty[] };

export function Subscribe(property: string, state: string) {
	return function (target: any, handler: string) {
		const object: SubscribeObject = target;
		if (!Object.getOwnPropertyDescriptor(object, SUBSCRIBE_PROPERTY)) {
			Object.defineProperty(object, SUBSCRIBE_PROPERTY, {
				value: (object[SUBSCRIBE_PROPERTY] || []).slice(0)
			});
		}
		object[SUBSCRIBE_PROPERTY].push({
			property,
			handler,
			state,
		});
	}
}
