import {Html} from "../dom";
import {Container, Inject} from "../container";
import {TemplateManager} from "../template";
import {GetString, Strings, ToString} from "../utils";
import {Collection, HashMap} from "../collection";
import {Reactor, ReactorManager, Reactors} from "../reactor";
import {NATIVE_PROPERTY, NativeObject} from "./native";
import {REACT_PROPERTY, ReactProperty} from "./react";

export class Component {
	@Inject(Container)
	protected container: Container;
	@Inject(TemplateManager)
	protected templateManager: TemplateManager;
	@Inject(ReactorManager)
	protected reactorManager: ReactorManager;
	protected components: Collection<Component>;
	protected reactors: HashMap<Reactor>;
	protected root: Html;

	public constructor() {
		this.components = new Collection();
		this.reactors = new HashMap();
	}

	public render(): Html {
		this.render = () => {
			throw new Error(`Cannot render component [${GetString(this)}] multiple times; please create a new instance.`);
		};
		this.root = this.templateManager.render(GetString(this));
		this.resolveBinds();
		this.resolveComponents();
		this.resolveNatives();
		return this.root = this.onRender();
	}

	/**
	 * register a new state to this component
	 *
	 * @param reactors
	 */
	public register(reactors: Reactors): Component {
		this.unsubscribe();
		this.reactors.copy(new HashMap(reactors));
		this.subscribe();
		return this;
	}

	/**
	 * set a new state and update the component by executing the state
	 *
	 * @param reactors
	 */
	public update(reactors: Reactors = {}): Component {
		this.register(reactors);
		this.reactors.each((_, reactor) => reactor.update());
		return this;
	}

	public reactor(name: string = 'default'): Reactor {
		return this.reactors.require(name, `Requested unknown reactor [${name}] on component [${GetString(this)}].`);
	}

	public push(name: string, object: Object): Component {
		this.reactor(name).push(object);
		return this;
	}

	public patch(name: string, object: Object): Component {
		this.reactor(name).patch(object);
		return this;
	}

	public isRendered(): boolean {
		return !!this.root;
	}

	public subscribe(): Component {
		new Collection((<any>this)[REACT_PROPERTY]).each((reactProperty: ReactProperty) => {
			if (this.reactors.has(reactProperty.reactor)) {
				this.reactors.require(reactProperty.reactor).subscribe(reactProperty.property, (<any>this)[reactProperty.handler].bind(this));
			}
		});
		return this;
	}

	public unsubscribe(): Component {
		new Collection((<any>this)[REACT_PROPERTY]).each((reactProperty: ReactProperty) => {
			if (this.reactors.has(reactProperty.reactor)) {
				this.reactors.require(reactProperty.reactor).unsubscribe(reactProperty.property, (<any>this)[reactProperty.handler]);
			}
		});
		return this;
	}

	public component<U extends Component>(bind: ToString): U {
		return this.container.create(bind.toString());
	}

	/**
	 * called when a component should be ready to use
	 */
	public wakeup(): Component {
		this.onWakeup();
		this.subscribe();
		this.root.removeClass('is-hidden');
		return this;
	}

	/**
	 * called when a component is going to sleep (component should not be destroyed);
	 * component no longer registers any events (include state changes)
	 */
	public sleep(): Component {
		this.onSleep();
		this.unsubscribe();
		this.root.addClass('is-hidden');
		return this;
	}

	/**
	 * links are basically same as mounts, but they're directly put into properties of this component (converting foo-bar to fooBar convention)
	 */
	protected resolveBinds(): void {
		this.root.selectorCollection('[data-bind]').each(html => {
			(<any>this)[Strings.toCamelCase(html.rattr('data-bind'))] = html.removeAttr('data-bind');
		});
	}

	/**
	 * the magic of component tree - this method creates other components (and triggers render method on them)
	 */
	protected resolveComponents(): void {
		this.root.selectorCollection('[data-component]').each(html => {
			html.replaceBy(this.components.addi(this.container.create<Component>(html.rattr('data-component'))).render());
		});
	}

	protected resolveNatives(): void {
		new Collection((<NativeObject><unknown>this)[NATIVE_PROPERTY]).each(nativeProperty => {
			(nativeProperty.callback ? nativeProperty.callback(this) : this.root).listenTo(nativeProperty.event, (<any>this)[nativeProperty.handler].bind(this));
		});
	}

	protected onRender(): Html {
		return this.root;
	}

	protected onWakeup(): void {
	}

	protected onSleep(): void {
	}
}
