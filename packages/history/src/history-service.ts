import {Inject} from "@edde-js/container";
import {Runtime} from "@edde-js/runtime";
import {ListenTo} from "@edde-js/event";
import {RouteChangeEvent, Router} from "@edde-js/router";

export class HistoryService {
	@Inject(Runtime)
	protected runtime: Runtime;
	@Inject(Router)
	protected router: Router;

	public init() {
		this.runtime.getWindow().onpopstate = (event: PopStateEvent) => {
			if (event.state) {
				this.router.run(event.state.path);
			}
		};
	}

	@ListenTo(RouteChangeEvent)
	public handleRouteChangeEvent(event: RouteChangeEvent) {
		this.runtime.getWindow().history.pushState({path: this.runtime.getPath()}, '', event.getPath());
	}

	public static toString() {
		return 'edde-js/history/history-service';
	}
}
