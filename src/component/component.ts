import {IComponent} from "./types";
import {Html} from "../dom";
import {Container, Inject} from "../container";
import {Collection} from "../collection";
import {Strings} from "../utils";

export abstract class Component implements IComponent {
	@Inject(Container)
	protected container: Container;
	protected controls: Collection<IComponent>;
	protected root: Html;

	public constructor() {
		this.controls = new Collection();
	}

	public bind(root: Html, selector: string = '[data-component]'): IComponent {
		let current: IComponent = this;
		(this.root = root).selectorCollection(selector).each(html => {
			const render = html.attr('data-render');
			if (render) {
				(<any>current)[Strings.fromKebabCase(render)](html.rattr('data-component'), html);
				return;
			}
			const component = this.container.create<IComponent>(html.rattr('data-component'));
			this.controls.add(current = component.link(html));
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
