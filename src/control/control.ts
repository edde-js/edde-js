import {IControl} from "./types";
import {Html} from "../dom";

export abstract class AbstractControl implements IControl {
	public bind(root: Html): IControl {
		return this;
	}

	public mount(): IControl {
		return this;
	}

	public mountTo(root: Html): IControl {
		return this.bind(root).mount();
	}

	public umount(): IControl {
		return this;
	}
}
