import {Inject} from "../container";
import {Runtime} from "../runtime";
import {MountViewEvent, ViewManager} from "../view";
import {ListenTo} from "../event";
import {ToString} from "../utils";

@ToString('edde-js/history/history-service')
export class HistoryService {
	@Inject(Runtime)
	protected runtime: Runtime;
	@Inject(ViewManager)
	protected viewManager: ViewManager;

	protected init() {
		this.runtime.getWindow().onpopstate = (event: PopStateEvent) => {
			if (event.state) {
				this.viewManager.routeTo(event.state.path);
			}
		};
	}

	@ListenTo(MountViewEvent)
	public handleRouteChangeEvent(event: MountViewEvent) {
		this.runtime.getWindow().history.pushState({path: this.runtime.getPath()}, '', event.getPath());
	}
}
