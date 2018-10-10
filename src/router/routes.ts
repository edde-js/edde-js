import {NoopRouteHandler, RouteHandler} from "./route-handler";
import {HashMap} from "../collection";

export abstract class AbstractRoute {
	protected routeHandler: RouteHandler;

	protected constructor(routeHandler: RouteHandler) {
		this.routeHandler = routeHandler;
		return this;
	}

	/**
	 * match the router against the given path
	 *
	 * @param path
	 */
	public abstract match(path: string): boolean;

	/**
	 * handle the route; if there is an error, it should throw an exception; handle also should
	 * setup handler
	 *
	 * @param path
	 */
	public abstract handle(path: string): AbstractRoute;

	/**
	 * return current route handler
	 */
	public handler(): RouteHandler {
		return this.routeHandler;
	}
}

export class NoopRoute extends AbstractRoute {
	public constructor() {
		super(new NoopRouteHandler());
	}

	public match(path: string): boolean {
		return false;
	}

	public handle(path: string): AbstractRoute {
		return this;
	}
}

export class PathRoute extends AbstractRoute {
	protected path: string;

	public constructor(path: string, routeHandler: RouteHandler) {
		super(routeHandler);
		this.path = path;
	}

	/** @inheritDoc */
	public match(path: string): boolean {
		return this.path === path;
	}

	/** @inheritDoc */
	public handle(path: string): AbstractRoute {
		this.routeHandler.handle(path, new HashMap());
		return this;
	}
}

export class Routes {
	public static noop(): AbstractRoute {
		return new NoopRoute();
	}

	public static path(path: string, routeHandler: RouteHandler): AbstractRoute {
		return new PathRoute(path, routeHandler);
	}
}
