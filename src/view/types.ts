import {HashMap} from "../collection";

export interface IView {
	/**
	 * mount a view
	 *
	 * @param attrs
	 */
	mount(attrs: HashMap<any>): IView;

	/**
	 * umount (deactivate) view
	 */
	umount(): IView;
}
