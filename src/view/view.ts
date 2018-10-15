import {IView} from "./types";
import {HashMap} from "../collection";

export abstract class AbstractView implements IView {
	public abstract mount(attrs: HashMap<any>): IView;

	public abstract umount(): IView;
}
