import {Inject} from "../container";
import {Runtime} from "../runtime";
import {Mount} from "./mount";
import {ViewManager} from "../view/view-manager";

/**
 * Covers basic stuff related to an application.
 *
 * An application must be created by a container.
 */
export class Application {
	@Inject(ViewManager)
	protected viewManager: ViewManager;
	@Inject(Runtime)
	protected runtime: Runtime;
	@Inject(Mount)
	protected mount: Mount;

	public startup(): void {
		this.onStartup();
		this.viewManager.routeTo(this.runtime.getPath());
		this.startup = () => {
			throw new Error('Do not call application startup multiple times')
		};
	}

	/**
	 * common stuff setup; if method is overridden and not called, a lot of stuff
	 * has to be done manually (or using Mount class)
	 */
	protected onStartup(): void {
		this.mount.views(this.runtime.html());
		this.mount.controls(this.runtime.html());
	}

	public static toString() {
		return 'edde-js/application/application';
	}
}
