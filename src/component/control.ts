import {IComponent} from "./types";
import {Html} from "../dom";
import {Container, Inject} from "container";
import {Collection} from "collection";

export abstract class Component implements IComponent {
	@Inject(Container)
	protected container: Container;
	protected controls: Collection<IComponent>;
	protected root: Html;

	public constructor() {
		this.controls = new Collection();
	}

	public bind(root: Html, selector: string = '[data-control]'): IComponent {
		(this.root = root).selectorCollection(selector).each(html => {
			const component = this.container.create<IComponent>(html.rattr('data-component'));
			this.controls.add(component.link(html));
		});
		return this;
	}

	public link(root: Html): IComponent {
		this.root = root;
		return this;
	}

	public mount(): IComponent {
		return this;
	}

	public mountTo(root: Html): IComponent {
		return this.bind(root).mount();
	}

	public umount(): IComponent {
		return this;
	}
}
