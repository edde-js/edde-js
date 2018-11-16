import {Html} from "../dom";
import {Container, Inject} from "../container";
import {TemplateManager} from "../template";
import {ToString} from "../utils";
import {HashMap} from "../collection";
import {State} from "./state";

export class Component {
	@Inject(Container)
	protected container: Container;
	@Inject(TemplateManager)
	protected templateManager: TemplateManager;
	protected binds: HashMap<string>;
	protected mounts: HashMap<Html>;

	public constructor() {
		this.binds = new HashMap();
		this.mounts = new HashMap();
	}

	public render(state?: State): Html {
		const template = this.templateManager.render(ToString(this));
		this.resolveBinds(template);
		this.resolveMounts(template);
		this.resolveComponents(template);
		return this.onRender(template, state);
	}

	protected resolveBinds(root: Html): void {
		root.selectorCollection('[data-bind]').each(html => {
			this.binds.set(
				html.rattr('data-bind'),
				html.rattr('data-component', 'Missing required attribute [data-component]; use it to declare component name to be used for binding.')
			);
			html.remove();
		});
	}

	protected resolveMounts(root: Html): void {
		root.selectorCollection('[data-mount]').each(html => this.mounts.set(html.rattr('data-mount'), html));
	}

	protected resolveComponents(root: Html): void {
		root.selectorCollection('[data-component]').each(html => {
			html.replaceBy(this.container.create<Component>(html.rattr('data-component')).render());
		});
	}

	protected onRender(template: Html, state?: State): Html {
		return template;
	}

	public component<U extends Component>(bind: string): U {
		return this.container.create(this.binds.require(bind, `Requested unknown component bind [${bind}].`));
	}
}
