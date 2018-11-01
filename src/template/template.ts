import {Html} from "../dom";
import {Component} from "../component";
import {Container, Inject} from "../container";

export class Template {
	@Inject(Container)
	protected container: Container;
	/**
	 * source html of the template (should be clonned)
	 */
	protected html: Html;
	/**
	 * factory name of required component that will be bound to the
	 * template's cloned html
	 */
	protected component: string;

	public constructor(html: Html, component: string) {
		this.html = html;
		this.component = component;
	}

	/**
	 * just render a template
	 */
	public render(): Component {
		const component = this.container.create<Component>(this.component);
		component.bind(this.html.clone());
		component.render();
		return component;
	}

	/**
	 * append component's element to the given target element
	 *
	 * @param target
	 */
	public renderTo(target: Html): Component {
		const component = this.render();
		component.mountTo(target);
		return component;
	}
}
