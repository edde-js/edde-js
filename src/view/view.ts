import {IView} from "./types";
import {Component} from "../component";
import {React, State} from "../state";
import {Runtime} from "../runtime";
import {Inject} from "../container";

export abstract class AbstractView extends Component implements IView {
	@Inject(Runtime)
	protected runtime: Runtime;

	@React('visible')
	public stateVisible(visible: boolean, state: State) {
		if (!this.isRendered()) {
			this.runtime.require(state.get('root', () => 'main')).append(this.render());
		}
		super.stateVisible(visible, state);
	}

	public mount(): IView {
		this.state.set('visible', true);
		return this;
	}

	public umount(): IView {
		this.state.set('visible', false);
		return this;
	}

	public abstract canHandle(path: string): boolean;
}
