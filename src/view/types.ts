import {Html} from "../dom";

export interface IView {
	/**
	 * bind a view to the given html config node
	 *
	 * @param html
	 */
	bind(html: Html): IView;

	/**
	 * can view handle the given path?
	 *
	 * @param path
	 */
	canHandle(path: string): boolean;

	/**
	 * mount a view (view should be already bound)
	 */
	mount(): IView;

	/**
	 * umount (deactivate) view
	 */
	umount(): IView;
}

export const IView: IView = {
	bind: () => this,
	canHandle: () => false,
	mount: () => this,
	umount: () => this
};
