import {IView} from "./types";
import {Component} from "../component";
import {Runtime} from "../runtime";
import {Inject} from "../container";

export abstract class AbstractView extends Component implements IView {
	@Inject(Runtime)
	protected runtime: Runtime;

	protected onMount(): IView {
		this.components.each(component => component.wakeup());
		this.html.removeClass('is-hidden');
		return this;
	}

	protected onUmount(): IView {
		this.components.each(component => component.sleep());
		this.html.addClass('is-hidden');
		return this;
	}

	public mount(): IView {
		this.mount = this.onMount;
		this.runtime.require('main').append(this.render());
		this.onMount();
		return this;
	}

	public umount(): IView {
		this.onUmount();
		return this;
	}

	public abstract canHandle(path: string): boolean;
}
