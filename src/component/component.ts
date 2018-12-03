import {Html} from "../dom";
import {Container, Inject} from "../container";
import {TemplateManager} from "../template";
import {GetString, Strings} from "../utils";
import {Collection, HashMap} from "../collection";
import {State, StateManager, States} from "../state";
import {NATIVE_PROPERTY, NativeObject} from "./native";
import {SUBSCRIBE_PROPERTY, SubscribeObject} from "./subscribe";
import {React, REACT_PROPERTY, ReactProperty} from "./react";

export class Component {
	@Inject(Container)
	protected container: Container;
	@Inject(TemplateManager)
	protected templateManager: TemplateManager;
	@Inject(StateManager)
	protected stateManager: StateManager;
	protected root: Html;
	protected states: HashMap<State>;
	protected binds: HashMap<string>;
	protected mounts: HashMap<Html>;

	public constructor() {
		this.states = new HashMap();
		this.binds = new HashMap();
		this.mounts = new HashMap();
	}

	protected init() {
		this.register({'_': this.stateManager.random()});
	}

	public render(): Html {
		this.render = () => {
			throw new Error(`Cannot render component [${GetString(this)}] multiple times; please create a new instance.`);
		};
		this.root = this.templateManager.render(GetString(this));
		this.resolveBinds();
		this.resolveMounts();
		this.resolveLinks();
		this.resolveComponents();
		this.resolveNatives();
		this.resolveSubscribes();
		return this.root = this.onRender();
	}

	/**
	 * register a new state to this component
	 *
	 * @param states
	 */
	public register(states: States): Component {
		this.unsubscribe();
		this.states.copy(new HashMap(states));
		this.subscribe();
		return this;
	}

	/**
	 * set a new state and update the component by executing the state
	 *
	 * @param states
	 */
	public update(states: { [index: string]: State }): Component {
		this.register(states);
		this.states.each((_, state) => state.update());
		return this;
	}

	public state(name: string = '_'): State {
		return this.states.require(name, `Requested unknown state [${name}] on component [${GetString(this)}].`);
	}

	public push(name: string, object: Object): Component {
		this.state(name).push(object);
		return this;
	}

	public patch(name: string, object: Object): Component {
		this.state(name).patch(object);
		return this;
	}

	public isRendered(): boolean {
		return !!this.root;
	}

	public show(): Component {
		this.state().set('visible', true);
		return this;
	}

	/**
	 * just hide a view, no DOM tree manipulation should be done here
	 */
	public hide(): Component {
		this.state().set('visible', false);
		return this;
	}

	@React('visible')
	public stateVisible(visible: boolean, state: State) {
		this.root.toggleClass('is-hidden', !visible);
	}

	public subscribe(): Component {
		new Collection((<any>this)[REACT_PROPERTY]).each((reactProperty: ReactProperty) => {
			if (this.states.has(reactProperty.state)) {
				this.states.require(reactProperty.state).subscribe(reactProperty.property, (<any>this)[reactProperty.handler].bind(this));
			}
		});
		return this;
	}

	public unsubscribe(): Component {
		new Collection((<any>this)[REACT_PROPERTY]).each((reactProperty: ReactProperty) => {
			if (this.states.has(reactProperty.state)) {
				this.states.require(reactProperty.state).unsubscribe(reactProperty.property, (<any>this)[reactProperty.handler]);
			}
		});
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
			const component = this.container.create<Component>(html.rattr('data-component'));
			let state = html.attr('data-state');
			switch (state) {
				case '$':
					state = GetString(component);
			}
			if (state) {
				component.register({'_': this.stateManager.state(state)});
			}
			html.replaceBy(component.render());
		});
	}

	protected resolveNatives(): void {
		new Collection((<NativeObject><unknown>this)[NATIVE_PROPERTY]).each(nativeProperty => {
			(nativeProperty.callback ? nativeProperty.callback(this) : this.root).listenTo(nativeProperty.event, (<any>this)[nativeProperty.handler].bind(this));
		});
	}

	protected resolveSubscribes(): void {
		new Collection((<SubscribeObject><unknown>this)[SUBSCRIBE_PROPERTY]).each(subscribeProperty => {
			this.stateManager.state(subscribeProperty.state).subscribe(subscribeProperty.property, (<any>this)[subscribeProperty.handler].bind(this));
		});
	}

	protected onRender(): Html {
		return this.root;
	}

	public component<U extends Component>(bind: string): U {
		return this.container.create(this.binds.require(bind, `Requested unknown component bind [${bind}].`));
	}
}
