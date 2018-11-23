import {ToString} from "../utils";
import {State} from "./state";

export type States = { [index: string]: any };
export type Subscriber = (value: any, state: State) => void;
export type SubscribeProperty = {
	state: ToString | null;
	name: string;
	handler: string
};
export const SubscribersName = '::subscribers';
export type SubscribeObject = {
	[SubscribersName]: SubscribeProperty[];
};
