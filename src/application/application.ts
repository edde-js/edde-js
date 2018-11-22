import {Container, Inject, Make} from "../container";
import {Runtime} from "../runtime";
import {ViewManager} from "../view/view-manager";
import {TemplateManager} from "../template";
import {Collection} from "../collection";
import {ToString, GetString} from "../utils";
import {PushState, StateManager} from "../state";

/**
 * Covers basic stuff related to an application.
 *
 * An application must be created by a container.
 */
@ToString('edde-js/application/application')
export class Application {
	@Inject(Container)
	protected container: Container;
	@Inject(StateManager)
	protected stateManager: StateManager;
	@Inject(TemplateManager)
	protected templateManager: TemplateManager;
	@Inject(ViewManager)
	protected viewManager: ViewManager;
	@Inject(Runtime)
	protected runtime: Runtime;

	public views(views: Collection<ToString>): Application {
		views.each(name => {
			this.container.register(name, Make.service(name));
			this.viewManager.register(name);
		});
		return this;
	}

	/**
	 * push state of an application
	 *
	 * @param states
	 */
	public states(states: PushState[]): Application {
		this.stateManager.push(states);
		return this;
	}

	public startup(): void {
		this.onStartup();
		this.templateManager.bind(this.runtime.html());
		this.viewManager.routeTo(this.runtime.getPath());
		this.stateManager.refresh();
		this.startup = () => {
			throw new Error('Do not call application startup multiple times')
		};
	}

	/**
	 * common stuff setup; if method is overridden and not called, a lot of stuff
	 * has to be done manually (or using Mount class)
	 */
	protected onStartup(): void {
	}
}
