import {HashMap} from "../collection";

export abstract class RouteHandler {
	/**
	 * setup a route handler
	 */
	public setup(): RouteHandler {
		this.handleSetup();
		/**
		 * simple hack to call dummy setup method when
		 * setup is done
		 */
		this.setup = () => {
			throw new Error('Route handler is already ready! Do not call setup() method multiple times. Or the God will kill one cute kitten!')
		};
		return this;
	}

	protected handleSetup(): void {
	}

	public abstract handle(path: string, params: HashMap<any>): RouteHandler;
}

export class NoopRouteHandler extends RouteHandler {
	public handle(path: string, params: HashMap<any>): RouteHandler {
		return this;
	}
}
