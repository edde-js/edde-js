import {Html} from "../dom";
import {Inject} from "../container";
import {ViewManager} from "../view/view-manager";

/**
 * General tool used to do some common stuff like mounting routes from html document.
 */
export class Mount {
	@Inject(ViewManager)
	protected viewManager: ViewManager;

	/**
	 * mount view from the given html subtree
	 *
	 * @param from
	 */
	public views(from: Html): Mount {
		from.selectorCollection('edde-view').each(html => {
//			this.viewManager.register()
//			const attrs = html.attrs();
//			to.register(container.create(attrs.require('view')));
		});
	}

	public static toString() {
		return 'edde-js/application/mount';
	}
}
