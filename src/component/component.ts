import {Html} from "../dom";
import {Container, Inject} from "../container";
import {TemplateManager} from "../template";
import {GetString, Strings} from "../utils";
import {Collection, HashMap} from "../collection";
import {React, State, StateManager} from "../state";
import {NATIVE_PROPERTY, NativeObject} from "./native";

export class Component {
	@Inject(Container)
	protected container: Container;
	@Inject(TemplateManager)
	protected templateManager: TemplateManager;
	@Inject(StateManager)
	protected stateManager: StateManager;
	protected root: Html;
	protected state: State;
	protected binds: HashMap<string>;
	protected mounts: HashMap<Html>;

	public constructor() {
		this.binds = new HashMap();
		this.mounts = new HashMap();
	}

	protected init() {
		/**
		 * all components of the same class are by default bound to the same state
		 */
		this.register(this.stateManager.state(GetString(this)));
	}

	public render(): Html {
		this.root = this.templateManager.render(GetString(this));
		this.resolveBinds();
		this.resolveMounts();
		this.resolveLinks();
		this.resolveComponents();
		this.resolveNatives();
		return this.onRender();
	}

	/**
	 * register a new state to this component
	 *
	 * @param state
	 */
	public register(state: State): Component {
		if (this.state) {
			this.state.forget(this);
		}
		(this.state = state).remember(this);
		return this;
	}

	/**
	 * set a new state and update the component by executing the state
	 *
	 * @param state
	 */
	public update(state: State): Component {
		this.register(state);
		this.state.update();
		return this;
	}

	public getState(): State {
		return this.state;
	}

	public push(object: Object): Component {
		this.getState().push(object);
		return this;
	}

	public patch(object: Object): Component {
		this.getState().patch(object);
		return this;
	}

	public isRendered(): boolean {
		return !!this.root;
	}

	public show(): Component {
		this.getState().set('visible', true);
		return this;
	}

	/**
	 * just hide a view, no DOM tree manipulation should be done here
	 */
	public hide(): Component {
		this.getState().set('visible', false);
		return this;
	}

	@React('visible')
	public stateVisible(visible: boolean, state: State) {
		this.root.toggleClass('is-hidden', !visible);
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

	protected resolveNatives(): void {
		new Collection((<NativeObject><unknown>this)[NATIVE_PROPERTY]).each(nativeProperty => {
			nativeProperty.callback(this).listenTo(nativeProperty.event, (<any>this)[nativeProperty.handler].bind(this));
		});
	}

	protected onRender(): Html {
		return this.root;
	}

	public component<U extends Component>(bind: string): U {
		return this.container.create(this.binds.require(bind, `Requested unknown component bind [${bind}].`));
	}
}
