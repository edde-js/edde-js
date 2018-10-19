import {IControl} from "./types";
import {Html} from "../dom";
import {Container, Inject} from "container";
import {Collection} from "collection";

export abstract class AbstractControl implements IControl {
	@Inject(Container)
	protected container: Container;
	protected controls: Collection<IControl>;
	protected root: Html;

	public constructor() {
		this.controls = new Collection();
	}

	public bind(root: Html, selector: string = '[data-control]'): IControl {
		root.selectorCollection(selector).each(html => {
			const control = this.container.create<IControl>(html.rattr('data-control'));
			this.controls.add(control.link(html));
		});
		return this;
	}

	public link(root: Html): IControl {
		this.root = root;
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
