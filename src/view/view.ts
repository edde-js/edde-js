import {IView} from "./types";
import {Component} from "../component";
import {State, Subscribe} from "../state";
import {Runtime} from "../runtime";
import {Inject} from "../container";

export abstract class AbstractView extends Component implements IView {
	@Inject(Runtime)
	protected runtime: Runtime;

	@Subscribe('visible')
	public stateVisible(visible: boolean, state: State) {
		if (!this.isRendered()) {
			this.runtime.require(state.get('root', () => 'main')).append(this.render());
		}
		visible ? this.show() : this.hide();
	}

	/**
	 * just show a view (no DOM tree manipulation should be done here, just some magick with classes)
	 */
	public show(): AbstractView {
		this.root.removeClass('is-hidden');
		return this;
	}

	/**
	 * just hide a view, no DOM tree manipulation should be done here
	 */
	public hide(): AbstractView {
		this.root.addClass('is-hidden');
		return this;
	}

	public mount(): IView {
		this.getState().set('visible', true);
		return this;
	}

	public umount(): IView {
		this.getState().set('visible', false);
		return this;
	}

	public abstract canHandle(path: string): boolean;
}
