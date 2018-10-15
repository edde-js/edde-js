import {IView} from "./types";
import {ToString} from "../utils";
import {Container, Inject} from "../container";
import {HashMap} from "../collection";
import {EventBus} from "../event";
import {NoViewEvent} from "./events";

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
	 */
	public switchTo(name: ToString): IView {
		this.current.umount();
		this.current = this.create(name);
		this.current.mount();
		return this.current;
	}

	/**
	 * execute view matching against the given path
	 *
	 * @param path
	 */
	public routeTo(path: string): IView | null {
		const context = this.views.each((name, view) => view.canHandle(path) ? this.switchTo(name) && false : true);
		if (context.cancelled) {
			return context.value;
		}
		this.eventBus.event(new NoViewEvent());
		return null;
	}

	public static toString() {
		return 'edde-js/view/view-manager';
	}
}
