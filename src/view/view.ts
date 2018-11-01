import {IView} from "./types";

export abstract class AbstractView implements IView {
	public abstract canHandle(path: string): boolean;

	public abstract mount(): IView;

	public abstract umount(): IView;
}
