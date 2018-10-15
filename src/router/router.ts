import {AbstractRoute, NoopRoute} from "./routes";
import {Route404Event, RouteChangeEvent, RouteDoneEvent, RouteRefreshEvent} from "./events";
import {Inject} from "../container";
import {EventBus} from "../event";
import {Collection} from "../collection";

export class Router {
	@Inject(EventBus)
	protected eventBus: EventBus;
	protected routes: Collection<AbstractRoute>;
	protected current: AbstractRoute;

	public constructor() {
		this.routes = new Collection();
		this.current = new NoopRoute();
	}

	/**
	 * register a new route
	 *
	 * @param route
	 */
	public register(route: AbstractRoute): Router {
		this.routes.add(route);
		return this;
	}

	public setup(): Router {
		this.routes.each(route => route.handler().setup());
		/**
		 * simple hack to call dummy setup method when
		 * setup is done
		 */
		this.setup = () => {
			throw new Error('Router is already ready! Do not call setup() method multiple times. It is not nice from you!')
		};
		return this;
	}

	/**
	 * run router and all related logic; this should also do dark magick with
	 * browser history
	 */
	public run(path: string): Router {
		/**
		 * loop through all routes and try to match the given path
		 */
		const loopContext = this.routes.each(route => {
			/**
			 * this is quite obvious: not matched stuff makes loop run
			 * further
			 */
			if (route.match(path) === false) {
				return;
			}
			/**
			 * when the same route ie executed, no action is performed; this
			 * could lead to some eventual event, but this is enough now
			 */
			if (this.current === route) {
				this.eventBus.event(new RouteRefreshEvent());
				return false;
			}
			this.eventBus.event(new RouteChangeEvent(path, route));
			(this.current = route).handle(path);
			return false;
		});
		if (loopContext.cancelled) {
			this.eventBus.event(new RouteDoneEvent(path, <AbstractRoute>loopContext.value));
			return this;
		}
		/**
		 * if loop has not been cancelled means function above did not returned
		 * explicit false (thus loop cancellation, like break) which means no route
		 * caught actual request
		 */
		this.eventBus.event(new Route404Event(path));
		return this;
	}

	public static toString() {
		return 'edde-js/router/router';
	}
}
