import {IView} from "./types";
import {Component} from "../component";
import {Runtime} from "../runtime";
import {Inject} from "../container";

export abstract class AbstractView extends Component implements IView {
	@Inject(Runtime)
	protected runtime: Runtime;

	public mount(): IView {
		this.mount = <() => IView><unknown>this.show;
		this.runtime.require('main').append(this.render());
		this.show();
		return this;
	}

	public umount(): IView {
		this.hide();
		return this;
	}

	public abstract canHandle(path: string): boolean;
}
