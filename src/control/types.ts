import {Html} from "../dom";
import {HashMap} from "../collection";

export interface IControl {
	/**
	 * bind control and all it's dependants (but doesn't change DOM) into eventual properties
	 *
	 * @param root
	 */
	bind(root: Html): IControl;

	/**
	 * return rendered DOM tree of this control
	 */
	render(attrs: HashMap<any> | null): Html;

	/**
	 * basically renders and mount a control to DOM
	 */
	mount(): IControl;
}
