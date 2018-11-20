import {IView} from "./types";
import {Component} from "../component";

export abstract class AbstractView extends Component implements IView {
	public mount(): IView {
		return this;
	}

	public umount(): IView {
		return this;
	}

	public abstract canHandle(path: string): boolean;
}
