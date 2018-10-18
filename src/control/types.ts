import {Html} from "../dom";

export interface IControl {
	/**
	 * bind control and all it's dependants (but doesn't change DOM) into eventual properties
	 *
	 * @param root
	 */
	bind(root: Html): IControl;

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
