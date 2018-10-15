import {Html} from "../dom";
import {Router} from "../router";
import {Container} from "../container";

/**
 * General tool used to do some common stuff like mounting routes from html document.
 */
export class Mount {
	/**
	 * mount routes from the given html subtree
	 *
	 * @param from
	 * @param to
	 * @param container
	 */
	public static routes(from: Html, to: Router, container: Container): Router {
		from.selectorCollection('edde-dynamic-route').each(html => {
			const attrs = html.attrs();
			to.register(container.create(attrs.require('view')));
		});
		return to;
	}
}
