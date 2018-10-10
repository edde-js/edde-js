import {ToString} from "../../utils";
import {Factory} from "../types";

export interface IContainer {
	/**
	 * register a factory for the given identifier
	 *
	 * @param name
	 * @param factory
	 */
	register(name: ToString, factory: Factory): IContainer;

	/**
	 * create dependency; all required dependencies will be lazily autowired
	 *
	 * @param name
	 */
	create<T>(name: ToString): T;

	/**
	 * magic method for lazy autowiring
	 *
	 * @param instance
	 */
	autowire<T>(instance: T): T;
}
