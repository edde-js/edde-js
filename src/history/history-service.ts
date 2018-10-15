import {Inject} from "../container";
import {Runtime} from "../runtime";
import {ViewManager} from "../view/view-manager";

export class HistoryService {
	@Inject(Runtime)
	protected runtime: Runtime;
	@Inject(ViewManager)
	protected viewManager: ViewManager;

	public init() {
		this.runtime.getWindow().onpopstate = (event: PopStateEvent) => {
			if (event.state) {
				this.viewManager.routeTo(event.state.path);
			}
		};
	}

//	@ListenTo(RouteChangeEvent)
//	public handleRouteChangeEvent(event: RouteChangeEvent) {
//		this.runtime.getWindow().history.pushState({path: this.runtime.getPath()}, '', event.getPath());
//	}
	public static toString() {
		return 'edde-js/history/history-service';
	}
}
