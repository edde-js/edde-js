import {Html} from "../dom";

export class Template {
	/**
	 * source html of the template (should be clonned)
	 */
	protected html: Html;

	public constructor(html: Html) {
		this.html = html;
	}

	/**
	 * just render a template
	 */
	public render(): Html {
		return this.html.clone();
	}
}
