import {HashMap} from "../collection";
import {IView} from "./types";
import {ToString} from "../utils";
import {Container, Factory, Inject} from "../container";
import {Runtime} from "../runtime";

export class ViewManager {
	@Inject(Container)
	protected container: Container;
	@Inject(Runtime)
	protected runtime: Runtime;
	protected target: string;
	protected views: HashMap<IView | null>;

	public constructor(target: string = 'main') {
		this.target = target;
	}

	/**
	 * set default target when explicit target on view is not set
	 *
	 * @param target
	 */
	public setTarget(target: string): ViewManager {
		this.target = target;
		return this;
	}

	/**
	 * register new view factory; internally it's proxied into container
	 *
	 * @param name
	 * @param factory
	 */
	public register(name: ToString, factory: Factory<IView>): ViewManager {
		this.views.set(name.toString(), null);
		this.container.register(name, factory);
		return this;
	}

	/**
	 * check if a view with the given name exists
	 *
	 * @param name
	 */
	public check(name: ToString): boolean {
		if (this.views.has(name.toString())) {
			throw new Error(`Requested unknown view [${name.toString()}]; view must be registered into ViewManager.`);
		}
		return true;
	}

	/**
	 * create a view
	 *
	 * @param name
	 */
	public create(name: ToString): IView {
		this.check(name);
		return this.container.create<IView>(name);
	}

	/**
	 * mount a view
	 *
	 * @param name
	 * @param attrs
	 */
	public mount(name: ToString, attrs: HashMap<any>): IView {
		const view = this.create(name).mount(attrs);
		this.views.set(name.toString(), view);
		return view;
	}

	/**
	 * uount already mounted view or die
	 *
	 * @param name
	 */
	public umount(name: ToString): IView {
		this.check(name);
		const view = this.views.require(name.toString());
		if (view) {
			this.views.set(name.toString(), null);
			return view.umount();
		}
		throw new Error(`Cannot umount view [${name.toString()}] not mounted.`);
	}

	public static toString() {
		return 'edde-js/view/view-manager';
	}
}
