/**
 * How route itself looks.
 */
export interface IRoute {
	/**
	 * match the router against the given path
	 *
	 * @param path
	 */
	match(path: string): boolean;

	/**
	 * handle the route; if there is an error, it should throw an exception; handle also should
	 * setup handler
	 *
	 * @param path
	 */
	handle(path: string): void;
}

/**
 * What it says: noop route, it does not match nothing
 */
export const INoopRoute: IRoute = {
	match: () => false,
	handle: () => null
};
/**
 * Handler method type.
 */
export type IHandler = (path: string) => void;
