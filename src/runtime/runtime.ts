import {RuntimeDocument, RuntimeWindow} from "./types";
import {Html} from "../dom";

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

	public static toString() {
		return 'edde-js/runtime/runtime';
	}
}
