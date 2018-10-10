import {EventBus} from "../event";
import {Factory} from "./types";

export class Make {
	/**
	 * creates a factory for singleton service
	 */
	public static singleton<T>(factory: Factory<T>): Factory<T> {
		/**
		 * cannot be converted to array function because the function holds some "state"
		 */
		return function (container) {
			return this.instance || (container.autowire(this.instance = factory(container)));
		};
	}

	/**
	 * creates a listener singleton factory
	 */
	public static listener<T>(factory: Factory<T>): Factory<T> {
		return this.singleton(container => container.create<EventBus>(EventBus).subscribe(factory(container)));
	}

	/**
	 * shorthand for simple singleton service
	 */
	public static service<T>(service: any): Factory<T> {
		return this.singleton<T>(() => new service());
	}

	/**
	 * creates singleton factory, subscribed to event bus
	 */
	public static subscriber<T>(service: any): Factory<T> {
		return this.listener<T>(() => new service());
	}

	/**
	 * return an instance
	 */
	public static instance<T>(instance: T): Factory<T> {
		return function () {
			return instance;
		};
	}
}
