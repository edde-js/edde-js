export interface IView {
	/**
	 * can view handle the given path?
	 *
	 * @param path
	 */
	canHandle(path: string): boolean;

	/**
	 * called when a view is about to be activated
	 */
	mount(): IView;

	/**
	 * called when a view is about to be deactivated
	 */
	umount(): IView;
}

export const IView: IView = {
	canHandle: () => false,
	mount: () => this,
	umount: () => this,
};
