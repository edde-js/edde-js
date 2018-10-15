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

export type IHandler = (path: string) => void;
