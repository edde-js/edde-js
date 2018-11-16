import {Html} from "../dom";
import {Container, Inject} from "../container";
import {TemplateManager} from "../template";
import {Strings, ToString} from "../utils";
import {HashMap} from "../collection";
import {State} from "./state";

export class Component {
	@Inject(Container)
	protected container: Container;
	@Inject(TemplateManager)
	protected templateManager: TemplateManager;
	protected root: Html;
	protected binds: HashMap<string>;
	protected mounts: HashMap<Html>;

	public constructor() {
		this.binds = new HashMap();
		this.mounts = new HashMap();
	}

	public render(state: State = new State()): Html {
		this.root = this.templateManager.render(ToString(this));
		this.resolveBinds();
		this.resolveMounts();
		this.resolveLinks();
		this.resolveComponents();
		return this.root = this.onRender(state);
	}

	protected resolveBinds(): void {
		this.root.selectorCollection('[data-bind]').each(html => {
			this.binds.set(
				html.rattr('data-bind'),
				html.rattr('data-component', 'Missing required attribute [data-component]; use it to declare component name to be used for binding.')
			);
			html.remove();
		});
	}

	protected resolveMounts(): void {
		this.root.selectorCollection('[data-mount]').each(html => this.mounts.set(html.rattr('data-mount'), html));
	}

	protected resolveLinks(): void {
		this.root.selectorCollection('[data-link]').each(html => (<any>this)[Strings.fromKebabCase(html.rattr('data-link'))] = html);
	}

	protected resolveComponents(): void {
		this.root.selectorCollection('[data-component]').each(html => {
			html.replaceBy(this.container.create<Component>(html.rattr('data-component')).render());
		});
	}

	protected onRender(state: State): Html {
		return this.root;
	}

	public component<U extends Component>(bind: string): U {
		return this.container.create(this.binds.require(bind, `Requested unknown component bind [${bind}].`));
	}
}
