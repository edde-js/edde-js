import {IView} from "./types";
import {ToString} from "../utils";
import {Container, Inject} from "../container";
import {HashMap} from "../collection";
import {EventBus} from "../event";
import {DeadRouteEvent, MountViewEvent, RefreshViewEvent, UmountViewEvent} from "./events";
import {StateManager} from "../state";

@ToString('edde-js/view/view-manager')
export class ViewManager {
	@Inject(Container)
	protected container: Container;
	@Inject(EventBus)
	protected eventBus: EventBus;
	@Inject(StateManager)
	protected stateManager: StateManager;
	protected views: HashMap<IView>;
	protected current: IView;

	public constructor() {
		this.views = new HashMap();
		this.current = IView;
	}

	/**
	 * create and register a new view
	 *
	 * @param name
	 */
	public register(name: ToString): IView {
		return this.views.seti(name.toString(), this.container.create<IView>(name));
	}

	/**
	 * switch to exact view; life-cycle is executed
	 *
	 * @param name
	 * @param path
	 */
	public switchTo(name: ToString, path: string): IView {
		const view = this.register(name);
		if (this.current === view) {
			this.eventBus.emit(new RefreshViewEvent(this.current, path));
			return this.current;
		}
		if (this.eventBus.emit(new UmountViewEvent(this.current, path)).isCancelled()) {
			return this.current;
		}
		this.current.umount();
		this.current = view;
		this.current.mount();
		this.eventBus.emit(new MountViewEvent(this.current, path));
		this.stateManager.update();
		return this.current;
	}

	/**
	 * execute view matching against the given path
	 *
	 * @param path
	 */
	public routeTo(path: string): IView | null {
		const context = this.views.each((name, view) => {
			if (view.canHandle(path)) {
				return this.switchTo(name, path) && false;
			}
		});
		if (context.cancelled) {
			return this.current;
		}
		this.eventBus.emit(new DeadRouteEvent(path));
		return null;
	}
}
