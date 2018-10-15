import {Html} from "../dom";

export interface IView {
	/**
	 * bind a view to the given html config node
	 *
	 * @param html
	 */
	bind(html: Html): IView;

	/**
	 * mount a view (view should be already bound)
	 */
	mount(): IView;

	/**
	 * umount (deactivate) view
	 */
	umount(): IView;
}
