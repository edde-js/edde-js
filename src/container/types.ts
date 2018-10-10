import {ToString} from "@edde-js/utils";

export type DependencyProperty = {
	property: string;
	factory: Function | ToString;
};
export type DependencyObject = {
	'::injects': DependencyProperty[];
};
