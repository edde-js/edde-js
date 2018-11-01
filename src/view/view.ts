import {IView} from "./types";

export abstract class AbstractView implements IView {
	public mount(): IView {
		return this;
	}

	public umount(): IView {
		return this;
	}

	public abstract canHandle(path: string): boolean;
}
