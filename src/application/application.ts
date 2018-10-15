import {Inject} from "../container";
import {Router} from "../router";
import {Runtime} from "../runtime";
import {Mount} from "./mount";

/**
 * Covers basic stuff related to an application.
 *
 * An application must be created by a container.
 */
export class Application {
	@Inject(Router)
	protected router: Router;
	@Inject(Runtime)
	protected runtime: Runtime;
	@Inject(Mount)
	protected mount: Mount;

	public startup(): void {
		this.onStartup();
		this.router.run(this.runtime.getPath());
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
	}

	public static toString() {
		return 'edde-js/application/application';
	}
}
