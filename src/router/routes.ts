import {IHandler, IRoute} from "./types";

export abstract class AbstractRoute implements IRoute {
	public abstract match(path: string): boolean;

	public abstract handle(path: string): IRoute;
}

export class NoopRoute extends AbstractRoute {
	public match(path: string): boolean {
		return false;
	}

	public handle(path: string): AbstractRoute {
		return this;
	}
}

export class Routes {
	public static path(path: string, handler: IHandler): IRoute {
		return {
			match: (match: string) => {
				return match === path;
			},
			handle: handler
		}
	}
}
