export type ToString = {
	toString: () => string;
};

/**
 * Simple decorator to name a "class" by usage of native toString() method.
 */
export function ToString(name: string): (constructor: Function) => void {
	return (constructor: any) => constructor.toString = () => name;
}

/**
 * Export string form an instance of object.
 */
export function GetString(instance: ToString): string {
	return instance.constructor.toString();
}
