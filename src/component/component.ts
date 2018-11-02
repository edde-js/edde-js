import {Html} from "../dom";
import {Container, Inject} from "../container";

export class Component {
	@Inject(Container)
	protected container: Container;
	protected root: Html;

	/**
	 * bind this component to the given html root (it should do basically no further actions)
	 *
	 * @param root
	 */
	public bind(root: Html): Component {
		this.root = root;
		return this;
	}

	/**
	 * render this component to it's final state; render could change
	 * state of $this component
	 */
	public render(): Html {
		this.renderComponents();
		return this.root;
	}

	/**
	 * append component's root element to the given target element
	 *
	 * @param target
	 */
	public mountTo(target: Html): Component {
		target.append(this.render());
		return this;
	}

	protected renderComponents(): Component {
//		this.root.selectorCollection('[data-component]').each(html => {
//			this.container.create<Component>(html.rattr('data-component')).bind(html).render();
//		});
		return this;
	}
}
