import {IComponent, IRenderer} from "./types";
import {Html} from "../dom";
import {Container, Inject} from "../container";
import {Collection} from "../collection";
import {Strings} from "../utils";
import {Runtime} from "../runtime";

export abstract class Component implements IComponent {
	@Inject(Container)
	protected container: Container;
	@Inject(Runtime)
	protected runtime: Runtime;
	protected controls: Collection<IComponent>;
	protected root: Html;
	protected cloneTo: Html | null;

	public constructor() {
		this.controls = new Collection();
	}

	public bind(root: Html, selector: string = '[data-component]'): IComponent {
		let current: IComponent = this;
		if (root.hasAttr('data-clone-to')) {
			root = root.clone();
			this.cloneTo = this.runtime.require(root.attr('data-clone-to'));
		}
		(this.root = root).selectorCollection(selector).each(html => {
			const render = html.attr('data-render');
			if (render) {
				(<IRenderer>(<any>current)[Strings.fromKebabCase(render)])(root, html.rattr('data-component'), html);
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
		if (this.cloneTo) {
			this.cloneTo.append(this.root);
		}
		return this;
	}

	public mountTo(root: Html): IComponent {
		return this.bind(root).mount();
	}

	public umount(): IComponent {
		return this;
	}
}
