import {IView} from "./types";
import {ToString} from "../utils";
import {Container, Inject} from "../container";
import {IRoute} from "../router";

export class ViewManager implements IRoute {
	@Inject(Container)
	protected container: Container;

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

	public handle(path: string): void {
	}

	public match(path: string): boolean {
		return false;
	}
}
