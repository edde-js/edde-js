import {IControl} from "../control";

export interface IView extends IControl {
	/**
	 * can view handle the given path?
	 *
	 * @param path
	 */
	canHandle(path: string): boolean;
}

export const IView: IView = {
	bind: () => this,
	canHandle: () => false,
	mount: () => this,
	mountTo: () => this,
	umount: () => this
};
