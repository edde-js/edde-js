import {ParentControl} from "./types";
import {Inject} from "../container";
import {Runtime} from "../runtime";
import {HashMap} from "../collection";
import {HtmlElement, NativeListener} from "../dom";

export class Control {
	@Inject(Runtime)
	protected runtime: Runtime;
	protected parent: ParentControl;
	protected elements: HashMap<HtmlElement>;
	protected state: number;

	public constructor(parent: ParentControl = null) {
		this.parent = parent;
		this.elements = new HashMap();
		this.state = 0;
	}

	public link(name: string, selector: string): HtmlElement {
		const element = this.runtime.query(selector);
		if (!element) {
			throw new Error(`There is no match by the given selector [${selector}].`);
		}
		this.elements.set(name, element);
		return element;
	}

	public native(name: string, event: string, nativeListener: NativeListener): Control {
		this.elements.require(name).native(event, nativeListener);
		return this;
	}

	/**
	 * called whatever control should be rendered; if it's already rendered, nothing happend
	 */
	public render(): Control {
		if (this.state === 0) {
			this.onRender();
		}
		this.state++;
		return this;
	}

	/**
	 * release the component if it's no longer needed (but the same instance should be re-renderable)
	 */
	public release(): Control {
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
