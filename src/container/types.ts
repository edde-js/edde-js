import {ToString} from "../utils";
import {IContainer} from "./api";
/**
 * type marking a factory for the container
 */
export type Factory<T = any> = (container: IContainer) => T;
export type DependencyProperty = {
	property: string;
	factory: Function | ToString;
};
export type DependencyObject = {
	'::injects': DependencyProperty[];
};
