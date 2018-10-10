import {Factory} from "./container";

export class Make {
	/**
	 * bind the given instance
	 */
	public static instance<T>(instance: T): Factory<T> {
		return function () {
			return instance;
		}
	}

	/**
	 * creates a factory for singleton service
	 */
	public static singleton<T>(factory: Factory<T>): Factory<T> {
		/**
		 * cannot be converted to array function because the function holds some "state"
		 */
		return function (container) {
			//noinspection JSPotentiallyInvalidUsageOfClassThis
			return this.instance || (container.autowire(this.instance = factory(container)));
		};
	}

	/**
	 * shorthand for simple singleton service
	 */
	public static service<T>(service: any): Factory<T> {
		return this.singleton<T>(() => new service());
	}
}
