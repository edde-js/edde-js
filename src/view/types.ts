export interface IView {
	/**
	 * can view handle the given path?
	 *
	 * @param path
	 */
	canHandle(path: string): boolean;
}

export const IView: IView = {
	canHandle: () => false,
};
