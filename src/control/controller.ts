import {ParentController} from "./types";
import {Inject} from "../container";
import {Runtime} from "../runtime";
import {HashMap} from "../collection";
import {Html, NativeListener} from "../dom";

/**
 * Controller lives next to DOM tree; it can contain any number of elements, thus the name: it's controller over
 * several standalone elements.
 */
export class Controller {
	@Inject(Runtime)
	protected runtime: Runtime;
	protected parent: ParentController;
	protected elements: HashMap<Html>;
	protected state: number;

	public constructor(parent: ParentController = null) {
		this.parent = parent;
		this.elements = new HashMap();
		this.state = 0;
	}

	public link(name: string, selector: string): Html {
		const element = this.runtime.require(selector);
		this.elements.set(name, element);
		return element;
	}

	public native(name: string, event: string, nativeListener: NativeListener): Controller {
		this.elements.require(name).native(event, nativeListener);
		return this;
	}

	/**
	 * called whatever control should be rendered; if it's already rendered, nothing happend
	 */
	public render(): Controller {
		if (this.state === 0) {
			this.onRender();
		}
		this.state++;
		return this;
	}

	/**
	 * release the component if it's no longer needed (but the same instance should be re-renderable)
	 */
	public release(): Controller {
		if (this.state > 0) {
			this.onRelease();
			this.state = 0;
		}
		return this;
	}

	/**
	 * actual render handler
	 */
	public onRender(): void {
	}

	/**
	 * actual release handler
	 */
	public onRelease(): void {
	}
}
