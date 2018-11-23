import {Html} from "../dom";
import {Container, Inject} from "../container";
import {TemplateManager} from "../template";
import {GetString, Strings} from "../utils";
import {HashMap} from "../collection";
import {State, Subscribe} from "../state";

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

	public render(): Html {
		this.root = this.templateManager.render(GetString(this));
		this.resolveBinds();
		this.resolveMounts();
		this.resolveLinks();
		this.resolveComponents();
		this.root = this.onRender();
		return this.root;
	}

	public isRendered(): boolean {
		return !!this.root;
	}

	@Subscribe('visible')
	public stateVisible(visible: boolean, state: State) {
		visible ? this.show() : this.hide();
	}

	public show(): Component {
		this.root && this.root.removeClass('is-hidden');
		return this;
	}

	/**
	 * just hide a view, no DOM tree manipulation should be done here
	 */
	public hide(): Component {
		this.root && this.root.addClass('is-hidden');
		return this;
	}

	/**
	 * resolve bound components; they're prepared into an array later used by component() method for component creation;
	 * components are not directly created as a component instance is used per rendered template
	 */
	protected resolveBinds(): void {
		this.root.selectorCollection('[data-bind]').each(html => {
			this.binds.set(
				html.rattr('data-bind'),
				html.rattr('data-component', 'Missing required attribute [data-component]; use it to declare component name to be used for binding.')
			);
			html.remove();
		});
	}

	/**
	 * mounts are pieces of DOM elements mounted to this component; that means mounted elements could be accessed through "mounts" hashmap
	 */
	protected resolveMounts(): void {
		this.root.selectorCollection('[data-mount]').each(html => this.mounts.set(html.rattr('data-mount'), html));
	}

	/**
	 * links are basically same as mounts, but they're directly put into properties of this component (converting foo-bar to fooBar convention)
	 */
	protected resolveLinks(): void {
		this.root.selectorCollection('[data-link]').each(html => (<any>this)[Strings.toKebabCase(html.rattr('data-link'))] = html);
	}

	/**
	 * the magic of component tree - this method creates other components (and triggers render method on them)
	 */
	protected resolveComponents(): void {
		this.root.selectorCollection('[data-component]').each(html => {
			html.replaceBy(this.container.create<Component>(html.rattr('data-component')).render());
		});
	}

	protected onRender(): Html {
		return this.root;
	}

	public component<U extends Component>(bind: string): U {
		return this.container.create(this.binds.require(bind, `Requested unknown component bind [${bind}].`));
	}
}
