import {NativeListener} from "./types";
import {Collection, HashMap, HashMapCollection} from "../collection";

/**
 * Because all meaningful names are taken, it's quite strange name for
 * html element wrapper.
 */
export class Html {
	protected element: HTMLElement;
	protected events: HashMapCollection<NativeListener>;

	public constructor(element: HTMLElement) {
		this.element = element;
		this.events = new HashMapCollection();
	}

	public addClass(name: string): Html {
		if (this.hasClass(name)) {
			return this;
		}
		this.element.classList.add(name);
		return this;
	}

	public hasClass(name: string): boolean {
		return this.element.classList.contains(name);
	}

	public removeClass(name: string): Html {
		this.element.classList.remove(name);
		return this;
	}

	public toggleClass(name: string, toggle?: boolean): Html {
		let hasClass = this.hasClass(name);
		if (toggle === true && hasClass === false) {
			this.addClass(name);
		} else if (toggle === true && hasClass) {
		} else if (toggle === false && hasClass === false) {
		} else if (toggle === false && hasClass) {
			this.removeClass(name);
		} else if (hasClass) {
			this.removeClass(name);
		} else if (hasClass === false) {
			this.addClass(name);
		}
		return this;
	}

	public native(event: string, nativeListener: NativeListener): Html {
		this.events.add(event, nativeListener);
		this.element.addEventListener(event, nativeListener, false);
		return this;
	}

	/**
	 * executes selector on the given element
	 *
	 * @param selector
	 */
	public selector(selector: string): Html | null {
		const element = <HTMLElement>this.element.querySelector(selector);
		if (element) {
			return new Html(element);
		}
		return null;
	}

	/**
	 * return collection of HTML elements
	 *
	 * @param selector
	 */
	public selectorCollection(selector: string): Collection<Html> {
		return new Collection(
			[].slice.call(
				this.element.querySelectorAll(selector)
			)).collect((element: HTMLElement) => new Html(element)
		);
	}

	/**
	 * require an element requested by the given selector
	 *
	 * @param selector
	 */
	public require(selector: string): Html {
		const element = this.selector(selector);
		if (element) {
			return element;
		}
		throw new Error(`Cannot get any element by selector [${selector}].`);
	}

	/**
	 * return attribute with the given name or default value
	 *
	 * @param name
	 * @param value
	 */
	public attr(name: string, value: any = null): any {
		return this.element.hasAttribute(name) ? this.element.getAttribute(name) : value;
	}

	/**
	 * return required attribute; if it's not present, error is thrown
	 *
	 * @param name
	 */
	public rattr(name: string): any {
		if (this.element.hasAttribute(name)) {
			return this.element.getAttribute(name);
		}
		throw new Error(`Requested unknown attribute [${name}] on element [${this.element.nodeName}].`);
	}

	/**
	 * return attribute hashmap
	 */
	public attrs(): HashMap<any> {
		const attrs = this.element.attributes;
		const map: any = {};
		for (let i = 0; i < attrs.length; i++) {
			map[attrs[i].name] = attrs[i].value;
		}
		return new HashMap(map);
	}

	/**
	 * return internal html element; this method should be used with caution!
	 */
	public getElement(): HTMLElement {
		return this.element;
	}

	/**
	 * append the given node to $this one
	 *
	 * @param html
	 */
	public append(html: Html): Html {
		this.element.appendChild(html.element);
		return this;
	}

	/**
	 * simply clones current node
	 */
	public clone(deep: boolean = true): Html {
		return new Html(<HTMLElement>this.element.cloneNode(deep));
	}
}
