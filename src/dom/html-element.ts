import {NativeListener} from "./types";
import {HashMapCollection} from "../collection";

export class HtmlElement {
	protected element: HTMLElement;
	protected events: HashMapCollection<NativeListener>;

	public constructor(element: HTMLElement) {
		this.element = element;
		this.events = new HashMapCollection();
	}

	public addClass(name: string): HtmlElement {
		if (this.hasClass(name)) {
			return this;
		}
		this.element.className = this.className(this.element.className + ' ' + name);
		return this;
	}

	public hasClass(name: string): boolean {
		return this.element.className !== undefined && (' ' + this.element.className + ' ').indexOf(' ' + name + ' ') !== -1;
	}

	public removeClass(name: string): HtmlElement {
		this.element.className = this.className(this.element.className.replace(name, ''));
		return this;
	}

	public toggleClass(name: string, toggle?: boolean): HtmlElement {
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

	public native(event: string, nativeListener: NativeListener): HtmlElement {
		this.events.add(event, nativeListener);
		this.element.addEventListener(event, nativeListener, false);
		return this;
	}

	/**
	 * cleanup and rejoin the given value with space
	 */
	protected className(name: string): string {
		return (name.match(/[^\x20\t\r\n\f]+/g) || []).join(' ');
	}
}
