import {AbstractEvent} from "@edde-js/event";
import {AbstractRoute} from "./routes";

/**
 * When no route has been matched, this event is sent.
 */
export class Route404Event extends AbstractEvent {
	protected path: string;

	public constructor(path: string) {
		super();
		this.path = path;
	}

	public getPath(): string {
		return this.path;
	}

	public static toString() {
		return 'edde-js/router/route-404-event';
	}
}

/**
 * When the same route is requested, this event is sent.
 */
export class RouteRefreshEvent extends AbstractEvent {
	public static toString() {
		return 'edde-js/router/route-refresh-event';
	}
}

/**
 * When a route is changed (navigation); called before handler.
 */
export class RouteChangeEvent extends AbstractEvent {
	protected path: string;
	protected route: AbstractRoute;

	public constructor(path: string, route: AbstractRoute) {
		super();
		this.path = path;
		this.route = route;
	}

	public getPath(): string {
		return this.path;
	}

	public getRoute(): AbstractRoute {
		return this.route;
	}

	public static toString() {
		return 'edde-js/router/route-change-event';
	}
}

/**
 * When a route is changed (done); emitted after handler.
 */
export class RouteDoneEvent extends AbstractEvent {
	protected path: string;
	protected route: AbstractRoute;

	public constructor(path: string, route: AbstractRoute) {
		super();
		this.path = path;
		this.route = route;
	}

	public getPath(): string {
		return this.path;
	}

	public getRoute(): AbstractRoute {
		return this.route;
	}

	public static toString() {
		return 'edde-js/router/route-done-event';
	}
}
