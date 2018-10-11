import {ToString} from "../utils";
import {Container} from "./container";
/**
 * type marking a factory for the container
 */
export type Factory<T = any> = (container: Container) => T;
/**
 * property descriptor of lazy loaded dependency
 */
export type DependencyProperty = {
	property: string;
	factory: Function | ToString;
};
/**
 * lazy dependency object
 */
export type DependencyObject = {
	'::injects': DependencyProperty[];
};
