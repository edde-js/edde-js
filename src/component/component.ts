import {Html} from "../dom";

export class Component {
	protected root: Html;

	public constructor(root: Html) {
		this.root = root;
	}

	/**
	 * render this component to it's final state; render could change
	 * state of $this component
	 */
	public render(): Html {
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
}
