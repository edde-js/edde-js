import {IView} from "./types";
import {Html} from "../dom";

export abstract class AbstractView implements IView {
	public abstract bind(html: Html): IView;

	public abstract canHandle(path: string): boolean;

	public abstract mount(): IView;

	public abstract umount(): IView;
}
