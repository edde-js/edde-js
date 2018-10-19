import {IComponent, IRenderer} from "./types";
import {Html} from "../dom";
import {Container, Inject} from "../container";
import {Collection} from "../collection";
import {Strings, ToString} from "../utils";
import {Runtime} from "../runtime";

export abstract class Component implements IComponent {
	@Inject(Container)
	protected container: Container;
	@Inject(Runtime)
	protected runtime: Runtime;
	protected components: Collection<IComponent>;
	protected root: Html;
	protected target: Html;

	public constructor() {
		this.components = new Collection();
	}

	public bind(root: Html, selector: string = '[data-component]'): IComponent {
		this.target = root.getParent();
		let current: IComponent = this;
		if (root.hasAttr('data-clone-to')) {
			root = root.clone();
			this.target = this.runtime.require(root.attr('data-clone-to'));
		}
		(this.root = root).selectorCollection(selector).each(html => {
			html.hasAttr('data-template') ?
				(<IRenderer>(<any>current)[Strings.fromKebabCase(html.attr('data-template'))])(html.detach().rattr('data-component'), html) :
				(current = this.component(html.rattr('data-component')).link(html));
		});
		return this;
	}

	public link(root: Html): IComponent {
		this.root = root;
		return this;
	}

	public mount(): IComponent {
		if (this.root.getParent().equals(this.target) === false) {
			this.target.append(this.root);
		}
		this.components.each(component => component.mount());
		return this;
	}

	public mountTo(root: Html): IComponent {
		return this.bind(root).mount();
	}

	public umount(): IComponent {
		return this;
	}

	public component<T extends IComponent>(name: ToString): T {
		const component = this.container.create<T>(name);
		this.components.add(component);
		return component;
	}
}
