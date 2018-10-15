import {DependencyProperty, Factory} from "./types";
import {Collection, HashMap} from "../collection";
import {ToString} from "../utils";

/**
 * simple DI container implementation
 */
export class Container {
	protected factories: HashMap<Factory>;

	public constructor() {
		this.factories = new HashMap();
	}

	/**
	 * register a factory for the given identifier
	 *
	 * @param name
	 * @param factory
	 */
	public register(name: ToString, factory: Factory): Container {
		this.factories.set(name.toString(), factory);
		return this;
	}

	/**
	 * create dependency; all required dependencies will be lazily autowired
	 *
	 * @param name
	 */
	public create<T>(name: ToString): T {
		const factory = this.factories.require(name.toString(), `Requested unknown factory [${name.toString()}].`);
		const instance: any = factory.call(factory, this);
		if (instance.init && typeof instance.init === 'function') {
			instance.init();
		}
		return instance;
	}

	/**
	 * magic method for lazy autowiring
	 *
	 * @param instance
	 */
	public autowire<T>(instance: T): T {
		new Collection<DependencyProperty>((<any>instance)['::injects'] || []).each(dependencyProperty => {
			if (Object.getOwnPropertyDescriptor(instance, dependencyProperty.property)) {
				return;
			}
			(<any>instance)[dependencyProperty.property] = Object.defineProperty(instance, dependencyProperty.property, {
				set: () => {
				},
				get: () => {
					try {
						return this.create(dependencyProperty.factory);
					} catch (e) {
						console.error(`Cannot make instance of [${dependencyProperty.factory.toString()}]`);
						throw e;
					}
				}
			});
		});
		return instance;
	}

	public static toString() {
		return 'edde-js/container/container';
	}
}
