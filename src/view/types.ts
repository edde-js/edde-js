import {IComponent} from "../component";

export interface IView extends IComponent {
	/**
	 * can view handle the given path?
	 *
	 * @param path
	 */
	canHandle(path: string): boolean;
}

export const IView: IView = {
	bind: () => this,
	link: () => this,
	canHandle: () => false,
	mount: () => this,
	mountTo: () => this,
	umount: () => this
};
