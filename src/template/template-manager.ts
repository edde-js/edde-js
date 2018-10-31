import {Html} from "../dom";
import {HashMap} from "../collection";
import {Template} from "./template";

export class TemplateManager {
	protected templates: HashMap<Template>;

	public constructor() {
		this.templates = new HashMap();
	}

	/**
	 * register a new template
	 *
	 * @param name
	 * @param template
	 */
	public register(name: string, template: Template): TemplateManager {
		this.templates.set(name, template);
		return this;
	}

	/**
	 * mount template manager on the given root; all templates from the given DOM tree
	 * will be registered
	 */
	public mountTo(root: Html): TemplateManager {
		return this;
	}

	public static toString() {
		return 'edde-js/template/template-manager';
	}
}
