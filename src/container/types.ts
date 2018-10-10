import {ToString} from "../utils";

export type DependencyProperty = {
	property: string;
	factory: Function | ToString;
};
export type DependencyObject = {
	'::injects': DependencyProperty[];
};
