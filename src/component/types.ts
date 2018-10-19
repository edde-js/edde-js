import {Html} from "../dom";
import {ToString} from "../utils";

export interface IComponent {
	bind(root: Html): IComponent;

	/**
	 * bind control and all it's dependants (but doesn't change DOM) into eventual properties
	 *
	 * this method should also create and bind all dependant controls
	 *
	 * @param root
	 * @param selector
	 */
	bind(root: Html, selector: string): IComponent;

	/**
	 * just link a control to the given html element
	 *
	 * @param root
	 */
	link(root: Html): IComponent;

	/**
	 * basically renders and mount a control to DOM
	 */
	mount(): IComponent;

	/**
	 * combination of bind & mount
	 *
	 * @param root
	 */
	mountTo(root: Html): IComponent;

	/**
	 * removes control
	 */
	umount(): IComponent;

	/**
	 * create a new component and register it to current one
	 *
	 * @param name
	 */
	component<T extends IComponent>(name: ToString): T;
}

export type IRenderer = (component: ToString, source: Html) => void;
