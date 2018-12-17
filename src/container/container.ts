import {DependencyProperty, Factory} from "./types";
import {Collection, HashMap} from "../collection";
import {ToString} from "../utils";

/**
 * simple DI container implementation
 */
@ToString('edde-js/container/container')
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
		return factory.call(factory, this);
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
						console.error(`Cannot make instance of [${dependencyProperty.factory ? dependencyProperty.factory.toString() : '<unknown factory>'}]`);
						console.error(instance);
						console.error(dependencyProperty);
						throw e;
					}
				}
			});
		});
		((<any>instance).init || (() => instance)).call(instance);
		((<any>instance).init = (() => instance));
		return instance;
	}
}
