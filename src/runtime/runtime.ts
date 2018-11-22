import {RuntimeDocument, RuntimeDocumentFragment, RuntimeWindow} from "./types";
import {Html} from "../dom";
import {ToString} from "../utils";

@ToString('edde-js/runtime/runtime')
export class Runtime {
	protected window: RuntimeWindow;
	protected document: RuntimeDocument;
	protected root: Html;

	public constructor(window: RuntimeWindow, document?: RuntimeDocument) {
		this.window = window;
		this.document = document || window.document;
	}

	public getWindow(): RuntimeWindow {
		return this.window;
	}

	public getDocument(): RuntimeDocument {
		return this.document;
	}

	public createDocumentFragment(): RuntimeDocumentFragment {
		return this.getDocument().createDocumentFragment();
	}

	public el(html: string): Html {
		const element = this.getDocument().createElement('div');
		element.innerHTML = html.trim();
		return new Html(<HTMLElement>element.firstElementChild);
	}

	/**
	 * return window local storage
	 */
	public getLocalStorage(): Storage {
		return this.window.localStorage;
	}

	/**
	 * return session storage
	 */
	public getSessionStorage(): Storage {
		return this.window.sessionStorage;
	}

	public getPath(): string {
		return this.window.location.pathname;
	}

	public selector(selector: string): Html | null {
		const element = this.document.querySelector(selector);
		if (!element) {
			return null;
		}
		return new Html(<HTMLElement>element);
	}

	public require(selector: string): Html {
		const element = this.selector(selector);
		if (element) {
			return element;
		}
		throw new Error(`Cannot get any element by selector [${selector}] in global context.`);
	}

	public html(): Html {
		return this.root || (this.root = new Html(<HTMLElement>this.document.querySelector('html')));
	}
}
