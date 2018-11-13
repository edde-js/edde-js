import {Html} from "../dom";
import {HashMap} from "../collection";
import {Template} from "./template";
import {Container, Inject} from "../container";

export class TemplateManager {
	@Inject(Container)
	protected container: Container;
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
	 * register templates from the given DOM subtree
	 */
	public bind(root: Html, selector: string = '[data-template]', attribute: string = 'data-template'): TemplateManager {
		root.selectorCollection(selector).each(html => this.register(html.rattr(attribute), new Template(html.detach())));
		return this;
	}

	public static toString() {
		return 'edde-js/template/template-manager';
	}
}
