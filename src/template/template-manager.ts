import {Html} from "../dom";
import {HashMap} from "../collection";
import {Template} from "./template";
import {Container, Inject} from "../container";
import {Runtime} from "../runtime";
import {ToString} from "../utils";

@ToString('edde-js/template/template-manager')
export class TemplateManager {
	@Inject(Container)
	protected container: Container;
	@Inject(Runtime)
	protected runtime: Runtime;
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
	public register(name: ToString, template: Template): TemplateManager {
		this.templates.set(name.toString(), template);
		return this;
	}

	/**
	 * register templates from the given DOM subtree
	 */
	public bind(root: Html): TemplateManager {
		root.selectorCollection('[data-template]').each(html => this.register(html.rattr('data-template'), new Template(html.detach())));
		return this;
	}

	public render(template: ToString): Html {
		return this.templates.require(template.toString(), `Requested unknown template [${template.toString()}].`).render();
	}
}
