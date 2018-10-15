import {IView} from "./types";
import {ToString} from "../utils";
import {Container, Inject} from "../container";
import {HashMap} from "../collection";
import {EventBus} from "../event";
import {DeadRouteEvent, MountViewEvent, RefreshViewEvent, UmountViewEvent} from "./events";

export class ViewManager {
	@Inject(Container)
	protected container: Container;
	@Inject(EventBus)
	protected eventBus: EventBus;
	protected views: HashMap<IView>;
	protected current: IView;

	public constructor() {
		this.views = new HashMap();
		this.current = IView;
	}

	/**
	 * create a view (just typehint)
	 *
	 * @param name
	 */
	public create(name: ToString): IView {
		const view = this.container.create<IView>(name);
		this.views.set(name.toString(), view);
		return view;
	}

	/**
	 * mount a view
	 *
	 * @param name
	 */
	public mount(name: ToString): IView {
		return this.create(name).mount();
	}

	/**
	 * umount already mounted view or die
	 *
	 * @param name
	 */
	public umount(name: ToString): IView {
		return this.create(name).umount();
	}

	/**
	 * switch to exact view; life-cycle is executed
	 *
	 * @param name
	 * @param path
	 */
	public switchTo(name: ToString, path: string): IView {
		const view = this.create(name);
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
			return context.value;
		}
		this.eventBus.emit(new DeadRouteEvent(path));
		return null;
	}

	public static toString() {
		return 'edde-js/view/view-manager';
	}
}
