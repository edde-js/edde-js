import {Inject} from "../container";
import {Router} from "../router";
import {Runtime} from "../runtime";

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

	public setup(): void {
		this.onSetup();
		this.router.run(this.runtime.getPath());
		this.setup = () => {
			throw new Error('Do not call application setup multiple times')
		};
	}

	protected onSetup(): void {
	}

	public static toString() {
		return 'edde-js/application/application';
	}
}
