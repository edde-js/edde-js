import {ToString} from "../utils";
import {State} from "./state";

export type PushState = { name: ToString, state: Object };
export const SubscribesName = '::subscribers';
export const BindsName = '::binds';
export type Subscriber = (value: any, state: State) => void;
export type SubscribeProperty = {
	state: ToString | null;
	name: string;
	handler: string
};
export type SubscribeObject = {
	'::subscribers': SubscribeProperty[];
};
export type BindProperty = {
	name: string;
	handler: string
};
export type BindObject = {
	'::binds': BindProperty[];
};
