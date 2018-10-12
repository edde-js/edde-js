import {RuntimeDocument, RuntimeWindow} from "./types";
import {Html} from "../dom";

export class Runtime {
	protected window: RuntimeWindow;
	protected document: RuntimeDocument;

	public constructor(window: RuntimeWindow, document?: RuntimeDocument) {
		this.window = window;
		this.document = document || window.document;
	}

	/** @inheritDoc */
	public getWindow(): RuntimeWindow {
		return this.window;
	}

	/** @inheritDoc */
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

	/** @inheritDoc */
	public getPath(): string {
		return this.window.location.pathname;
	}

	/** @inheritDoc */
	public query(selector: string): Html | null {
		const element = this.document.querySelector(selector);
		if (!element) {
			return null;
		}
		return new Html(<HTMLElement>element);
	}

	public static toString() {
		return 'edde-js/runtime/runtime';
	}
}
