import {Html} from "../dom";

export interface IControl {
	/**
	 * bind control and all it's dependants (but doesn't change DOM) into eventual properties
	 *
	 * this method should also create and bind all dependant controls
	 *
	 * @param root
	 */
	bind(root: Html, selector: string): IControl;

	/**
	 * just link a control to the given html element
	 *
	 * @param root
	 */
	link(root: Html): IControl;

	/**
	 * basically renders and mount a control to DOM
	 */
	mount(): IControl;

	/**
	 * combination of bind & mount
	 *
	 * @param root
	 */
	mountTo(root: Html): IControl;

	/**
	 * removes control
	 */
	umount(): IControl;
}
