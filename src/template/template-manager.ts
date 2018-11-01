import {Html} from "../dom";
import {HashMap} from "../collection";
import {Template} from "./template";
import {Container, Inject} from "../container";
import {Component} from "../component";

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
	 * mount template manager on the given root; all templates from the given DOM tree
	 * will be registered
	 */
	public mountTo(root: Html): TemplateManager {
		root.selectorCollection('[data-template]').each(html => {
			const attr = this.split(html.rattr('data-template'));
			this.register(attr[0], this.container.autowire(new Template(html.detach(), attr[1])));
		});
		return this;
	}

	/**
	 * render given template and attach it to the given html root
	 *
	 * @param template
	 * @param target
	 */
	public renderTo(template: string, target: Html): Component {
		return this.templates.require(template, `Requested unknown template [${template}].`).renderTo(target)
	}

	public split(attr: string): string[] {
		if (attr.indexOf(':') !== -1) {
			return attr.split(':', 2);
		}
		return [
			attr,
			attr,
		];
	}

	public static toString() {
		return 'edde-js/template/template-manager';
	}
}
