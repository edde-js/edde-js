import {IView} from "./types";
import {ToString} from "../utils";
import {Container, Inject} from "../container";
import {Runtime} from "../runtime";

export class ViewManager {
	@Inject(Container)
	protected container: Container;
	@Inject(Runtime)
	protected runtime: Runtime;

	/**
	 * create a view (just typehint)
	 *
	 * @param name
	 */
	public create(name: ToString): IView {
		return this.container.create<IView>(name);
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

	public static toString() {
		return 'edde-js/view/view-manager';
	}
}
