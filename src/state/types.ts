import {ToString} from "../utils";
import {State} from "./state";

export type Subscriber = (value: any, state: State) => void;
export type SubscribeProperty = {
	state: ToString | null;
	name: string;
	handler: string
};
export type SubscribeObject = {
	'::subscribers': SubscribeProperty[];
};
export type PushState = { name: ToString, state: Object };
