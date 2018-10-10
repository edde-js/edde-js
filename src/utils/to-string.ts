export type ToString = {
	toString: () => string;
};

export function ToString(instance: ToString): string {
	return instance.constructor.toString();
}
