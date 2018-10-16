import {Html} from "../dom";
import {Container, Inject} from "../container";
import {ViewManager} from "../view/view-manager";
import {IControl} from "../control";

/**
 * General tool used to do some common stuff like mounting routes from html document.
 */
export class Mount {
	@Inject(Container)
	protected container: Container;
	@Inject(ViewManager)
	protected viewManager: ViewManager;

	/**
	 * mount view from the given html subtree
	 *
	 * @param from
	 * @param selector
	 */
	public views(from: Html, selector = '*[data-view]'): Mount {
		from.selectorCollection(selector).each(html => this.viewManager.create(html.rattr('data-view')).bind(html));
		return this;
	}

	/**
	 * bind views from the given html subtree
	 *
	 * @param from
	 * @param selector
	 */
	public controls(from: Html, selector: string = '*[data-control]'): Mount {
		from.selectorCollection(selector).each(html => this.container.create<IControl>(html.attr('data-control')).bind(html).mount());
		return this;
	}

	public static toString() {
		return 'edde-js/application/mount';
	}
}
